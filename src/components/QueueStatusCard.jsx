import { useState } from 'react';

/**
 * Renders a synthetic row in the ChatPortal stream for queued messages
 */
export default function QueueStatusCard({ item, onRetry }) {
    const [retrying, setRetrying] = useState(false);

    if (!item) return null;

    const ts = new Date(item.created_at || Date.now());
    const timeStr = `${ts.getUTCHours().toString().padStart(2, '0')}:${ts.getUTCMinutes().toString().padStart(2, '0')}:${ts.getUTCSeconds().toString().padStart(2, '0')} UTC`;

    // Derived from UUID
    const idTail = String(item.id || '').toUpperCase().slice(-6).padStart(6, '0');
    const seq = `SEQ-${idTail}`;

    const handleRetry = async () => {
        if (!onRetry || retrying) return;
        setRetrying(true);
        try {
            await onRetry(item.id);
        } finally {
            setRetrying(false);
        }
    };

    let chipClass = '';
    let chipText = '';
    let showRetry = false;

    switch (item.status) {
        case 'queued':
            chipClass = 'bg-[#f2f0ed0a] text-[var(--text-stone)] border border-[var(--border-hairline)]';
            chipText = 'Queued';
            break;
        case 'waiting_for_northern':
            chipClass = 'bg-[#f2f0ed15] text-[var(--text-bone)] border border-[var(--text-stone)] animate-pulse';
            chipText = 'Sending…';
            break;
        case 'delivered':
            chipClass = 'bg-white/10 text-white border border-white/20';
            chipText = 'Delivered';
            break;
        case 'failed':
            chipClass = 'bg-red-500/10 text-red-200 border border-red-500/20';
            chipText = 'Failed';
            showRetry = true;
            break;
        default:
            chipClass = 'bg-transparent text-[var(--text-stone)] border border-[var(--border-hairline)]';
            chipText = item.status || 'Unknown';
    }

    return (
        <div className="flex flex-col md:flex-row gap-6 md:gap-12 w-full animate-reveal relative group">
            {/* Left rail */}
            <div className="flex flex-col gap-1 md:w-48 shrink-0 mono-meta text-[var(--text-stone)] pt-1 select-none">
                <span className="text-[var(--text-shadow)]">QUEUED</span>
                <span>{seq}</span>
                <span>{timeStr}</span>
            </div>

            {/* Right col */}
            <div className="flex-1 max-w-4xl flex flex-col gap-4">
                {/* User text */}
                <div className="whitespace-pre-wrap leading-[1.6em]" style={{ color: 'var(--text-bone)' }}>
                    {item.text}
                </div>

                {/* Status Card (Concierge style) */}
                <div className="border border-[var(--border-hairline)] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <span className="mono-meta text-[var(--text-stone)]">PORTAL QUEUE</span>
                        <div className="flex items-center gap-3">
                            <span className="mono-meta text-[var(--text-shadow)]">STATUS</span>
                            <div className={`mono-meta px-2 py-0.5 rounded-sm ${chipClass}`}>
                                {chipText}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {item.error_message && (
                            <span className="mono-meta text-red-400/80 text-right max-w-[200px] truncate" title={item.error_message}>
                                {item.error_message}
                            </span>
                        )}
                        {showRetry && (
                            <button
                                type="button"
                                onClick={handleRetry}
                                disabled={retrying}
                                className="mono-meta border border-[var(--border-hairline)] px-3 py-1 hover:border-[var(--text-bone)] hover:text-[var(--text-bone)] transition-colors disabled:opacity-50"
                            >
                                {retrying ? 'Retrying…' : 'Retry →'}
                            </button>
                        )}
                        {!showRetry && item.status !== 'delivered' && (
                            <div className="mono-meta text-[var(--text-shadow)] flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-stone)] animate-pulse" />
                                Polling
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
