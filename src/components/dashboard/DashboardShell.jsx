import { Link } from 'react-router-dom';
import ActivityTab from './tabs/ActivityTab';
import TasksTab from './tabs/TasksTab';
import LogsTab from './tabs/LogsTab';
import ToolsTab from './tabs/ToolsTab';
import MemoryTab from './tabs/MemoryTab';

const TAB_DEFS = [
    { key: 'activity', label: 'Activity' },
    { key: 'tasks', label: 'Tasks' },
    { key: 'logs', label: 'Logs' },
    { key: 'tools', label: 'Tools' },
    { key: 'memory', label: 'Memory' },
];

function formatTs(value) {
    if (!value) return 'never';
    const dt = new Date(value);
    if (Number.isNaN(dt.getTime())) return 'never';
    return dt.toLocaleString();
}

function renderTab(activeTab, tabState) {
    if (activeTab === 'activity') return <ActivityTab tabState={tabState} />;
    if (activeTab === 'tasks') return <TasksTab tabState={tabState} />;
    if (activeTab === 'logs') return <LogsTab tabState={tabState} />;
    if (activeTab === 'tools') return <ToolsTab tabState={tabState} />;
    if (activeTab === 'memory') return <MemoryTab tabState={tabState} />;
    return null;
}

export default function DashboardShell({
    user,
    onLogout,
    runtimeState,
    runtimeLoading,
    activeTab,
    onSelectTab,
    tabs,
    onRefresh,
    isRefreshing,
    lastRefreshAt,
}) {
    const activeTabState = tabs?.[activeTab] || {};
    const runtimeLabel = runtimeLoading
        ? 'CHECKING'
        : (runtimeState === 'awake' ? 'ONLINE' : String(runtimeState || 'UNKNOWN').toUpperCase());

    return (
        <div className="studio-page min-h-screen relative flex flex-col">
            <div className="architectural-grid" />
            <div className="film-grain" />

            <span className="fixed top-8 left-8 text-[var(--text-shadow)] opacity-40 select-none pointer-events-none hidden md:block" style={{ fontSize: 16 }}>+</span>
            <span className="fixed top-8 right-8 text-[var(--text-shadow)] opacity-40 select-none pointer-events-none hidden md:block" style={{ fontSize: 16 }}>+</span>
            <span className="fixed bottom-8 left-8 text-[var(--text-shadow)] opacity-40 select-none pointer-events-none hidden md:block" style={{ fontSize: 16 }}>+</span>
            <span className="fixed bottom-8 right-8 text-[var(--text-shadow)] opacity-40 select-none pointer-events-none hidden md:block" style={{ fontSize: 16 }}>+</span>

            <header className="w-full px-6 md:px-12 py-6 relative z-10" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-xl font-light tracking-tight" style={{ color: 'var(--text-shadow)' }}>
                            NORTHERN Dashboard
                        </h1>
                        <span className="mono-meta" style={{ color: 'var(--text-stone)' }}>
                            OpenClaw-style agent understanding workspace
                        </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <span className="mono-meta px-3 py-1.5 border" style={{ borderColor: 'var(--border-hairline)', color: 'var(--text-shadow)' }}>
                            Runtime: {runtimeLabel}
                        </span>
                        <span className="mono-meta px-3 py-1.5 border" style={{ borderColor: 'var(--border-hairline)', color: 'var(--text-shadow)' }}>
                            Last refresh: {formatTs(lastRefreshAt)}
                        </span>
                        <button
                            type="button"
                            onClick={() => void onRefresh()}
                            disabled={isRefreshing}
                            className="mono-meta px-3 py-1.5 border transition-colors"
                            style={{ borderColor: 'var(--border-hairline)', color: 'var(--text-stone)' }}
                        >
                            {isRefreshing ? 'Refreshing…' : 'Refresh'}
                        </button>
                        <Link to="/chat" className="mono-meta px-3 py-1.5 border" style={{ borderColor: 'var(--border-hairline)', color: 'var(--text-stone)' }}>
                            Chat
                        </Link>
                        <Link to="/settings" className="mono-meta px-3 py-1.5 border" style={{ borderColor: 'var(--border-hairline)', color: 'var(--text-stone)' }}>
                            Settings
                        </Link>
                        <Link to="/" className="mono-meta px-3 py-1.5 border" style={{ borderColor: 'var(--border-hairline)', color: 'var(--text-stone)' }}>
                            Home
                        </Link>
                        {user ? (
                            <button
                                type="button"
                                onClick={() => void onLogout()}
                                className="mono-meta px-3 py-1.5 border transition-colors"
                                style={{ borderColor: 'var(--border-hairline)', color: 'var(--text-stone)' }}
                            >
                                Logout
                            </button>
                        ) : null}
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-[1400px] mx-auto px-6 md:px-12 pt-8 md:pt-12 pb-20 relative z-10">
                {runtimeState !== 'awake' ? (
                    <section className="w-full max-w-3xl border p-6 md:p-8 animate-reveal" style={{ borderColor: 'var(--border-hairline)' }}>
                        <h2 className="text-3xl font-light tracking-tight mb-4" style={{ color: 'var(--text-bone)' }}>Northern isn’t awake</h2>
                        <p className="leading-relaxed" style={{ color: 'var(--text-stone)' }}>
                            The dashboard frame is available, but live agent telemetry needs your local runtime online.
                        </p>
                        <div className="mt-6 space-y-2 mono-meta" style={{ color: 'var(--text-shadow)' }}>
                            <div>1. Run <span style={{ color: 'var(--text-bone)' }}>northern status</span></div>
                            <div>2. If stopped, run <span style={{ color: 'var(--text-bone)' }}>northern up</span></div>
                            <div>3. Hit refresh once runtime is back online</div>
                        </div>
                    </section>
                ) : (
                    <>
                        <section className="border p-2 md:p-3 mb-4" style={{ borderColor: 'var(--border-hairline)' }}>
                            <div className="flex flex-wrap gap-2">
                                {TAB_DEFS.map((tab) => {
                                    const active = activeTab === tab.key;
                                    return (
                                        <button
                                            key={tab.key}
                                            type="button"
                                            onClick={() => onSelectTab(tab.key)}
                                            className="mono-meta px-3 py-2 border transition-colors"
                                            style={{
                                                borderColor: active ? 'var(--border-focus)' : 'var(--border-hairline)',
                                                color: active ? 'var(--text-ink)' : 'var(--text-stone)',
                                                background: active ? 'rgba(255,255,255,0.03)' : 'transparent',
                                            }}
                                        >
                                            {tab.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </section>

                        {activeTabState?.error ? (
                            <div className="mb-4 border px-4 py-2 mono-meta" style={{ borderColor: 'var(--border-focus)', color: 'var(--text-ink)' }}>
                                {activeTabState.error}
                            </div>
                        ) : null}

                        {renderTab(activeTab, activeTabState)}
                    </>
                )}
            </main>
        </div>
    );
}
