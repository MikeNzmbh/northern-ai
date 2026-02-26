import { useEffect, useMemo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import '../styles/studio.css';
import { requestJson, buildUrl, RECOMMENDED_DEV_BASE } from '../lib/api';
import { useSettings } from '../hooks/useSettings';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function isSelfOrigin(base) {
    if (!base) return false;
    try {
        const url = new URL(base, window.location.origin);
        return url.origin === window.location.origin && !base.trim().startsWith('/api');
    } catch { return false; }
}

function diagnoseFetchError(err, base) {
    const msg = err?.message || '';
    if (msg.includes('HTML') || msg.includes('not valid JSON'))
        return 'Response was HTML — API base likely points to the frontend. Use /api or the direct backend URL.';
    if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
        if (base?.startsWith('/')) return 'The local proxy could not reach the NORTHERN backend. Make sure the backend is running on http://127.0.0.1:8000.';
        if (isSelfOrigin(base)) return `${base} is this website, not the NORTHERN backend. Use /api or http://127.0.0.1:8000.`;
        return `Cannot connect to ${base}. Is the NORTHERN backend running?`;
    }
    return msg || 'Unknown error';
}

const CONN_IDLE = 'idle', CONN_RUNNING = 'running', CONN_OK = 'ok', CONN_FAIL = 'fail';

// ─── Studio input/label primitives ───────────────────────────────────────────
function Field({ label, hint, children }) {
    return (
        <div className="space-y-1.5">
            {label && <label className="mono-meta block" style={{ color: 'var(--text-shadow)' }}>{label}</label>}
            {children}
            {hint && <p className="mono-meta mt-0.5" style={{ fontSize: '9px', color: 'var(--text-shadow)' }}>{hint}</p>}
        </div>
    );
}
function SInput({ value, onChange, placeholder, type = 'text' }) {
    return (
        <input type={type} value={value} onChange={onChange} placeholder={placeholder}
            className="w-full border px-3 py-2 text-sm font-light bg-transparent focus:outline-none"
            style={{ borderColor: 'var(--border-hairline)', color: 'var(--text-ink)' }} />
    );
}

