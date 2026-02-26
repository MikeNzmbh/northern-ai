import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function Footer({ className = '' }) {
    return (
        <footer className={`w-full bg-[#0a0a0a] border-t border-zinc-800 pt-20 pb-12 font-['JetBrains_Mono'] relative z-10 ${className}`}>
            <div className="max-w-[1600px] mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-20">
                    <div className="max-w-md">
                        <div className="flex items-center gap-4 mb-6 group cursor-pointer" onClick={() => window.location.href = '/'}>
                            {/* Animated Northern Logo */}
                            <div className="relative inline-flex items-center justify-center w-10 h-12">
                                <svg viewBox="0 0 64 64" className="w-full h-full overflow-visible" aria-label="NORTHERN Agentic Symbol">
                                    <rect x="10" y="24" width="8" height="16" fill="var(--text-stone, #78716c)" className="opacity-70 transition-all duration-700 group-hover:opacity-100" />
                                    <rect x="22" y="12" width="8" height="40" fill="var(--text-stone, #78716c)" className="opacity-70 transition-all duration-700 group-hover:opacity-100" />
                                    <rect x="34" y="6" width="8" height="40" fill="var(--text-bone, #f2f0ed)" style={{ animation: 'agentic-float 4s ease-in-out infinite', filter: 'drop-shadow(0 0 8px rgba(242, 240, 237, 0.4))' }} />
                                    <rect x="46" y="24" width="8" height="16" fill="var(--text-stone, #78716c)" className="opacity-70 transition-all duration-700 group-hover:opacity-100" />
                                    <path d="M 0 0 L 4 0 M 0 0 L 0 4" stroke="var(--text-stone, #78716c)" strokeWidth="1" fill="none" className="opacity-40" />
                                    <path d="M 64 64 L 60 64 M 64 64 L 64 60" stroke="var(--text-stone, #78716c)" strokeWidth="1" fill="none" className="opacity-40" />
                                </svg>
                            </div>
                            <span className="text-2xl font-light tracking-[0.25em] text-white uppercase group-hover:text-zinc-200 transition-colors">NORTHERN</span>
                        </div>
                        <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                            NORTHERN is an AI assistant for real work. Chat with it, connect your tools, and approve actions before anything is sent or changed.
                        </p>
                        <a
                            href="/chat"
                            className="bg-white text-black px-6 py-3 rounded-full text-sm font-medium hover:bg-zinc-200 transition-colors inline-flex items-center gap-2 group"
                        >
                            Open chat
                            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </a>
                    </div>

                    <div className="flex flex-wrap gap-12 lg:gap-24">
                        <div className="flex flex-col gap-4">
                            <h4 className="text-white text-sm font-semibold mb-2">Product</h4>
                            <a href="/business" className="text-zinc-400 hover:text-white transition-colors text-sm">Business</a>
                            <a href="/individuals" className="text-zinc-400 hover:text-white transition-colors text-sm">Individuals</a>
                            <a href="/integrations" className="text-zinc-400 hover:text-white transition-colors text-sm">Integrations</a>
                            <a href="/settings" className="text-zinc-400 hover:text-white transition-colors text-sm">Settings</a>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h4 className="text-white text-sm font-semibold mb-2">Resources</h4>
                            <a href="/stories" className="text-zinc-400 hover:text-white transition-colors text-sm">Examples</a>
                            <a href="/news" className="text-zinc-400 hover:text-white transition-colors text-sm">Roadmap & News</a>
                            <a href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">Getting Started</a>
                            <a href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">API Reference</a>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h4 className="text-white text-sm font-semibold mb-2">Company</h4>
                            <a href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">About</a>
                            <a href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">Blog</a>
                            <a href="mailto:sales@northern.ai" className="text-zinc-400 hover:text-white transition-colors text-sm">Contact</a>
                            <a href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">Security</a>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-zinc-800/50 text-xs text-zinc-500 gap-4">
                    <p>&copy; {new Date().getFullYear()} NORTHERN AI Inc. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-zinc-300 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-zinc-300 transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-zinc-300 transition-colors">Trust Center</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
