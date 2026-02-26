import { useEffect, useState } from 'react';

/**
 * Auto-dismissing toast notification
 */
export default function Toast({ message, durationMs = 4000, onDismiss }) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const t1 = setTimeout(() => setVisible(false), durationMs);
        const t2 = setTimeout(() => onDismiss?.(), durationMs + 600); // 600ms for exit anim
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, [durationMs, onDismiss]);

    if (!message) return null;

    return (
        <div
            role="status"
            aria-live="polite"
            className={`fixed bottom-24 right-6 md:right-12 z-50 border border-[var(--border-hairline)] px-4 py-2 mono-meta text-[var(--text-stone)] bg-[#07070799] backdrop-blur transition-all duration-[600ms] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
            style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
        >
            {message}
        </div>
    );
}
