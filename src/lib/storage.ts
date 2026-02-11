export const STORAGE_KEYS = {
  ORG_NAME: 'frh-org-name',
  LOGO: 'frh-logo',
  THEME: 'frh-theme',
  OVERRIDES: 'frh-overrides',
  RECENTLY_OPENED: 'frh-recent',
  CONFIG_SOURCE_URL: 'frh-config-url',
  DARK_MODE: 'frh-dark-mode',
} as const;

export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

export function saveToStorage(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }
}
