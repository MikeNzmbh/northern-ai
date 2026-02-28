import React, { useState } from 'react';
import { ArrowLeft, ArrowUpRight, Menu, X } from 'lucide-react';

export default function Navbar({ title = 'NORTHERN Home', backLink = '/' }) {
    const [open, setOpen] = useState(false);

    return (
        <nav
            style={{
                position: 'fixed',
                top: 0,
                width: '100%',
                zIndex: 50,
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                backgroundColor: 'rgba(7,7,7,0.95)',
                backdropFilter: 'blur(12px)',
                fontFamily: "'JetBrains Mono', monospace",
            }}
        >
            {/* Main bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem' }}>
                <a
                    href={backLink}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: '#a1a1aa',
                        textDecoration: 'none',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        maxWidth: '60%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}
                >
                    <ArrowLeft size={16} style={{ flexShrink: 0 }} />
                    {title}
                </a>

                {/* Desktop links */}
                <div className="hidden-mobile" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <a
                        href="/chat"
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.25rem',
                            color: '#a1a1aa', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500,
                        }}
                    >
                        Open Chat <ArrowUpRight size={12} />
                    </a>
                    <a
                        href="/setup"
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.25rem',
                            color: '#a1a1aa', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500,
                        }}
                    >
                        Setup Guide <ArrowUpRight size={12} />
                    </a>
                    <a
                        href="mailto:sales@northern.ai"
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.25rem',
                            color: '#a1a1aa', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500,
                        }}
                    >
                        Talk to us <ArrowUpRight size={12} />
                    </a>
                </div>

                {/* Hamburger */}
                <button
                    className="show-mobile"
                    onClick={() => setOpen(!open)}
                    aria-label="Toggle menu"
                    style={{
                        display: 'none',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#a1a1aa',
                        padding: '4px',
                    }}
                >
                    {open ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {/* Mobile dropdown */}
            {open && (
                <div
                    className="show-mobile"
                    style={{
                        borderTop: '1px solid rgba(255,255,255,0.05)',
                        backgroundColor: '#0a0a0a',
                        padding: '1rem 1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                    }}
                >
                    <a
                        href="/chat"
                        style={{ color: '#a1a1aa', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}
                        onClick={() => setOpen(false)}
                    >
                        Open Chat →
                    </a>
                    <a
                        href="/setup"
                        style={{ color: '#a1a1aa', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}
                        onClick={() => setOpen(false)}
                    >
                        Setup Guide →
                    </a>
                    <a
                        href="mailto:sales@northern.ai"
                        style={{ color: '#a1a1aa', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}
                        onClick={() => setOpen(false)}
                    >
                        Talk to us →
                    </a>
                </div>
            )}

            {/* Responsive style injection */}
            <style>{`
                @media (min-width: 640px) {
                    .hidden-mobile { display: flex !important; }
                    .show-mobile { display: none !important; }
                }
                @media (max-width: 639px) {
                    .hidden-mobile { display: none !important; }
                    .show-mobile { display: flex !important; }
                }
            `}</style>
        </nav>
    );
}
