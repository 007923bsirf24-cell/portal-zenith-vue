import { supabase } from '@/integrations/supabase/client';

/**
 * Load a setting from Lovable Cloud (app_settings table).
 * Falls back to `fallback` if nothing is stored yet.
 */
export async function loadFromCloud<T>(key: string, fallback: T): Promise<T> {
  try {
    const { data, error } = await supabase
      .from('app_settings')
      .select('setting_value')
      .eq('setting_key', key)
      .maybeSingle();

    if (error || !data) return fallback;
    return data.setting_value as T;
  } catch {
    return fallback;
  }
}

/**
 * Save a setting to Lovable Cloud (upsert by key).
 */
export async function saveToCloud(key: string, value: unknown): Promise<void> {
  try {
    await supabase
      .from('app_settings')
      .upsert(
        { setting_key: key, setting_value: value as any, updated_at: new Date().toISOString() },
        { onConflict: 'setting_key' }
      );
  } catch (e) {
    console.warn('Failed to save to cloud:', e);
  }
}

/**
 * Load all settings from cloud in one query.
 */
export async function loadAllFromCloud(): Promise<Record<string, unknown>> {
  try {
    const { data, error } = await supabase
      .from('app_settings')
      .select('setting_key, setting_value');

    if (error || !data) return {};
    const result: Record<string, unknown> = {};
    for (const row of data) {
      result[row.setting_key] = row.setting_value;
    }
    return result;
  } catch {
    return {};
  }
}
