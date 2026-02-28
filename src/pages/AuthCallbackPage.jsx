import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { requireSupabaseClient, supabaseConfigured } from '../lib/supabaseClient';

export default function AuthCallbackPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const nextPath = searchParams.get('next') || '/chat';
    const [error, setError] = useState(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        let active = true;
        void (async () => {
            if (!supabaseConfigured) {
                if (!active) return;
                setError('Supabase is not configured for this deployment.');
                return;
            }
            const client = requireSupabaseClient();
            const { error: sessionError } = await client.auth.getSession();
            if (!active) return;
            if (sessionError) {
                setError(sessionError.message || 'Could not complete sign-in.');
                return;
            }
            setReady(true);
        })();
        return () => { active = false; };
    }, [navigate, nextPath]);

    useEffect(() => {
        if (!ready || error) return undefined;
        const timer = window.setTimeout(() => {
            navigate(nextPath, { replace: true });
        }, 2500);
        return () => window.clearTimeout(timer);
    }, [ready, error, navigate, nextPath]);

    return (
        <div className="studio-page min-h-screen relative flex items-center justify-center p-6">
            <div className="w-full max-w-[520px] border border-[var(--border-hairline)] p-6 md:p-8 animate-reveal" style={{ background: 'rgba(255,255,255,0.01)' }}>
                <h1 className="mono-meta text-[var(--text-stone)] text-xs mb-2">AUTH CALLBACK</h1>
                {!error && !ready ? (
                    <p className="mono-meta text-[var(--text-bone)]">Completing sign-in…</p>
                ) : null}
                {ready ? (
                    <>
                        <p className="mono-meta text-[var(--text-bone)] mb-5">Sign-in complete.</p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                type="button"
                                onClick={() => navigate(nextPath, { replace: true })}
                                className="mono-meta border border-[var(--border-hairline)] hover:border-[var(--border-focus)] text-[var(--text-bone)] px-5 py-3 transition-colors text-left sm:text-center"
                            >
                                Continue →
                            </button>
                            <a
                                href={`/setup?next=${encodeURIComponent(nextPath)}`}
                                className="mono-meta border border-[var(--border-hairline)] hover:border-[var(--border-focus)] text-[var(--text-stone)] hover:text-[var(--text-bone)] px-5 py-3 transition-colors text-left sm:text-center"
                            >
                                Open setup guide →
                            </a>
                        </div>
                        <p className="mono-meta text-[var(--text-shadow)] mt-4">
                            Auto-redirecting in 2.5 seconds…
                        </p>
                    </>
                ) : null}
                {error ? (
                    <>
                        <p className="mono-meta text-[var(--text-shadow)] mb-4">{error}</p>
                        <a className="mono-meta text-[var(--text-stone)] hover:text-[var(--text-bone)]" href={`/login?next=${encodeURIComponent(nextPath)}`}>
                            Back to sign in →
                        </a>
                    </>
                ) : null}
            </div>
        </div>
    );
}
