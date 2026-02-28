function formatTs(value) {
    if (!value) return '—';
    const dt = new Date(value);
    if (Number.isNaN(dt.getTime())) return '—';
    return dt.toLocaleString();
}

function FlagPill({ label, value }) {
    return (
        <div className="border px-3 py-2" style={{ borderColor: 'var(--border-hairline)' }}>
            <div className="mono-meta" style={{ color: 'var(--text-shadow)' }}>{label}</div>
            <div className="text-sm mt-1" style={{ color: 'var(--text-ink)' }}>{value ? 'enabled' : 'disabled'}</div>
        </div>
    );
}

export default function MemoryTab({ tabState }) {
    if (tabState?.loading && !tabState?.data) {
        return (
            <div className="p-6 border animate-reveal" style={{ borderColor: 'var(--border-hairline)' }}>
                <span className="mono-meta" style={{ color: 'var(--text-stone)' }}>Loading memory…</span>
            </div>
        );
    }

    const data = tabState?.data || {};
    const sessionId = data.sessionId || '—';
    const settings = data.memorySettings || {};
    const memoryItems = Array.isArray(data.memoryItems) ? data.memoryItems : [];
    const quarantineItems = Array.isArray(data.memoryQuarantine) ? data.memoryQuarantine : [];

    return (
        <div className="space-y-4 animate-reveal">
            <section className="border p-4" style={{ borderColor: 'var(--border-hairline)' }}>
                <h3 className="mono-meta mb-3" style={{ color: 'var(--text-stone)' }}>Session Context</h3>
                <div className="mono-meta" style={{ color: 'var(--text-shadow)' }}>session id</div>
                <div className="text-sm mt-1 break-all" style={{ color: 'var(--text-ink)' }}>{sessionId}</div>
                <div className="grid gap-2 sm:grid-cols-2 mt-4">
                    <FlagPill label="saved memory" value={Boolean(settings.saved_memory_enabled)} />
                    <FlagPill label="chat history personalization" value={Boolean(settings.chat_history_personalization_enabled)} />
                </div>
            </section>

            <div className="grid gap-4 lg:grid-cols-2">
                <section className="border p-4" style={{ borderColor: 'var(--border-hairline)' }}>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="mono-meta" style={{ color: 'var(--text-stone)' }}>Memory Items</h3>
                        <span className="mono-meta" style={{ color: 'var(--text-shadow)' }}>{memoryItems.length}</span>
                    </div>
                    {memoryItems.length === 0 ? (
                        <p className="mono-meta" style={{ color: 'var(--text-shadow)' }}>No memory items yet for this session.</p>
                    ) : (
                        <div className="space-y-2 max-h-[52vh] overflow-auto pr-1">
                            {memoryItems.map((item) => (
                                <div key={`${item.id}`} className="border p-3" style={{ borderColor: 'var(--border-hairline)' }}>
                                    <div className="mono-meta" style={{ color: 'var(--text-stone)' }}>
                                        {String(item.kind || 'memory').toUpperCase()} · {formatTs(item.created_at)}
                                    </div>
                                    <div className="text-sm mt-1" style={{ color: 'var(--text-ink)' }}>
                                        {String(item.summary || 'No summary provided.')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <section className="border p-4" style={{ borderColor: 'var(--border-hairline)' }}>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="mono-meta" style={{ color: 'var(--text-stone)' }}>Quarantine Queue</h3>
                        <span className="mono-meta" style={{ color: 'var(--text-shadow)' }}>{quarantineItems.length}</span>
                    </div>
                    {quarantineItems.length === 0 ? (
                        <p className="mono-meta" style={{ color: 'var(--text-shadow)' }}>No pending memory quarantine items.</p>
                    ) : (
                        <div className="space-y-2 max-h-[52vh] overflow-auto pr-1">
                            {quarantineItems.map((item) => (
                                <div key={`${item.id}`} className="border p-3" style={{ borderColor: 'var(--border-hairline)' }}>
                                    <div className="mono-meta" style={{ color: 'var(--text-stone)' }}>
                                        {String(item.status || 'pending').toUpperCase()} · {formatTs(item.created_at)}
                                    </div>
                                    <div className="text-sm mt-1" style={{ color: 'var(--text-ink)' }}>
                                        {String(item.summary || item.reason || 'Quarantine item')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
