import React from 'react';
import Footer from '../components/Footer';
import {
    ArrowLeft,
    ChevronDown,
    Folder,
    ArrowUpRight,
    Bot,
} from 'lucide-react';

const featureCards = [
    {
        title: 'NORTHERN Chat for Business',
        description: 'Give your team one place to ask, automate, and review work safely.',
        bullets: [
            'Give teams a shared AI workspace with approvals built in.',
            'Use chat, tools, and data analysis in one place.',
        ],
    },
];

export default function BusinessPage() {
    return (
        <div
            className="min-h-screen bg-[#000000] text-[#f4f4f5] selection:bg-zinc-800 overflow-x-hidden"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&display=swap');
            `}</style>

            {/* Nav */}
            <nav className="fixed top-0 w-full z-50 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#000]/95 backdrop-blur">
                <a href="/" className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors text-sm font-medium group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    NORTHERN Home
                </a>
                <div className="flex items-center gap-3 md:gap-4 text-sm font-medium">
                    <a href="/chat" className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1 group">
                        Open Chat <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                    <a href="mailto:sales@northern.ai" className="hidden sm:flex text-zinc-400 hover:text-white transition-colors items-center gap-1 group">
                        Contact sales <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                </div>
            </nav>

            <div className="pt-20 px-6 max-w-[1600px] mx-auto pb-24">
                <main className="flex flex-col mt-4 lg:mt-8">
                    {/* Hero */}
                    <div className="flex flex-col xl:flex-row gap-16 xl:gap-8 items-start justify-between mb-24">
                        <div className="max-w-xl flex-1">
                            <p className="text-zinc-500 text-xs font-bold tracking-[0.2em] uppercase mb-4">Built for real teams</p>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.08]">
                                AI that fits how your team already works.
                            </h1>
                            <p className="text-zinc-400 text-base md:text-lg mb-10 leading-relaxed max-w-md">
                                NORTHERN helps your team draft, review, and automate work with clear approval steps before anything is sent or changed.
                            </p>
                            <div className="flex flex-wrap items-center gap-4">
                                <a href="/solutions" className="bg-white text-black px-6 py-3 rounded-full text-sm font-semibold hover:bg-zinc-200 transition-colors flex items-center gap-2 group">
                                    Explore solutions
                                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </a>
                                <a href="mailto:sales@northern.ai" className="bg-transparent border border-white/20 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-white/10 transition-colors">
                                    Contact sales
                                </a>
                            </div>
                        </div>

                        {/* Chat UI Mockup */}
                        <div className="flex-1 max-w-xl w-full">
                            <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-1 shadow-2xl shadow-blue-900/30">
                                <div className="bg-white rounded-[1.35rem] overflow-hidden">
                                    <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-red-400" />
                                            <div className="w-2 h-2 rounded-full bg-yellow-400" />
                                            <div className="w-2 h-2 rounded-full bg-green-400" />
                                        </div>
                                        <div className="flex items-center gap-4 text-xs font-medium text-zinc-400">
                                            <button className="text-zinc-800 font-semibold border-b-2 border-zinc-800 pb-0.5">Chat</button>
                                            <button className="hover:text-zinc-600 transition-colors">Workflows</button>
                                            <button className="hover:text-zinc-600 transition-colors">Agents</button>
                                            <Bot className="w-4 h-4 text-zinc-400 ml-2" />
                                        </div>
                                    </div>

                                    <div className="p-5">
                                        <div className="flex items-center gap-2 px-3 py-2 bg-zinc-50 rounded-xl border border-zinc-200 text-zinc-600 text-sm mb-5 cursor-pointer hover:bg-zinc-100 transition-colors">
                                            <span className="font-medium">NORTHERN World</span>
                                            <ChevronDown className="w-4 h-4 ml-auto" />
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 mb-5">
                                            {["Draft a sales email", "Analyze this dataset", "Summarize meeting notes", "Review my code"].map(s => (
                                                <button key={s} className="text-left text-xs font-medium text-zinc-600 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-xl p-3 transition-colors leading-snug">
                                                    {s}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="border border-zinc-200 rounded-2xl overflow-hidden mb-3">
                                            <div className="px-4 py-3 text-xs text-zinc-400 bg-zinc-50 border-b border-zinc-100">
                                                Ask NORTHERN anything, add files, or run a command
                                            </div>
                                            <div className="bg-white px-4 py-3 flex items-center justify-between">
                                                <div className="flex items-center gap-3 text-xs text-zinc-400">
                                                    <Folder className="w-4 h-4" />
                                                    <span>NORTHERN Work (4 tasks)</span>
                                                </div>
                                                <button className="bg-zinc-900 text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-zinc-700 transition-colors">
                                                    Send
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-center text-[10px] text-zinc-400">You review important actions before they run.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feature cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {featureCards.map((card) => (
                            <div
                                key={card.title}
                                className="border border-zinc-800 bg-[#0a0a0a] rounded-2xl p-8 hover:border-zinc-700 transition-colors cursor-pointer group"
                            >
                                <h3 className="text-2xl font-semibold mb-4 text-white">{card.title}</h3>
                                <p className="text-zinc-400 mb-6">{card.description}</p>
                                <ul className="space-y-3">
                                    {card.bullets.map((bullet, index) => (
                                        <li key={index} className="flex items-start gap-3 text-sm text-zinc-300">
                                            <span className="mt-1.5 w-1 h-1 rounded-full bg-white shrink-0" />
                                            <p>{bullet}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Pricing */}
                    <div className="mt-24">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">Simple, transparent pricing</h2>
                            <p className="text-zinc-400 text-lg max-w-xl mx-auto">Early access pricing — locked in for you from day one.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">

                            {/* Individual */}
                            <div className="flex flex-col border border-zinc-800 bg-[#0a0a0a] rounded-3xl p-8">
                                <div className="mb-8">
                                    <p className="text-[10px] font-bold tracking-[0.25em] text-zinc-500 uppercase mb-3">Individual</p>
                                    <div className="flex items-baseline gap-1 mb-1">
                                        <span className="text-4xl font-bold text-white">$5</span>
                                        <span className="text-zinc-400 text-sm font-medium">/month</span>
                                    </div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="text-zinc-600 text-sm line-through">$12/month</span>
                                        <span className="text-[10px] font-bold tracking-[0.1em] text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-0.5 rounded">EARLY ACCESS</span>
                                    </div>
                                    <p className="text-zinc-500 text-sm leading-relaxed">Full stack for solo operators who want NORTHERN running reliably.</p>
                                </div>
                                <ul className="space-y-3 flex-1 mb-8">
                                    {[
                                        'Full chat & workflow interface',
                                        'All 9 specialist agents',
                                        'Unlimited persistent memory',
                                        'All model routing (DeepSeek, OpenAI, Gemini)',
                                        'Custom workflow builder',
                                        'Priority security patches',
                                    ].map((f, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                                            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <a href="/chat" className="w-full py-3.5 rounded-xl flex items-center justify-center text-sm font-semibold transition-colors bg-zinc-800 text-white hover:bg-zinc-700">
                                    Get started
                                </a>
                            </div>

                            {/* Business & Teams */}
                            <div className="flex flex-col border-2 border-zinc-400 bg-zinc-900 rounded-3xl p-8 relative shadow-2xl shadow-zinc-900/60">
                                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-1 rounded-full text-[10px] font-bold tracking-[0.15em] uppercase whitespace-nowrap">
                                    Recommended
                                </div>
                                <div className="mb-8">
                                    <p className="text-[10px] font-bold tracking-[0.25em] text-zinc-500 uppercase mb-3">Business & Teams</p>
                                    <div className="flex items-baseline gap-1 mb-1">
                                        <span className="text-4xl font-bold text-white">$15</span>
                                        <span className="text-zinc-400 text-sm font-medium">/month per seat</span>
                                    </div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="text-zinc-600 text-sm line-through">$25/month per seat</span>
                                        <span className="text-[10px] font-bold tracking-[0.1em] text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-0.5 rounded">EARLY ACCESS</span>
                                    </div>
                                    <p className="text-zinc-500 text-sm leading-relaxed">For teams that need shared governance, RBAC, and dedicated support.</p>
                                </div>
                                <ul className="space-y-3 flex-1 mb-8">
                                    {[
                                        'Everything in Individual',
                                        'Team-level governance & approval chains',
                                        'Role-based access control per operator',
                                        'Shared agent workflows across your org',
                                        'Dedicated onboarding & priority support',
                                        'Audit logs and compliance reporting',
                                    ].map((f, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                                            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <a href="mailto:sales@northern.ai" className="w-full py-3.5 rounded-xl flex items-center justify-center text-sm font-semibold transition-colors bg-white text-black hover:bg-zinc-200">
                                    Contact sales
                                </a>
                            </div>

                            {/* Donate */}
                            <div className="flex flex-col border border-dashed border-zinc-700 bg-[#0a0a0a] rounded-3xl p-8">
                                <div className="mb-8">
                                    <p className="text-[10px] font-bold tracking-[0.25em] text-zinc-500 uppercase mb-3">Open Protocol</p>
                                    <div className="flex items-baseline gap-1 mb-4">
                                        <span className="text-4xl font-bold text-white">Donate</span>
                                    </div>
                                    <p className="text-zinc-500 text-sm leading-relaxed">Help keep Northern open-source and accessible to students and researchers.</p>
                                </div>
                                <ul className="space-y-3 flex-1 mb-8">
                                    {[
                                        'Funds free student access (US & Canada)',
                                        'Covers server & infrastructure costs',
                                        'Supports security audits & patches',
                                        'Your name in the contributor list',
                                    ].map((f, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-zinc-400">
                                            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-zinc-600 shrink-0" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <a href="#" className="w-full py-3.5 rounded-xl flex items-center justify-center text-sm font-semibold transition-colors bg-zinc-800 text-white hover:bg-zinc-700">
                                    Donate to Northern
                                </a>
                            </div>

                        </div>
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
}
