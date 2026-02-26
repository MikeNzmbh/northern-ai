import { useCallback, useEffect, useRef, useState } from 'react';
import { requestJson } from '../lib/api';

const POLL_MS = 15_000;

/**
 * Polls GET /auth/portal/queue every 15 s, but only when deviceState === 'sleeping'.
 * Returns { items, refresh }.
 *
 * Each item: { id, text, status, session_id, created_at, delivered_at, error_message }
 */
export function usePortalQueue(apiBase, user, deviceState) {
    const [items, setItems] = useState([]);
    const intervalRef = useRef(null);

    const fetchQueue = useCallback(async () => {
        if (!user || deviceState !== 'sleeping') return;
        try {
            const data = await requestJson(
                apiBase,
                '/auth/portal/queue?include_delivered=false&limit=120',
                { method: 'GET' }
            );
            setItems(Array.isArray(data?.items) ? data.items : []);
        } catch {
            // non-fatal
        }
    }, [apiBase, user, deviceState]);

    useEffect(() => {
        if (!user || deviceState !== 'sleeping') {
            window.clearInterval(intervalRef.current);
            return;
        }
        void fetchQueue();
        intervalRef.current = window.setInterval(() => { void fetchQueue(); }, POLL_MS);
        return () => { window.clearInterval(intervalRef.current); };
    }, [user, deviceState, fetchQueue]);

    return { items, refresh: fetchQueue };
}
