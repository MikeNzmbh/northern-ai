import { useState } from 'react';
import { Link } from 'react-router-dom';

function formatAgo(timestamp) {
    if (!timestamp) return 'unknown';
    const ms = Date.now() - new Date(timestamp).getTime();
    const mins = Math.floor(ms / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(timestamp).toLocaleDateString();
}

/**
 * Banner shown just below the header when device is sleeping
 */
export default function OfflineBanner({ status }) {
    const [expanded, setExpanded] = useState(false);

    if (status?.state !== 'sleeping') return null;

    const lastSeen = formatAgo(status.last_seen_at);
    const depth = status.queue_depth || 0;

    return (
        <div
            className="w-full border-b border-[var(--border-hairline)] bg-[#f2f0ed02] animate-reveal mono-meta"
            role="status"
        >
            <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="text-[var(--text-stone)]">
                    <span className="text-[var(--text-ink)] mr-2">NORTHERN IS SLEEPING</span>
                    · Last seen {lastSeen} · {depth} queued
                </div>

                <div className="flex items-center gap-6 text-[var(--text-stone)]">
                    <button
                        type="button"
                        onClick={() => setExpanded(!expanded)}
                        aria-expanded={expanded}
                        className="py-1 border-b border-[var(--border-hairline)] hover:text-[var(--text-bone)] transition-colors"
                    >
                        How to reconnect {expanded ? '↑' : '↓'}
                    </button>
                    <Link
                        to="/connect?next=/chat"
                        className="py-1 border-b border-[var(--border-hairline)] hover:text-[var(--text-bone)] transition-colors"
                    >
                        Switch device →
                    </Link>
                </div>
            </div>

            {expanded && (
                <div
                    role="region"
                    className="max-w-[1200px] mx-auto px-6 md:px-12 py-6 border-t border-[var(--border-hairline)] animate-reveal"
                >
                    <div className="text-[var(--text-stone)] mb-4 tracking-widest">RECONNECT STEPS</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                        <div className="flex gap-4">
                            <span className="text-[var(--text-shadow)]">01</span>
                            <span className="text-[var(--text-ink)]">Open a terminal on {status.instance_id || 'your device'}</span>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-[var(--text-shadow)]">02</span>
                            <span className="text-[var(--text-ink)]">Run: <span className="text-[var(--text-bone)]">northern status</span></span>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-[var(--text-shadow)]">03</span>
                            <span className="text-[var(--text-ink)]">If stopped, run: <span className="text-[var(--text-bone)]">northern up</span></span>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-[var(--text-shadow)]">04</span>
                            <div className="flex flex-col gap-2 relative z-20">
                                <span className="text-[var(--text-ink)]">This page polls every 15 s and updates automatically</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
