import { useCallback, useEffect, useMemo, useState } from 'react';
import { requestJson } from '../lib/api';

function envEnabled(name, defaultValue = true) {
    const raw = import.meta.env?.[name];
    if (raw == null || raw === '') return defaultValue;
    return String(raw).toLowerCase() !== 'false';
}

function fallbackPublicConfig() {
    return {
        signupEnabled: true,
        authMode: 'cookie',
        oauth: {
            google: {
                enabled: envEnabled('VITE_NORTHERN_OAUTH_GOOGLE', true),
                startPath: '/auth/oauth/google/start',
            },
            apple: {
                enabled: envEnabled('VITE_NORTHERN_OAUTH_APPLE', true),
                startPath: '/auth/oauth/apple/start',
            },
        },
    };
}

function normalize(payload) {
    const fb = fallbackPublicConfig();
    if (!payload || typeof payload !== 'object') return fb;
    const oauthPayload = (payload.oauth && typeof payload.oauth === 'object') ? payload.oauth : {};
    const oauth = {};
    for (const provider of ['google', 'apple']) {
        const row = (oauthPayload[provider] && typeof oauthPayload[provider] === 'object') ? oauthPayload[provider] : {};
        oauth[provider] = {
            enabled: Boolean(row.enabled ?? fb.oauth[provider].enabled),
            startPath: String(row.start_path || row.startPath || fb.oauth[provider].startPath),
        };
    }
    return {
        signupEnabled: Boolean(payload.signup_enabled ?? payload.signupEnabled ?? fb.signupEnabled),
        authMode: String(payload.auth_mode || payload.authMode || fb.authMode),
        oauth,
    };
}

export function usePublicConfig(apiBase) {
    const fallback = useMemo(() => fallbackPublicConfig(), []);
    const [publicConfig, setPublicConfig] = useState(fallback);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(async () => {
        try {
            const payload = await requestJson(apiBase, '/auth/public-config', { method: 'GET' });
            setPublicConfig(normalize(payload));
        } catch {
            setPublicConfig(fallback);
        } finally {
            setLoading(false);
        }
    }, [apiBase, fallback]);

    useEffect(() => {
        setLoading(true);
        void refresh();
    }, [refresh]);

    return { publicConfig, loading, refresh };
}

