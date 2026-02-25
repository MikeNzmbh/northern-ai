import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
    ArrowUpRight,
    Search,
    Code,
    MessageSquare,
    Headset,
    Database,
    Shield,
    Server,
    LineChart,
} from 'lucide-react';

const useCases = [
    {
        title: 'Customer Experience',
        desc: 'Identify frustrated customers, analyze sentiment, and resolve complex issues instantly 24/7. Turn wait times into real-time, personalized support.',
        icon: <Headset className="w-5 h-5 text-indigo-300" />,
        color: 'bg-indigo-500/10 border-indigo-500/20',
        iconBg: 'bg-indigo-500/20',
    },
    {
        title: 'Coding',
        desc: 'Build, debug, and ship faster. TARS can help review code, draft changes, and work through older codebases step by step.',
        icon: <Code className="w-5 h-5 text-emerald-300" />,
        color: 'bg-emerald-500/10 border-emerald-500/20',
        iconBg: 'bg-emerald-500/20',
    },
    {
        title: 'Content creation',
        desc: 'Create clear, consistent content at scale. Maintain your brand voice across thousands of marketing assets and product descriptions.',
        icon: <MessageSquare className="w-5 h-5 text-blue-300" />,
        color: 'bg-blue-500/10 border-blue-500/20',
        iconBg: 'bg-blue-500/20',
    },
    {
        title: 'Research',
        desc: 'Gather and summarize information quickly. TARS can read long documents and pull out the parts you need.',
        icon: <Search className="w-5 h-5 text-amber-300" />,
        color: 'bg-amber-500/10 border-amber-500/20',
        iconBg: 'bg-amber-500/20',
    },
    {
        title: 'Data analysis',
        desc: 'Uncover insights that drive smarter decisions. Connect your databases and ask questions in plain English.',
        icon: <LineChart className="w-5 h-5 text-rose-300" />,
        color: 'bg-rose-500/10 border-rose-500/20',
        iconBg: 'bg-rose-500/20',
    },
];

const industries = [
    {
        title: 'Financial services',
        desc: 'Build trust and stay ahead in any market. Automate compliance checks and analyze risk vectors in milliseconds.',
        image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop',
    },
    {
        title: 'Healthcare',
        desc: 'Improve outcomes and deliver better care. Triage patient inquiries, summarize medical histories, and reduce administrative load.',
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop',
    },
    {
        title: 'Life sciences',
        desc: 'Connect science to patient impact. Accelerate literature reviews, clinical trial analysis, and regulatory drafting.',
        image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800&auto=format&fit=crop',
    },
    {
        title: 'Retail',
        desc: 'Deliver better shopping experiences. Personalize customer journeys, forecast demand, and automate inventory intelligence.',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop',
    },
];

