import { useCallback, useMemo } from 'react';
import '../styles/studio.css';
import DashboardShell from '../components/dashboard/DashboardShell';
import { useAuth } from '../hooks/useAuth';
import { useDashboardData } from '../hooks/useDashboardData';
import { useRuntimeAwake } from '../hooks/useRuntimeAwake';
import { useSettings } from '../hooks/useSettings';

export default function AgentDashboardPage() {
    const { settings } = useSettings();
    const apiBase = useMemo(
        () => (settings.apiBaseUrl || '').replace(/\/+$/, '') || '/api',
        [settings.apiBaseUrl]
    );

    const { user, loading: authLoading, logout } = useAuth(apiBase, false, true);
    const { state: runtimeState, loading: runtimeLoading, refresh: refreshRuntime } = useRuntimeAwake(apiBase, true);

    const {
        activeTab,
        selectTab,
        tabs,
        isRefreshing,
        lastRefreshAt,
        refreshAll,
    } = useDashboardData(apiBase, {
        enabled: Boolean(user) && runtimeState === 'awake',
        pollMs: 15_000,
    });

    const handleRefresh = useCallback(async () => {
        await refreshRuntime();
        await refreshAll();
    }, [refreshAll, refreshRuntime]);

    if (authLoading) {
        return (
            <div className="studio-page min-h-screen flex items-center justify-center">
                <span className="mono-meta" style={{ color: 'var(--text-shadow)' }}>
                    Loading dashboard...
                </span>
            </div>
        );
    }

    return (
        <DashboardShell
            user={user}
            onLogout={logout}
            runtimeState={runtimeState}
            runtimeLoading={runtimeLoading}
            activeTab={activeTab}
            onSelectTab={selectTab}
            tabs={tabs}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
            lastRefreshAt={lastRefreshAt}
        />
    );
}
