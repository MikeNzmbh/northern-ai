import { useCallback, useEffect, useRef, useState } from 'react';
import { requestJson } from '../lib/api';

const POLL_MS = 15_000;

/**
 * Polls GET /auth/device-status every 15 s while user is authenticated.
 * Returns { deviceStatus, loading, refresh }.
 *
 * deviceStatus shape:
 *   { state, linked, connector_name, instance_id, storage_mode,
 *     last_seen_at, heartbeat_status, heartbeat_age_seconds, queue_depth }
 */
export function useDeviceStatus(apiBase, user) {
    const [deviceStatus, setDeviceStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const intervalRef = useRef(null);

    const fetchStatus = useCallback(async () => {
        if (!user) return;
        try {
            const data = await requestJson(apiBase, '/auth/device-status', { method: 'GET' });
            setDeviceStatus(data);
        } catch {
            // non-fatal — keep last known state
        } finally {
            setLoading(false);
        }
    }, [apiBase, user]);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }
        setLoading(true);
        void fetchStatus();
        intervalRef.current = window.setInterval(() => { void fetchStatus(); }, POLL_MS);
        return () => {
            window.clearInterval(intervalRef.current);
        };
    }, [user, fetchStatus]);

    return { deviceStatus, loading: loading && !deviceStatus, refresh: fetchStatus };
}
