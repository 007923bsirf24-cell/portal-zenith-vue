import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Dashboard, DEFAULT_DASHBOARDS } from '@/data/dashboards';
import { ThemeConfig, DEFAULT_THEME, applyTheme } from '@/lib/theme';
import { CoverConfig, DEFAULT_COVER_CONFIG } from '@/data/coverConfig';
import { STORAGE_KEYS, loadFromStorage, saveToStorage } from '@/lib/storage';

interface DashboardOverrides {
  added: Dashboard[];
  edited: Record<string, Partial<Dashboard>>;
  deleted: string[];
}

const DEFAULT_OVERRIDES: DashboardOverrides = { added: [], edited: {}, deleted: [] };

interface AppContextType {
  orgName: string;
  setOrgName: (name: string) => void;
  logoUrl: string;
  setLogoUrl: (url: string) => void;
  theme: ThemeConfig;
  setTheme: (theme: ThemeConfig) => void;
  resetTheme: () => void;
  resetBranding: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  dashboards: Dashboard[];
  addDashboard: (d: Dashboard) => void;
  updateDashboard: (id: string, updates: Partial<Dashboard>) => void;
  deleteDashboard: (id: string) => void;
  resetDashboards: () => void;
  importDashboards: (data: Dashboard[]) => void;
  recentlyOpened: string[];
  addRecentlyOpened: (id: string) => void;
  clearRecentlyOpened: () => void;
  configSourceUrl: string;
  setConfigSourceUrl: (url: string) => void;
  baseDashboards: Dashboard[];
  setBaseDashboards: (d: Dashboard[]) => void;
  coverConfig: CoverConfig;
  setCoverConfig: (config: CoverConfig) => void;
  resetCoverConfig: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [orgName, setOrgNameState] = useState(() =>
    loadFromStorage(STORAGE_KEYS.ORG_NAME, 'Finance Hub')
  );
  const [logoUrl, setLogoUrlState] = useState(() =>
    loadFromStorage(STORAGE_KEYS.LOGO, '')
  );
  const [theme, setThemeState] = useState<ThemeConfig>(() =>
    loadFromStorage(STORAGE_KEYS.THEME, DEFAULT_THEME)
  );
  const [darkMode, setDarkMode] = useState(() =>
    loadFromStorage(STORAGE_KEYS.DARK_MODE, false)
  );
  const [overrides, setOverrides] = useState<DashboardOverrides>(() =>
    loadFromStorage(STORAGE_KEYS.OVERRIDES, DEFAULT_OVERRIDES)
  );
  const [recentlyOpened, setRecentlyOpened] = useState<string[]>(() =>
    loadFromStorage(STORAGE_KEYS.RECENTLY_OPENED, [])
  );
  const [configSourceUrl, setConfigSourceUrlState] = useState(() =>
    loadFromStorage(STORAGE_KEYS.CONFIG_SOURCE_URL, '')
  );
  const [baseDashboards, setBaseDashboardsState] = useState<Dashboard[]>(DEFAULT_DASHBOARDS);
  const [coverConfig, setCoverConfigState] = useState<CoverConfig>(() =>
    loadFromStorage(STORAGE_KEYS.COVER_CONFIG, DEFAULT_COVER_CONFIG)
  );

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    saveToStorage(STORAGE_KEYS.DARK_MODE, darkMode);
  }, [darkMode]);

  const dashboards = useMemo(() => {
    const base = baseDashboards
      .filter(d => !overrides.deleted.includes(d.id))
      .map(d => overrides.edited[d.id] ? { ...d, ...overrides.edited[d.id] } as Dashboard : d);
    const added = overrides.added.filter(d => !overrides.deleted.includes(d.id));
    return [...base, ...added];
  }, [baseDashboards, overrides]);

  const setOrgName = useCallback((name: string) => {
    setOrgNameState(name);
    saveToStorage(STORAGE_KEYS.ORG_NAME, name);
  }, []);

  const setLogoUrl = useCallback((url: string) => {
    setLogoUrlState(url);
    saveToStorage(STORAGE_KEYS.LOGO, url);
  }, []);

  const setTheme = useCallback((t: ThemeConfig) => {
    setThemeState(t);
    saveToStorage(STORAGE_KEYS.THEME, t);
  }, []);

  const resetTheme = useCallback(() => {
    setThemeState(DEFAULT_THEME);
    saveToStorage(STORAGE_KEYS.THEME, DEFAULT_THEME);
    applyTheme(DEFAULT_THEME);
  }, []);

  const resetBranding = useCallback(() => {
    setOrgNameState('Finance Hub');
    setLogoUrlState('');
    saveToStorage(STORAGE_KEYS.ORG_NAME, 'Finance Hub');
    saveToStorage(STORAGE_KEYS.LOGO, '');
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => !prev);
  }, []);

  const addDashboard = useCallback((d: Dashboard) => {
    setOverrides(prev => {
      const next = { ...prev, added: [...prev.added, d] };
      saveToStorage(STORAGE_KEYS.OVERRIDES, next);
      return next;
    });
  }, []);

  const updateDashboard = useCallback((id: string, updates: Partial<Dashboard>) => {
    setOverrides(prev => {
      const addedIndex = prev.added.findIndex(d => d.id === id);
      if (addedIndex >= 0) {
        const newAdded = [...prev.added];
        newAdded[addedIndex] = { ...newAdded[addedIndex], ...updates };
        const next = { ...prev, added: newAdded };
        saveToStorage(STORAGE_KEYS.OVERRIDES, next);
        return next;
      }
      const next = {
        ...prev,
        edited: { ...prev.edited, [id]: { ...prev.edited[id], ...updates } },
      };
      saveToStorage(STORAGE_KEYS.OVERRIDES, next);
      return next;
    });
  }, []);

  const deleteDashboard = useCallback((id: string) => {
    setOverrides(prev => {
      const addedIndex = prev.added.findIndex(d => d.id === id);
      if (addedIndex >= 0) {
        const next = { ...prev, added: prev.added.filter(d => d.id !== id) };
        saveToStorage(STORAGE_KEYS.OVERRIDES, next);
        return next;
      }
      const next = { ...prev, deleted: [...prev.deleted, id] };
      saveToStorage(STORAGE_KEYS.OVERRIDES, next);
      return next;
    });
  }, []);

  const resetDashboards = useCallback(() => {
    setOverrides(DEFAULT_OVERRIDES);
    saveToStorage(STORAGE_KEYS.OVERRIDES, DEFAULT_OVERRIDES);
    setBaseDashboardsState(DEFAULT_DASHBOARDS);
  }, []);

  const importDashboards = useCallback((data: Dashboard[]) => {
    const next: DashboardOverrides = {
      added: data,
      edited: {},
      deleted: baseDashboards.map(d => d.id),
    };
    setOverrides(next);
    saveToStorage(STORAGE_KEYS.OVERRIDES, next);
  }, [baseDashboards]);

  const addRecentlyOpened = useCallback((id: string) => {
    setRecentlyOpened(prev => {
      const next = [id, ...prev.filter(i => i !== id)].slice(0, 8);
      saveToStorage(STORAGE_KEYS.RECENTLY_OPENED, next);
      return next;
    });
  }, []);

  const clearRecentlyOpened = useCallback(() => {
    setRecentlyOpened([]);
    saveToStorage(STORAGE_KEYS.RECENTLY_OPENED, []);
  }, []);

  const setConfigSourceUrl = useCallback((url: string) => {
    setConfigSourceUrlState(url);
    saveToStorage(STORAGE_KEYS.CONFIG_SOURCE_URL, url);
  }, []);

  const setBaseDashboards = useCallback((d: Dashboard[]) => {
    setBaseDashboardsState(d);
  }, []);

  const setCoverConfig = useCallback((config: CoverConfig) => {
    setCoverConfigState(config);
    saveToStorage(STORAGE_KEYS.COVER_CONFIG, config);
  }, []);

  const resetCoverConfig = useCallback(() => {
    setCoverConfigState(DEFAULT_COVER_CONFIG);
    saveToStorage(STORAGE_KEYS.COVER_CONFIG, DEFAULT_COVER_CONFIG);
  }, []);

  const value: AppContextType = {
    orgName, setOrgName,
    logoUrl, setLogoUrl,
    theme, setTheme, resetTheme, resetBranding,
    darkMode, toggleDarkMode,
    dashboards,
    addDashboard, updateDashboard, deleteDashboard,
    resetDashboards, importDashboards,
    recentlyOpened, addRecentlyOpened, clearRecentlyOpened,
    configSourceUrl, setConfigSourceUrl,
    baseDashboards, setBaseDashboards,
    coverConfig, setCoverConfig, resetCoverConfig,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
