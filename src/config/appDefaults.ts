/**
 * APP DEFAULTS — Edit this file to permanently set your app's default settings.
 * These values are used as fallbacks when localStorage is empty or cleared.
 * Changes here will persist across all sessions and devices automatically.
 */

export const APP_DEFAULTS: {
  orgName: string;
  logoUrl: string;
  darkMode: boolean;
} = {
  /** Organization name shown in navbar and cover page */
  orgName: 'Pak Turk Maarif Schools',

  /** Logo URL — paste a URL or leave empty for no logo */
  logoUrl: '',

  /** Dark mode on by default? */
  darkMode: false,
};
