import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { requireSupabaseClient, supabaseConfigured } from '../lib/supabaseClient';

export default function AuthCallbackPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const nextPath = searchParams.get('next') || '/chat';
    const [error, setError] = useState(null);

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
            navigate(nextPath, { replace: true });
        })();
        return () => { active = false; };
    }, [navigate, nextPath]);

    return (
        <div className="studio-page min-h-screen relative flex items-center justify-center p-6">
            <div className="w-full max-w-[520px] border border-[var(--border-hairline)] p-6 md:p-8 animate-reveal" style={{ background: 'rgba(255,255,255,0.01)' }}>
                <h1 className="mono-meta text-[var(--text-stone)] text-xs mb-2">AUTH CALLBACK</h1>
                {!error ? (
                    <p className="mono-meta text-[var(--text-bone)]">Completing sign-in…</p>
                ) : (
                    <>
                        <p className="mono-meta text-[var(--text-shadow)] mb-4">{error}</p>
                        <a className="mono-meta text-[var(--text-stone)] hover:text-[var(--text-bone)]" href={`/login?next=${encodeURIComponent(nextPath)}`}>
                            Back to sign in →
                        </a>
                    </>
                )}
            </div>
        </div>
    );
}

