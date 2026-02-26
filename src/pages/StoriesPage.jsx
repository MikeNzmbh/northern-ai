import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function StoriesPage() {
    return (
        <div
            className="min-h-screen bg-[#000000] text-[#f4f4f5] selection:bg-zinc-800 overflow-x-hidden flex flex-col"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&display=swap');
            `}</style>

            <Navbar title="NORTHERN Stories" />

            <div className="pt-32 px-6 max-w-[1400px] mx-auto w-full flex-1">
                <main className="flex flex-col mb-24">

                    {/* Hero */}
                    <div className="max-w-3xl mb-24">
                        <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] font-bold tracking-[0.25em] text-white mb-6">
                            WHAT BECOMES POSSIBLE
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-8 leading-[1.05]">
                            What people do with NORTHERN.
                        </h1>
                        <p className="text-zinc-400 text-lg md:text-xl leading-relaxed">
                            Examples of how teams and individuals use NORTHERN for research, coding, and operations.
                        </p>
                    </div>

                    {/* Main Story Card */}
                    <div className="mb-8 p-8 md:p-12 border border-zinc-800 bg-[#0a0a0a] rounded-3xl hover:border-zinc-700 transition-colors">
                        <div className="flex flex-col gap-6">
                            <div className="text-[11px] font-bold tracking-[0.2em] text-zinc-500">RESEARCH ANALYST</div>
                            <blockquote className="text-3xl md:text-5xl font-light text-white leading-tight tracking-tight mb-4">
                                "Two hours of my morning back. Every single day."
                            </blockquote>
                            <p className="text-zinc-400 text-lg leading-relaxed max-w-3xl mb-8">
                                NORTHERN can run overnight, collect updates from multiple sources, and deliver a clean morning brief with references. No tab juggling required.
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-8 border-t border-zinc-800">
                                <div>
                                    <div className="text-[10px] font-bold tracking-[0.2em] text-zinc-500 mb-2">TIME SAVED</div>
                                    <div className="text-2xl font-medium text-white">2 hrs/day</div>
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold tracking-[0.2em] text-zinc-500 mb-2">SETUP TIME</div>
                                    <div className="text-2xl font-medium text-white">1 afternoon</div>
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold tracking-[0.2em] text-zinc-500 mb-2">AGENTS DEPLOYED</div>
                                    <div className="text-2xl font-medium text-white">3</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Small Story Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div className="p-8 md:p-10 border border-zinc-800 bg-[#0a0a0a] rounded-3xl hover:border-zinc-700 transition-colors flex flex-col justify-between h-full">
                            <div>
                                <div className="text-[11px] font-bold tracking-[0.2em] text-zinc-500 mb-6">TRADING OPERATOR</div>
                                <blockquote className="text-2xl md:text-3xl font-light text-white leading-snug mb-6">
                                    "We updated live risk parameters and the Evidence Gate held. Zero surprises. 48-hour review enforced automatically."
                                </blockquote>
                            </div>
                            <p className="text-zinc-400 text-md">A good example of approvals and safety checks working as intended.</p>
                        </div>

                        <div className="p-8 md:p-10 border border-zinc-800 bg-[#0a0a0a] rounded-3xl hover:border-zinc-700 transition-colors flex flex-col justify-between h-full">
                            <div>
                                <div className="text-[11px] font-bold tracking-[0.2em] text-zinc-500 mb-6">INDEPENDENT DEVELOPER</div>
                                <blockquote className="text-2xl md:text-3xl font-light text-white leading-snug mb-6">
                                    "I gave NORTHERN a GitHub repo with 50 open issues. It queued 12 PRs for my approval. Like a senior engineer on retainer."
                                </blockquote>
                            </div>
                            <p className="text-zinc-400 text-md">From issue triage to draft pull request in minutes.</p>
                        </div>
                    </div>

                    {/* Wide Story Card */}
                    <div className="p-8 md:p-12 border border-zinc-800 bg-[#0a0a0a] rounded-3xl hover:border-zinc-700 transition-colors">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                            <div className="lg:col-span-5">
                                <div className="text-[11px] font-bold tracking-[0.2em] text-zinc-500 mb-6">BUSINESS OPERATOR</div>
                                <blockquote className="text-3xl md:text-4xl font-light text-white leading-tight">
                                    "NORTHERN handles our email triage, meeting prep briefs, and outreach queues. My team ships twice as fast."
                                </blockquote>
                            </div>
                            <div className="lg:col-span-7">
                                <p className="text-zinc-400 text-lg leading-relaxed bg-[#111] p-8 rounded-2xl border border-zinc-800/50">
                                    NORTHERN can sort incoming requests, draft replies, and hold them for review before anything is sent. The operator checks the draft and approves when ready.
                                </p>
                            </div>
                        </div>
                    </div>

                </main>
            </div>

            <Footer />
        </div>
    );
}
