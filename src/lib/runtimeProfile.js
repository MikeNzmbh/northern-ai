function isLocalHostname(hostname) {
    const host = String(hostname || '').trim().toLowerCase();
    return host === 'localhost' || host === '127.0.0.1' || host === '[::1]';
}

function currentHostname() {
    if (typeof window === 'undefined') return '';
    return window.location?.hostname || '';
}

export function getRuntimeProfile() {
    const raw = String(import.meta.env?.VITE_NORTHERN_RUNTIME_PROFILE || 'local').trim().toLowerCase();
    const configured = raw === 'public_launcher' ? 'public_launcher' : 'local';

    // Production safety: public/non-local hosts should never expose full local chat.
    if (!isLocalHostname(currentHostname())) return 'public_launcher';
    return configured;
}

export function isPublicLauncherProfile() {
    return getRuntimeProfile() === 'public_launcher';
}

export function getLocalPortalUrl() {
    return String(import.meta.env?.VITE_NORTHERN_LOCAL_PORTAL_URL || 'http://127.0.0.1:5173/chat').trim();
}