// ─── Test Connection ─────────────────────────────────────────────────────────
function TestConnection({ base }) {
    const [status, setStatus] = useState(CONN_IDLE);
    const [detail, setDetail] = useState('');
    const [sessionId, setSessionId] = useState(null);

    const run = useCallback(async () => {
        setStatus(CONN_RUNNING); setDetail(''); setSessionId(null);
        try {
            const resp = await requestJson(base, '/chat/sessions', {
                method: 'POST',
                body: JSON.stringify({ mode: 'assistant', actor: 'northern_web_user', temporary: true }),
            });
            setSessionId(resp?.session_id || resp?.id || '(no id)');
            setDetail(`Backend reachable via ${base || '(empty)'}`);
            setStatus(CONN_OK);
        } catch (err) {
            setDetail(diagnoseFetchError(err, base));
            setStatus(CONN_FAIL);
        }
    }, [base]);

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-4">
                <button type="button" onClick={run} disabled={status === CONN_RUNNING}
                    className="mono-meta px-4 py-2 border transition-all disabled:opacity-40"
                    style={{ borderColor: 'var(--border-hairline)', color: 'var(--text-ink)' }}
                    onMouseEnter={e => status !== CONN_RUNNING && (e.currentTarget.style.borderColor = 'var(--border-focus)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-hairline)')}>
                    {status === CONN_RUNNING ? 'Testing…' : 'Test connection'}
                </button>
                {status === CONN_OK && <span className="mono-meta" style={{ color: '#3a7a4a' }}>✓ Connected</span>}
                {status === CONN_FAIL && <span className="mono-meta" style={{ color: '#9e3737' }}>✗ Failed</span>}
            </div>
            {detail && (
                <div className="border px-3 py-2 text-xs font-light"
                    style={{
                        borderColor: status === CONN_OK ? 'rgba(60,160,80,0.25)' : 'rgba(180,60,60,0.25)',
                        color: 'var(--text-stone)',
                    }}>
                    <p>{detail}</p>
                    {sessionId && <p className="mono-meta mt-1" style={{ color: 'var(--text-shadow)' }}>session: {sessionId}</p>}
                </div>
            )}
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Settings() {
    const { settings, update, isLoading } = useSettings();
    const [apiBaseUrl, setApiBaseUrl] = useState('');
    const [operatorToken, setOperatorToken] = useState('');
    const [actor, setActor] = useState('');
    const [saved, setSaved] = useState(false);
    const [profile, setProfile] = useState(null);
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileError, setProfileError] = useState(null);

    useEffect(() => {
        if (!isLoading) { setApiBaseUrl(settings.apiBaseUrl); setOperatorToken(settings.operatorToken); setActor(settings.actor); }
    }, [isLoading, settings]);

    const resolvedBase = useMemo(() => (apiBaseUrl || settings.apiBaseUrl || RECOMMENDED_DEV_BASE).replace(/\/+$/, ''), [apiBaseUrl, settings.apiBaseUrl]);
    const brokenConfig = isSelfOrigin(resolvedBase);

    useEffect(() => {
        if (!actor.trim() || brokenConfig) return;
        let mounted = true;
        setProfileLoading(true); setProfileError(null);
        requestJson(resolvedBase, `/chat/profiles/${encodeURIComponent(actor.trim())}`, { method: 'GET' })
            .then(d => { if (mounted) setProfile(d); })
            .catch(e => { if (mounted) setProfileError(e.message); })
            .finally(() => { if (mounted) setProfileLoading(false); });
        return () => { mounted = false; };
    }, [actor, resolvedBase, brokenConfig]);

    const handleSave = e => {
        e.preventDefault();
        update({ apiBaseUrl: apiBaseUrl.trim(), operatorToken: operatorToken.trim(), actor: actor.trim() || 'northern_web_user' });
        setSaved(true); setTimeout(() => setSaved(false), 2500);
    };

    return (
        <div className="studio-page" style={{ color: 'var(--text-ink)' }}>


            <div className="relative z-10 mx-auto max-w-3xl px-6 md:px-12 py-10 space-y-10">

                {/* Header */}
                <header className="flex items-center justify-between">
                    <div>
                        <span className="mono-meta block mb-2" style={{ color: 'var(--text-shadow)' }}>NORTHERN / Settings</span>
                        <h1 className="text-3xl font-light tracking-tight" style={{ color: 'var(--text-ink)' }}>Connection &amp; Profile</h1>
                    </div>
                    <div className="flex gap-2">
                        <Link to="/chat" className="mono-meta px-3 py-1.5 border transition-colors"
                            style={{ borderColor: 'var(--border-hairline)', color: 'var(--text-stone)' }}>Chat</Link>
                        <Link to="/" className="mono-meta px-3 py-1.5 border transition-colors"
                            style={{ borderColor: 'var(--border-hairline)', color: 'var(--text-stone)' }}>← Home</Link>
                    </div>
                </header>

                {/* Connection form */}
                <form onSubmit={handleSave} className="border space-y-6 px-6 py-6" style={{ borderColor: 'var(--border-hairline)' }}>
                    <span className="mono-meta block" style={{ color: 'var(--text-shadow)' }}>Connection settings</span>

                    <Field label="API base URL"
                        hint={`Recommended: /api (Vite proxy → 127.0.0.1:8000)  |  Direct: http://127.0.0.1:8000 (requires backend CORS for ${typeof window !== 'undefined' ? window.location.origin : 'your origin'})`}>
                        <SInput value={apiBaseUrl} onChange={e => setApiBaseUrl(e.target.value)} placeholder="/api" />
                        {brokenConfig && (
                            <div className="border px-4 py-3 mt-2 space-y-2"
                                style={{ borderColor: 'rgba(180,140,60,0.3)', background: 'rgba(220,170,60,0.07)' }}>
                                <p className="mono-meta" style={{ color: 'var(--text-stone)' }}>⚠ Wrong address</p>
                                <p className="text-xs font-light" style={{ color: 'var(--text-stone)' }}>
                                    <code className="font-mono">{resolvedBase}</code> points to this website, so chat requests will not reach the NORTHERN backend.
                                </p>
                                <div className="flex gap-2">
                                    <button type="button" onClick={() => setApiBaseUrl('/api')}
                                        className="mono-meta px-3 py-1.5 border"
                                        style={{ borderColor: 'var(--border-focus)', color: 'var(--text-ink)' }}>
                                        Use /api
                                    </button>
                                    <button type="button" onClick={() => setApiBaseUrl('http://127.0.0.1:8000')}
                                        className="mono-meta px-3 py-1.5 border"
                                        style={{ borderColor: 'var(--border-hairline)', color: 'var(--text-stone)' }}>
                                        Use 127.0.0.1:8000
                                    </button>
                                </div>
                            </div>
                        )}
                    </Field>

                    <Field label="Profile name" hint="Used for chat sessions and saved personality settings.">
                        <SInput value={actor} onChange={e => setActor(e.target.value)} placeholder="northern_web_user" />
                    </Field>

                    <Field label="Admin token (dev only)" hint="Needed only for profile save actions in local development. Do not hardcode in production.">
                        <SInput type="password" value={operatorToken} onChange={e => setOperatorToken(e.target.value)} placeholder="sk-..." />
                    </Field>

                    <div className="flex items-center gap-4 pt-2">
                        <button type="submit"
                            className="mono-meta px-5 py-2 border transition-all"
                            style={{ borderColor: 'var(--border-focus)', color: 'var(--text-ink)' }}>
                            Save settings
                        </button>
                        {saved && <span className="mono-meta" style={{ color: '#3a7a4a' }}>Saved ✓</span>}
                    </div>
                </form>

                {/* Connection diagnostic */}
                <div className="border px-6 py-6 space-y-4" style={{ borderColor: 'var(--border-hairline)' }}>
                    <div>
                        <span className="mono-meta block mb-1" style={{ color: 'var(--text-shadow)' }}>Connection test</span>
                        <p className="text-xs font-light" style={{ color: 'var(--text-stone)' }}>
                            This checks whether NORTHERN can create a chat session using{' '}
                            <code className="font-mono">{resolvedBase || '/api'}</code>.
                        </p>
                    </div>
                    <TestConnection base={resolvedBase} />
                </div>

                {/* Current profile */}
                <div className="border px-6 py-6 space-y-4" style={{ borderColor: 'var(--border-hairline)' }}>
                    <div className="flex items-center justify-between">
                        <span className="mono-meta" style={{ color: 'var(--text-shadow)' }}>Current profile</span>
                        {actor && (
                            <Link to="/onboarding" className="mono-meta px-3 py-1 border transition-colors"
                                style={{ borderColor: 'var(--border-hairline)', color: 'var(--text-stone)' }}>
                                Edit personality →
                            </Link>
                        )}
                    </div>
                    {brokenConfig && <p className="text-xs font-light" style={{ color: 'var(--text-shadow)' }}>Fix the API base URL first.</p>}
                    {!brokenConfig && profileLoading && <p className="mono-meta animate-pulse" style={{ color: 'var(--text-shadow)' }}>Loading…</p>}
                    {!brokenConfig && profileError && <p className="text-xs font-light" style={{ color: '#9e3737' }}>{profileError}</p>}
                    {!brokenConfig && !profileLoading && profile && (
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-4">
                                <div><span className="mono-meta block mb-1" style={{ color: 'var(--text-shadow)' }}>Actor</span>
                                    <span className="text-sm font-light" style={{ color: 'var(--text-ink)' }}>{profile.actor}</span></div>
                                <div><span className="mono-meta block mb-1" style={{ color: 'var(--text-shadow)' }}>Updated</span>
                                    <span className="text-sm font-light" style={{ color: 'var(--text-ink)' }}>
                                        {profile.updated_at ? new Date(profile.updated_at).toLocaleString() : 'n/a'}
                                    </span></div>
                            </div>
                            {profile.style_profile && Object.keys(profile.style_profile).length > 0 ? (
                                <pre className="max-h-56 overflow-auto text-xs leading-5 font-mono border px-3 py-3"
                                    style={{ borderColor: 'var(--border-hairline)', color: 'var(--text-stone)' }}>
                                    {JSON.stringify(profile.style_profile, null, 2)}
                                </pre>
                            ) : (
                                <p className="text-xs font-light" style={{ color: 'var(--text-shadow)' }}>No saved personality settings yet.</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Quick nav */}
                <div className="grid gap-2 sm:grid-cols-2">
                    {[
                        { to: '/chat', label: 'Open chat' },
                        { to: '/onboarding', label: 'Personality setup' },
                    ].map(l => (
                        <Link key={l.to} to={l.to}
                            className="mono-meta border px-4 py-3 block transition-all"
                            style={{ borderColor: 'var(--border-hairline)', color: 'var(--text-stone)' }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-focus)'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-hairline)'}>
                            {l.label}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
