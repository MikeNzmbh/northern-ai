/**
 * Northern Studio – Artifact Surface Components
 *
 * Generic, governance-free visual surfaces for displaying structured
 * Northern artifacts inline in the chat message thread.
 *
 * Visual language ported from governance-workspace.tsx:
 *   gov-inline-artifact card  (rounded-xl, border-hairline, bg-white/55)
 *   BadgePill                 (text-[10px], uppercase, tracking letters)
 *
 * Usage:
 *   <NorthernArtifactCard
 *     label="CONTEXT"           // required: top-left badge
 *     title="Session bootstrap" // required
 *     meta="repo · main"        // optional: secondary info
 *     delay={0}                 // optional animation stagger ms
 *   >
 *     {optional slot for action buttons or body content}
 *   </NorthernArtifactCard>
 */

/** Small badge pill — matches the proposal badge style in the workspace */
export function StudioBadge({ children, className = '' }) {
    return (
        <span
            className={`inline-flex items-center border px-1.5 py-0.5 text-[10px] uppercase tracking-[0.14em] rounded-sm ${className}`}
            style={{ borderColor: 'var(--border-hairline)', color: 'var(--text-stone)' }}
        >
            {children}
        </span>
    );
}

/** Inline artifact card — mirrors gov-inline-artifact layout */
export function NorthernArtifactCard({ label, title, meta, delay = 0, children }) {
    return (
        <div
            className="studio-artifact rounded-xl p-3 md:p-4"
            style={{
                border: '1px solid var(--border-hairline)',
                backgroundColor: 'rgba(255,255,255,0.55)',
                animationDelay: `${delay}ms`,
            }}
        >
            <div className="flex flex-wrap items-center gap-1.5">
                {label && <StudioBadge>{label}</StudioBadge>}
                {meta && (
                    <span
                        className="mono-meta"
                        style={{ color: 'var(--text-shadow)' }}
                    >
                        {meta}
                    </span>
                )}
            </div>

            {title && (
                <div
                    className="mt-2 text-sm md:text-base font-light leading-relaxed"
                    style={{ color: 'var(--text-ink)' }}
                >
                    {title}
                </div>
            )}

            {children && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                    {children}
                </div>
            )}
        </div>
    );
}

/** A vertical stack of artifact cards with staggered animations */
export function NorthernArtifactList({ artifacts }) {
    if (!artifacts || artifacts.length === 0) return null;
    return (
        <div className="mt-6 space-y-3">
            {artifacts.map((a, i) => (
                <NorthernArtifactCard
                    key={a.id ?? i}
                    label={a.label}
                    title={a.title}
                    meta={a.meta}
                    delay={i * 140}
                >
                    {a.actions?.map((btn) => (
                        <button
                            key={btn.label}
                            type="button"
                            onClick={btn.onClick}
                            className="h-8 px-3 border text-[11px] uppercase tracking-[0.14em] transition-colors"
                            style={{
                                borderColor: 'var(--border-hairline)',
                                background: 'rgba(255,255,255,0.7)',
                                color: 'var(--text-ink)',
                            }}
                        >
                            {btn.label}
                        </button>
                    ))}
                </NorthernArtifactCard>
            ))}
        </div>
    );
}
