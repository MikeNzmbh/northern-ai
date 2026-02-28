import { useCallback, useEffect, useRef, useState } from 'react';
import { buildUrl } from '../lib/api';

const DEFAULT_TIMEOUT_MS = 2500;
const POLL_MS = 15000;

function createTimeoutSignal(timeoutMs) {
    const controller = new AbortController();
    const timerId = window.setTimeout(() => controller.abort(), timeoutMs);
    return { signal: controller.signal, clear: () => window.clearTimeout(timerId) };
}

export function useRuntimeAwake(apiBase, enabled = true, timeoutMs = DEFAULT_TIMEOUT_MS) {
    const [state, setState] = useState(enabled ? 'checking' : 'disabled');
    const intervalRef = useRef(null);

    const probe = useCallback(async () => {
        if (!enabled) {
            setState('disabled');
            return false;
        }
        const { signal, clear } = createTimeoutSignal(timeoutMs);
        try {
            const response = await fetch(buildUrl(apiBase, '/health/live'), {
                method: 'GET',
                credentials: 'include',
                signal,
            });
            const awake = response.ok;
            setState(awake ? 'awake' : 'asleep');
            return awake;
        } catch {
            setState('asleep');
            return false;
        } finally {
            clear();
        }
    }, [apiBase, enabled, timeoutMs]);

    useEffect(() => {
        if (!enabled) {
            setState('disabled');
            return undefined;
        }
        setState('checking');
        void probe();
        intervalRef.current = window.setInterval(() => { void probe(); }, POLL_MS);
        return () => {
            window.clearInterval(intervalRef.current);
        };
    }, [enabled, probe]);

    return {
        state,
        loading: state === 'checking',
        awake: state === 'awake',
        refresh: probe,
    };
}

