import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/studio.css';
import { requestJson, requestMultipartJson } from '../lib/api';
import { useSettings } from '../hooks/useSettings';
import { useAuth } from '../hooks/useAuth';
import { useDeviceStatus } from '../hooks/useDeviceStatus';
import { usePortalQueue } from '../hooks/usePortalQueue';
import DeviceStatusBadge from '../components/DeviceStatusBadge';
import OfflineBanner from '../components/OfflineBanner';
import QueueStatusCard from '../components/QueueStatusCard';
import Toast from '../components/Toast';

// ─── Feature flags ────────────────────────────────────────────────────────────
const DEVICE_PANEL_ENABLED = true;

// ─── Session persistence ──────────────────────────────────────────────────────
const SESSION_ID_KEY = 'northern.chat.session_id.v1';
function loadSavedSessionId() { try { return localStorage.getItem(SESSION_ID_KEY) || null; } catch { return null; } }
function saveSessionId(id) { try { localStorage.setItem(SESSION_ID_KEY, id); } catch { /* */ } }

// ─── Display ID helpers (from governance-workspace.tsx) ────────────────────────
function getExactTime() {
    const now = new Date();
    return `${now.getUTCHours().toString().padStart(2, '0')}:${now.getUTCMinutes().toString().padStart(2, '0')}:${now.getUTCSeconds().toString().padStart(2, '0')} UTC`;
}

function formatDisplayId(id, role) {
    const normalized = String(id).replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const suffix = normalized.slice(-6).padStart(6, '0');
    if (role === 'OPERATOR') return `SEQ-${suffix}`;
    if (role === 'INTELLIGENCE') return `SYS-${suffix}`;
    return `LOG-${suffix}`;
}

// ─── Streaming word-by-word reveal ─────────────────────────────────────────────
async function streamReply(messageId, text, setMessages) {
    const chunks = text.split(/(\s+)/).filter(c => c.length > 0);
    let current = '';
    for (const chunk of chunks) {
        await new Promise(r => setTimeout(r, 22 + Math.floor(Math.random() * 38)));
        current += chunk;
        setMessages(prev => prev.map(m => m.id === messageId ? { ...m, content: current } : m));
    }
    setMessages(prev => prev.map(m => m.id === messageId ? { ...m, content: current, isStreaming: false } : m));
}

