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
 * 4th telemetry column in ChatPortal header
 */
export default function DeviceStatusBadge({ status }) {
    if (!status) return null;

    let badgeText = '';
    let isLink = false;
    let colorClass = '';

    if (status.state === 'online') {
        badgeText = 'CONNECTED';
        colorClass = 'text-[var(--text-ink)]';
    } else if (status.state === 'sleeping') {
        badgeText = `SLEEPING · ${formatAgo(status.last_seen_at)}`;
        colorClass = 'text-[var(--text-stone)]';
    } else {
        // not_set_up
        badgeText = 'SET UP →';
        isLink = true;
        colorClass = 'text-[var(--text-stone)] transition-colors hover:text-[var(--text-bone)]';
    }

    return (
        <div className="flex flex-col gap-0.5 items-end">
            <span className="text-[var(--text-stone)]">DEVICE</span>
            <div aria-live="polite">
                {isLink ? (
                    <Link to="/connect?next=/chat" className={colorClass}>
                        {badgeText}
                    </Link>
                ) : (
                    <span className={colorClass}>{badgeText}</span>
                )}
            </div>
        </div>
    );
}
