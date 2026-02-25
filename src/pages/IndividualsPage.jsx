import React from 'react';
import { ArrowUpRight, Cpu, Network, ShieldCheck, Database, LayoutTemplate } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function IndividualsPage() {
    const features = [
        {
            icon: <Database className="w-6 h-6 text-blue-400" />,
            title: 'Memory that helps',
            desc: 'TARS can remember useful details from past chats and bring them back when you ask. That means less repeating yourself and faster follow-up work.',
        },
        {
            icon: <Network className="w-6 h-6 text-purple-400" />,
            title: 'Automated workflows',
            desc: 'Describe what you want done and TARS can handle the steps for you. It pauses for approval before important actions so you stay in control.',
        },
        {
            icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
            title: 'Approval before action',
            desc: 'TARS asks for approval before sending messages, changing files, or running risky actions. You can review first and decide what happens next.',
        },
        {
            icon: <Cpu className="w-6 h-6 text-amber-400" />,
            title: 'Works with multiple models',
            desc: 'TARS can route tasks across OpenAI, DeepSeek, Gemini, and local models. You are not locked to one provider.',
        },
        {
            icon: <LayoutTemplate className="w-6 h-6 text-rose-400" />,
            title: 'Desktop first, browser option',
            desc: 'Use the desktop app for the full experience, or use the browser version if you want a simpler setup.',
        },
    ];

    const pricing = [
        {
            tier: 'Student',
            price: 'Free',
            period: '',
            note: 'Free access for verified students in the US and Canada.',
            features: [
                'Full conversational and workflow interface',
                'All 9 specialist agents',
                'Personality configuration',
                'Standard tool and integration access',
                'Requires verified .edu email',
            ],
            cta: 'Verify Student Status',
            primary: false
        },
        {
            tier: 'Operator',
            price: '$5',
            period: '/month',
            note: 'For individuals who want the full TARS experience, including saved memory and automation features.',
            features: [
                'Everything in Student',
                'Unlimited persistent memory',
                'Automated daily research and intelligence briefs',
                'All model routing unlocked (DeepSeek, OpenAI, Gemini)',
                'Custom workflow and automation builder',
                'Priority security patches',
            ],
            cta: 'Start for $5/mo',
            primary: true
        }
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
                            PERSONAL RUNTIME
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-8 leading-[1.05]">
                            Run real work.<br />Not just questions.
                        </h1>
                        <p className="text-zinc-400 text-lg md:text-xl leading-relaxed max-w-2xl">
                            TARS is an AI assistant built for real work. You can chat with it, connect tools, and let it help with multi-step tasks while you approve important actions.
                        </p>
                        <div className="mt-10 flex flex-wrap gap-4">
                            <a href="/chat" className="bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-zinc-200 transition-colors flex items-center gap-2 group">
                                Open Web Client
                                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </a>
                            <a href="#" className="bg-zinc-900 border border-zinc-800 text-white px-6 py-3 rounded-full font-medium hover:bg-zinc-800 transition-colors">
                                Download for macOS
                            </a>
                        </div>
                    </div>

                    {/* Features List */}
                    <div className="mb-32">
                        <h2 className="text-xs font-bold tracking-[0.3em] text-zinc-500 mb-12 uppercase border-b border-zinc-800 pb-4">Quick start features</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {features.map((feature, idx) => (
                                <div key={idx} className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-8 hover:border-zinc-700 transition-colors">
                                    <div className="mb-6 p-4 bg-black rounded-xl inline-block border border-zinc-900">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                                    <p className="text-zinc-400 leading-relaxed text-sm">
                                        {feature.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pricing */}
                    <div>
                        <h2 className="text-xs font-bold tracking-[0.3em] text-zinc-500 mb-8 uppercase text-center">Pricing</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {pricing.map((plan, idx) => (
                                <div key={idx} className={`rounded-3xl p-8 flex flex-col relative ${plan.primary ? 'bg-zinc-900 border border-zinc-700 shadow-2xl shadow-zinc-900/50' : 'bg-[#0a0a0a] border border-zinc-800'}`}>
                                    {plan.primary && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-1 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase">
                                            Most Popular
                                        </div>
                                    )}
                                    <h3 className="text-xl font-medium text-white mb-2">{plan.tier}</h3>
                                    <div className="flex items-baseline gap-1 mb-4">
                                        <span className="text-4xl font-bold text-white">{plan.price}</span>
                                        <span className="text-zinc-500 font-medium">{plan.period}</span>
                                    </div>
                                    <p className="text-zinc-400 text-sm mb-8">{plan.note}</p>
                                    <div className="flex-1">
                                        <ul className="space-y-4 mb-8">
                                            {plan.features.map((feat, i) => (
                                                <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                                                    <span className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${plan.primary ? 'bg-white' : 'bg-zinc-600'}`} />
                                                    <span>{feat}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <a href="#" className={`w-full py-4 rounded-xl flex items-center justify-center font-medium transition-colors ${plan.primary ? 'bg-white text-black hover:bg-zinc-200' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}>
                                        {plan.cta}
                                    </a>
                                </div>
                            ))}
                        </div>
                        <div className="max-w-2xl mx-auto mt-8 p-6 bg-[#0a0a0a] border border-zinc-800 rounded-2xl text-center">
                            <p className="text-sm text-zinc-400">
                                <strong className="text-white">Support TARS.</strong> Contributions help fund student access and ongoing development.
                            </p>
                        </div>
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
}
