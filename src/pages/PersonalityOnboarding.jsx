import { useEffect, useMemo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import '../styles/studio.css';
import { getApiBase, classifyApiError } from '../lib/api';
import { useSettings } from '../hooks/useSettings';

const CLEAN_ACTOR = 'tars_web_user';

// ─── Answer compilation helpers (unchanged logic) ────────────────────────────
function setNestedValue(target, path, value) {
    const parts = path.split('.').filter(Boolean);
    if (!parts.length) return;
    let cursor = target;
    for (const part of parts.slice(0, -1)) {
        if (!cursor[part] || typeof cursor[part] !== 'object') cursor[part] = {};
        cursor = cursor[part];
    }
    cursor[parts[parts.length - 1]] = value;
}
function appendNestedValue(target, path, value) {
    const parts = path.split('.').filter(Boolean);
    if (!parts.length) return;
    let cursor = target;
    for (const part of parts.slice(0, -1)) {
        if (!cursor[part] || typeof cursor[part] !== 'object') cursor[part] = {};
        cursor = cursor[part];
    }
    const leaf = parts[parts.length - 1];
    if (!Array.isArray(cursor[leaf])) cursor[leaf] = [];
    cursor[leaf].push(value);
}
function compileAnswersToStyleProfile(manifest, answers) {
    if (!manifest) return {};
    const patch = {};
    for (const section of manifest.sections || []) {
        for (const q of section.questions || []) {
            if (!(q.id in answers)) continue;
            const raw = answers[q.id];
            if (raw === '' || raw === undefined || raw === null) continue;
            const mapsTo = (q.maps_to || '').trim();
            if (!mapsTo) continue;
            if (mapsTo === 'scenario_picks[]') { appendNestedValue(patch, 'scenario_picks', { scenario_id: q.scenario_id, choice: raw }); continue; }
            if (mapsTo.endsWith('[]')) { appendNestedValue(patch, mapsTo.slice(0, -2), raw); continue; }
            setNestedValue(patch, mapsTo, raw);
        }
    }
    if (Object.keys(patch).length > 0) patch.questionnaire_version = manifest.questionnaire_version || 'v1';
    return patch;
}

// ─── Studio-styled inline select ─────────────────────────────────────────────
function StudioSelect({ value, onChange, children, className = '' }) {
    return (
        <select value={value} onChange={onChange}
            className={`w-full border px-3 py-2 text-sm font-light bg-transparent focus:outline-none ${className}`}
            style={{ borderColor: 'var(--border-hairline)', color: 'var(--text-ink)' }}>
            {children}
        </select>
    );
}
function StudioInput({ value, onChange, placeholder, type = 'text', className = '' }) {
    return (
        <input type={type} value={value} onChange={onChange} placeholder={placeholder}
            className={`w-full border px-3 py-2 text-sm font-light bg-transparent focus:outline-none ${className}`}
            style={{ borderColor: 'var(--border-hairline)', color: 'var(--text-ink)' }} />
    );
}
function StudioTextInput({ value, onChange, placeholder, className = '' }) {
    return <StudioInput value={value} onChange={onChange} placeholder={placeholder} className={className} />;
}

// ─── Warnings ────────────────────────────────────────────────────────────────
function LegacyProfileWarning({ legacyKeys, actor, onSwitchActor }) {
    return (
        <div className="mt-4 border px-4 py-3 text-sm space-y-2"
            style={{ borderColor: 'rgba(180,140,60,0.3)', background: 'rgba(220,170,60,0.07)', color: 'var(--text-ink)' }}>
            <p className="mono-meta" style={{ color: 'var(--text-stone)' }}>⚠ Legacy profile format</p>
            <p className="font-light text-xs leading-relaxed" style={{ color: 'var(--text-stone)' }}>
                The profile for <code className="font-mono">{actor}</code> uses an older format{legacyKeys.length > 0 && <> (<code className="font-mono">{legacyKeys.join(', ')}</code>)</>}. Preview works best with a clean Persona v1 profile.
            </p>
            <button type="button" onClick={onSwitchActor}
                className="mono-meta px-3 py-1.5 border transition-colors"
                style={{ borderColor: 'var(--border-focus)', color: 'var(--text-ink)' }}>
                Use clean actor "{CLEAN_ACTOR}" and try again
            </button>
        </div>
    );
}
function UnauthorizedWarning({ action }) {
    return (
        <div className="mt-4 border px-4 py-3 text-sm"
            style={{ borderColor: 'rgba(180,60,60,0.3)', background: 'rgba(220,60,60,0.06)', color: 'var(--text-ink)' }}>
            <p className="mono-meta mb-1" style={{ color: 'var(--text-stone)' }}>🔒 Permission needed</p>
            <p className="font-light text-xs" style={{ color: 'var(--text-stone)' }}>
                {action === 'Save'
                    ? 'Saving changes needs a valid X-Operator-Token. Enter it above and try again.'
                    : 'This request was rejected because credentials are missing or invalid.'}
            </p>
        </div>
    );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function PersonalityOnboarding() {
    const { settings } = useSettings();
    const apiBase = useMemo(() => (settings.apiBaseUrl || getApiBase()).replace(/\/+$/, ''), [settings.apiBaseUrl]);

    const [manifest, setManifest] = useState(null);
    const [answers, setAnswers] = useState({});
    const [actor, setActor] = useState(() => settings.actor || CLEAN_ACTOR);
    const [operatorToken, setOperatorToken] = useState(() => settings.operatorToken || '');
    const [selectedScenarioId, setSelectedScenarioId] = useState('');
    const [previewPersona, setPreviewPersona] = useState('current');
    const [preview, setPreview] = useState(null);
    const [previewLoading, setPreviewLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');
    const [classifiedError, setClassifiedError] = useState(null);
    const [skippedSections, setSkippedSections] = useState(new Set());

    useEffect(() => {
        if (settings.actor) setActor(settings.actor);
        if (settings.operatorToken) setOperatorToken(settings.operatorToken);
    }, [settings.actor, settings.operatorToken]);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const resp = await fetch(`${apiBase}/chat/personality/onboarding/questionnaire`, { credentials: 'include' });
                if (!resp.ok) throw new Error(`Could not load setup questions (${resp.status})`);
                const data = await resp.json();
                if (!cancelled) {
                    const loaded = data.manifest || null;
                    setManifest(loaded);
                    setSelectedScenarioId(loaded?.preview_scenarios?.[0]?.id || '');
                }
            } catch (err) { if (!cancelled) setError(err.message || 'Failed to load questionnaire'); }
        })();
        return () => { cancelled = true; };
    }, [apiBase]);

    const compiledPatch = useMemo(() => compileAnswersToStyleProfile(manifest, answers), [manifest, answers]);

    const handleApiError = useCallback((resp, body, action) => {
        const detail = typeof body?.detail === 'string' ? body.detail : `${action} failed (${resp.status})`;
        const classified = classifyApiError(resp.status, detail);
        setClassifiedError({ ...classified, action });
        if (classified.kind === 'legacy_profile_validation' || classified.kind === 'unauthorized') setError('');
        else setError(detail);
    }, []);

    const runPreviewWithActor = useCallback(async (previewActor) => {
        setError(''); setStatus(''); setClassifiedError(null); setPreviewLoading(true);
        try {
            const styleProfile = previewPersona === 'current' ? compiledPatch : { ...compiledPatch, persona_base: previewPersona };
            const resp = await fetch(`${apiBase}/chat/personality/onboarding/preview`, {
                method: 'POST', credentials: 'include',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ actor: previewActor, scenario_id: selectedScenarioId || undefined, answers, style_profile: styleProfile }),
            });
            const body = await resp.json();
            if (!resp.ok) { handleApiError(resp, body, 'Preview'); return; }
            setPreview(body);
            setStatus('Preview updated.');
        } catch (err) { setError(err.message || 'Preview failed.'); }
        finally { setPreviewLoading(false); }
    }, [apiBase, answers, compiledPatch, handleApiError, previewPersona, selectedScenarioId]);

    const switchActorAndRetry = useCallback(() => {
        setActor(CLEAN_ACTOR); setClassifiedError(null); setError('');
        setTimeout(() => void runPreviewWithActor(CLEAN_ACTOR), 50);
    }, [runPreviewWithActor]);

    async function saveProfile() {
        setError(''); setStatus(''); setClassifiedError(null); setSaveLoading(true);
        try {
            const headers = { 'content-type': 'application/json' };
            if (operatorToken.trim()) headers['X-Operator-Token'] = operatorToken.trim();
            const resp = await fetch(`${apiBase}/chat/profiles/${encodeURIComponent(actor)}`, {
                method: 'PATCH', credentials: 'include', headers,
                body: JSON.stringify({ merge: true, style_profile: compiledPatch }),
            });
            const body = await resp.json();
            if (!resp.ok) { handleApiError(resp, body, 'Save'); return; }
            setStatus('Personality settings saved.');
        } catch (err) { setError(err.message || 'Could not save settings.'); }
        finally { setSaveLoading(false); }
    }

    const toggleSkip = id => setSkippedSections(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

    return (
        <div className="studio-page" style={{ color: 'var(--text-ink)' }}>


            <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-12 py-10">

                {/* Header */}
                <header className="mb-10 flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <span className="mono-meta mb-2 block" style={{ color: 'var(--text-shadow)' }}>TARS / Personality setup</span>
                        <h1 className="text-3xl md:text-4xl font-light tracking-tight" style={{ color: 'var(--text-ink)' }}>
                            {manifest?.title || 'Personality Setup'}
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm font-light leading-relaxed" style={{ color: 'var(--text-stone)' }}>
                            {manifest?.description || 'Choose how TARS should speak to you. You can preview replies before saving anything.'}
                        </p>
                    </div>
                    <Link to="/chat" className="mono-meta px-3 py-1.5 border transition-colors shrink-0"
                        style={{ borderColor: 'var(--border-hairline)', color: 'var(--text-stone)' }}>
                        ← Chat
                    </Link>
                </header>

                {/* Config strip */}
                <div className="mb-8 py-6 grid gap-4 sm:grid-cols-3">
                    <label className="flex flex-col gap-1.5">
                        <span className="mono-meta" style={{ color: 'var(--text-shadow)' }}>Profile name</span>
                        <StudioTextInput value={actor} onChange={e => setActor(e.target.value)} placeholder={CLEAN_ACTOR} />
                        <span className="mono-meta mt-0.5" style={{ color: 'var(--text-shadow)', fontSize: '9px' }}>
                            Default: {CLEAN_ACTOR}
                        </span>
                    </label>
                    <label className="flex flex-col gap-1.5">
                        <span className="mono-meta" style={{ color: 'var(--text-shadow)' }}>Admin token (dev only)</span>
                        <StudioInput type="password" value={operatorToken} onChange={e => setOperatorToken(e.target.value)} placeholder="X-Operator-Token" />
                    </label>
                    <label className="flex flex-col gap-1.5">
                        <span className="mono-meta" style={{ color: 'var(--text-shadow)' }}>Preview style</span>
                        <StudioSelect value={previewPersona} onChange={e => setPreviewPersona(e.target.value)}>
                            <option value="current">Use my current answers</option>
                            <option value="jarvis">Preview as Jarvis</option>
                            <option value="friday">Preview as Friday</option>
                        </StudioSelect>
                    </label>
                </div>

                {/* Action row */}
                <div className="mb-8 flex flex-wrap gap-3">
                    {[
                        { label: previewLoading ? 'Generating…' : 'Preview reply', onClick: () => void runPreviewWithActor(actor), disabled: previewLoading || !manifest },
                        { label: saveLoading ? 'Saving…' : 'Save personality', onClick: saveProfile, disabled: saveLoading || !manifest },
                        { label: 'Reset answers', onClick: () => { setAnswers({}); setSkippedSections(new Set()); } },
                    ].map(btn => (
                        <button key={btn.label} type="button" onClick={btn.onClick} disabled={btn.disabled}
                            className="mono-meta px-4 py-2 border transition-all disabled:opacity-40"
                            style={{ borderColor: 'var(--border-hairline)', color: 'var(--text-ink)' }}
                            onMouseEnter={e => !btn.disabled && (e.currentTarget.style.borderColor = 'var(--border-focus)')}
                            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-hairline)')}>
                            {btn.label}
                        </button>
                    ))}
                </div>

                {/* Status/Error */}
                {status && <p className="mb-4 mono-meta" style={{ color: 'var(--text-stone)' }}>{status}</p>}
                {error && <p className="mb-4 text-sm font-light" style={{ color: '#9e3737' }}>{error}</p>}
                {classifiedError?.kind === 'legacy_profile_validation' && (
                    <LegacyProfileWarning legacyKeys={classifiedError.legacyKeys} actor={actor} onSwitchActor={switchActorAndRetry} />
                )}
                {classifiedError?.kind === 'unauthorized' && <UnauthorizedWarning action={classifiedError.action} />}

                {/* Main grid: questionnaire + preview */}
                <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] mt-8">

                    {/* Questionnaire */}
                    <section className="space-y-6">
                        {!manifest && !error && (
                            <div className="border px-5 py-4 animate-pulse" style={{ borderColor: 'var(--border-hairline)' }}>
                                <div className="h-3 w-40 mb-3 rounded" style={{ background: 'var(--border-focus)' }} />
                                <div className="h-2 w-full mb-2 rounded" style={{ background: 'var(--border-hairline)' }} />
                            </div>
                        )}
                        {(manifest?.sections || []).map((section) => {
                            const isSkipped = skippedSections.has(section.id);
                            return (
                                <div key={section.id} className="border" style={{ borderColor: 'var(--border-hairline)' }}>
                                    <div className="flex items-start justify-between gap-3 px-5 py-4 border-b"
                                        style={{ borderColor: 'var(--border-hairline)' }}>
                                        <div>
                                            <h2 className="text-base font-light" style={{ color: 'var(--text-ink)' }}>{section.title}</h2>
                                            {section.description && (
                                                <p className="text-xs font-light mt-0.5" style={{ color: 'var(--text-stone)' }}>{section.description}</p>
                                            )}
                                        </div>
                                        {section.skippable !== false && (
                                            <button type="button" onClick={() => toggleSkip(section.id)}
                                                className="mono-meta px-3 py-1 border shrink-0 transition-colors"
                                                style={{ borderColor: 'var(--border-hairline)', color: isSkipped ? 'var(--text-ink)' : 'var(--text-shadow)' }}>
                                                {isSkipped ? 'Show' : 'Skip section'}
                                            </button>
                                        )}
                                    </div>
                                    {!isSkipped && (
                                        <div className="px-5 py-4 space-y-4">
                                            {(section.questions || []).map((q) => {
                                                const value = answers[q.id];
                                                return (
                                                    <div key={q.id} className="border-b pb-4 last:border-b-0 last:pb-0"
                                                        style={{ borderColor: 'var(--border-hairline)' }}>
                                                        <label className="block text-sm font-light mb-2" style={{ color: 'var(--text-ink)' }}>
                                                            {q.prompt}
                                                        </label>
                                                        {(q.answer_type === 'single_select' || q.answer_type === 'scenario_choice') && (
                                                            <StudioSelect value={typeof value === 'string' ? value : ''}
                                                                onChange={e => setAnswers(prev => { const c = { ...prev }; e.target.value ? c[q.id] = e.target.value : delete c[q.id]; return c; })}>
                                                                <option value="">Skip (use default)</option>
                                                                {(q.options || []).map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                                            </StudioSelect>
                                                        )}
                                                        {q.answer_type === 'boolean' && (
                                                            <StudioSelect value={typeof value === 'boolean' ? String(value) : ''}
                                                                onChange={e => setAnswers(prev => { const c = { ...prev }; e.target.value ? c[q.id] = e.target.value === 'true' : delete c[q.id]; return c; })}>
                                                                <option value="">Skip (use default)</option>
                                                                <option value="true">Yes</option>
                                                                <option value="false">No</option>
                                                            </StudioSelect>
                                                        )}
                                                        {q.answer_type === 'text' && (
                                                            <StudioTextInput value={typeof value === 'string' ? value : ''}
                                                                onChange={e => setAnswers(prev => { const c = { ...prev }; e.target.value.trim() ? c[q.id] = e.target.value : delete c[q.id]; return c; })}
                                                                placeholder="Skip to use default" />
                                                        )}
                                                        <p className="mono-meta mt-1" style={{ color: 'var(--text-shadow)' }}>
                                                            {q.id}{q.maps_to ? ` → ${q.maps_to}` : ''}
                                                        </p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </section>

                    {/* Right: scenario + compiled patch + preview */}
                    <aside className="space-y-6">
                        {/* Scenario picker */}
                        <div className="border" style={{ borderColor: 'var(--border-hairline)' }}>
                            <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border-hairline)' }}>
                                <h2 className="text-base font-light" style={{ color: 'var(--text-ink)' }}>Preview scenario</h2>
                            </div>
                            <div className="px-5 py-4">
                                <StudioSelect value={selectedScenarioId} onChange={e => setSelectedScenarioId(e.target.value)}>
                                    {(manifest?.preview_scenarios || []).map(s => (
                                        <option key={s.id} value={s.id}>{s.id} — {s.user_prompt}</option>
                                    ))}
                                </StudioSelect>
                            </div>
                        </div>

                        {/* Compiled patch */}
                        <div className="border" style={{ borderColor: 'var(--border-hairline)' }}>
                            <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border-hairline)' }}>
                                <h2 className="text-base font-light" style={{ color: 'var(--text-ink)' }}>Advanced: settings preview</h2>
                            </div>
                            <pre className="px-5 py-4 max-h-64 overflow-auto text-xs leading-5 font-mono"
                                style={{ color: 'var(--text-stone)' }}>
                                {JSON.stringify(compiledPatch, null, 2)}
                            </pre>
                        </div>

                        {/* Preview output */}
                        <div className="border" style={{ borderColor: 'var(--border-hairline)' }}>
                            <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border-hairline)' }}>
                                <h2 className="text-base font-light" style={{ color: 'var(--text-ink)' }}>Preview result</h2>
                            </div>
                            <div className="px-5 py-4">
                                {preview ? (
                                    <div className="space-y-4">
                                        <div className="border-b pb-3" style={{ borderColor: 'var(--border-hairline)' }}>
                                            <p className="mono-meta mb-1" style={{ color: 'var(--text-shadow)' }}>Your message</p>
                                            <p className="text-sm font-light" style={{ color: 'var(--text-stone)' }}>{preview.user_prompt}</p>
                                        </div>
                                        <div>
                                            <p className="mono-meta mb-1" style={{ color: 'var(--text-shadow)' }}>TARS reply</p>
                                            <p className="text-sm font-light leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-ink)' }}>
                                                {preview.reply}
                                            </p>
                                        </div>
                                        <p className="mono-meta" style={{ color: 'var(--text-shadow)' }}>
                                            {preview.scenario_id || 'custom'}{preview.dimension ? ` · ${preview.dimension}` : ''}
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-sm font-light" style={{ color: 'var(--text-shadow)' }}>
                                        Choose a scenario, then click Preview reply.
                                    </p>
                                )}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
