import { useCallback, useEffect, useMemo, useState } from 'react';
import { requireSupabaseClient, supabaseConfigured } from '../lib/supabaseClient';

const POLL_MS = 15000;

function staleAfterSeconds() {
    const raw = import.meta.env?.VITE_NORTHERN_PRESENCE_STALE_SECONDS;
    const parsed = Number(raw || 60);
    if (!Number.isFinite(parsed)) return 60;
    return Math.max(10, Math.min(3600, Math.round(parsed)));
}

function isoToMs(value) {
    const n = Date.parse(String(value || ''));
    return Number.isFinite(n) ? n : null;
}

function deriveState(row) {
    if (!row) return 'not_set_up';
    const status = String(row.status || '').toLowerCase();
    const lastSeenMs = isoToMs(row.last_seen_at || row.updated_at);
    if (lastSeenMs == null) return status === 'online' ? 'online' : 'sleeping';
    const ageSeconds = Math.max(0, (Date.now() - lastSeenMs) / 1000);
    if (ageSeconds > staleAfterSeconds()) return 'sleeping';
    return status === 'online' ? 'online' : 'sleeping';
}

export function useSupabaseDevicePresence(user) {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(Boolean(user));
    const [error, setError] = useState(null);

    const refresh = useCallback(async () => {
        if (!user || !supabaseConfigured) {
            setDevices([]);
            setLoading(false);
            return;
        }
        const client = requireSupabaseClient();
        setLoading(true);
        setError(null);
        const { data, error: queryError } = await client
            .from('northern_devices')
            .select('id,user_id,install_id,device_name,is_default,status,last_seen_at,updated_at,heartbeat_meta')
            .eq('user_id', user.id)
            .order('is_default', { ascending: false })
            .order('updated_at', { ascending: false });

        if (queryError) {
            setError(queryError.message || 'Could not load device presence.');
            setLoading(false);
            return;
        }
        setDevices(Array.isArray(data) ? data : []);
        setLoading(false);
    }, [user]);

    useEffect(() => {
        if (!user || !supabaseConfigured) return undefined;
        const bootstrap = window.setTimeout(() => { void refresh(); }, 0);
        const timer = window.setInterval(() => { void refresh(); }, POLL_MS);
        return () => {
            window.clearTimeout(bootstrap);
            window.clearInterval(timer);
        };
    }, [refresh, user]);

    const scopedDevices = useMemo(() => ((user && supabaseConfigured) ? devices : []), [devices, user]);
    const primary = useMemo(() => (scopedDevices[0] || null), [scopedDevices]);
    const state = useMemo(() => deriveState(primary), [primary]);

    return {
        state,
        primary,
        devices: scopedDevices,
        loading: (user && supabaseConfigured) ? loading : false,
        error,
        refresh,
    };
}
