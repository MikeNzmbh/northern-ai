import React, { useState } from 'react';
import { ArrowLeft, ArrowUpRight, Menu, X } from 'lucide-react';

export default function Navbar({ title = 'NORTHERN Home', backLink = '/' }) {
    const [open, setOpen] = useState(false);

    return (
        <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#070707]/95 backdrop-blur supports-[backdrop-filter]:bg-[#070707]/85">
            <div className="flex items-center justify-between px-5 py-4">
                <a
                    href={backLink}
                    className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors text-sm font-medium group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform shrink-0" />
                    <span className="truncate max-w-[160px] sm:max-w-none">{title}</span>
                </a>

                {/* Desktop nav */}
                <div className="hidden sm:flex items-center gap-3 md:gap-4 lg:gap-6 text-sm font-medium">
                    <a
                        href="/chat"
                        className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1 group"
                    >
                        Open Chat
                        <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                    <a
                        href="mailto:sales@northern.ai"
                        className="text-zinc-400 hover:text-white transition-colors group flex items-center gap-1"
                    >
                        Talk to us
                        <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                </div>

                {/* Mobile hamburger */}
                <button
                    className="sm:hidden p-1.5 text-zinc-400 hover:text-white transition-colors"
                    onClick={() => setOpen(!open)}
                    aria-label="Toggle menu"
                >
                    {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Mobile dropdown */}
            {open && (
                <div className="sm:hidden border-t border-white/5 bg-[#0a0a0a] px-5 py-4 flex flex-col gap-4 text-sm font-medium">
                    <a
                        href="/chat"
                        className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
                        onClick={() => setOpen(false)}
                    >
                        Open Chat
                        <ArrowUpRight className="w-3 h-3" />
                    </a>
                    <a
                        href="mailto:sales@northern.ai"
                        className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
                        onClick={() => setOpen(false)}
                    >
                        Talk to us
                        <ArrowUpRight className="w-3 h-3" />
                    </a>
                </div>
            )}
        </nav>
    );
}
