import { useMemo } from 'react';
import { getLocalPortalUrl } from '../lib/runtimeProfile';
import { useAuth } from '../hooks/useAuth';
import { useSupabaseDevicePresence } from '../hooks/useSupabaseDevicePresence';
import '../styles/studio.css';

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
    const statusHeadline = useMemo(() => {
        if (!user) return 'Connect your account';
        if (presenceState === 'online') return 'Northern is awake';
        if (presenceState === 'not_set_up') return 'Runtime not linked';
        return 'Northern is sleeping';
    }, [presenceState, user]);

    return (
        <div className="studio-page min-h-screen relative flex flex-col overflow-hidden p-4 sm:p-6 md:p-12">
            <div className="pointer-events-none absolute -left-20 top-4 h-96 w-96 rounded-full bg-[#d4af37]/10 blur-3xl" />
            <div className="pointer-events-none absolute -right-16 bottom-12 h-80 w-80 rounded-full bg-[#8a7558]/10 blur-3xl" />
            <span className="fixed top-8 left-8 text-[var(--text-shadow)] opacity-40 select-none pointer-events-none hidden md:block" style={{ fontSize: 16 }}>+</span>
            <span className="fixed top-8 right-8 text-[var(--text-shadow)] opacity-40 select-none pointer-events-none hidden md:block" style={{ fontSize: 16 }}>+</span>
            <span className="fixed bottom-8 left-8 text-[var(--text-shadow)] opacity-40 select-none pointer-events-none hidden md:block" style={{ fontSize: 16 }}>+</span>
            <span className="fixed bottom-8 right-8 text-[var(--text-shadow)] opacity-40 select-none pointer-events-none hidden md:block" style={{ fontSize: 16 }}>+</span>

            <header className="w-full mb-8 sm:mb-10 md:mb-12 flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-luxury tracking-[0.16em] sm:tracking-[0.2em] text-[#c49b5d] md:text-[#e8d5a5] italic">
                        NORTHERN
                    </h1>
                    <p className="mono-meta text-[11px] sm:text-[10px] mt-2 text-[var(--text-shadow)]">Local runtime control</p>
                </div>
                {!authLoading && user ? (
                    <button
                        type="button"
                        onClick={() => void logout()}
                        className="mono-meta text-[11px] sm:text-[10px] rounded-lg border border-[var(--border-hairline)] bg-white/45 px-4 py-2 text-[var(--text-stone)] transition-colors hover:border-[var(--border-focus)] hover:bg-white/65 hover:text-[var(--text-ink)]"
                    >
                        Log out
                    </button>
                ) : null}
            </header>

            <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-7 sm:gap-8 md:gap-16 pt-3 md:pt-8">
                <div className="md:w-52 shrink-0 space-y-2">
                    <h2 className="font-luxury tracking-[0.1em] text-[#bf934f] md:text-[#d4af37] text-sm uppercase opacity-90">Local Runtime</h2>
                    <p className="mono-meta text-[11px] sm:text-[10px] text-[var(--text-shadow)]">Status orchestration</p>
                </div>

                <div className="flex-1 flex flex-col gap-8 sm:gap-10">
                    <div className="space-y-3 sm:space-y-4">
                        <span className="inline-flex items-center rounded-full border border-[#d4af37]/30 bg-white/35 px-4 py-1.5 mono-meta text-[11px] sm:text-[10px] text-[#6e675f]">
                            Device presence
                        </span>
                        <h2 className="text-[2.35rem] leading-[0.95] sm:text-5xl md:text-6xl font-calligraphy text-[#b2894d] md:text-[#e8d5a5] drop-shadow-md">
                            {statusHeadline}
                        </h2>
                        <p className="text-[#645e57] sm:text-[var(--text-stone)] leading-relaxed max-w-2xl font-luxury text-base sm:text-lg md:text-xl italic opacity-95">
                            {statusCopy}
                        </p>
                    </div>

                    <div
                        className="relative border border-[#d4af37]/25 p-5 sm:p-7 md:p-9 flex flex-col gap-5 sm:gap-6 w-full animate-reveal rounded-2xl backdrop-blur-sm overflow-hidden"
                        style={{
                            background: 'linear-gradient(128deg, rgba(255,255,255,0.38) 0%, rgba(242,239,233,0.18) 48%, rgba(212,175,55,0.14) 100%)',
                            boxShadow: '0 22px 48px rgba(31, 24, 14, 0.16)',
                        }}
                    >
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d4af37]/70 to-transparent" />
                        <span className="font-luxury tracking-[0.2em] text-[#b48a49] md:text-[#e8d5a5] text-xs uppercase opacity-85">ACCOUNT</span>
                        <div className="flex flex-col sm:flex-row gap-4">
                            {!authLoading && !user ? (
                                <>
                                    <a
                                        href="/login?next=%2Fchat"
                                        className="font-luxury italic tracking-[0.06em] sm:tracking-wider border border-[#d4af37]/45 hover:border-[#d4af37] hover:bg-[#d4af37]/10 text-[#4f4a44] px-6 sm:px-8 py-3 transition-all text-center rounded-xl bg-white/72"
                                    >
                                        Sign in →
                                    </a>
                                    <a
                                        href="/signup?next=%2Fchat"
                                        className="font-luxury italic tracking-[0.06em] sm:tracking-wider border border-[#d4af37]/45 hover:border-[#d4af37] hover:bg-[#d4af37]/10 text-[#4f4a44] px-6 sm:px-8 py-3 transition-all text-center rounded-xl bg-white/72"
                                    >
                                        Create account →
                                    </a>
                                </>
                            ) : (
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                    <span className="font-luxury italic text-[var(--text-ink)] text-[1.02rem] sm:text-lg opacity-85">
                                        Signed in{user?.email ? ` as ${user.email}` : ''}.
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => void logout()}
                                        className="font-luxury italic tracking-[0.06em] sm:tracking-wider border border-[#d4af37]/45 hover:border-[#d4af37] hover:bg-[#d4af37]/10 text-[#4f4a44] px-6 py-2 transition-all text-left sm:text-center rounded-xl bg-white/72"
                                    >
                                        Log out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div
                        className="relative border border-[#d4af37]/25 p-5 sm:p-7 md:p-9 flex flex-col gap-5 sm:gap-6 w-full animate-reveal rounded-2xl backdrop-blur-sm overflow-hidden"
                        style={{
                            background: 'linear-gradient(128deg, rgba(255,255,255,0.38) 0%, rgba(242,239,233,0.18) 48%, rgba(212,175,55,0.14) 100%)',
                            boxShadow: '0 22px 48px rgba(31, 24, 14, 0.16)',
                        }}
                    >
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d4af37]/70 to-transparent" />
                        <span className="font-luxury tracking-[0.2em] text-[#b48a49] md:text-[#e8d5a5] text-xs uppercase opacity-85">START STEPS</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5 sm:gap-y-6">
                            <div className="flex gap-4 items-baseline">
                                <span className="font-luxury text-[#bb8f4b] md:text-[#d4af37] opacity-70 text-base sm:text-lg">01</span>
                                <span className="font-luxury text-[var(--text-ink)] opacity-90 text-base sm:text-lg">Open terminal on your device</span>
                            </div>
                            <div className="flex gap-4 items-baseline">
                                <span className="font-luxury text-[#bb8f4b] md:text-[#d4af37] opacity-70 text-base sm:text-lg">02</span>
                                <span className="font-luxury text-[var(--text-ink)] opacity-90 text-base sm:text-lg">Run <span className="text-[#1f1b16]">northern status</span></span>
                            </div>
                            <div className="flex gap-4 items-baseline">
                                <span className="font-luxury text-[#bb8f4b] md:text-[#d4af37] opacity-70 text-base sm:text-lg">03</span>
                                <span className="font-luxury text-[var(--text-ink)] opacity-90 text-base sm:text-lg">If stopped, run <span className="text-[#1f1b16]">northern up</span></span>
                            </div>
                            <div className="flex gap-4 items-baseline">
                                <span className="font-luxury text-[#bb8f4b] md:text-[#d4af37] opacity-70 text-base sm:text-lg">04</span>
                                <span className="font-luxury text-[var(--text-ink)] opacity-90 text-base sm:text-lg">Open your local portal and sign in</span>
                            </div>
                        </div>

                        <div className="mt-4 flex flex-col sm:flex-row gap-4">
                            <a
                                href={localPortalUrl}
                                className="font-luxury italic tracking-[0.06em] sm:tracking-wider border border-[#d4af37]/45 hover:border-[#d4af37] hover:bg-[#d4af37]/10 text-[#4f4a44] px-6 sm:px-8 py-3 transition-all text-center rounded-xl bg-white/72"
                            >
                                Open local portal →
                            </a>
                            <a
                                href="/"
                                className="font-luxury italic tracking-[0.06em] sm:tracking-wider border border-transparent hover:border-[#d4af37]/40 text-[var(--text-ink)] opacity-85 sm:opacity-75 hover:opacity-100 px-6 sm:px-8 py-3 transition-all text-center rounded-xl"
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
