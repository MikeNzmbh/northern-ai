function formatTs(value) {
    if (!value) return '—';
    const dt = new Date(value);
    if (Number.isNaN(dt.getTime())) return '—';
    return dt.toLocaleString();
}

function SectionHeader({ title, count }) {
    return (
        <div className="flex items-center justify-between mb-3">
            <h3 className="mono-meta" style={{ color: 'var(--text-stone)' }}>{title}</h3>
            <span className="mono-meta" style={{ color: 'var(--text-shadow)' }}>{count}</span>
        </div>
    );
}

export default function TasksTab({ tabState }) {
    if (tabState?.loading && !tabState?.data) {
        return (
            <div className="p-6 border animate-reveal" style={{ borderColor: 'var(--border-hairline)' }}>
                <span className="mono-meta" style={{ color: 'var(--text-stone)' }}>Loading tasks…</span>
            </div>
        );
    }

    const data = tabState?.data || {};
    const activeTasks = Array.isArray(data.activeTasks?.tasks) ? data.activeTasks.tasks : [];
    const workflowRuns = Array.isArray(data.workflowRuns?.runs) ? data.workflowRuns.runs : [];

    return (
        <div className="grid gap-4 lg:grid-cols-2 animate-reveal">
            <section className="border p-4" style={{ borderColor: 'var(--border-hairline)' }}>
                <SectionHeader title="Active Tasks" count={activeTasks.length} />
                {activeTasks.length === 0 ? (
                    <p className="mono-meta" style={{ color: 'var(--text-shadow)' }}>No active tasks.</p>
                ) : (
                    <div className="space-y-2 max-h-[50vh] overflow-auto pr-1">
                        {activeTasks.map((task) => (
                            <div key={task.task_id} className="border p-3" style={{ borderColor: 'var(--border-hairline)' }}>
                                <div className="mono-meta" style={{ color: 'var(--text-stone)' }}>
                                    {String(task.status || 'unknown').toUpperCase()} · {String(task.kind || 'task')}
                                </div>
                                <div className="text-sm mt-1" style={{ color: 'var(--text-ink)' }}>
                                    id: {task.task_id}
                                </div>
                                <div className="mono-meta mt-2" style={{ color: 'var(--text-shadow)' }}>
                                    progress: {Math.round(Number(task.progress || 0) * 100)}% · updated: {formatTs(task.updated_at)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section className="border p-4" style={{ borderColor: 'var(--border-hairline)' }}>
                <SectionHeader title="Workflow Runs" count={workflowRuns.length} />
                {workflowRuns.length === 0 ? (
                    <p className="mono-meta" style={{ color: 'var(--text-shadow)' }}>No workflow runs.</p>
                ) : (
                    <div className="space-y-2 max-h-[50vh] overflow-auto pr-1">
                        {workflowRuns.map((run) => (
                            <div key={run.run_id} className="border p-3" style={{ borderColor: 'var(--border-hairline)' }}>
                                <div className="mono-meta" style={{ color: 'var(--text-stone)' }}>
                                    {String(run.status || 'unknown').toUpperCase()} · workflow {run.workflow_id || '—'}
                                </div>
                                <div className="text-sm mt-1" style={{ color: 'var(--text-ink)' }}>
                                    run: {run.run_id}
                                </div>
                                <div className="mono-meta mt-2" style={{ color: 'var(--text-shadow)' }}>
                                    started: {formatTs(run.started_at)} · attempt: {run.attempt ?? 1}
                                </div>
                                {run.last_error ? (
                                    <div className="mono-meta mt-2" style={{ color: 'var(--text-ink)' }}>
                                        error: {String(run.last_error)}
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
