import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/studio.css';
import { requestJson } from '../lib/api';
import { useSettings } from '../hooks/useSettings';

// ─── Feature flags ────────────────────────────────────────────────────────────
const DEVICE_PANEL_ENABLED = false;

// ─── Session persistence ──────────────────────────────────────────────────────
const SESSION_ID_KEY = 'tars.chat.session_id.v1';
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

// ─── Component ────────────────────────────────────────────────────────────────
export default function ChatPortal() {
    const { settings } = useSettings();
    const apiBase = useMemo(
        () => (settings.apiBaseUrl || '').replace(/\/+$/, '') || '/api',
        [settings.apiBaseUrl]
    );

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [messages, setMessages] = useState([]);
    const [activeSessionId, setActiveSessionId] = useState(() => loadSavedSessionId());
    const [input, setInput] = useState('');
    const [busy, setBusy] = useState(false);
    const [thinkTs, setThinkTs] = useState(null);

    const endRef = useRef(null);
    const inputRef = useRef(null);
    const tel = useTelemetry(busy);
    const status = busy ? 'COMPUTING' : 'STANDBY';

    // scroll to bottom on new messages
    useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, busy]);

    // textarea auto-height
    const resizeInput = (el) => { el.style.height = 'auto'; el.style.height = `${el.scrollHeight}px`; };

    // ── Ensure session ──────────────────────────────────────────────────────────
    const ensureSession = useCallback(async () => {
        if (activeSessionId) return activeSessionId;
        const created = await requestJson(apiBase, '/chat/sessions', {
            method: 'POST',
            body: JSON.stringify({ mode: 'assistant', actor: settings.actor || 'tars_web_user', temporary: false }),
        });
        const newId = created.session_id || created.id;
        setActiveSessionId(newId);
        saveSessionId(newId);
        return newId;
    }, [activeSessionId, apiBase, settings.actor]);

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

    // ── Boot ──────────────────────────────────────────────────────────────────
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const sid = await ensureSession();
                if (mounted) await loadMessages(sid);
            } catch (err) {
                if (mounted) setError(err.message || 'Could not connect to TARS.');
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Send ──────────────────────────────────────────────────────────────────
    const handleExecute = useCallback(async (e, forcedText) => {
        if (e) e.preventDefault();
        const text = (forcedText ?? input).trim();
        if (!text || busy) return;

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
        }]);

        setBusy(true);
        setThinkTs(getExactTime());

        try {
            const sid = await ensureSession();
            const resp = await requestJson(apiBase, `/chat/sessions/${encodeURIComponent(sid)}/respond`, {
                method: 'POST',
                body: JSON.stringify({ message: text, mode: 'assistant', include_session_history: true }),
            });
            const reply = resp?.reply || resp?.content || '…';
            const tarsId = makeMsgId('tars');
            setMessages(prev => [...prev, {
                id: tarsId,
                role: 'INTELLIGENCE',
                content: '',
                timestamp: getExactTime(),
                isStreaming: true,
            }]);
            await streamReply(tarsId, reply, setMessages);
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
    }, [apiBase, busy, ensureSession, input]);

    const startNew = useCallback(async () => {
        setError(null);
        try {
            const created = await requestJson(apiBase, '/chat/sessions', {
                method: 'POST',
                body: JSON.stringify({ mode: 'assistant', actor: settings.actor || 'tars_web_user', temporary: false }),
            });
            const newId = created.session_id || created.id;
            setActiveSessionId(newId);
            saveSessionId(newId);
            setMessages([]);
        } catch (err) { setError(err.message); }
    }, [apiBase, settings.actor]);

    // ─────────────────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="studio-page flex items-center justify-center min-h-screen">
                <span className="mono-meta" style={{ color: 'var(--text-shadow)', animation: 'blink-heavy 1.2s step-end infinite' }}>
                    Starting TARS…
                </span>
            </div>
        );
    }

    return (
        <div className="studio-page flex flex-col min-h-screen relative" style={{ color: 'var(--text-ink)' }}>


            {/* Corner registration marks */}
            <span className="fixed top-8 left-8 text-[var(--text-shadow)] opacity-40 select-none pointer-events-none hidden md:block" style={{ fontSize: 16 }}>+</span>
            <span className="fixed top-8 right-8 text-[var(--text-shadow)] opacity-40 select-none pointer-events-none hidden md:block" style={{ fontSize: 16 }}>+</span>
            <span className="fixed bottom-8 left-8 text-[var(--text-shadow)] opacity-40 select-none pointer-events-none hidden md:block" style={{ fontSize: 16 }}>+</span>
            <span className="fixed bottom-8 right-8 text-[var(--text-shadow)] opacity-40 select-none pointer-events-none hidden md:block" style={{ fontSize: 16 }}>+</span>

            {/* ── Header ── */}
            <header className="w-full px-6 md:px-12 py-8 flex flex-col md:flex-row justify-between items-start md:items-center relative z-10">
                <div className="flex flex-col gap-1 mb-6 md:mb-0">
                    <h1 className="text-xl font-light tracking-tight" style={{ color: 'var(--text-shadow)' }}>TARS Chat</h1>
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
                    </div>

                    {/* Nav actions */}
                    <div className="flex items-center gap-1 shrink-0">
                        {[
                            { label: 'New session', onClick: startNew },
                            { label: 'Personality', to: '/onboarding' },
                            { label: 'Settings', to: '/settings' },
                            { label: 'Home', to: '/' },
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
                    <div className="flex-1 flex flex-col justify-center max-w-3xl animate-reveal mt-12 md:mt-24">
                        <h2 className="text-3xl md:text-5xl font-light leading-tight tracking-tight mb-6"
                            style={{ color: 'var(--text-ink)' }}>
                            Chat with<br />TARS
                        </h2>
                        <p className="text-base md:text-lg font-light leading-relaxed mb-12 max-w-xl"
                            style={{ color: 'var(--text-stone)' }}>
                            Type a message below, or choose a starter prompt to begin.
                        </p>
                        <div className="flex flex-col gap-4">
                            <span className="mono-meta mb-2" style={{ color: 'var(--text-shadow)' }}>Starter prompts</span>
                            {SUGGESTED.map(seq => (
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
                            ))}
                        </div>
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
                                </div>
                            </div>
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

                <form onSubmit={handleExecute}
                    className="max-w-[1400px] mx-auto px-6 md:px-12 py-8 flex flex-col md:flex-row gap-6 md:gap-24 relative">

                    {/* Left label */}
                    <div className="w-48 shrink-0 pt-4 hidden md:block mono-meta" style={{ color: 'var(--text-shadow)' }}>
                        Message
                    </div>

                    {/* Input + submit */}
                    <div className="flex-1 flex flex-col gap-3 relative group">
                        <div className="flex items-end gap-6">
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
                                disabled={busy}
                                placeholder="Type a message..."
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
                                    opacity: busy ? 0.3 : 1,
                                }}
                            />
                            <button type="submit" disabled={!input.trim() || busy}
                                className="shrink-0 p-4 border transition-all duration-300"
                                style={{
                                    borderColor: input.trim() && !busy ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.2)',
                                    color: 'var(--text-bone)',
                                    background: 'var(--bg-carbon)',
                                    opacity: !input.trim() || busy ? 0 : 1,
                                    pointerEvents: !input.trim() || busy ? 'none' : 'auto',
                                }}>
                                →
                            </button>
                        </div>
                        <div className="mono-meta flex justify-between opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 hidden md:flex"
                            style={{ color: 'var(--text-shadow)' }}>
                            <span>Shift + Enter for a new line</span>
                            <span style={{ paddingRight: '5rem' }}>Press Enter to send</span>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
