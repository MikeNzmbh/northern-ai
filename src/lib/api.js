import { getSupabaseAccessToken } from './supabaseClient';

const DEFAULT_API_BASE = 'http://127.0.0.1:8000';

// Recommended dev default: /api (proxied by Vite → Northern backend, avoids CORS entirely)
// Change via VITE_NORTHERN_API_BASE env var or Settings page → stored in localStorage
export const RECOMMENDED_DEV_BASE = '/api';

/**
 * Returns the Northern backend base URL (no trailing slash).
 * Supports both absolute URLs (http://...) and relative paths (/api).
 *
 * Dev recommendation: use "/api" so Vite proxies requests to the backend.
 * Direct backend URL (http://127.0.0.1:8000) requires the backend CORS
 * allowlist to include http://localhost:5173.
 */
export function getApiBase() {
    const raw =
        (typeof import.meta !== 'undefined' && import.meta.env?.VITE_NORTHERN_API_BASE) ||
        DEFAULT_API_BASE;
    return normalizeBase(String(raw).trim());
}

/**
 * Normalise a base string: strip trailing slashes.
 * Works for both absolute URLs and relative paths like /api.
 */
export function normalizeBase(raw) {
    return String(raw || '').trim().replace(/\/+$/, '');
}

/**
 * Build a full request URL from a base and a path.
 * - Relative base ("/api"): returns "/api/chat/sessions" — browser resolves against origin
 * - Absolute base ("http://127.0.0.1:8000"): returns "http://127.0.0.1:8000/chat/sessions"
 */
export function buildUrl(base, path) {
    const b = normalizeBase(base);
    const p = path.startsWith('/') ? path : `/${path}`;
    return `${b}${p}`;
}

/**
 * Shared JSON fetch wrapper.
 * @param {string} base - API base URL or relative path (e.g. "/api")
 * @param {string} path - Endpoint path (e.g. "/chat/sessions")
 * @param {RequestInit} [init] - Fetch init options
 * @returns {Promise<any>}
 */
export async function requestJson(base, path, init = {}) {
    const url = buildUrl(base, path);
    const token = await getSupabaseAccessToken();
    const mergedHeaders = {
        'content-type': 'application/json',
        ...(init.headers || {}),
    };
    if (token && !mergedHeaders.Authorization && !mergedHeaders.authorization) {
        mergedHeaders.Authorization = `Bearer ${token}`;
    }
    const response = await fetch(url, {
        credentials: 'include',
        ...init,
        headers: mergedHeaders,
    });

    const text = await response.text();
    let parsed;
    try {
        parsed = text ? JSON.parse(text) : {};
    } catch {
        // Non-JSON response — likely HTML from a misconfigured proxy or wrong origin
        const snippet = text.slice(0, 120).trim();
        const isHtml = snippet.startsWith('<') || snippet.toLowerCase().includes('<!doctype');
        const hint = isHtml
            ? ' (got HTML — API base may be pointing to the frontend server instead of the Northern backend; use /api or set VITE_NORTHERN_API_BASE)'
            : '';
        const err = new Error(`Response was not valid JSON (${response.status})${hint}`);
        err.status = response.status;
        throw err;
    }

    if (!response.ok) {
        const detail = parsed?.detail || parsed?.message || `Request failed (${response.status})`;
        const error = new Error(typeof detail === 'string' ? detail : JSON.stringify(detail));
        error.status = response.status;
        error.payload = parsed;
        throw error;
    }

    return parsed;
}

/**
 * Multipart/form-data fetch wrapper for file uploads.
 * Do not set content-type manually; the browser sets the boundary.
 */
export async function requestMultipartJson(base, path, formData, init = {}) {
    const url = buildUrl(base, path);
    const token = await getSupabaseAccessToken();
    const mergedHeaders = {
        ...(init.headers || {}),
    };
    if (token && !mergedHeaders.Authorization && !mergedHeaders.authorization) {
        mergedHeaders.Authorization = `Bearer ${token}`;
    }
    const response = await fetch(url, {
        credentials: 'include',
        ...init,
        headers: mergedHeaders,
        body: formData,
    });

    const text = await response.text();
    let parsed;
    try {
        parsed = text ? JSON.parse(text) : {};
    } catch {
        const err = new Error(`Response was not valid JSON (${response.status})`);
        err.status = response.status;
        throw err;
    }

    if (!response.ok) {
        const detail = parsed?.detail || parsed?.message || `Request failed (${response.status})`;
        const error = new Error(typeof detail === 'string' ? detail : JSON.stringify(detail));
        error.status = response.status;
        error.payload = parsed;
        throw error;
    }

    return parsed;
}

// ─── Error classifier ─────────────────────────────────────────────────────────
const LEGACY_PROFILE_RE = /additional properties are not allowed/i;
const LEGACY_KEYS_RE = /\('([^']+)'(?:,\s*'([^']+)')*\s*were unexpected\)/i;

/**
 * Classify a backend error for targeted UX messaging.
 * @param {number} status  HTTP status code
 * @param {string} detail  Error detail string from backend
 * @returns {{ kind: 'legacy_profile_validation'|'unauthorized'|'generic', detail: string, legacyKeys: string[] }}
 */
export function classifyApiError(status, detail) {
    const msg = String(detail || '');

    if (LEGACY_PROFILE_RE.test(msg)) {
        const keysMatch = msg.match(LEGACY_KEYS_RE);
        const legacyKeys = keysMatch ? keysMatch.slice(1).filter(Boolean) : [];
        return { kind: 'legacy_profile_validation', detail: msg, legacyKeys };
    }

    if (status === 401 || status === 403) {
        return { kind: 'unauthorized', detail: msg, legacyKeys: [] };
    }

    return { kind: 'generic', detail: msg, legacyKeys: [] };
}
