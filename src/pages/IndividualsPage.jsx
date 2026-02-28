import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowUpRight } from 'lucide-react';
import { NORTHERN_DOWNLOAD_LINKS } from '../lib/downloadLinks';

const features = [
    {
        number: '01',
        title: 'Memory that helps',
        desc: 'NORTHERN remembers useful details from your past conversations and brings them back when relevant — so you repeat yourself less and follow-up work moves faster.',
    },
    {
        number: '02',
        title: 'Automated workflows',
        desc: 'Describe what you want done. NORTHERN breaks it into steps, handles the routine parts, and pauses for your approval before anything important happens.',
    },
    {
        number: '03',
        title: 'Approval before action',
        desc: 'Before sending a message, changing a file, or running any risky action, NORTHERN shows you exactly what it plans to do. You review it and decide.',
    },
    {
        number: '04',
        title: 'Works with multiple models',
        desc: 'NORTHERN routes tasks across OpenAI, DeepSeek, Gemini, and local models automatically. You are never locked into one provider.',
    },
    {
        number: '05',
        title: 'Desktop first, browser option',
        desc: 'Use the native desktop app for the full offline experience, or open the browser client for the same interface without any installation.',
    },
];

export default function IndividualsPage() {
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
                    <div className="max-w-4xl mb-32">
                        <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] font-bold tracking-[0.25em] text-white mb-6">
                            FOR INDIVIDUALS
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-8 leading-[1.05]">
                            Run real work.<br />Not just questions.
                        </h1>
                        <p className="text-zinc-400 text-lg md:text-xl leading-relaxed max-w-2xl mb-10">
                            NORTHERN is an AI built for people who want to get things done — not just generate text. Chat, automate, and review, all in one place.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <a href="/chat" className="bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-zinc-200 transition-colors flex items-center gap-2 group">
                                Open Web Client
                                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </a>
                            <a
                                href={NORTHERN_DOWNLOAD_LINKS.macos}
                                target="_blank"
                                rel="noreferrer"
                                className="bg-zinc-900 border border-zinc-800 text-white px-6 py-3 rounded-full font-medium hover:bg-zinc-800 transition-colors"
                            >
                                Download for macOS
                            </a>
                            <a
                                href={NORTHERN_DOWNLOAD_LINKS.windows}
                                target="_blank"
                                rel="noreferrer"
                                className="bg-zinc-900 border border-zinc-800 text-white px-6 py-3 rounded-full font-medium hover:bg-zinc-800 transition-colors"
                            >
                                Download for Windows
                            </a>
                            <a
                                href="/setup"
                                className="bg-transparent border border-zinc-700 text-zinc-200 px-6 py-3 rounded-full font-medium hover:bg-zinc-900 transition-colors"
                            >
                                Setup guide
                            </a>
                        </div>
                    </div>

                    {/* Features — Apple-style numbered cards */}
                    <div className="mb-40">
                        <p className="text-[10px] font-bold tracking-[0.3em] text-zinc-600 uppercase mb-12 border-b border-zinc-900 pb-4">
                            What NORTHERN does
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-800 rounded-2xl overflow-hidden border border-zinc-800">
                            {features.map((f, idx) => (
                                <div
                                    key={idx}
                                    className="bg-[#080808] p-10 flex flex-col gap-6 hover:bg-[#0f0f0f] transition-colors group"
                                >
                                    <span className="text-[11px] font-bold tracking-[0.25em] text-zinc-700 uppercase">
                                        {f.number}
                                    </span>
                                    <div>
                                        <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-zinc-100 transition-colors leading-snug">
                                            {f.title}
                                        </h3>
                                        <p className="text-zinc-500 text-sm leading-relaxed font-light">
                                            {f.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pricing */}
                    <div>
                        <div className="text-center mb-16">
                            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">Simple, transparent pricing</h2>
                            <p className="text-zinc-400 text-lg max-w-xl mx-auto">Early access pricing — locked in for you from day one.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">

                            {/* Student */}
                            <div className="flex flex-col border border-zinc-800 bg-[#0a0a0a] rounded-3xl p-8">
                                <div className="mb-8">
                                    <p className="text-[10px] font-bold tracking-[0.25em] text-zinc-500 uppercase mb-3">Student</p>
                                    <div className="flex items-baseline gap-1 mb-4">
                                        <span className="text-4xl font-bold text-white">Free</span>
                                    </div>
                                    <p className="text-zinc-500 text-sm leading-relaxed">For verified students — full access, no subscription required.</p>
                                </div>
                                <ul className="space-y-3 flex-1 mb-8">
                                    {[
                                        'Full chat & workflow interface',
                                        'All specialist agents',
                                        'Standard tool access',
                                        'Requires verified .edu email',
                                    ].map((feat, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                                            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0" />
                                            {feat}
                                        </li>
                                    ))}
                                </ul>
                                <a href="/chat" className="w-full py-3.5 rounded-xl flex items-center justify-center text-sm font-semibold transition-colors bg-zinc-800 text-white hover:bg-zinc-700">
                                    Verify student status
                                </a>
                            </div>

                            {/* Individual */}
                            <div className="flex flex-col border-2 border-zinc-400 bg-zinc-900 rounded-3xl p-8 relative shadow-2xl shadow-zinc-900/60">
                                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-1 rounded-full text-[10px] font-bold tracking-[0.15em] uppercase whitespace-nowrap">
                                    Recommended
                                </div>
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
                                    <p className="text-zinc-500 text-sm leading-relaxed">The full stack for individuals who want NORTHERN running reliably.</p>
                                </div>
                                <ul className="space-y-3 flex-1 mb-8">
                                    {[
                                        'Everything in Student',
                                        'Unlimited persistent memory',
                                        'Daily research & intelligence briefs',
                                        'All model routing (DeepSeek, OpenAI, Gemini)',
                                        'Custom workflow & automation builder',
                                        'Priority security patches',
                                    ].map((feat, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                                            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                                            {feat}
                                        </li>
                                    ))}
                                </ul>
                                <a href="/chat" className="w-full py-3.5 rounded-xl flex items-center justify-center text-sm font-semibold transition-colors bg-white text-black hover:bg-zinc-200">
                                    Get started
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
                                    ].map((feat, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-zinc-400">
                                            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-zinc-600 shrink-0" />
                                            {feat}
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
