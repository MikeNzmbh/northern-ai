import { useCallback, useEffect, useMemo, useState } from 'react';
import { normalizeBase } from '../lib/api';

const STORAGE_KEY = 'northern.chat.settings.v1';

// Default API base for dev — /api is proxied by Vite to the Northern backend.
// This avoids CORS issues without any backend changes.
// Direct mode: set to 'http://127.0.0.1:8000' (requires backend CORS to allow localhost:5173)
const DEV_DEFAULT_API_BASE = '/api';

function normalizeSettings(input) {
    return {
        apiBaseUrl: normalizeBase(input?.apiBaseUrl || DEV_DEFAULT_API_BASE),
        operatorToken: String(input?.operatorToken || '').trim(),
        theme: ['light', 'dark', 'system'].includes(input?.theme) ? input.theme : 'dark',
        actor: String(input?.actor || 'northern_web_user').trim() || 'northern_web_user',
    };
}

/**
 * Persistent settings hook backed by localStorage.
 * Returns { settings, update, isLoading }.
 *
 * settings.apiBaseUrl defaults to '/api' in dev (Vite proxy mode).
 * settings.operatorToken is for privileged API calls — dev-only, never hardcoded.
 */
export function useSettings() {
    const [settings, setSettings] = useState(() => normalizeSettings());
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const raw = window.localStorage.getItem(STORAGE_KEY);
            setSettings(normalizeSettings(raw ? JSON.parse(raw) : null));
        } catch {
            setSettings(normalizeSettings());
        } finally {
            setIsLoading(false);
        }
    }, []);

    const update = useCallback((patch) => {
        setSettings((prev) => {
            const next = normalizeSettings({ ...prev, ...patch });
            try {
                window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            } catch {
                // ignore
            }
            return next;
        });
    }, []);

    return useMemo(() => ({ settings, update, isLoading }), [settings, update, isLoading]);
}
