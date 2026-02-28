import { requestJson } from './api';

export const DASHBOARD_TAB_ORDER = ['activity', 'tasks', 'logs', 'tools', 'memory'];
export const DASHBOARD_ACTIVE_TAB_KEY = 'northern.dashboard.active_tab.v1';
export const DASHBOARD_SESSION_KEY = 'northern.dashboard.session_id.v1';

export function readDashboardStorage(key) {
    if (typeof window === 'undefined') return null;
    try {
        const value = window.localStorage.getItem(key);
        return value ? String(value) : null;
    } catch {
        return null;
    }
}

export function writeDashboardStorage(key, value) {
    if (typeof window === 'undefined') return;
    try {
        if (value == null || value === '') {
            window.localStorage.removeItem(key);
            return;
        }
        window.localStorage.setItem(key, String(value));
    } catch {
        // Ignore storage write failures.
    }
}

function parseSessionId(payload) {
    if (!payload || typeof payload !== 'object') return '';

    const direct = [payload.id, payload.session_id, payload.sessionId]
        .map((candidate) => (typeof candidate === 'string' ? candidate.trim() : ''))
        .find(Boolean);
    if (direct) return direct;

    const nested = payload.data && typeof payload.data === 'object'
        ? [payload.data.id, payload.data.session_id, payload.data.sessionId]
            .map((candidate) => (typeof candidate === 'string' ? candidate.trim() : ''))
            .find(Boolean)
        : '';

    return nested || '';
}

export async function fetchHealthLive(apiBase) {
    return requestJson(apiBase, '/health/live', { method: 'GET' });
}

export async function fetchDeviceStatus(apiBase) {
    return requestJson(apiBase, '/auth/device-status', { method: 'GET' });
}

export async function fetchTelemetryReliability(apiBase) {
    return requestJson(apiBase, '/chat/telemetry/reliability?window_hours=24', { method: 'GET' });
}

export async function fetchTelemetrySummary(apiBase) {
    return requestJson(apiBase, '/chat/telemetry/summary?window_hours=24', { method: 'GET' });
}

export async function fetchTelemetryAlerts(apiBase) {
    return requestJson(apiBase, '/chat/telemetry/alerts?window_hours=24', { method: 'GET' });
}

export async function fetchActiveTasks(apiBase) {
    return requestJson(apiBase, '/assistant/tasks/active?limit=50', { method: 'GET' });
}

export async function fetchWorkflowRuns(apiBase) {
    return requestJson(apiBase, '/assistant/workflow-runs?limit=20', { method: 'GET' });
}

export async function fetchTelemetryEvents(apiBase) {
    return requestJson(apiBase, '/chat/telemetry/events?window_hours=24&limit=120&include_shadow_judge=false', {
        method: 'GET',
    });
}

export async function fetchOutboxMessages(apiBase) {
    return requestJson(apiBase, '/assistant/outbox?limit=30', { method: 'GET' });
}

export async function fetchSkillsCatalog(apiBase) {
    return requestJson(apiBase, '/assistant/skills/catalog', { method: 'GET' });
}

export async function fetchAgents(apiBase) {
    return requestJson(apiBase, '/agents', { method: 'GET' });
}

export async function ensureDashboardSessionId(apiBase) {
    const cached = readDashboardStorage(DASHBOARD_SESSION_KEY);
    if (cached) {
        return cached;
    }

    const payload = await requestJson(apiBase, '/chat/sessions', {
        method: 'POST',
        body: JSON.stringify({
            mode: 'assistant',
            temporary: false,
            metadata: { channel: 'dashboard' },
        }),
    });

    const sessionId = parseSessionId(payload);
    if (!sessionId) {
        throw new Error('Could not resolve dashboard session id from /chat/sessions response.');
    }

    writeDashboardStorage(DASHBOARD_SESSION_KEY, sessionId);
    return sessionId;
}

export async function fetchMemorySettings(apiBase, sessionId) {
    return requestJson(apiBase, `/chat/sessions/${encodeURIComponent(sessionId)}/memory/settings`, {
        method: 'GET',
    });
}

export async function fetchMemoryItems(apiBase, sessionId) {
    return requestJson(apiBase, `/chat/sessions/${encodeURIComponent(sessionId)}/memory?limit=100`, {
        method: 'GET',
    });
}

export async function fetchMemoryQuarantine(apiBase, sessionId) {
    return requestJson(
        apiBase,
        `/chat/sessions/${encodeURIComponent(sessionId)}/memory/quarantine?status=pending&limit=100`,
        { method: 'GET' }
    );
}
