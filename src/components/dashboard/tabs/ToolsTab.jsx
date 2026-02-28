export default function ToolsTab({ tabState }) {
    if (tabState?.loading && !tabState?.data) {
        return (
            <div className="p-6 border animate-reveal" style={{ borderColor: 'var(--border-hairline)' }}>
                <span className="mono-meta" style={{ color: 'var(--text-stone)' }}>Loading tools…</span>
            </div>
        );
    }

    const data = tabState?.data || {};
    const skills = Array.isArray(data.skillsCatalog?.skills) ? data.skillsCatalog.skills : [];
    const agents = Array.isArray(data.agents)
        ? data.agents
        : (Array.isArray(data.agents?.agents) ? data.agents.agents : []);

    return (
        <div className="grid gap-4 lg:grid-cols-2 animate-reveal">
            <section className="border p-4" style={{ borderColor: 'var(--border-hairline)' }}>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="mono-meta" style={{ color: 'var(--text-stone)' }}>Skill Catalog</h3>
                    <span className="mono-meta" style={{ color: 'var(--text-shadow)' }}>{skills.length}</span>
                </div>
                {skills.length === 0 ? (
                    <p className="mono-meta" style={{ color: 'var(--text-shadow)' }}>No skill catalog data available.</p>
                ) : (
                    <div className="space-y-2 max-h-[55vh] overflow-auto pr-1">
                        {skills.map((skill) => (
                            <div key={skill.skill} className="border p-3" style={{ borderColor: 'var(--border-hairline)' }}>
                                <div className="mono-meta" style={{ color: 'var(--text-stone)' }}>
                                    {String(skill.readiness || 'unknown').toUpperCase()} · policy {skill.default_policy || 'allow'}
                                </div>
                                <div className="text-sm mt-1" style={{ color: 'var(--text-ink)' }}>
                                    {skill.skill}
                                </div>
                                {Array.isArray(skill.missing_credentials) && skill.missing_credentials.length > 0 ? (
                                    <div className="mono-meta mt-2" style={{ color: 'var(--text-shadow)' }}>
                                        missing: {skill.missing_credentials.join(', ')}
                                    </div>
                                ) : null}
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section className="border p-4" style={{ borderColor: 'var(--border-hairline)' }}>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="mono-meta" style={{ color: 'var(--text-stone)' }}>Agents</h3>
                    <span className="mono-meta" style={{ color: 'var(--text-shadow)' }}>{agents.length}</span>
                </div>
                {agents.length === 0 ? (
                    <p className="mono-meta" style={{ color: 'var(--text-shadow)' }}>No agent registry data available.</p>
                ) : (
                    <div className="space-y-2 max-h-[55vh] overflow-auto pr-1">
                        {agents.map((agent) => (
                            <div key={agent.agent_type} className="border p-3" style={{ borderColor: 'var(--border-hairline)' }}>
                                <div className="mono-meta" style={{ color: 'var(--text-stone)' }}>
                                    {String(agent.risk_class || 'unknown').toUpperCase()} risk
                                </div>
                                <div className="text-sm mt-1" style={{ color: 'var(--text-ink)' }}>
                                    {agent.agent_type}
                                </div>
                                <div className="mono-meta mt-2" style={{ color: 'var(--text-shadow)' }}>
                                    skills: {Array.isArray(agent.allowed_skills) ? agent.allowed_skills.length : 0}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
