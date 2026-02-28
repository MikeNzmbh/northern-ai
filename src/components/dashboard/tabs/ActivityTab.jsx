function renderHealthLabel(value) {
    const normalized = String(value || '').trim().toLowerCase();
    if (!normalized) return 'unknown';
    if (normalized === 'ok' || normalized === 'alive') return 'healthy';
    return normalized;
}

function CountPill({ label, value }) {
    return (
        <div className="border px-3 py-2" style={{ borderColor: 'var(--border-hairline)' }}>
            <div className="mono-meta" style={{ color: 'var(--text-shadow)' }}>{label}</div>
            <div className="text-lg font-light" style={{ color: 'var(--text-ink)' }}>{value}</div>
        </div>
    );
}

export default function ActivityTab({ tabState }) {
    if (tabState?.loading && !tabState?.data) {
        return (
            <div className="p-6 border animate-reveal" style={{ borderColor: 'var(--border-hairline)' }}>
                <span className="mono-meta" style={{ color: 'var(--text-stone)' }}>Loading activity…</span>
            </div>
        );
    }

    const data = tabState?.data || {};
    const healthLive = data.healthLive || {};
    const deviceStatus = data.deviceStatus || {};
    const reliability = data.telemetryReliability || {};
    const summary = data.telemetrySummary || {};
    const alerts = Array.isArray(data.telemetryAlerts?.alerts) ? data.telemetryAlerts.alerts : [];

    const counts = summary.counts || {};
    const bySeverity = summary.by_severity || {};

    return (
        <div className="space-y-4 animate-reveal">
            <div className="grid gap-4 md:grid-cols-3">
                <CountPill label="runtime" value={renderHealthLabel(healthLive.status || healthLive.mode || healthLive.state)} />
                <CountPill label="device" value={String(deviceStatus.state || 'unknown')} />
                <CountPill label="alerts (24h)" value={alerts.length} />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <section className="border p-4" style={{ borderColor: 'var(--border-hairline)' }}>
                    <h3 className="mono-meta mb-3" style={{ color: 'var(--text-stone)' }}>Telemetry Outcomes</h3>
                    <div className="grid gap-2 sm:grid-cols-2">
                        <CountPill label="answer" value={counts.answer ?? 0} />
                        <CountPill label="unknown" value={counts.unknown ?? 0} />
                        <CountPill label="refusal" value={counts.refusal ?? 0} />
                        <CountPill label="error" value={counts.error ?? 0} />
                    </div>
                </section>

                <section className="border p-4" style={{ borderColor: 'var(--border-hairline)' }}>
                    <h3 className="mono-meta mb-3" style={{ color: 'var(--text-stone)' }}>Severity Mix</h3>
                    <div className="grid gap-2 sm:grid-cols-3">
                        <CountPill label="normal" value={bySeverity.normal ?? 0} />
                        <CountPill label="elevated" value={bySeverity.elevated ?? 0} />
                        <CountPill label="critical" value={bySeverity.critical ?? 0} />
                    </div>
                    <div className="mt-4 mono-meta" style={{ color: 'var(--text-shadow)' }}>
                        provider errors: {reliability.provider_errors ?? 0} · critical thrash: {reliability.critical_thrash_count ?? 0}
                    </div>
                </section>
            </div>

            <section className="border p-4" style={{ borderColor: 'var(--border-hairline)' }}>
                <h3 className="mono-meta mb-3" style={{ color: 'var(--text-stone)' }}>Recent Alerts</h3>
                {alerts.length === 0 ? (
                    <p className="mono-meta" style={{ color: 'var(--text-shadow)' }}>No active alerts in the 24h telemetry window.</p>
                ) : (
                    <div className="space-y-2">
                        {alerts.slice(0, 8).map((alert, index) => (
                            <div
                                key={`${alert?.kind || 'alert'}-${index}`}
                                className="border p-3"
                                style={{ borderColor: 'var(--border-hairline)' }}
                            >
                                <div className="mono-meta" style={{ color: 'var(--text-stone)' }}>
                                    {String(alert?.severity || 'info').toUpperCase()} · {String(alert?.kind || 'telemetry')}
                                </div>
                                <div className="text-sm mt-1" style={{ color: 'var(--text-ink)' }}>
                                    {String(alert?.message || 'No message provided.')}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
