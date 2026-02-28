import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import GoogleMark from '../components/GoogleMark';
import { requireSupabaseClient, supabaseConfigured } from '../lib/supabaseClient';
import '../styles/studio.css';

function envEnabled(name, defaultValue = true) {
    const raw = import.meta.env?.[name];
    if (raw == null || raw === '') return defaultValue;
    return String(raw).toLowerCase() !== 'false';
}

export default function LoginPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const nextPath = searchParams.get('next') || '/chat';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
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
        const client = requireSupabaseClient();
        const { error: signInError } = await client.auth.signInWithPassword({
            email: email.trim(),
            password,
        });
        if (signInError) {
            setError(signInError.message || 'Failed to sign in.');
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
        const client = requireSupabaseClient();
        const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`;
        const { error: oauthError } = await client.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo },
        });
        if (oauthError) {
            setError(oauthError.message || 'Could not start Google sign-in.');
            setLoading(false);
        }
    };

    return (
        <div className="studio-page min-h-screen relative flex items-center justify-center overflow-hidden px-4 py-6 sm:py-8 md:p-8">
            <div className="pointer-events-none absolute -left-16 top-8 h-72 w-72 rounded-full bg-[#d4af37]/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -right-10 h-80 w-80 rounded-full bg-[#8a7558]/10 blur-3xl" />

            <span className="fixed top-8 left-8 text-[var(--text-shadow)] opacity-40 select-none pointer-events-none hidden md:block" style={{ fontSize: 16 }}>+</span>
            <span className="fixed top-8 right-8 text-[var(--text-shadow)] opacity-40 select-none pointer-events-none hidden md:block" style={{ fontSize: 16 }}>+</span>
            <span className="fixed bottom-8 left-8 text-[var(--text-shadow)] opacity-40 select-none pointer-events-none hidden md:block" style={{ fontSize: 16 }}>+</span>
            <span className="fixed bottom-8 right-8 text-[var(--text-shadow)] opacity-40 select-none pointer-events-none hidden md:block" style={{ fontSize: 16 }}>+</span>

            <div className="relative z-10 w-full max-w-[620px] animate-reveal">
                {error && (
                    <div
                        className="mb-6 rounded-xl border px-4 py-3 mono-meta text-[11px] sm:text-[10px] text-[var(--text-ink)]"
                        style={{ borderColor: 'rgba(128, 56, 56, 0.35)', background: 'rgba(181, 110, 110, 0.08)' }}
                        aria-live="polite"
                    >
                        {error}
                    </div>
                )}

                <div className="mb-7 space-y-2">
                    <h1 className="mono-meta text-[var(--text-stone)] text-xs">SIGN IN</h1>
                    <p className="font-luxury text-[1.95rem] leading-[0.95] tracking-tight text-[var(--text-ink)] sm:text-3xl md:text-[2.25rem]">
                        Welcome back to Northern
                    </p>
                    <p className="text-[15px] leading-7 text-[#6e6660] sm:text-base sm:text-[var(--text-shadow)]">
                        Sign in to sync your runtime status, then jump directly into your local portal.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="relative w-full overflow-hidden rounded-[24px] border p-5 sm:p-6 md:p-8 flex flex-col gap-4 sm:gap-5"
                    style={{
                        background: 'linear-gradient(142deg, rgba(255,255,255,0.56) 0%, rgba(242,240,237,0.38) 48%, rgba(231,226,219,0.26) 100%)',
                        borderColor: 'var(--border-focus)',
                        boxShadow: '0 30px 75px rgba(21, 16, 11, 0.16)',
                    }}
                >
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d4af37]/65 to-transparent" />

                    <div className="flex flex-col gap-2 md:flex-row md:items-center relative z-20">
                        <label htmlFor="email" className="mono-meta text-[11px] sm:text-xs text-[var(--text-stone)] md:w-36 shrink-0">EMAIL</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            placeholder="you@example.com"
                            className="flex-1 w-full rounded-xl border border-[var(--border-hairline)] bg-white/78 px-4 py-3 text-[15px] tracking-[0.01em] text-[var(--text-ink)] placeholder:text-[#8b847d] focus:outline-none focus:border-[var(--border-focus)] focus:bg-white transition-colors"
                        />
                    </div>

                    <div className="flex flex-col gap-2 md:flex-row md:items-center relative z-20">
                        <label htmlFor="password" className="mono-meta text-[11px] sm:text-xs text-[var(--text-stone)] md:w-36 shrink-0">PASSWORD</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            placeholder="Enter password"
                            className="flex-1 w-full rounded-xl border border-[var(--border-hairline)] bg-white/78 px-4 py-3 text-[15px] tracking-[0.01em] text-[var(--text-ink)] placeholder:text-[#8b847d] focus:outline-none focus:border-[var(--border-focus)] focus:bg-white transition-colors"
                        />
                    </div>

                    <div className="mt-2 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 w-full relative z-20">
                        <button
                            type="submit"
                            disabled={loading || !email || !password}
                            className="mono-meta text-[11px] sm:text-[10px] inline-flex w-full sm:w-auto min-h-12 items-center justify-center gap-2 rounded-xl bg-[#1f1b16] px-7 py-3 text-[#f2f0ed] transition-colors hover:bg-[#14110d] disabled:opacity-50"
                        >
                            {loading ? (
                                <>Signing in<span className="w-1.5 h-3 bg-[#f2f0ed] animate-pulse inline-block align-middle" /></>
                            ) : (
                                'Sign in →'
                            )}
                        </button>

                        {googleEnabled && (
                            <button
                                type="button"
                                onClick={handleGoogle}
                                disabled={loading}
                                className="mono-meta text-[11px] sm:text-[10px] inline-flex w-full sm:w-auto min-h-12 items-center justify-center gap-2 rounded-xl border border-[var(--border-focus)] bg-white/82 px-5 py-3 text-[var(--text-ink)] transition-colors hover:bg-white disabled:opacity-50"
                            >
                                <GoogleMark />
                                <span>Continue with Google</span>
                                <span aria-hidden className="opacity-70">→</span>
                            </button>
                        )}
                    </div>
                </form>

                <div className="mt-7 sm:mt-8 text-center text-[var(--text-shadow)] mono-meta text-[11px] sm:text-[10px]">
                    Need an account?{' '}
                    <a href={`/signup?next=${encodeURIComponent(nextPath)}`} className="text-[var(--text-ink)] hover:text-[#1f1b16] transition-colors">
                        Create one →
                    </a>
                </div>
            </div>
        </div>
    );
}
