import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    DASHBOARD_ACTIVE_TAB_KEY,
    DASHBOARD_SESSION_KEY,
    DASHBOARD_TAB_ORDER,
    ensureDashboardSessionId,
    fetchActiveTasks,
    fetchAgents,
    fetchDeviceStatus,
    fetchHealthLive,
    fetchMemoryItems,
    fetchMemoryQuarantine,
    fetchMemorySettings,
    fetchOutboxMessages,
    fetchSkillsCatalog,
    fetchTelemetryAlerts,
    fetchTelemetryEvents,
    fetchTelemetryReliability,
    fetchTelemetrySummary,
    fetchWorkflowRuns,
    readDashboardStorage,
    writeDashboardStorage,
} from '../lib/dashboardApi';

const DEFAULT_POLL_MS = 15_000;

function createEmptyTabState() {
    return {
        loading: false,
        error: null,
        data: null,
        lastUpdatedAt: null,
    };
}

function createInitialTabs() {
    return DASHBOARD_TAB_ORDER.reduce((acc, tab) => {
        acc[tab] = createEmptyTabState();
        return acc;
    }, {});
}

function normalizeTab(tab) {
    return DASHBOARD_TAB_ORDER.includes(tab) ? tab : 'activity';
}

function loadSavedActiveTab() {
    return normalizeTab(readDashboardStorage(DASHBOARD_ACTIVE_TAB_KEY));
}

function errorMessage(err) {
    if (!err) return 'Unknown error';
    if (typeof err === 'string') return err;
    if (err instanceof Error) return err.message || 'Unknown error';
    return String(err);
}

function summarizeFailures(failures) {
    if (!Array.isArray(failures) || failures.length === 0) return null;
    const labels = failures.map((item) => {
        const source = String(item?.source || 'unknown').replace(/([A-Z])/g, ' $1').trim();
        return source.toLowerCase();
    });
    return `Partial refresh: ${labels.join(', ')}.`;
}

async function resolveSources(sourceMap, previousData = null) {
    const entries = Object.entries(sourceMap || {});
    if (entries.length === 0) {
        return {
            data: previousData,
            successCount: 0,
            failures: [],
        };
    }

    const settled = await Promise.allSettled(entries.map(([, loader]) => loader()));
    const nextData = {
        ...(previousData && typeof previousData === 'object' ? previousData : {}),
    };
    const failures = [];
    let successCount = 0;

    settled.forEach((result, index) => {
        const [source] = entries[index];
        if (result.status === 'fulfilled') {
            successCount += 1;
            nextData[source] = result.value;
            return;
        }
        failures.push({ source, message: errorMessage(result.reason) });
    });

    return {
        data: nextData,
        successCount,
        failures,
    };
}

