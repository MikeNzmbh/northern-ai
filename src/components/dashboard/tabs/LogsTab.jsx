function formatTs(value) {
    if (!value) return '—';
    const dt = new Date(value);
    if (Number.isNaN(dt.getTime())) return '—';
    return dt.toLocaleString();
}

export default function LogsTab({ tabState }) {
    if (tabState?.loading && !tabState?.data) {
        return (
            <div className="p-6 border animate-reveal" style={{ borderColor: 'var(--border-hairline)' }}>
                <span className="mono-meta" style={{ color: 'var(--text-stone)' }}>Loading logs…</span>
            </div>
        );
    }

    const data = tabState?.data || {};
    const events = Array.isArray(data.telemetryEvents?.events) ? data.telemetryEvents.events : [];
    const messages = Array.isArray(data.outboxMessages?.messages) ? data.outboxMessages.messages : [];

    return (
        <div className="grid gap-4 lg:grid-cols-2 animate-reveal">
            <section className="border p-4" style={{ borderColor: 'var(--border-hairline)' }}>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="mono-meta" style={{ color: 'var(--text-stone)' }}>Telemetry Events</h3>
                    <span className="mono-meta" style={{ color: 'var(--text-shadow)' }}>{events.length}</span>
                </div>
                {events.length === 0 ? (
                    <p className="mono-meta" style={{ color: 'var(--text-shadow)' }}>No telemetry events available.</p>
                ) : (
                    <div className="space-y-2 max-h-[55vh] overflow-auto pr-1">
                        {events.slice(-80).reverse().map((event, index) => (
                            <div key={`${event.seq || 'evt'}-${index}`} className="border p-3" style={{ borderColor: 'var(--border-hairline)' }}>
                                <div className="mono-meta" style={{ color: 'var(--text-stone)' }}>
                                    {String(event.outcome_type || 'answer').toUpperCase()} · {String(event.severity || 'normal').toUpperCase()}
                                </div>
                                <div className="mono-meta mt-1" style={{ color: 'var(--text-shadow)' }}>
                                    seq: {event.seq ?? '—'} · source: {event.source || 'unknown'} · {formatTs(event.ts)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section className="border p-4" style={{ borderColor: 'var(--border-hairline)' }}>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="mono-meta" style={{ color: 'var(--text-stone)' }}>Outbox Log Context</h3>
                    <span className="mono-meta" style={{ color: 'var(--text-shadow)' }}>{messages.length}</span>
                </div>
                {messages.length === 0 ? (
                    <p className="mono-meta" style={{ color: 'var(--text-shadow)' }}>No outbox messages in this window.</p>
                ) : (
                    <div className="space-y-2 max-h-[55vh] overflow-auto pr-1">
                        {messages.map((message) => (
                            <div key={message.outbound_id} className="border p-3" style={{ borderColor: 'var(--border-hairline)' }}>
                                <div className="mono-meta" style={{ color: 'var(--text-stone)' }}>
                                    {String(message.status || 'unknown').toUpperCase()} · {String(message.channel || 'channel')}
                                </div>
                                <div className="text-sm mt-1" style={{ color: 'var(--text-ink)' }}>
                                    outbound: {message.outbound_id}
                                </div>
                                <div className="mono-meta mt-2" style={{ color: 'var(--text-shadow)' }}>
                                    created: {formatTs(message.created_at)}
                                </div>
                                {message.last_error ? (
                                    <div className="mono-meta mt-2" style={{ color: 'var(--text-ink)' }}>
                                        error: {String(message.last_error)}
                                    </div>
                                ) : null}
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
