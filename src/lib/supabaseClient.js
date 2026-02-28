import { createClient } from '@supabase/supabase-js';

const supabaseUrl = String(import.meta.env?.VITE_SUPABASE_URL || '').trim();
const supabasePublishableKey = String(
    import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY ||
    import.meta.env?.VITE_SUPABASE_ANON_KEY ||
    '',
).trim();

export const supabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

export const supabase = supabaseConfigured
    ? createClient(supabaseUrl, supabasePublishableKey, {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
        },
    })
    : null;

export async function getSupabaseSession() {
    if (!supabase) return null;
    const { data, error } = await supabase.auth.getSession();
    if (error) return null;
    return data?.session || null;
}

export async function getSupabaseAccessToken() {
    const session = await getSupabaseSession();
    return session?.access_token || null;
}

export function requireSupabaseClient() {
    if (!supabase) {
        throw new Error(
            'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY (or VITE_SUPABASE_ANON_KEY for compatibility).',
        );
    }
    return supabase;
}
