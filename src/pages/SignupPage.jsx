import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { requireSupabaseClient, supabaseConfigured } from '../lib/supabaseClient';

function envEnabled(name, defaultValue = true) {
    const raw = import.meta.env?.[name];
    if (raw == null || raw === '') return defaultValue;
    return String(raw).toLowerCase() !== 'false';
}

export default function SignupPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const nextPath = searchParams.get('next') || '/chat';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [notice, setNotice] = useState(null);
    const googleEnabled = useMemo(() => envEnabled('VITE_NORTHERN_OAUTH_GOOGLE', true), []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) return;
        if (!supabaseConfigured) {
            setError('Supabase is not configured for this deployment.');
            return;
        }

        setLoading(true);
        setError(null);
        setNotice(null);
        const client = requireSupabaseClient();
        const { data, error: signUpError } = await client.auth.signUp({
            email: email.trim(),
            password,
            options: {
                data: {
                    full_name: username.trim() || undefined,
                },
                emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
            },
        });
        if (signUpError) {
            setError(signUpError.message || 'Failed to create account.');
            setLoading(false);
            return;
        }
        if (!data?.session) {
            setNotice('Check your email to confirm your account, then sign in.');
            setLoading(false);
            return;
        }
        navigate(nextPath, { replace: true });
    };

    const handleGoogle = async () => {
        if (!supabaseConfigured) {
            setError('Supabase is not configured for this deployment.');
            return;
        }
        setLoading(true);
        setError(null);
        setNotice(null);
        const client = requireSupabaseClient();
        const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`;
        const { error: oauthError } = await client.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo },
        });
        if (oauthError) {
            setError(oauthError.message || 'Could not start Google sign-up.');
            setLoading(false);
        }
    };

    return (
        <div className="studio-page min-h-screen relative flex items-center justify-center p-6">
            <span className="fixed top-8 left-8 text-[var(--text-shadow)] opacity-40 select-none pointer-events-none hidden md:block" style={{ fontSize: 16 }}>+</span>
            <span className="fixed top-8 right-8 text-[var(--text-shadow)] opacity-40 select-none pointer-events-none hidden md:block" style={{ fontSize: 16 }}>+</span>
            <span className="fixed bottom-8 left-8 text-[var(--text-shadow)] opacity-40 select-none pointer-events-none hidden md:block" style={{ fontSize: 16 }}>+</span>
            <span className="fixed bottom-8 right-8 text-[var(--text-shadow)] opacity-40 select-none pointer-events-none hidden md:block" style={{ fontSize: 16 }}>+</span>

            <div className="w-full max-w-[520px] animate-reveal">
                {error && (
                    <div className="mb-6 border border-[var(--border-hairline)] px-4 py-3 mono-meta text-[var(--text-shadow)]" aria-live="polite">
                        {error}
                    </div>
                )}
                {notice && (
                    <div className="mb-6 border border-[var(--border-hairline)] px-4 py-3 mono-meta text-[var(--text-stone)]" aria-live="polite">
                        {notice}
                    </div>
                )}

                <div className="mb-6">
                    <h1 className="mono-meta text-[var(--text-stone)] text-xs mb-1">CREATE ACCOUNT</h1>
                    <p className="mono-meta text-[var(--text-shadow)]">Create your Northern account.</p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="border border-[var(--border-hairline)] p-6 md:p-8 flex flex-col gap-6 w-full"
                    style={{ background: 'rgba(255,255,255,0.01)' }}
                >
                    <div className="flex flex-col gap-2 md:flex-row md:items-center relative z-20">
                        <label htmlFor="signup-email" className="mono-meta text-[var(--text-stone)] text-xs md:w-32 shrink-0 pt-1">EMAIL</label>
                        <input
                            id="signup-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            className="flex-1 w-full bg-transparent border-b border-[var(--border-hairline)] text-[var(--text-bone)] py-1 focus:outline-none focus:border-[var(--border-focus)] transition-colors mono-meta"
                        />
                    </div>

                    <div className="flex flex-col gap-2 md:flex-row md:items-center relative z-20">
                        <label htmlFor="signup-password" className="mono-meta text-[var(--text-stone)] text-xs md:w-32 shrink-0 pt-1">PASSWORD</label>
                        <input
                            id="signup-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            className="flex-1 w-full bg-transparent border-b border-[var(--border-hairline)] text-[var(--text-bone)] py-1 focus:outline-none focus:border-[var(--border-focus)] transition-colors mono-meta"
                        />
                    </div>

                    <div className="flex flex-col gap-2 md:flex-row md:items-center relative z-20">
                        <label htmlFor="signup-username" className="mono-meta text-[var(--text-stone)] text-xs md:w-32 shrink-0 pt-1">NAME</label>
                        <input
                            id="signup-username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={loading}
                            className="flex-1 w-full bg-transparent border-b border-[var(--border-hairline)] text-[var(--text-bone)] py-1 focus:outline-none focus:border-[var(--border-focus)] transition-colors mono-meta"
                        />
                    </div>

                    <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-6 w-full relative z-20">
                        <button
                            type="submit"
                            disabled={loading || !email || !password}
                            className="mono-meta border border-[var(--border-hairline)] hover:border-[var(--border-focus)] text-[var(--text-bone)] px-6 py-3 transition-colors disabled:opacity-50 w-full sm:w-auto flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>Creating<span className="w-1.5 h-3 bg-[var(--text-bone)] animate-pulse inline-block align-middle" /></>
                            ) : (
                                'Create account →'
                            )}
                        </button>

                        <div className="w-full sm:w-auto flex flex-col gap-2">
                            {googleEnabled && (
                                <button
                                    type="button"
                                    onClick={handleGoogle}
                                    disabled={loading}
                                    className="mono-meta text-[var(--text-stone)] hover:text-[var(--text-bone)] transition-colors border-b border-transparent hover:border-[var(--border-hairline)] text-left"
                                >
                                    Continue with Google →
                                </button>
                            )}
                        </div>
                    </div>
                </form>

                <div className="mt-8 text-center text-[var(--text-shadow)] mono-meta">
                    Already have access? <a href={`/login?next=${encodeURIComponent(nextPath)}`} className="text-[var(--text-stone)] hover:text-[var(--text-bone)]">Sign in →</a>
                </div>
            </div>
        </div>
    );
}