function makeMsgId(prefix) {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

// ─── Telemetry telltale ────────────────────────────────────────────────────────
function useTelemetry(busy) {
    const [tel, setTel] = useState({ hz: 144, temp: 32 });
    useEffect(() => {
        const iid = window.setInterval(() => {
            setTel(prev => ({
                hz: busy ? 3600 + Math.floor(Math.random() * 400) : 144,
                temp: busy
                    ? Math.min(85, prev.temp + Math.random() * 5)
                    : Math.max(32, prev.temp - 1),
            }));
        }, 800);
        return () => window.clearInterval(iid);
    }, [busy]);
    return tel;
}

const SUGGESTED = [
    'Summarize our last conversation.',
    'What can you help me do today?',
    'Check the current system status.',
];

// OpenAI-compatible attachment baseline for chat workflows in Northern:
// - File Search supported documents/code types
// - Code Interpreter common tabular/archive types
// - Vision image input types (incl. webp)
const OPENAI_ATTACHMENT_EXTENSIONS = [
    '.c', '.cpp', '.cs', '.css', '.csv', '.doc', '.docx', '.gif', '.go', '.html', '.iif', '.java', '.jpeg',
    '.jpg', '.js', '.json', '.md', '.odt', '.pdf', '.php', '.pkl', '.png', '.ppt', '.pptx', '.py', '.rb',
    '.rtf', '.sh', '.tar', '.tex', '.ts', '.tsv', '.txt', '.webp', '.xls', '.xlsx', '.xml', '.zip',
];

const OPENAI_ATTACHMENT_MIME_TYPES = new Set([
    'application/csv',
    'application/json',
    'application/msword',
    'application/pdf',
    'application/rtf',
    'application/typescript',
    'application/vnd.ms-excel',
    'application/vnd.ms-powerpoint',
    'application/vnd.oasis.opendocument.text',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/x-sh',
    'application/x-tar',
    'application/x-iif',
    'application/xml',
    'application/zip',
    'image/gif',
    'image/jpeg',
    'image/png',
    'image/webp',
    'text/csv',
    'text/css',
    'text/html',
    'text/javascript',
    'text/markdown',
    'text/plain',
    'text/rtf',
    'text/tsv',
    'text/x-c',
    'text/x-c++',
    'text/x-csharp',
    'text/x-golang',
    'text/x-java',
    'text/x-php',
    'text/x-python',
    'text/x-ruby',
    'text/x-script.python',
    'text/x-tex',
    'text/xml',
    'text/x-iif',
]);

const OPENAI_ATTACHMENT_EXTENSION_SET = new Set(OPENAI_ATTACHMENT_EXTENSIONS);
const OPENAI_ATTACHMENT_ACCEPT = OPENAI_ATTACHMENT_EXTENSIONS.join(',');
const TERMINAL_CONCIERGE_STATUSES = new Set(['done', 'failed', 'canceled']);
const ACTIVE_CONCIERGE_STATUSES = new Set(['clarifying', 'planned', 'waiting_approval', 'running', 'verifying']);

function getFileExtension(name) {
    const value = String(name || '').toLowerCase();
    const lastDot = value.lastIndexOf('.');
    if (lastDot <= 0 || lastDot === value.length - 1) return '';
    return value.slice(lastDot);
}

function isOpenAiCompatibleAttachment(file) {
    const ext = getFileExtension(file?.name);
    const mime = String(file?.type || '').toLowerCase();
    if (OPENAI_ATTACHMENT_EXTENSION_SET.has(ext)) return true;
    if (mime && OPENAI_ATTACHMENT_MIME_TYPES.has(mime)) return true;
    return false;
}

function summarizeNames(files, limit = 3) {
    return files
        .slice(0, limit)
        .map((file) => file?.name || 'file')
        .join(', ');
}

function formatBytes(value) {
    const size = Number(value || 0);
    if (!Number.isFinite(size) || size <= 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    let n = size;
    let idx = 0;
    while (n >= 1024 && idx < units.length - 1) {
        n /= 1024;
        idx += 1;
    }
    return `${n >= 10 || idx === 0 ? n.toFixed(0) : n.toFixed(1)} ${units[idx]}`;
}

function isChatSessionNotFoundError(err) {
    return Number(err?.status) === 404 && /chat session not found/i.test(String(err?.message || ''));
}

function formatEtaRange(eta) {
    if (!eta || typeof eta !== 'object') return '';
    const low = Number(eta.minutes_low);
    const high = Number(eta.minutes_high);
    if (!Number.isFinite(low) || !Number.isFinite(high)) return '';
    const conf = Number(eta.confidence);
    const confText = Number.isFinite(conf) ? ` · ${Math.round(Math.max(0, Math.min(1, conf)) * 100)}% confidence` : '';
    return `${Math.max(0, Math.round(low))}-${Math.max(0, Math.round(high))} min${confText}`;
}

function titleCaseWords(value) {
    return String(value || '')
        .split(/[_\s-]+/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

function extractConciergeMetaFromResponse(resp) {
    const provenance = resp?.provenance;
    if (!provenance || typeof provenance !== 'object') return null;

    const handoff = provenance.concierge_handoff;
    const run = provenance.concierge_run;
    if ((!handoff || typeof handoff !== 'object') && (!run || typeof run !== 'object')) {
        return null;
    }

    const handoffObj = (handoff && typeof handoff === 'object') ? handoff : {};
    const runObj = (run && typeof run === 'object') ? run : {};
    const eta = (handoffObj.eta && typeof handoffObj.eta === 'object')
        ? handoffObj.eta
        : (runObj.eta && typeof runObj.eta === 'object' ? runObj.eta : null);
    const gapBuild = (handoffObj.gap_build && typeof handoffObj.gap_build === 'object')
        ? handoffObj.gap_build
        : (runObj.gap_build && typeof runObj.gap_build === 'object' ? runObj.gap_build : null);

    return {
        runId: String(handoffObj.run_id || runObj.run_id || '').trim() || null,
        status: String(runObj.status || '').trim() || null,
        approvalRequired: Boolean(handoffObj.approval_required ?? runObj.approval_required),
        eta,
        plan: (runObj.plan && typeof runObj.plan === 'object') ? runObj.plan : null,
        gapBuild,
        rawRun: runObj,
        rawHandoff: handoffObj,
    };
}

function extractConciergeMetaFromRunPayload(runObj) {
    if (!runObj || typeof runObj !== 'object') return null;
    return extractConciergeMetaFromResponse({ provenance: { concierge_run: runObj } });
}

function requiredApprovalScopesFromMeta(meta) {
    const items = Array.isArray(meta?.plan?.approval_items) ? meta.plan.approval_items : [];
    return items
        .filter((item) => item && typeof item === 'object' && item.required && item.scope)
        .map((item) => String(item.scope))
        .filter(Boolean);
}

async function entryToFile(entry) {
    return await new Promise((resolve, reject) => {
        entry.file(resolve, reject);
    });
}

async function readDirectoryEntries(reader) {
    const all = [];
    while (true) {
        const batch = await new Promise((resolve, reject) => {
            reader.readEntries(resolve, reject);
        });
        if (!Array.isArray(batch) || batch.length === 0) break;
        all.push(...batch);
    }
    return all;
}

async function collectFilesFromDropEntry(entry) {
    if (!entry) return [];

    if (entry.isFile) {
        try {
            const file = await entryToFile(entry);
            return file ? [file] : [];
        } catch {
            return [];
        }
    }

    if (!entry.isDirectory || typeof entry.createReader !== 'function') {
        return [];
    }

    try {
        const reader = entry.createReader();
        const children = await readDirectoryEntries(reader);
        const nested = await Promise.all(children.map((child) => collectFilesFromDropEntry(child)));
        return nested.flat();
    } catch {
        return [];
    }
}

async function collectDroppedFiles(dataTransfer) {
    const items = Array.from(dataTransfer?.items || []);
    if (items.length > 0) {
        const collected = await Promise.all(items.map(async (item) => {
            const entry = typeof item?.webkitGetAsEntry === 'function' ? item.webkitGetAsEntry() : null;
            if (entry) return await collectFilesFromDropEntry(entry);
            const file = typeof item?.getAsFile === 'function' ? item.getAsFile() : null;
            return file ? [file] : [];
        }));
        const flattened = collected.flat().filter(Boolean);
        if (flattened.length > 0) return flattened;
    }

    return Array.from(dataTransfer?.files || []).filter(Boolean);
}

function isFileDragEvent(event) {
    const types = Array.from(event?.dataTransfer?.types || []);
    return types.includes('Files');
}

function PlusIcon() {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 5v14" />
            <path d="M5 12h14" />
        </svg>
    );
}

function AttachmentIcon() {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21.44 11.05 12.25 20.24a6 6 0 0 1-8.49-8.49l9.2-9.19a4 4 0 1 1 5.65 5.66l-9.2 9.19a2 2 0 1 1-2.83-2.83l8.49-8.49" />
        </svg>
    );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function ChatPortal() {
    const { settings } = useSettings();
    const apiBase = useMemo(
        () => (settings.apiBaseUrl || '').replace(/\/+$/, '') || '/api',
        [settings.apiBaseUrl]
    );

    // Rule A auth gate with local SSO mock intercept
    const { user: realUser, loading: authLoading, logout: realLogout } = useAuth(apiBase, false);
    const [mockAuth, setMockAuth] = useState(false);

    const user = useMemo(() => {
        return realUser || (mockAuth ? { email: 'demo@northern.com', name: 'Demo Mode' } : null);
    }, [realUser, mockAuth]);

    const logout = useCallback(() => {
        if (mockAuth) setMockAuth(false);
        else realLogout();
    }, [mockAuth, realLogout]);

    // Device state
    const { deviceStatus, refresh: refreshDeviceStatus } = useDeviceStatus(apiBase, user);

    // Queue state
    const { items: queuePollItems, refresh: refreshQueue } = usePortalQueue(apiBase, user, deviceStatus?.state);
    const [localQueueItems, setLocalQueueItems] = useState([]);

    // Toast state
    const [toastMessage, setToastMessage] = useState(null);

    // Track previous state for transitions
    const prevStateRef = useRef(deviceStatus?.state);

    useEffect(() => {
        if (!queuePollItems || !queuePollItems.length) return;
        setLocalQueueItems(prev => {
            const next = [...prev];
            let changed = false;
            for (const incoming of queuePollItems) {
                const idx = next.findIndex(item => item.id === incoming.id);
                if (idx >= 0) {
                    if (JSON.stringify(next[idx]) !== JSON.stringify(incoming)) {
                        next[idx] = incoming;
                        changed = true;
                    }
                } else {
                    next.push(incoming);
                    changed = true;
                }
            }
            // Sort by created_at desc if we want newest at bottom, but backend returns them sorted.
            return changed ? next : prev;
        });
    }, [queuePollItems]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [messages, setMessages] = useState([]);
    const [activeSessionId, setActiveSessionId] = useState(() => loadSavedSessionId());
    const [input, setInput] = useState('');
    const [pendingAttachments, setPendingAttachments] = useState([]);
    const [uploadingFiles, setUploadingFiles] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [busy, setBusy] = useState(false);
    const [thinkTs, setThinkTs] = useState(null);
    const [conciergeUiByRun, setConciergeUiByRun] = useState({});

    const endRef = useRef(null);
    const inputRef = useRef(null);
    const fileInputRef = useRef(null);
    const folderInputRef = useRef(null);
    const tel = useTelemetry(busy);
    const status = busy ? 'COMPUTING' : 'STANDBY';

    const activeConciergeRunIds = useMemo(() => {
        const ids = new Set();
        for (const msg of messages) {
            const runId = msg?.conciergeMeta?.runId;
            const runStatus = String(msg?.conciergeMeta?.status || '').toLowerCase();
            if (!runId) continue;
            if (!runStatus || ACTIVE_CONCIERGE_STATUSES.has(runStatus)) ids.add(runId);
        }
        return Array.from(ids);
    }, [messages]);

    // scroll to bottom on new messages
    useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, busy]);

    // textarea auto-height
    const resizeInput = (el) => { el.style.height = 'auto'; el.style.height = `${el.scrollHeight}px`; };

    // ── Ensure session ──────────────────────────────────────────────────────────
    const createSession = useCallback(async () => {
        const created = await requestJson(apiBase, '/chat/sessions', {
            method: 'POST',
            body: JSON.stringify({ mode: 'assistant', actor: settings.actor || 'northern_web_user', temporary: false }),
        });
        const newId = created.session_id || created.id;
        setActiveSessionId(newId);
        saveSessionId(newId);
        return newId;
    }, [apiBase, settings.actor]);

    const ensureSession = useCallback(async () => {
        if (activeSessionId) return activeSessionId;
        return await createSession();
    }, [activeSessionId, createSession]);

    const loadMessages = useCallback(async (sid) => {
        const payload = await requestJson(apiBase, `/chat/sessions/${encodeURIComponent(sid)}/messages?limit=150`, { method: 'GET' });
        const raw = Array.isArray(payload) ? payload : [];
        // Map backend roles to Studio roles
        setMessages(raw.map(m => ({
            id: String(m.id),
            role: m.role === 'operator' ? 'OPERATOR' : 'INTELLIGENCE',
            content: m.content,
            timestamp: m.created_at ? new Date(m.created_at).toUTCString().slice(17, 25) + ' UTC' : getExactTime(),
            isStreaming: false,
        })));
    }, [apiBase]);

    const uploadAttachments = useCallback(async (fileList) => {
        const pickedFiles = Array.from(fileList || []).filter(Boolean);
        if (!pickedFiles.length) return;
        if (busy) {
            setError('Please wait for the current response before adding files.');
            return;
        }

        const supportedFiles = pickedFiles.filter(isOpenAiCompatibleAttachment);
        const unsupportedFiles = pickedFiles.filter((file) => !isOpenAiCompatibleAttachment(file));
        if (!supportedFiles.length) {
            setError('Unsupported file type. Northern is configured for OpenAI-style files (PDF, images, text/code/docs).');
            if (fileInputRef.current) fileInputRef.current.value = '';
            if (folderInputRef.current) folderInputRef.current.value = '';
            return;
        }

        const unsupportedMsg = unsupportedFiles.length
            ? `Skipped unsupported file${unsupportedFiles.length > 1 ? 's' : ''}: ${summarizeNames(unsupportedFiles)}${unsupportedFiles.length > 3 ? ` (+${unsupportedFiles.length - 3} more)` : ''}`
            : null;

        setError(unsupportedMsg);
        setUploadingFiles(true);
        try {
            let sid = await ensureSession();
            const formData = new FormData();
            supportedFiles.forEach((file) => formData.append('files', file, file.name));
            let payload;
            try {
                payload = await requestMultipartJson(
                    apiBase,
                    `/chat/sessions/${encodeURIComponent(sid)}/attachments`,
                    formData,
                    { method: 'POST' }
                );
            } catch (err) {
                if (!isChatSessionNotFoundError(err)) throw err;
                setMessages([]);
                setPendingAttachments([]);
                sid = await createSession();
                payload = await requestMultipartJson(
                    apiBase,
                    `/chat/sessions/${encodeURIComponent(sid)}/attachments`,
                    formData,
                    { method: 'POST' }
                );
            }

            const accepted = Array.isArray(payload?.accepted) ? payload.accepted : [];
            const rejected = Array.isArray(payload?.rejected) ? payload.rejected : [];

            if (accepted.length) {
                setPendingAttachments((prev) => {
                    const next = [...prev];
                    for (const item of accepted) {
                        const key = `${item.sha256 || ''}:${item.filename || ''}:${item.size_bytes || 0}`;
                        const exists = next.some(
                            (candidate) => `${candidate.sha256 || ''}:${candidate.filename || ''}:${candidate.size_bytes || 0}` === key
                        );
                        if (!exists) next.push(item);
                    }
                    return next.slice(-12);
                });
            }

            if (rejected.length) {
                const msg = rejected
                    .slice(0, 2)
                    .map((item) => `${item.filename || 'file'}: ${item.error || 'could not process'}`)
                    .join(' | ');
                const hint = /unsupported file type/i.test(msg)
                    ? ' Backend allowlist must be updated to match OpenAI-supported types.'
                    : '';
                setError((msg || 'Some files could not be processed.') + hint);
            }
        } catch (err) {
            setError(err.message || 'Failed to upload file(s).');
        } finally {
            setUploadingFiles(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
            if (folderInputRef.current) folderInputRef.current.value = '';
        }
    }, [apiBase, busy, createSession, ensureSession]);

    const handleDrop = useCallback((e) => {
        if (!isFileDragEvent(e)) return;
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        void (async () => {
            const files = await collectDroppedFiles(e.dataTransfer);
            await uploadAttachments(files);
        })();
    }, [uploadAttachments]);

    const handleDragOver = useCallback((e) => {
        if (!isFileDragEvent(e)) return;
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
        if (!dragActive) setDragActive(true);
    }, [dragActive]);

    const handleDragLeave = useCallback((e) => {
        if (!isFileDragEvent(e)) return;
        e.preventDefault();
        e.stopPropagation();
        const nextTarget = e.relatedTarget;
        if (nextTarget && e.currentTarget.contains(nextTarget)) return;
        setDragActive(false);
    }, []);

    const mergeConciergeRunIntoMessages = useCallback((runPayload) => {
        const nextMeta = extractConciergeMetaFromRunPayload(runPayload);
        if (!nextMeta?.runId) return;
        setMessages((prev) => prev.map((msg) => (
            msg?.conciergeMeta?.runId === nextMeta.runId
                ? { ...msg, conciergeMeta: { ...msg.conciergeMeta, ...nextMeta } }
                : msg
        )));
    }, []);

    const refreshConciergeRun = useCallback(async (runId) => {
        const sid = activeSessionId;
        if (!sid || !runId) return;
        const payload = await requestJson(
            apiBase,
            `/chat/sessions/${encodeURIComponent(sid)}/concierge/runs/${encodeURIComponent(runId)}`,
            { method: 'GET' }
        );
        mergeConciergeRunIntoMessages(payload);
        setConciergeUiByRun((prev) => {
            if (!prev[runId]?.error) return prev;
            return { ...prev, [runId]: { ...prev[runId], error: null } };
        });
    }, [activeSessionId, apiBase, mergeConciergeRunIntoMessages]);

    const approveConciergeRun = useCallback(async (meta) => {
        const sid = activeSessionId;
        const runId = String(meta?.runId || '').trim();
        if (!sid || !runId) return;
        const approvedScopes = requiredApprovalScopesFromMeta(meta);
        setConciergeUiByRun((prev) => ({
            ...prev,
            [runId]: { ...(prev[runId] || {}), approving: true, error: null },
        }));
        try {
            const payload = await requestJson(
                apiBase,
                `/chat/sessions/${encodeURIComponent(sid)}/concierge/runs/${encodeURIComponent(runId)}/approve`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        decision: 'approve',
                        approved_scopes: approvedScopes,
                    }),
                }
            );
            mergeConciergeRunIntoMessages(payload);
            setConciergeUiByRun((prev) => ({
                ...prev,
                [runId]: { ...(prev[runId] || {}), approving: false, error: null },
            }));
        } catch (err) {
            const detail = err?.payload?.detail;
            const runtimeMsg = (detail && typeof detail === 'object')
                ? String(detail.message || detail.error || '')
                : '';
            setConciergeUiByRun((prev) => ({
                ...prev,
                [runId]: {
                    ...(prev[runId] || {}),
                    approving: false,
                    error: runtimeMsg || err.message || 'Could not approve run.',
                },
            }));
        }
    }, [activeSessionId, apiBase, mergeConciergeRunIntoMessages]);

    const removePendingAttachment = useCallback(async (attachmentId) => {
        const removedItem = pendingAttachments.find((item) => item.attachment_id === attachmentId) || null;
        setPendingAttachments((prev) => prev.filter((item) => item.attachment_id !== attachmentId));

        if (!removedItem?.attachment_id || !activeSessionId) return;

        try {
            await requestJson(
                apiBase,
                `/chat/sessions/${encodeURIComponent(activeSessionId)}/attachments/${encodeURIComponent(removedItem.attachment_id)}`,
                { method: 'DELETE' }
            );
        } catch (err) {
            if (isChatSessionNotFoundError(err)) return;
            setPendingAttachments((prev) => (
                prev.some((item) => item.attachment_id === removedItem.attachment_id)
                    ? prev
                    : [...prev, removedItem]
            ));
            setError(err.message || 'Failed to remove attachment.');
        }
    }, [activeSessionId, apiBase, pendingAttachments]);

    // ── Boot ──────────────────────────────────────────────────────────────────
    useEffect(() => {
        if (authLoading) return; // Wait until auth check finishes

        if (!user) {
            setLoading(false);
            return;
        }

        let mounted = true;
        (async () => {
            try {
                let sid = await ensureSession();
                if (mounted) {
                    try {
                        await loadMessages(sid);
                    } catch (err) {
                        if (!isChatSessionNotFoundError(err)) throw err;
                        setMessages([]);
                        setPendingAttachments([]);
                        sid = await createSession();
                        await loadMessages(sid);
                    }
                }
            } catch (err) {
                if (mounted) setError(err.message || 'Could not connect to NORTHERN.');
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [createSession, ensureSession, loadMessages, authLoading, user]);

    // Session recovery on sleeping -> online transition
    useEffect(() => {
        const current = deviceStatus?.state;
        const prev = prevStateRef.current;
        prevStateRef.current = current;

        if (prev === 'sleeping' && current === 'online') {
            setToastMessage('Northern is now online. Reconnecting session...');
            void (async () => {
                const sid = await ensureSession();
                await loadMessages(sid);
                await refreshQueue();
            })();
        }
    }, [deviceStatus?.state, ensureSession, loadMessages, refreshQueue]);

    const handleRetryQueueItem = useCallback(async (itemId) => {
        try {
            await requestJson(apiBase, `/auth/portal/queue/${encodeURIComponent(itemId)}/retry`, { method: 'POST' });
            await refreshQueue();
        } catch (err) {
            setToastMessage('Failed to retry message: ' + err.message);
        }
    }, [apiBase, refreshQueue]);

    // ── Send ──────────────────────────────────────────────────────────────────
    const handleExecute = useCallback(async (e, forcedText) => {
        if (e) e.preventDefault();
        const typedText = (forcedText ?? input).trim();
        const attachmentsForSend = pendingAttachments.slice();
        const text = typedText || (attachmentsForSend.length ? 'Please read and analyze the attached file(s).' : '');
        if (!text || busy || uploadingFiles) return;

        setInput('');
        if (inputRef.current) { inputRef.current.style.height = 'auto'; }
        setError(null);

        const opId = makeMsgId('op');
        setMessages(prev => [...prev, {
            id: opId,
            role: 'OPERATOR',
            content: text,
            timestamp: getExactTime(),
            isStreaming: false,
            attachments: attachmentsForSend,
        }]);

        setBusy(true);
        setThinkTs(getExactTime());

        try {
            let sid = await ensureSession();

            // Branch to offline queue if device is not online
            if (deviceStatus?.state !== 'online') {
                try {
                    await requestJson(apiBase, '/auth/portal/queue', {
                        method: 'POST',
                        body: JSON.stringify({ session_id: sid, text })
                    });
                    if (attachmentsForSend.length) {
                        setPendingAttachments([]);
                    }
                    await refreshQueue();
                } catch (err) {
                    if (err?.status === 409 || err?.message?.includes('Queue depth')) {
                        setToastMessage('Queue full. Please wait for device to process messages.');
                        setMessages(prev => [...prev, {
                            id: makeMsgId('err'),
                            role: 'SYSTEM',
                            content: 'Queue limit reached (max 50).',
                            timestamp: getExactTime(),
                            isStreaming: false,
                        }]);
                    } else throw err;
                } finally {
                    setBusy(false);
                    setThinkTs(null);
                }
                return;
            }

            const context = attachmentsForSend.length
                ? {
                    uploaded_files: attachmentsForSend.map((item) => ({
                        attachment_id: item.attachment_id,
                        filename: item.filename,
                        media_type: item.media_type || '',
                        size_bytes: Number(item.size_bytes || 0),
                        sha256: item.sha256 || '',
                        text_chars: Number(item.text_chars || 0),
                        content_excerpt: item.content_excerpt || '',
                        truncated: Boolean(item.truncated),
                    })),
                }
                : undefined;
            const requestBody = {
                message: text,
                mode: 'assistant',
                include_session_history: true,
                ...(context ? { context } : {}),
            };
            let resp;
            try {
                resp = await requestJson(apiBase, `/chat/sessions/${encodeURIComponent(sid)}/respond`, {
                    method: 'POST',
                    body: JSON.stringify(requestBody),
                });
            } catch (err) {
                if (!isChatSessionNotFoundError(err)) throw err;
                sid = await createSession();
                resp = await requestJson(apiBase, `/chat/sessions/${encodeURIComponent(sid)}/respond`, {
                    method: 'POST',
                    body: JSON.stringify(requestBody),
                });
            }
            if (attachmentsForSend.length) {
                setPendingAttachments([]);
            }
            const reply = resp?.reply || resp?.content || '…';
            const conciergeMeta = extractConciergeMetaFromResponse(resp);
            const northernId = makeMsgId('northern');
            setMessages(prev => [...prev, {
                id: northernId,
                role: 'INTELLIGENCE',
                content: '',
                timestamp: getExactTime(),
                isStreaming: true,
                conciergeMeta,
            }]);
            await streamReply(northernId, reply, setMessages);
        } catch (err) {
            setMessages(prev => [...prev, {
                id: makeMsgId('err'),
                role: 'SYSTEM',
                content: err.message || 'Something went wrong.',
                timestamp: getExactTime(),
                isStreaming: false,
            }]);
        } finally {
            setBusy(false);
            setThinkTs(null);
        }
    }, [apiBase, busy, createSession, ensureSession, input, pendingAttachments, uploadingFiles]);

    useEffect(() => {
        if (!activeSessionId) return undefined;
        if (!activeConciergeRunIds.length) return undefined;
        let cancelled = false;

        const poll = async () => {
            for (const runId of activeConciergeRunIds) {
                try {
                    // eslint-disable-next-line no-await-in-loop
                    await refreshConciergeRun(runId);
                } catch (err) {
                    if (cancelled) return;
                    const msg = err?.message || 'Could not refresh async builder run.';
                    setConciergeUiByRun((prev) => ({
                        ...prev,
                        [runId]: { ...(prev[runId] || {}), error: msg },
                    }));
                }
            }
        };

        void poll();
        const iid = window.setInterval(() => { void poll(); }, 5000);
        return () => {
            cancelled = true;
            window.clearInterval(iid);
        };
    }, [activeConciergeRunIds, activeSessionId, refreshConciergeRun]);

    const startNew = useCallback(async () => {
        setError(null);
        try {
            await createSession();
            setMessages([]);
            setPendingAttachments([]);
        } catch (err) { setError(err.message); }
    }, [createSession]);

    // ─────────────────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="studio-page flex items-center justify-center min-h-screen">
                <span className="mono-meta" style={{ color: 'var(--text-shadow)', animation: 'blink-heavy 1.2s step-end infinite' }}>
                    Starting NORTHERN…
                </span>
            </div>
        );
    }

    return (
        <div
            className="studio-page flex flex-col min-h-screen relative"
            style={{ color: 'var(--text-ink)' }}
            onDragEnter={handleDragOver}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {dragActive && (
                <div
                    aria-hidden="true"
                    className="fixed inset-4 z-30 pointer-events-none border-2"
                    style={{
                        borderColor: 'var(--border-focus)',
                        background: 'rgba(255,255,255,0.02)',
                    }}
                />
            )}


            {/* Corner registration marks */}
            <span className="fixed top-8 left-8 text-[var(--text-shadow)] opacity-40 select-none pointer-events-none hidden md:block" style={{ fontSize: 16 }}>+</span>
            <span className="fixed top-8 right-8 text-[var(--text-shadow)] opacity-40 select-none pointer-events-none hidden md:block" style={{ fontSize: 16 }}>+</span>
            <span className="fixed bottom-8 left-8 text-[var(--text-shadow)] opacity-40 select-none pointer-events-none hidden md:block" style={{ fontSize: 16 }}>+</span>
            <span className="fixed bottom-8 right-8 text-[var(--text-shadow)] opacity-40 select-none pointer-events-none hidden md:block" style={{ fontSize: 16 }}>+</span>

            {/* ── Header ── */}
            <header className="w-full px-6 md:px-12 py-8 flex flex-col md:flex-row justify-between items-start md:items-center relative z-10">
                <div className="flex flex-col gap-1 mb-6 md:mb-0">
                    <h1 className="text-xl font-light tracking-tight" style={{ color: 'var(--text-shadow)' }}>NORTHERN Chat</h1>
                    <span className="mono-meta" style={{ color: 'var(--text-stone)' }}>
                        Studio build
                    </span>
                </div>

                {/* Telemetry + Nav */}
                <div className="flex items-center gap-6 md:gap-10 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                    {/* Telemetry */}
                    <div className="flex items-center gap-8 mono-meta" style={{ color: 'var(--text-stone)' }}>
                        <div className="flex flex-col gap-0.5 items-end">
                            <span>CLOCK</span>
                            <span style={{ color: 'var(--text-shadow)' }}>{tel.hz} MHZ</span>
                        </div>
                        <div className="flex flex-col gap-0.5 items-end">
                            <span>CORE_TEMP</span>
                            <span style={{ color: 'var(--text-shadow)' }}>{tel.temp.toFixed(1)} °C</span>
                        </div>
                        <div className="flex flex-col gap-0.5 items-end">
                            <span>STATUS</span>
                            <span style={{ color: status === 'COMPUTING' ? 'var(--text-ink)' : 'var(--text-stone)' }}
                                className={status === 'COMPUTING' ? 'animate-pulse' : ''}>
                                {status}
                            </span>
                        </div>
                        <DeviceStatusBadge status={deviceStatus} />
                    </div>

                    {/* Nav actions */}
                    <div className="flex items-center gap-1 shrink-0">
                        {[
                            { label: 'New session', onClick: startNew },
                            { label: 'Personality', to: '/onboarding' },
                            { label: 'Settings', to: '/settings' },
                            { label: 'Home', to: '/' },
                            ...(user ? [{ label: 'Logout', onClick: logout }] : [{ label: 'Sign in', onClick: () => window.location.href = '/login?next=/chat' }])
                        ].map(item => item.to ? (
                            <Link key={item.label} to={item.to}
                                className="mono-meta px-3 py-1.5 transition-colors hover:opacity-80"
                                style={{ color: 'var(--text-stone)', borderBottom: '1px solid transparent' }}>
                                {item.label}
                            </Link>
                        ) : (
                            <button key={item.label} type="button" onClick={item.onClick}
                                className="mono-meta px-3 py-1.5 border transition-colors"
                                style={{ borderColor: 'var(--border-hairline)', color: 'var(--text-stone)' }}>
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <OfflineBanner status={deviceStatus} />

            {/* ── Error banner ── */}
            {error && (
                <div className="relative z-10 mx-6 md:mx-12 mb-4 px-4 py-2 border mono-meta"
                    style={{ borderColor: 'var(--border-focus)', color: 'var(--text-ink)' }}>
                    {error}
                </div>
            )}

            {/* ── Main conversation area ── */}
            <main className="flex-1 w-full max-w-[1400px] mx-auto px-6 md:px-12 pt-8 md:pt-16 pb-72 relative z-10 flex flex-col">

                {/* Empty state */}
                {messages.length === 0 && !busy ? (
                    <div className={!user ? "flex-1 flex flex-col items-center justify-center animate-reveal" : "flex-1 flex flex-col justify-center max-w-3xl animate-reveal mt-12 md:mt-24"}>
                        {!user ? (
                            <div className="w-full max-w-md p-10 border border-[var(--border-hairline)] bg-[rgba(255,255,255,0.01)] text-center flex flex-col items-center gap-8 backdrop-blur-sm relative overflow-hidden group">
                                {/* Ambient glow */}
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.03)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

                                <div className="mono-meta uppercase tracking-[0.2em] opacity-60 flex items-center gap-3 relative z-10" style={{ color: 'var(--text-shadow)' }}>
                                    <span className="w-4 h-[1px] bg-current" />
                                    Authentication Required
                                    <span className="w-4 h-[1px] bg-current" />
                                </div>

                                <h3 className="text-2xl font-light leading-snug relative z-10" style={{ color: 'var(--text-ink)' }}>
                                    Sign up or continue with<br />Google or Apple
                                </h3>

                                <div className="flex flex-col w-full gap-3 mt-2 relative z-10">
                                    <a href="/login?next=/chat" className="w-full flex items-center justify-center gap-3 px-6 py-4 border transition-all duration-300 hover:scale-[1.02]" style={{ borderColor: '#000000', backgroundColor: '#000000', color: '#ffffff' }}>
                                        <span className="font-medium tracking-wide">Continue with Email</span>
                                    </a>

                                    <div className="flex gap-3">
                                        <button onClick={() => setMockAuth(true)} className="group flex-1 flex items-center justify-center py-4 border transition-all duration-300 hover:scale-[1.02] hover:bg-[rgba(255,255,255,0.03)] hover:border-[rgba(255,255,255,0.2)] overflow-hidden" style={{ borderColor: 'var(--border-hairline)', color: 'var(--text-ink)' }}>
                                            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                                                <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                                                    <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                                                    <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                                                    <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                                                    <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                                                </g>
                                            </svg>
                                            <span className="max-w-0 opacity-0 overflow-hidden whitespace-nowrap transition-all duration-300 group-hover:max-w-[70px] group-hover:opacity-100 group-hover:ml-3 font-medium text-sm">Google</span>
                                        </button>
                                        <button onClick={() => setMockAuth(true)} className="group flex-1 flex items-center justify-center py-4 border transition-all duration-300 hover:scale-[1.02] hover:bg-[rgba(255,255,255,0.03)] hover:border-[rgba(255,255,255,0.2)] overflow-hidden" style={{ borderColor: 'var(--border-hairline)', color: 'var(--text-ink)' }}>
                                            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" className="shrink-0 -mt-0.5">
                                                <path d="M16.92 14.88c-.02-2.32 1.9-3.44 1.98-3.49-1.08-1.58-2.76-1.8-3.36-1.82-1.42-.14-2.78.84-3.5.84-.71 0-1.84-.81-3.04-.79-1.55.02-2.98.9-3.78 2.29-1.62 2.8-.41 6.94 1.18 9.22.77 1.11 1.68 2.36 2.89 2.31 1.16-.04 1.61-.75 3.01-.75 1.4 0 1.83.75 3.04.73 1.25-.02 2.05-1.15 2.8-2.26.87-1.27 1.23-2.5 1.24-2.56-.02-.01-2.39-.91-2.41-3.62zM14.99 6.88c.63-.77 1.06-1.83.94-2.88-.91.04-2.02.61-2.67 1.39-.58.68-1.09 1.77-.94 2.8 1.02.08 2.03-.54 2.67-1.31z" />
                                            </svg>
                                            <span className="max-w-0 opacity-0 overflow-hidden whitespace-nowrap transition-all duration-300 group-hover:max-w-[70px] group-hover:opacity-100 group-hover:ml-2 font-medium text-sm">Apple</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-3xl md:text-5xl font-light leading-tight tracking-tight mb-6"
                                    style={{ color: 'var(--text-ink)' }}>
                                    Chat with<br />NORTHERN
                                </h2>
                                <p className="text-base md:text-lg font-light leading-relaxed mb-12 max-w-xl"
                                    style={{ color: 'var(--text-stone)' }}>
                                    Type a message below, or choose a starter prompt to begin.
                                </p>
                                <div className="flex flex-col gap-4">
                                    <span className="mono-meta mb-2" style={{ color: 'var(--text-shadow)' }}>Starter prompts</span>
                                    {deviceStatus?.state === 'online' ? (
                                        SUGGESTED.map(seq => (
                                            <button key={seq} type="button" onClick={() => void handleExecute(null, seq)}
                                                className="text-left py-4 px-6 border transition-all duration-300 group flex items-center justify-between"
                                                style={{ borderColor: 'var(--border-hairline)' }}
                                                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-focus)'}
                                                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-hairline)'}>
                                                <span className="font-light tracking-wide transition-colors" style={{ color: 'var(--text-stone)' }}>
                                                    {seq}
                                                </span>
                                                <span style={{ color: 'var(--text-shadow)' }}>→</span>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="p-4 border border-[var(--border-hairline)] text-[var(--text-stone)] mono-meta">
                                            Device is {deviceStatus?.state || 'not connected'}. Please connect or wake your device to use starter prompts.
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col w-full">
                        {messages.map(msg => (
                            <div key={msg.id}
                                className="flex flex-col md:flex-row gap-4 md:gap-24 py-12 md:py-16 animate-reveal">

                                {/* Left-rail metadata */}
                                <div className="w-full md:w-48 shrink-0 flex flex-col gap-2 pt-2 border-l-2 md:border-l-0 pl-3 md:pl-0"
                                    style={{ borderColor: 'var(--border-hairline)' }}>
                                    <div className="mono-meta flex items-center">
                                        <span style={{
                                            color: msg.role === 'INTELLIGENCE'
                                                ? 'var(--text-ink)'
                                                : msg.role === 'SYSTEM'
                                                    ? 'var(--text-shadow)'
                                                    : 'var(--text-stone)',
                                            fontWeight: msg.role === 'INTELLIGENCE' ? 500 : 400,
                                        }}>
                                            {msg.role}
                                        </span>
                                    </div>
                                    <div className="flex md:flex-col gap-4 md:gap-2">
                                        <span className="mono-meta" style={{ color: 'var(--text-shadow)' }}>
                                            {formatDisplayId(msg.id, msg.role)}
                                        </span>
                                        <span className="mono-meta" style={{ color: 'var(--text-shadow)' }}>
                                            {msg.timestamp}
                                        </span>
                                    </div>
                                </div>

                                {/* Content column */}
                                <div className="flex-1 max-w-4xl">
                                    <div className="text-lg md:text-2xl font-light leading-[1.8] tracking-tight whitespace-pre-wrap"
                                        style={{
                                            color: msg.role === 'OPERATOR'
                                                ? 'var(--text-stone)'
                                                : msg.role === 'SYSTEM'
                                                    ? 'var(--text-shadow)'
                                                    : 'var(--text-ink)',
                                        }}>
                                        {msg.content}
                                        {msg.isStreaming && <span className="cursor-block" />}
                                    </div>
                                    {Array.isArray(msg.attachments) && msg.attachments.length > 0 && (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {msg.attachments.map((file) => (
                                                <div
                                                    key={file.attachment_id || `${file.filename}-${file.sha256 || ''}`}
                                                    className="mono-meta px-3 py-1.5 border"
                                                    style={{ borderColor: 'var(--border-hairline)', color: 'var(--text-shadow)' }}
                                                >
                                                    {file.filename} · {formatBytes(file.size_bytes)}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {msg.role === 'INTELLIGENCE' && msg.conciergeMeta && (
                                        <div
                                            className="mt-5 border p-4 md:p-5"
                                            style={{
                                                borderColor: 'var(--border-hairline)',
                                                background: 'rgba(255,255,255,0.01)',
                                            }}
                                        >
                                            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                                <div className="mono-meta" style={{ color: 'var(--text-ink)' }}>
                                                    ASYNC BUILDER RUN
                                                </div>
                                                <div className="mono-meta" style={{ color: 'var(--text-shadow)' }}>
                                                    {msg.conciergeMeta.runId || 'pending'}
                                                </div>
                                            </div>

                                            {(() => {
                                                const runUi = conciergeUiByRun[msg.conciergeMeta.runId || ''] || {};
                                                return (
                                                    <>
                                                        <div className="mt-3 flex flex-wrap gap-2">
                                                            {msg.conciergeMeta.status && (
                                                                <span
                                                                    className="mono-meta px-2 py-1 border"
                                                                    style={{ borderColor: 'var(--border-hairline)', color: 'var(--text-shadow)' }}
                                                                >
                                                                    STATUS · {titleCaseWords(msg.conciergeMeta.status)}
                                                                </span>
                                                            )}
                                                            {msg.conciergeMeta.approvalRequired && (
                                                                <span
                                                                    className="mono-meta px-2 py-1 border"
                                                                    style={{ borderColor: 'var(--border-focus)', color: 'var(--text-ink)' }}
                                                                >
                                                                    APPROVAL REQUIRED
                                                                </span>
                                                            )}
                                                            {formatEtaRange(msg.conciergeMeta.eta) && (
                                                                <span
                                                                    className="mono-meta px-2 py-1 border"
                                                                    style={{ borderColor: 'var(--border-hairline)', color: 'var(--text-shadow)' }}
                                                                >
                                                                    ETA · {formatEtaRange(msg.conciergeMeta.eta)}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="mt-3 flex flex-wrap gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => void refreshConciergeRun(msg.conciergeMeta.runId)}
                                                                className="mono-meta px-3 py-1.5 border"
                                                                style={{ borderColor: 'var(--border-hairline)', color: 'var(--text-shadow)' }}
                                                            >
                                                                Refresh status
                                                            </button>
                                                            {msg.conciergeMeta.approvalRequired
                                                                && String(msg.conciergeMeta.status || '').toLowerCase() === 'waiting_approval'
                                                                && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => void approveConciergeRun(msg.conciergeMeta)}
                                                                        disabled={Boolean(runUi.approving)}
                                                                        className="mono-meta px-3 py-1.5 border"
                                                                        style={{
                                                                            borderColor: 'var(--border-focus)',
                                                                            color: 'var(--text-ink)',
                                                                            opacity: runUi.approving ? 0.6 : 1,
                                                                        }}
                                                                    >
                                                                        {runUi.approving ? 'Approving…' : 'Approve run'}
                                                                    </button>
                                                                )}
                                                        </div>
                                                        {runUi.error && (
                                                            <div
                                                                className="mt-3 mono-meta"
                                                                style={{ color: 'var(--text-shadow)' }}
                                                            >
                                                                {runUi.error}
                                                            </div>
                                                        )}
                                                    </>
                                                );
                                            })()}

                                            {msg.conciergeMeta.plan?.summary && (
                                                <p
                                                    className="mt-4 text-sm md:text-base font-light leading-relaxed"
                                                    style={{ color: 'var(--text-stone)' }}
                                                >
                                                    {msg.conciergeMeta.plan.summary}
                                                </p>
                                            )}

                                            {Array.isArray(msg.conciergeMeta.plan?.steps) && msg.conciergeMeta.plan.steps.length > 0 && (
                                                <div className="mt-4 flex flex-col gap-2">
                                                    {(msg.conciergeMeta.plan.steps || []).slice(0, 4).map((step, idx) => (
                                                        <div
                                                            key={`${msg.conciergeMeta.runId || 'run'}-step-${idx}`}
                                                            className="mono-meta flex items-start gap-2"
                                                            style={{ color: 'var(--text-shadow)' }}
                                                        >
                                                            <span style={{ minWidth: '1.5rem' }}>{String(idx + 1).padStart(2, '0')}</span>
                                                            <span>{step?.summary || titleCaseWords(step?.kind || 'step')}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {msg.conciergeMeta.gapBuild && (
                                                <div
                                                    className="mt-4 p-3 border"
                                                    style={{ borderColor: 'var(--border-hairline)', background: 'rgba(255,255,255,0.01)' }}
                                                >
                                                    <div className="mono-meta" style={{ color: 'var(--text-shadow)' }}>
                                                        GAP BUILD
                                                    </div>
                                                    <div className="mt-2 flex flex-wrap gap-2">
                                                        {msg.conciergeMeta.gapBuild.gap_name_hint && (
                                                            <span className="mono-meta" style={{ color: 'var(--text-stone)' }}>
                                                                Capability: {msg.conciergeMeta.gapBuild.gap_name_hint}
                                                            </span>
                                                        )}
                                                        {msg.conciergeMeta.gapBuild.auto_triggered && (
                                                            <span className="mono-meta" style={{ color: 'var(--text-shadow)' }}>
                                                                Auto-triggered
                                                            </span>
                                                        )}
                                                        {msg.conciergeMeta.gapBuild.catalog_refresh?.done && (
                                                            <span className="mono-meta" style={{ color: 'var(--text-ink)' }}>
                                                                Catalog refreshed
                                                            </span>
                                                        )}
                                                    </div>
                                                    {msg.conciergeMeta.gapBuild.build_result?.codex_summary_plain && (
                                                        <p
                                                            className="mt-3 text-sm md:text-base font-light leading-relaxed"
                                                            style={{ color: 'var(--text-stone)' }}
                                                        >
                                                            {msg.conciergeMeta.gapBuild.build_result.codex_summary_plain}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* SYNTHETIC QUEUE ROWS */}
                        {localQueueItems.map(item => (
                            <QueueStatusCard key={`q-${item.id}`} item={item} onRetry={handleRetryQueueItem} />
                        ))}

                        {/* INTELLIGENCE thinking row */}
                        {busy && !messages.some(m => m.isStreaming) && (
                            <div className="flex flex-col md:flex-row gap-4 md:gap-24 py-12 md:py-16 animate-reveal">
                                <div className="w-full md:w-48 shrink-0 flex flex-col gap-2 pt-2">
                                    <span className="mono-meta" style={{ color: 'var(--text-ink)', fontWeight: 500 }}>INTELLIGENCE</span>
                                    <span className="mono-meta" style={{ color: 'var(--text-shadow)' }}>SYS-LIVE</span>
                                    <span className="mono-meta" style={{ color: 'var(--text-shadow)' }}>{thinkTs ?? getExactTime()}</span>
                                </div>
                                <div className="flex-1 max-w-4xl">
                                    <div className="text-lg md:text-2xl font-light leading-[1.8]" style={{ color: 'var(--text-ink)' }}>
                                        Working on that.<span className="cursor-block" />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={endRef} className="h-32" />
                    </div>
                )}
            </main>

            {/* ── Command strip ── */}
            <div className="fixed bottom-0 w-full z-20" style={{ backgroundColor: 'var(--bg-carbon)' }}>
                {/* fade mask */}
                <div className="pointer-events-none absolute inset-x-0 bottom-full h-36"
                    style={{ background: 'linear-gradient(to top, var(--bg-carbon), transparent)' }} />

                <form
                    onSubmit={handleExecute}
                    className="max-w-[1400px] mx-auto px-6 md:px-12 py-8 flex flex-col md:flex-row gap-6 md:gap-24 relative"
                >

                    {/* Left label */}
                    <div className="w-48 shrink-0 pt-4 hidden md:block mono-meta" style={{ color: 'var(--text-shadow)' }}>
                        Message
                    </div>

                    {/* Input + submit */}
                    <div
                        className="flex-1 flex flex-col gap-3 relative group border p-3 md:p-4 transition-colors"
                        style={{
                            borderColor: dragActive ? 'var(--border-focus)' : 'var(--border-hairline)',
                            background: dragActive ? 'rgba(255,255,255,0.02)' : 'transparent',
                        }}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept={OPENAI_ATTACHMENT_ACCEPT}
                            className="hidden"
                            onChange={(e) => void uploadAttachments(e.target.files)}
                        />
                        <input
                            ref={folderInputRef}
                            type="file"
                            multiple
                            accept={OPENAI_ATTACHMENT_ACCEPT}
                            className="hidden"
                            onChange={(e) => void uploadAttachments(e.target.files)}
                            directory=""
                            webkitdirectory=""
                        />

                        {pendingAttachments.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {pendingAttachments.map((file) => (
                                    <div
                                        key={file.attachment_id || `${file.filename}-${file.sha256 || ''}`}
                                        className="flex items-center gap-2 px-3 py-1.5 border mono-meta"
                                        style={{ borderColor: 'var(--border-hairline)', color: 'var(--text-shadow)' }}
                                    >
                                        <span>{file.filename}</span>
                                        <span style={{ opacity: 0.8 }}>· {formatBytes(file.size_bytes)}</span>
                                        <button
                                            type="button"
                                            onClick={() => removePendingAttachment(file.attachment_id)}
                                            className="px-1"
                                            style={{ color: 'var(--text-bone)' }}
                                            aria-label={`Remove ${file.filename}`}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex items-end gap-3 md:gap-4">
                            <div className="shrink-0 flex items-center gap-2 pb-2">
                                <button
                                    type="button"
                                    onClick={() => folderInputRef.current?.click()}
                                    disabled={!user || busy || uploadingFiles || deviceStatus?.queue_depth >= 50}
                                    title="Add a folder"
                                    aria-label="Add a folder"
                                    className="inline-flex items-center justify-center w-10 h-10 border transition-colors"
                                    style={{
                                        borderColor: dragActive ? 'var(--border-focus)' : 'var(--border-hairline)',
                                        color: 'var(--text-shadow)',
                                        background: 'transparent',
                                        opacity: (!user || busy || uploadingFiles || deviceStatus?.queue_depth >= 50) ? 0.5 : 1,
                                    }}
                                >
                                    <PlusIcon />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={!user || busy || uploadingFiles || deviceStatus?.queue_depth >= 50}
                                    title="Attach files"
                                    aria-label="Attach files"
                                    className="inline-flex items-center justify-center w-10 h-10 border transition-colors"
                                    style={{
                                        borderColor: dragActive ? 'var(--border-focus)' : 'var(--border-hairline)',
                                        color: 'var(--text-shadow)',
                                        background: 'transparent',
                                        opacity: (!user || busy || uploadingFiles || deviceStatus?.queue_depth >= 50) ? 0.5 : 1,
                                    }}
                                >
                                    <AttachmentIcon />
                                </button>
                            </div>
                            <textarea
                                ref={inputRef}
                                value={input}
                                onChange={e => { setInput(e.target.value); resizeInput(e.target); }}
                                onKeyDown={e => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        void handleExecute();
                                    }
                                }}
                                disabled={!user || busy || uploadingFiles || deviceStatus?.queue_depth >= 50}
                                placeholder={
                                    !user ? 'Sign in to send a message' :
                                        deviceStatus?.queue_depth >= 50 ? 'Queue limit reached (max 50). Please wait.' :
                                            pendingAttachments.length ? 'Ask Northern to analyze the attached files…' : 'Type a message...'
                                }
                                rows={1}
                                spellCheck={false}
                                className="w-full border-none focus:outline-none resize-none py-2 max-h-[35vh] scroll-smooth leading-snug"
                                style={{
                                    background: 'transparent',
                                    fontSize: 'clamp(1.25rem, 3vw, 1.875rem)',
                                    fontWeight: 300,
                                    letterSpacing: '-0.02em',
                                    color: 'var(--text-bone)',
                                    caretColor: 'var(--text-bone)',
                                    opacity: (!user || busy || uploadingFiles || deviceStatus?.queue_depth >= 50) ? 0.3 : 1,
                                }}
                            />
                            <button
                                type="submit"
                                disabled={!user || (!input.trim() && pendingAttachments.length === 0) || busy || uploadingFiles || deviceStatus?.queue_depth >= 50}
                                className="shrink-0 p-4 border transition-all duration-300"
                                style={{
                                    borderColor: user && (input.trim() || pendingAttachments.length > 0) && !busy && !uploadingFiles && (deviceStatus?.queue_depth || 0) < 50
                                        ? 'rgba(255,255,255,0.35)'
                                        : 'rgba(255,255,255,0.2)',
                                    color: 'var(--text-bone)',
                                    background: 'var(--bg-carbon)',
                                    opacity: (!user || (!input.trim() && pendingAttachments.length === 0) || busy || uploadingFiles || deviceStatus?.queue_depth >= 50) ? 0 : 1,
                                    pointerEvents: (!user || (!input.trim() && pendingAttachments.length === 0) || busy || uploadingFiles || deviceStatus?.queue_depth >= 50) ? 'none' : 'auto',
                                }}>
                                →
                            </button>
                        </div>
                        <div className="mono-meta flex justify-between opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 hidden md:flex"
                            style={{ color: 'var(--text-shadow)' }}>
                            <span>Shift + Enter for a new line</span>
                            <span style={{ paddingRight: '5rem' }}>
                                {uploadingFiles ? 'Wait for uploads to finish' : 'Press Enter to send'}
                            </span>
                        </div>
                    </div>
                </form>
            </div>

            <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
        </div>
    );
}
