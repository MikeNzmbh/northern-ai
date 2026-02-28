function trimTrailingSlashes(value) {
    return String(value || '').trim().replace(/\/+$/, '');
}

function releaseBaseUrl() {
    const explicit = trimTrailingSlashes(import.meta.env?.VITE_NORTHERN_RELEASE_BASE || '');
    if (explicit) return explicit;
    const repo = String(import.meta.env?.VITE_NORTHERN_RELEASE_REPO || 'MikeNzmbh/northern-ai').trim();
    return `https://github.com/${repo}/releases/latest/download`;
}

const base = releaseBaseUrl();

export const NORTHERN_DOWNLOAD_LINKS = {
    macos: `${base}/northern-installer-darwin.zip`,
    windows: `${base}/northern-installer-windows.zip`,
    macosChecksum: `${base}/northern-installer-darwin.zip.sha256`,
    windowsChecksum: `${base}/northern-installer-windows.zip.sha256`,
};
