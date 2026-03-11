import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Dashboard, DEFAULT_DASHBOARDS } from '@/data/dashboards';
import { ThemeConfig, DEFAULT_THEME, applyTheme } from '@/lib/theme';
import { CoverConfig, DEFAULT_COVER_CONFIG } from '@/data/coverConfig';
import { STORAGE_KEYS, loadFromStorage, saveToStorage } from '@/lib/storage';
import { loadAllFromCloud, saveToCloud } from '@/lib/cloudStorage';
import { APP_DEFAULTS } from '@/config/appDefaults';

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
  cloudSynced: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

/** Save to both localStorage and cloud */
function persist(key: string, value: unknown) {
  saveToStorage(key, value);
  saveToCloud(key, value);
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [orgName, setOrgNameState] = useState(() =>
    loadFromStorage(STORAGE_KEYS.ORG_NAME, APP_DEFAULTS.orgName)
  );
  const [logoUrl, setLogoUrlState] = useState(() =>
    loadFromStorage(STORAGE_KEYS.LOGO, APP_DEFAULTS.logoUrl)
  );
  const [theme, setThemeState] = useState<ThemeConfig>(() =>
    loadFromStorage(STORAGE_KEYS.THEME, DEFAULT_THEME)
  );
  const [darkMode, setDarkMode] = useState(() =>
    loadFromStorage(STORAGE_KEYS.DARK_MODE, APP_DEFAULTS.darkMode)
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
  const [cloudSynced, setCloudSynced] = useState(false);

  // On mount, load from cloud and override localStorage values.
  // If cloud is empty, seed it with current defaults so data persists across devices.
  useEffect(() => {
    loadAllFromCloud().then((cloud) => {
      const hasCloudData = Object.keys(cloud).length > 0;

      if (!hasCloudData) {
        // First time — seed cloud with all current defaults
        const seedData: Record<string, unknown> = {
          [STORAGE_KEYS.ORG_NAME]: orgName,
          [STORAGE_KEYS.LOGO]: logoUrl,
          [STORAGE_KEYS.THEME]: theme,
          [STORAGE_KEYS.DARK_MODE]: darkMode,
          [STORAGE_KEYS.OVERRIDES]: overrides,
          [STORAGE_KEYS.COVER_CONFIG]: coverConfig,
          [STORAGE_KEYS.CONFIG_SOURCE_URL]: configSourceUrl,
          [STORAGE_KEYS.RECENTLY_OPENED]: recentlyOpened,
        };
        // Save all defaults to cloud in parallel
        Promise.all(
          Object.entries(seedData).map(([key, value]) => saveToCloud(key, value))
        ).then(() => setCloudSynced(true));
        return;
      }

      // Cloud has data — apply it
      if (cloud[STORAGE_KEYS.ORG_NAME] != null) {
        const v = cloud[STORAGE_KEYS.ORG_NAME] as string;
        setOrgNameState(v);
        saveToStorage(STORAGE_KEYS.ORG_NAME, v);
      }
      if (cloud[STORAGE_KEYS.LOGO] != null) {
        const v = cloud[STORAGE_KEYS.LOGO] as string;
        setLogoUrlState(v);
        saveToStorage(STORAGE_KEYS.LOGO, v);
      }
      if (cloud[STORAGE_KEYS.THEME] != null) {
        const v = cloud[STORAGE_KEYS.THEME] as ThemeConfig;
        setThemeState(v);
        saveToStorage(STORAGE_KEYS.THEME, v);
      }
      if (cloud[STORAGE_KEYS.DARK_MODE] != null) {
        const v = cloud[STORAGE_KEYS.DARK_MODE] as boolean;
        setDarkMode(v);
        saveToStorage(STORAGE_KEYS.DARK_MODE, v);
      }
      if (cloud[STORAGE_KEYS.OVERRIDES] != null) {
        const v = cloud[STORAGE_KEYS.OVERRIDES] as DashboardOverrides;
        setOverrides(v);
        saveToStorage(STORAGE_KEYS.OVERRIDES, v);
      }
      if (cloud[STORAGE_KEYS.COVER_CONFIG] != null) {
        const v = cloud[STORAGE_KEYS.COVER_CONFIG] as CoverConfig;
        setCoverConfigState(v);
        saveToStorage(STORAGE_KEYS.COVER_CONFIG, v);
      }
      if (cloud[STORAGE_KEYS.CONFIG_SOURCE_URL] != null) {
        const v = cloud[STORAGE_KEYS.CONFIG_SOURCE_URL] as string;
        setConfigSourceUrlState(v);
        saveToStorage(STORAGE_KEYS.CONFIG_SOURCE_URL, v);
      }
      if (cloud[STORAGE_KEYS.RECENTLY_OPENED] != null) {
        const v = cloud[STORAGE_KEYS.RECENTLY_OPENED] as string[];
        setRecentlyOpened(v);
        saveToStorage(STORAGE_KEYS.RECENTLY_OPENED, v);
      }
      setCloudSynced(true);
    });
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    saveToStorage(STORAGE_KEYS.DARK_MODE, darkMode);
    applyTheme(theme);
  }, [darkMode, theme]);

  const dashboards = useMemo(() => {
    const base = baseDashboards
      .filter(d => !overrides.deleted.includes(d.id))
      .map(d => overrides.edited[d.id] ? { ...d, ...overrides.edited[d.id] } as Dashboard : d);
    const added = overrides.added.filter(d => !overrides.deleted.includes(d.id));
    return [...base, ...added];
  }, [baseDashboards, overrides]);

  const setOrgName = useCallback((name: string) => {
    setOrgNameState(name);
    persist(STORAGE_KEYS.ORG_NAME, name);
  }, []);

  const setLogoUrl = useCallback((url: string) => {
    setLogoUrlState(url);
    persist(STORAGE_KEYS.LOGO, url);
  }, []);

  const setTheme = useCallback((t: ThemeConfig) => {
    setThemeState(t);
    persist(STORAGE_KEYS.THEME, t);
  }, []);

  const resetTheme = useCallback(() => {
    setThemeState(DEFAULT_THEME);
    persist(STORAGE_KEYS.THEME, DEFAULT_THEME);
    applyTheme(DEFAULT_THEME);
  }, []);

  const resetBranding = useCallback(() => {
    setOrgNameState(APP_DEFAULTS.orgName);
    setLogoUrlState(APP_DEFAULTS.logoUrl);
    persist(STORAGE_KEYS.ORG_NAME, APP_DEFAULTS.orgName);
    persist(STORAGE_KEYS.LOGO, APP_DEFAULTS.logoUrl);
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => {
      const next = !prev;
      persist(STORAGE_KEYS.DARK_MODE, next);
      return next;
    });
  }, []);

  const addDashboard = useCallback((d: Dashboard) => {
    setOverrides(prev => {
      const next = { ...prev, added: [...prev.added, d] };
      persist(STORAGE_KEYS.OVERRIDES, next);
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
        persist(STORAGE_KEYS.OVERRIDES, next);
        return next;
      }
      const next = {
        ...prev,
        edited: { ...prev.edited, [id]: { ...prev.edited[id], ...updates } },
      };
      persist(STORAGE_KEYS.OVERRIDES, next);
      return next;
    });
  }, []);

  const deleteDashboard = useCallback((id: string) => {
    setOverrides(prev => {
      const addedIndex = prev.added.findIndex(d => d.id === id);
      if (addedIndex >= 0) {
        const next = { ...prev, added: prev.added.filter(d => d.id !== id) };
        persist(STORAGE_KEYS.OVERRIDES, next);
        return next;
      }
      const next = { ...prev, deleted: [...prev.deleted, id] };
      persist(STORAGE_KEYS.OVERRIDES, next);
      return next;
    });
  }, []);

  const resetDashboards = useCallback(() => {
    setOverrides(DEFAULT_OVERRIDES);
    persist(STORAGE_KEYS.OVERRIDES, DEFAULT_OVERRIDES);
    setBaseDashboardsState(DEFAULT_DASHBOARDS);
  }, []);

  const importDashboards = useCallback((data: Dashboard[]) => {
    const next: DashboardOverrides = {
      added: data,
      edited: {},
      deleted: baseDashboards.map(d => d.id),
    };
    setOverrides(next);
    persist(STORAGE_KEYS.OVERRIDES, next);
  }, [baseDashboards]);

  const addRecentlyOpened = useCallback((id: string) => {
    setRecentlyOpened(prev => {
      const next = [id, ...prev.filter(i => i !== id)].slice(0, 8);
      persist(STORAGE_KEYS.RECENTLY_OPENED, next);
      return next;
    });
  }, []);

  const clearRecentlyOpened = useCallback(() => {
    setRecentlyOpened([]);
    persist(STORAGE_KEYS.RECENTLY_OPENED, []);
  }, []);

  const setConfigSourceUrl = useCallback((url: string) => {
    setConfigSourceUrlState(url);
    persist(STORAGE_KEYS.CONFIG_SOURCE_URL, url);
  }, []);

  const setBaseDashboards = useCallback((d: Dashboard[]) => {
    setBaseDashboardsState(d);
  }, []);

  const setCoverConfig = useCallback((config: CoverConfig) => {
    setCoverConfigState(config);
    persist(STORAGE_KEYS.COVER_CONFIG, config);
  }, []);

  const resetCoverConfig = useCallback(() => {
    setCoverConfigState(DEFAULT_COVER_CONFIG);
    persist(STORAGE_KEYS.COVER_CONFIG, DEFAULT_COVER_CONFIG);
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
    cloudSynced,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