export default function SolutionsPage() {
    return (
        <div
            className="min-h-screen bg-[#000000] text-[#f4f4f5] selection:bg-zinc-800 overflow-x-hidden flex flex-col"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&display=swap');
                :root {
                    --text-bone: #f2f0ed;
                    --text-stone: #78716c;
                }
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            <Navbar title="Solutions" />

            <div className="pt-32 pb-24 w-full flex-1">
                <main className="flex flex-col">

                    {/* Hero */}
                    <div className="max-w-[1400px] mx-auto px-6 w-full mb-32 flex flex-col items-center text-center">
                        <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] font-bold tracking-[0.25em] text-white mb-8">
                            BUILT FOR THE ENTERPRISE
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-8 leading-[1.05] max-w-5xl">
                            Enterprise-ready<br />solutions for real impact
                        </h1>
                        <p className="text-zinc-400 text-lg md:text-xl leading-relaxed max-w-3xl mb-10">
                            Explore practical ways to use AI across your organization, from support and operations to research and analysis.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <a href="/chat" className="bg-white text-black px-6 py-3 rounded-full text-sm font-medium hover:bg-zinc-200 transition-colors flex items-center gap-2 group">
                                Try TARS for business
                                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </a>
                            <a href="mailto:sales@tars.ai" className="bg-[#111] border border-white/10 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-white/10 transition-colors">
                                Contact sales
                            </a>
                        </div>
                    </div>

                    {/* Use cases (Horizontal Scroll) */}
                    <div className="w-full mb-32">
                        <div className="max-w-[1600px] mx-auto px-6 mb-8">
                            <h2 className="text-2xl font-semibold tracking-tight text-white mb-2">Use cases</h2>
                            <p className="text-zinc-500 text-sm">Practical ways teams can use TARS.</p>
                        </div>
                        <div className="w-full overflow-x-auto hide-scrollbar pl-6 pb-8">
                            <div className="flex gap-6 w-max pr-6">
                                {useCases.map((useCase, idx) => (
                                    <div
                                        key={idx}
                                        className={`w-[350px] md:w-[420px] rounded-3xl p-8 border ${useCase.color} flex flex-col min-h-[280px] group transition-all shrink-0 hover:bg-white/5 cursor-pointer`}
                                    >
                                        <div className={`w-12 h-12 rounded-2xl ${useCase.iconBg} flex items-center justify-center mb-8`}>
                                            {useCase.icon}
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-4">{useCase.title}</h3>
                                        <p className="text-zinc-300 leading-relaxed font-light">{useCase.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Industries */}
                    <div className="max-w-[1600px] mx-auto px-6 w-full mb-40">
                        <h2 className="text-2xl font-semibold tracking-tight text-white mb-10">Industries</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {industries.map((ind, idx) => (
                                <div key={idx} className="group cursor-pointer">
                                    <div className="w-full aspect-square rounded-2xl overflow-hidden mb-6 bg-zinc-900 border border-zinc-800 relative">
                                        <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors z-10" />
                                        <img
                                            src={ind.image}
                                            alt={ind.title}
                                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                                        />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-zinc-300 transition-colors">{ind.title}</h3>
                                    <p className="text-zinc-400 text-sm leading-relaxed">{ind.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Deploy with Confidence */}
                    <div className="max-w-[1600px] mx-auto px-6 w-full mb-20">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center border border-zinc-800 rounded-[2.5rem] p-12 lg:p-20 bg-[#050505]">
                            <div className="flex flex-col">
                                <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
                                    AI you can use with confidence
                                </h2>
                                <p className="text-zinc-400 text-lg leading-relaxed mb-16">
                                    Use TARS with clear approvals, access controls, and visibility into what it is doing and why.
                                </p>
                                <div className="space-y-12">
                                    <div>
                                        <div className="flex items-center gap-3 mb-4">
                                            <Database className="w-6 h-6 text-white" />
                                            <h3 className="text-2xl font-semibold text-white">Connect your data</h3>
                                        </div>
                                        <p className="text-zinc-400 leading-relaxed mb-6">
                                            Connect your internal docs, code, and data so TARS can answer with better context.
                                        </p>
                                        <div className="flex flex-wrap gap-4">
                                            <a href="/integrations" className="bg-white text-black px-5 py-2.5 rounded-full text-sm font-medium hover:bg-zinc-200 transition-colors">
                                                Explore integrations
                                            </a>
                                            <button className="bg-transparent border border-white/20 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-white/10 transition-colors">
                                                Connect with MCP
                                            </button>
                                        </div>
                                    </div>
                                    <div className="pt-12 border-t border-white/10">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Shield className="w-6 h-6 text-white" />
                                            <h3 className="text-2xl font-semibold text-white">Absolute privacy</h3>
                                        </div>
                                        <p className="text-zinc-400 leading-relaxed">
                                            TARS will not train on your business data. You can use role-based access controls and local deployment options when needed.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Visual */}
                            <div className="w-full aspect-square rounded-3xl bg-zinc-900 border border-zinc-800 p-8 flex items-center justify-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05)_0%,transparent_60%)]" />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors duration-1000" />
                                <div className="relative z-10 w-full max-w-sm">
                                    <div className="bg-[#0a0a0a] border border-zinc-700/50 rounded-2xl p-6 shadow-2xl">
                                        <div className="flex items-center justify-between mb-6 pb-6 border-b border-zinc-800">
                                            <div className="flex items-center gap-3">
                                                <Server className="w-5 h-5 text-emerald-400" />
                                                <span className="text-sm font-medium text-white">Production Database</span>
                                            </div>
                                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                        </div>
                                        <div className="space-y-4 mb-8">
                                            <div className="h-2 w-full bg-zinc-800 rounded-full" />
                                            <div className="h-2 w-3/4 bg-zinc-800 rounded-full" />
                                            <div className="h-2 w-5/6 bg-zinc-800 rounded-full" />
                                        </div>
                                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                                            <span className="text-xs font-mono text-emerald-400">✓ Context Connected via MCP</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </main>
            </div>

            <Footer />
        </div>
    );
}
