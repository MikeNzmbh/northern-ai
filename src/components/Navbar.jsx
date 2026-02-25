import React from 'react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';

export default function Navbar({ title = 'TARS Home', backLink = '/' }) {
    return (
        <nav className="fixed top-0 w-full z-50 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#070707]/95 backdrop-blur supports-[backdrop-filter]:bg-[#070707]/85">
            <a
                href={backLink}
                className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors text-sm font-medium group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                {title}
            </a>

            <div className="flex items-center gap-3 md:gap-4 lg:gap-6 text-sm font-medium">
                <a
                    href="/chat"
                    className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1 group"
                >
                    Open Chat
                    <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
                <a
                    href="mailto:sales@tars.ai"
                    className="text-zinc-400 hover:text-white transition-colors group flex items-center gap-1"
                >
                    Talk to us
                    <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
            </div>
        </nav>
    );
}
