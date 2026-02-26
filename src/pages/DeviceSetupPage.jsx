import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSettings } from '../hooks/useSettings';
import { useAuth } from '../hooks/useAuth';
import DeviceConnectCard from '../components/DeviceConnectCard';

export default function DeviceSetupPage() {
    const { settings } = useSettings();
    const apiBase = (settings.apiBaseUrl || '').replace(/\/+$/, '') || '/api';

    // Auth gate (Rule A)
    const { user, loading: authLoading } = useAuth(apiBase);

    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const nextParams = searchParams.get('next') || '/chat';

    const [deviceStatus, setDeviceStatus] = useState(null);

    // If already linked and online, just route back
    useEffect(() => {
        if (deviceStatus?.state === 'online') {
            navigate(nextParams, { replace: true });
        }
    }, [deviceStatus, navigate, nextParams]);

    if (authLoading) return null; // wait for redirect
    if (!user) return null;

    return (
        <div className="studio-page min-h-screen relative flex flex-col p-6 md:p-12">
            {/* Corner marks */}
            <span className="fixed top-8 left-8 text-[var(--text-shadow)] opacity-40 select-none pointer-events-none hidden md:block" style={{ fontSize: 16 }}>+</span>
            <span className="fixed top-8 right-8 text-[var(--text-shadow)] opacity-40 select-none pointer-events-none hidden md:block" style={{ fontSize: 16 }}>+</span>
            <span className="fixed bottom-8 left-8 text-[var(--text-shadow)] opacity-40 select-none pointer-events-none hidden md:block" style={{ fontSize: 16 }}>+</span>
            <span className="fixed bottom-8 right-8 text-[var(--text-shadow)] opacity-40 select-none pointer-events-none hidden md:block" style={{ fontSize: 16 }}>+</span>

            <header className="w-full mb-12">
                <h1 className="text-xl font-light tracking-tight text-[var(--text-shadow)]">NORTHERN</h1>
            </header>

            <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row gap-8 md:gap-16">

                {/* Left rail */}
                <div className="md:w-48 shrink-0">
                    <h2 className="mono-meta text-[var(--text-shadow)]">DEVICE SETUP</h2>
                </div>

                {/* Right col */}
                <div className="flex-1 flex flex-col gap-8">
                    <div>
                        <h2 className="text-3xl font-light tracking-tight text-[var(--text-bone)] mb-4">Link your Northern device</h2>
                        <p className="text-[var(--text-stone)] leading-relaxed max-w-xl">
                            Northern is a hybrid AI system. It runs safely on your own hardware while connecting to cloud intelligence. Link a device running the Northern daemon to start chatting.
                        </p>
                    </div>

                    {!deviceStatus && (
                        <DeviceConnectCard
                            apiBase={apiBase}
                            onSuccess={setDeviceStatus}
                        />
                    )}

                    {deviceStatus?.state === 'sleeping' && (
                        <div className="border border-[var(--border-hairline)] p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-12 w-full animate-reveal" style={{ background: 'rgba(255,255,255,0.01)' }}>
                            <div className="flex flex-col gap-6 md:w-32 shrink-0 mono-meta text-[var(--text-stone)] pt-2 select-none">
                                NEXT STEP
                            </div>
                            <div className="flex-1 flex flex-col gap-6">
                                <span className="mono-meta text-[var(--text-ink)]">DEVICE LINKED · WAITING FOR DAEMON</span>

                                <div className="text-[var(--text-stone)]">
                                    Start Northern on <span className="text-[var(--text-bone)] mono-meta">{deviceStatus.instance_id}</span>:
                                </div>

                                <div className="border border-[var(--border-hairline)] bg-[#0A0908] p-4 font-['JetBrains_Mono'] text-[13px] text-[var(--text-bone)] tracking-tight">
                                    northern up
                                </div>

                                <div className="text-[var(--text-shadow)] mono-meta mt-2">
                                    This page polls every 15 s and will automatically redirect when the device comes online.
                                </div>

                                <div className="mt-8 flex items-center justify-between gap-6 pb-2 border-b border-[var(--border-hairline)] w-fit">
                                    <button
                                        type="button"
                                        onClick={() => navigate(nextParams, { replace: true })}
                                        className="mono-meta text-[var(--text-stone)] hover:text-[var(--text-bone)] transition-colors"
                                    >
                                        → Go to chat (queue mode)
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
