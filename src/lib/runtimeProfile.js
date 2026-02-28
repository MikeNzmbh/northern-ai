export function getRuntimeProfile() {
    const raw = String(import.meta.env?.VITE_NORTHERN_RUNTIME_PROFILE || 'local').trim().toLowerCase();
    return raw === 'public_launcher' ? 'public_launcher' : 'local';
}

export function isPublicLauncherProfile() {
    return getRuntimeProfile() === 'public_launcher';
}

export function getLocalPortalUrl() {
    return String(import.meta.env?.VITE_NORTHERN_LOCAL_PORTAL_URL || 'http://127.0.0.1:5173/chat').trim();
}

