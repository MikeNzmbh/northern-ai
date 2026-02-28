import { useMemo } from 'react';
import { getLocalPortalUrl } from '../lib/runtimeProfile';
import { useAuth } from '../hooks/useAuth';
import { useSupabaseDevicePresence } from '../hooks/useSupabaseDevicePresence';

export default function ChatLauncherPage() {
    const localPortalUrl = getLocalPortalUrl();
    const { user, loading: authLoading, logout } = useAuth('/api', false, true);
    const { state: presenceState, primary: primaryDevice } = useSupabaseDevicePresence(user);
    const statusCopy = useMemo(() => {
        if (!user) return 'Sign in to load your device status.';
        if (presenceState === 'online') {
            return `Northern is online on ${primaryDevice?.device_name || primaryDevice?.install_id || 'your device'}. Open local portal to chat.`;
        }
        if (presenceState === 'not_set_up') {
            return 'No linked Northern device found yet. Start Northern locally and link your device.';
        }
        return `Northern is sleeping on ${primaryDevice?.device_name || primaryDevice?.install_id || 'your device'}. Start runtime to continue.`;
    }, [presenceState, primaryDevice, user]);

    return (
        <div className="studio-page min-h-screen relative flex flex-col p-6 md:p-12">
            <span className="fixed top-8 left-8 text-[var(--text-shadow)] opacity-40 select-none pointer-events-none hidden md:block" style={{ fontSize: 16 }}>+</span>
            <span className="fixed top-8 right-8 text-[var(--text-shadow)] opacity-40 select-none pointer-events-none hidden md:block" style={{ fontSize: 16 }}>+</span>
            <span className="fixed bottom-8 left-8 text-[var(--text-shadow)] opacity-40 select-none pointer-events-none hidden md:block" style={{ fontSize: 16 }}>+</span>
            <span className="fixed bottom-8 right-8 text-[var(--text-shadow)] opacity-40 select-none pointer-events-none hidden md:block" style={{ fontSize: 16 }}>+</span>

            <header className="w-full mb-12 flex items-center justify-between gap-4">
                <h1 className="text-xl font-light tracking-tight text-[var(--text-shadow)]">NORTHERN</h1>
                {!authLoading && user ? (
                    <button
                        type="button"
                        onClick={() => void logout()}
                        className="mono-meta border border-[var(--border-hairline)] hover:border-[var(--border-focus)] text-[var(--text-stone)] hover:text-[var(--text-bone)] px-4 py-2 transition-colors"
                    >
                        Log out
                    </button>
                ) : null}
            </header>

            <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row gap-8 md:gap-16">
                <div className="md:w-48 shrink-0">
                    <h2 className="mono-meta text-[var(--text-shadow)]">LOCAL RUNTIME</h2>
                </div>

                <div className="flex-1 flex flex-col gap-8">
                    <div>
                        <h2 className="text-3xl font-light tracking-tight text-[var(--text-bone)] mb-4">Northern isn’t awake</h2>
                        <p className="text-[var(--text-stone)] leading-relaxed max-w-xl">
                            {statusCopy}
                        </p>
                    </div>

                    <div className="border border-[var(--border-hairline)] p-6 md:p-8 flex flex-col gap-6 w-full animate-reveal" style={{ background: 'rgba(255,255,255,0.01)' }}>
                        <span className="mono-meta text-[var(--text-ink)]">ACCOUNT</span>
                        <div className="flex flex-col sm:flex-row gap-3">
                            {!authLoading && !user ? (
                                <>
                                    <a
                                        href="/login?next=%2Fchat"
                                        className="mono-meta border border-[var(--border-hairline)] hover:border-[var(--border-focus)] text-[var(--text-bone)] px-6 py-3 transition-colors text-center"
                                    >
                                        Sign in →
                                    </a>
                                    <a
                                        href="/signup?next=%2Fchat"
                                        className="mono-meta border border-[var(--border-hairline)] hover:border-[var(--border-focus)] text-[var(--text-bone)] px-6 py-3 transition-colors text-center"
                                    >
                                        Create account →
                                    </a>
                                </>
                            ) : (
                                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                    <span className="mono-meta text-[var(--text-stone)]">
                                        Signed in{user?.email ? ` as ${user.email}` : ''}.
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => void logout()}
                                        className="mono-meta border border-[var(--border-hairline)] hover:border-[var(--border-focus)] text-[var(--text-stone)] hover:text-[var(--text-bone)] px-4 py-2 transition-colors text-left sm:text-center"
                                    >
                                        Log out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="border border-[var(--border-hairline)] p-6 md:p-8 flex flex-col gap-6 w-full animate-reveal" style={{ background: 'rgba(255,255,255,0.01)' }}>
                        <span className="mono-meta text-[var(--text-ink)]">START STEPS</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                            <div className="flex gap-4">
                                <span className="text-[var(--text-shadow)]">01</span>
                                <span className="text-[var(--text-ink)]">Open terminal on your device</span>
                            </div>
                            <div className="flex gap-4">
                                <span className="text-[var(--text-shadow)]">02</span>
                                <span className="text-[var(--text-ink)]">Run <span className="text-[var(--text-bone)]">northern status</span></span>
                            </div>
                            <div className="flex gap-4">
                                <span className="text-[var(--text-shadow)]">03</span>
                                <span className="text-[var(--text-ink)]">If stopped, run <span className="text-[var(--text-bone)]">northern up</span></span>
                            </div>
                            <div className="flex gap-4">
                                <span className="text-[var(--text-shadow)]">04</span>
                                <span className="text-[var(--text-ink)]">Open your local portal and sign in</span>
                            </div>
                        </div>

                        <div className="mt-2 flex flex-col sm:flex-row gap-3">
                            <a
                                href={localPortalUrl}
                                className="mono-meta border border-[var(--border-hairline)] hover:border-[var(--border-focus)] text-[var(--text-bone)] px-6 py-3 transition-colors text-center"
                            >
                                Open local portal →
                            </a>
                            <a
                                href="/"
                                className="mono-meta border border-[var(--border-hairline)] text-[var(--text-stone)] hover:text-[var(--text-bone)] px-6 py-3 transition-colors text-center"
                            >
                                Back to website
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
