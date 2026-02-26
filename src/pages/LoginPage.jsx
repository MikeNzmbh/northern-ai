import { useState, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { requestJson } from '../lib/api';

export default function LoginPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const nextParams = searchParams.get('next') || '/chat';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Optional: detect if public signup is enabled via env var (often passed to vite via VITE_NORTHERN_ALLOW_PUBLIC_SIGNUP)
    // If not, we just show the "contact admin" text. We assume it's disabled by default.
    const PUBLIC_SIGNUP_ENABLED = import.meta.env.VITE_NORTHERN_ALLOW_PUBLIC_SIGNUP === 'true';

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) return;

        setLoading(true);
        setError(null);

        // Uses the proxy /api mapped in Vite config
        const apiBase = '/api';

        try {
            await requestJson(apiBase, '/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });

            // login success (cookie set)
            navigate(nextParams, { replace: true });
        } catch (err) {
            if (err?.status === 401) {
                setError('Invalid email or password.');
            } else {
                setError(err.message || 'Failed to sign in.');
            }
            setLoading(false);
        }
    };

    return (
        <div className="studio-page min-h-screen relative flex items-center justify-center p-6">
            {/* Corner marks */}
            <span className="fixed top-8 left-8 text-[var(--text-shadow)] opacity-40 select-none pointer-events-none hidden md:block" style={{ fontSize: 16 }}>+</span>
            <span className="fixed top-8 right-8 text-[var(--text-shadow)] opacity-40 select-none pointer-events-none hidden md:block" style={{ fontSize: 16 }}>+</span>
            <span className="fixed bottom-8 left-8 text-[var(--text-shadow)] opacity-40 select-none pointer-events-none hidden md:block" style={{ fontSize: 16 }}>+</span>
            <span className="fixed bottom-8 right-8 text-[var(--text-shadow)] opacity-40 select-none pointer-events-none hidden md:block" style={{ fontSize: 16 }}>+</span>

            <div className="w-full max-w-[520px] -mt-24 md:-mt-40 animate-reveal">

                {error && (
                    <div className="mb-6 border border-[var(--border-hairline)] px-4 py-3 mono-meta text-[var(--text-shadow)]" aria-live="polite">
                        {error}
                    </div>
                )}

                <div className="mb-6">
                    <h1 className="mono-meta text-[var(--text-stone)] text-xs mb-1">SIGN IN</h1>
                    <p className="mono-meta text-[var(--text-shadow)]">Sign in to chat with Northern from this device-connected session.</p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="border border-[var(--border-hairline)] p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-12 w-full"
                    style={{ background: 'rgba(255,255,255,0.01)' }}
                >
                    <div className="flex flex-col gap-6 md:w-32 shrink-0 mono-meta text-[var(--text-stone)] pt-2 select-none">
                        <label htmlFor="email">EMAIL</label>
                        <label htmlFor="password">PASSWORD</label>
                    </div>

                    <div className="flex-1 flex flex-col gap-6 relative z-20">
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            className="w-full bg-transparent border-b border-[var(--border-hairline)] text-[var(--text-bone)] py-1 focus:outline-none focus:border-[var(--border-focus)] transition-colors mono-meta"
                        />
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            className="w-full bg-transparent border-b border-[var(--border-hairline)] text-[var(--text-bone)] py-1 focus:outline-none focus:border-[var(--border-focus)] transition-colors mono-meta"
                        />

                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <button
                                type="submit"
                                disabled={loading || !email || !password}
                                className="mono-meta border border-[var(--border-hairline)] hover:border-[var(--border-focus)] text-[var(--text-bone)] px-6 py-3 transition-colors disabled:opacity-50 w-full sm:w-auto flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>Signing in<span className="w-1.5 h-3 bg-[var(--text-bone)] animate-pulse inline-block align-middle" /></>
                                ) : (
                                    'Sign in →'
                                )}
                            </button>

                            {PUBLIC_SIGNUP_ENABLED && (
                                <Link
                                    to={`/signup?next=${encodeURIComponent(nextParams)}`}
                                    className="mono-meta text-[var(--text-stone)] hover:text-[var(--text-bone)] transition-colors border-b border-transparent hover:border-[var(--border-hairline)]"
                                >
                                    Create account →
                                </Link>
                            )}
                        </div>
                    </div>
                </form>

                <div className="mt-8 text-center text-[var(--text-shadow)] mono-meta">
                    {!PUBLIC_SIGNUP_ENABLED && "Don't have access? Contact your administrator."}
                </div>
            </div>
        </div>
    );
}