export function useDashboardData(apiBase, options = {}) {
    const { enabled = true, pollMs = DEFAULT_POLL_MS } = options;

    const [activeTab, setActiveTab] = useState(loadSavedActiveTab);
    const [tabs, setTabs] = useState(createInitialTabs);
    const [sessionId, setSessionId] = useState(() => readDashboardStorage(DASHBOARD_SESSION_KEY));
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastRefreshAt, setLastRefreshAt] = useState(null);

    const tabsRef = useRef(tabs);
    const loadedTabsRef = useRef(new Set());
    const inflightRef = useRef({});

    useEffect(() => {
        tabsRef.current = tabs;
    }, [tabs]);

    useEffect(() => {
        writeDashboardStorage(DASHBOARD_ACTIVE_TAB_KEY, activeTab);
    }, [activeTab]);

    const selectTab = useCallback((tab) => {
        setActiveTab((prev) => {
            const next = normalizeTab(tab);
            return next || prev;
        });
    }, []);

    const loadTab = useCallback(async (tab, loadOptions = {}) => {
        const normalizedTab = normalizeTab(tab);
        const { force = false, suppressLoading = false } = loadOptions;

        if (!enabled || !apiBase) {
            return null;
        }

        if (inflightRef.current[normalizedTab] && !force) {
            return inflightRef.current[normalizedTab];
        }

        if (!suppressLoading) {
            setTabs((prev) => ({
                ...prev,
                [normalizedTab]: {
                    ...prev[normalizedTab],
                    loading: true,
                    error: null,
                },
            }));
        }

        loadedTabsRef.current.add(normalizedTab);

        const task = (async () => {
            const previous = tabsRef.current[normalizedTab] || createEmptyTabState();
            const previousData = previous.data;

            let result = {
                data: previousData,
                successCount: 0,
                failures: [],
            };

            if (normalizedTab === 'activity') {
                result = await resolveSources(
                    {
                        healthLive: () => fetchHealthLive(apiBase),
                        deviceStatus: () => fetchDeviceStatus(apiBase),
                        telemetryReliability: () => fetchTelemetryReliability(apiBase),
                        telemetrySummary: () => fetchTelemetrySummary(apiBase),
                        telemetryAlerts: () => fetchTelemetryAlerts(apiBase),
                    },
                    previousData
                );
            }

            if (normalizedTab === 'tasks') {
                result = await resolveSources(
                    {
                        activeTasks: () => fetchActiveTasks(apiBase),
                        workflowRuns: () => fetchWorkflowRuns(apiBase),
                    },
                    previousData
                );
            }

            if (normalizedTab === 'logs') {
                result = await resolveSources(
                    {
                        telemetryEvents: () => fetchTelemetryEvents(apiBase),
                        outboxMessages: () => fetchOutboxMessages(apiBase),
                    },
                    previousData
                );
            }

            if (normalizedTab === 'tools') {
                result = await resolveSources(
                    {
                        skillsCatalog: () => fetchSkillsCatalog(apiBase),
                        agents: () => fetchAgents(apiBase),
                    },
                    previousData
                );
            }

            if (normalizedTab === 'memory') {
                let resolvedSessionId = sessionId || readDashboardStorage(DASHBOARD_SESSION_KEY) || '';
                try {
                    resolvedSessionId = await ensureDashboardSessionId(apiBase);
                    setSessionId(resolvedSessionId);
                } catch (err) {
                    result = {
                        data: previousData,
                        successCount: 0,
                        failures: [{ source: 'sessionId', message: errorMessage(err) }],
                    };
                }

                if (resolvedSessionId) {
                    const memoryResult = await resolveSources(
                        {
                            memorySettings: () => fetchMemorySettings(apiBase, resolvedSessionId),
                            memoryItems: () => fetchMemoryItems(apiBase, resolvedSessionId),
                            memoryQuarantine: () => fetchMemoryQuarantine(apiBase, resolvedSessionId),
                        },
                        previousData
                    );
                    result = {
                        ...memoryResult,
                        data: {
                            ...(memoryResult.data && typeof memoryResult.data === 'object' ? memoryResult.data : {}),
                            sessionId: resolvedSessionId,
                        },
                    };
                }
            }

            const nowIso = new Date().toISOString();
            setTabs((prev) => {
                const current = prev[normalizedTab] || createEmptyTabState();
                const hasSuccess = result.successCount > 0;
                const resolvedData = hasSuccess
                    ? result.data
                    : (current.data || result.data || null);

                return {
                    ...prev,
                    [normalizedTab]: {
                        ...current,
                        loading: false,
                        data: resolvedData,
                        error: summarizeFailures(result.failures),
                        lastUpdatedAt: hasSuccess ? nowIso : current.lastUpdatedAt,
                    },
                };
            });

            if (result.successCount > 0) {
                setLastRefreshAt(nowIso);
            }

            return result;
        })();

        inflightRef.current[normalizedTab] = task;
        try {
            return await task;
        } finally {
            if (inflightRef.current[normalizedTab] === task) {
                delete inflightRef.current[normalizedTab];
            }
        }
    }, [apiBase, enabled, sessionId]);

    const refreshAll = useCallback(async () => {
        if (!enabled || !apiBase) return;
        setIsRefreshing(true);
        try {
            const targets = loadedTabsRef.current.size > 0
                ? Array.from(loadedTabsRef.current)
                : [activeTab];
            await Promise.all(targets.map((tab) => loadTab(tab, { force: true })));
        } finally {
            setIsRefreshing(false);
        }
    }, [activeTab, apiBase, enabled, loadTab]);

    useEffect(() => {
        if (!enabled || !apiBase) return;
        void loadTab(activeTab, { force: true });
    }, [activeTab, apiBase, enabled, loadTab]);

    useEffect(() => {
        if (!enabled || !apiBase) return undefined;

        const interval = window.setInterval(() => {
            const targets = loadedTabsRef.current.size > 0
                ? Array.from(loadedTabsRef.current)
                : [activeTab];
            targets.forEach((tab) => {
                void loadTab(tab, { force: true, suppressLoading: true });
            });
        }, pollMs);

        return () => {
            window.clearInterval(interval);
        };
    }, [activeTab, apiBase, enabled, loadTab, pollMs]);

    return useMemo(() => ({
        activeTab,
        selectTab,
        tabs,
        sessionId,
        isRefreshing,
        lastRefreshAt,
        refreshAll,
    }), [
        activeTab,
        selectTab,
        tabs,
        sessionId,
        isRefreshing,
        lastRefreshAt,
        refreshAll,
    ]);
}
