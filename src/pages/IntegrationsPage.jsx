import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function IntegrationsPage() {
    const apps = [
        { name: 'Google Drive', color: '#0F9D58', initial: 'G' },
        { name: 'Slack', color: '#E01E5A', initial: 'S' },
        { name: 'Notion', color: '#FFFFFF', initial: 'N', darkText: true },
        { name: 'GitHub', color: '#FAFBFC', initial: 'G', darkText: true },
        { name: 'Jira', color: '#0052CC', initial: 'J' },
        { name: 'AWS CloudWatch', color: '#FF9900', initial: 'A' },
        { name: 'PostgreSQL', color: '#336791', initial: 'P' },
        { name: 'Figma', color: '#F24E1E', initial: 'F' },
    ];

    return (
        <div
            className="min-h-screen bg-[#000000] text-[#f4f4f5] selection:bg-zinc-800 overflow-x-hidden flex flex-col"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&display=swap');
            `}</style>

            <Navbar />

            <div className="pt-32 px-6 max-w-[1600px] mx-auto w-full flex-1">
                <main className="flex flex-col mb-24">
                    {/* Hero */}
                    <div className="max-w-4xl mb-24">
                        <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] font-bold tracking-[0.25em] text-white mb-6">
                            ECOSYSTEM
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-8 leading-[1.05]">
                            Your tools.<br />One runtime.
                        </h1>
                        <p className="text-zinc-400 text-lg md:text-xl leading-relaxed max-w-2xl">
                            TARS connects to the tools you already use — like Slack, GitHub, Drive, and Notion — so you can work from one place instead of jumping between tabs.
                        </p>
                    </div>

                    {/* Nav Pills */}
                    <div className="mb-12 border-b border-zinc-800">
                        <div className="flex gap-8 overflow-x-auto pb-4 text-xs font-bold tracking-[0.1em] uppercase">
                            <button className="text-white border-b-2 border-white pb-2 whitespace-nowrap">All Platforms</button>
                            <button className="text-zinc-500 hover:text-zinc-300 transition-colors whitespace-nowrap pb-2">Collaboration</button>
                            <button className="text-zinc-500 hover:text-zinc-300 transition-colors whitespace-nowrap pb-2">File Sharing</button>
                            <button className="text-zinc-500 hover:text-zinc-300 transition-colors whitespace-nowrap pb-2">Dev Tools</button>
                            <button className="text-zinc-500 hover:text-zinc-300 transition-colors whitespace-nowrap pb-2">Data</button>
                        </div>
                    </div>

                    {/* Grid of integrations */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mb-24">
                        {apps.map(app => (
                            <div
                                key={app.name}
                                className="group flex items-center p-6 rounded-2xl border border-zinc-800 bg-[#0a0a0a] hover:bg-zinc-900 transition-all cursor-pointer hover:border-zinc-700"
                            >
                                <div
                                    className="w-12 h-12 rounded-lg flex items-center justify-center mr-4 shrink-0 shadow-lg"
                                    style={{ background: app.color }}
                                >
                                    <span style={{ fontSize: '20px', fontWeight: 800, color: app.darkText ? '#000' : '#fff' }}>
                                        {app.initial}
                                    </span>
                                </div>
                                <span className="text-lg font-medium text-white group-hover:text-white transition-colors">
                                    {app.name}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Coming Soon */}
                    <div className="max-w-4xl border border-zinc-800 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.05),transparent_50%)] bg-[#0a0a0a] rounded-3xl p-12 relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="inline-block px-3 py-1 bg-white/10 text-white rounded-full text-[10px] font-bold tracking-[0.2em] mb-6">
                                IN DEVELOPMENT · Q2 2026
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-snug">
                                Native Slack &amp; Notion integrations arriving Q2 2026.
                            </h2>
                            <p className="text-zinc-400 text-lg max-w-2xl leading-relaxed">
                                Get updates in Slack and send summaries to Notion. TARS is built to fit into your existing workflow.
                            </p>
                        </div>
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
}
