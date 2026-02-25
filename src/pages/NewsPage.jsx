import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function NewsPage() {
    const roadmap = [
        {
            tag: 'Q1 2026',
            status: 'UPCOMING',
            title: 'Web & Device Linked Chat',
            body: 'Sign in from the web, see whether your TARS device is online, and queue messages when it is offline.',
        },
        {
            tag: 'Q1 2026',
            status: 'UPCOMING',
            title: 'TARS Voice',
            body: 'Start a task with your voice and let TARS continue the workflow. Desktop first, then mobile.',
        },
        {
            tag: 'Q2 2026',
            status: 'IN DEVELOPMENT',
            title: 'Broader Business Autonomy',
            body: 'More support for email, outreach, reporting, and approval workflows for business teams.',
        },
        {
            tag: 'Q2 2026',
            status: 'IN DEVELOPMENT',
            title: 'Enterprise Role-Based Access',
            body: 'Administrators set evidence thresholds per role. An intern needs 5 sources to push code. A senior needs 2. Governance is now a team-level configuration, not just a runtime default.',
        },
        {
            tag: 'SHIPPED',
            status: 'SHIPPED',
            title: 'Rust Safety Core v2',
            body: 'The governance, idempotency, and audit logging stack rebuilt in Rust. Compile-time safety guarantees eliminate runtime bypass vectors. 40% faster risk validation. No prompt can override it.',
        },
        {
            tag: 'SHIPPED',
            status: 'SHIPPED',
            title: 'Multi-Model Routing',
            body: 'TARS supports DeepSeek, OpenAI, Gemini, and mock providers, and can route tasks to the best available model.',
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

            <Navbar title="ROADMAP & NEWS" />

            <div className="pt-32 px-6 max-w-[1000px] mx-auto w-full flex-1">
                <main className="flex flex-col mb-24">

                    {/* Hero */}
                    <div className="mb-24">
                        <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] font-bold tracking-[0.25em] text-white mb-6 uppercase">
                            Roadmap
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-8 leading-[1.05]">
                            What we're shipping next.
                        </h1>
                        <p className="text-zinc-400 text-lg md:text-xl leading-relaxed max-w-2xl">
                            A simple view of what we are shipping next: better web access, stronger real-world automation, and safer self-improving helpers.
                        </p>
                    </div>

                    {/* Timeline List */}
                    <div className="flex flex-col border-t border-zinc-800 pt-8">
                        {roadmap.map((item, i) => (
                            <div key={i} className="group relative grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 py-12 md:py-16 border-b border-zinc-800">

                                <div className="md:col-span-3 flex flex-col gap-2 pt-2">
                                    <div className={`text-[10px] font-bold tracking-[0.2em] ${item.status === 'SHIPPED' ? 'text-emerald-400/80' : 'text-white/40'}`}>
                                        {item.status}
                                    </div>
                                    <div className="text-xs font-bold tracking-[0.15em] text-zinc-500">
                                        {item.tag}
                                    </div>
                                </div>

                                <div className="md:col-span-9 bg-transparent transition-all">
                                    <h4 className="text-2xl md:text-3xl font-bold text-white leading-snug mb-4 group-hover:text-zinc-200 transition-colors">
                                        {item.title}
                                    </h4>
                                    <p className="text-lg font-light text-zinc-400 leading-relaxed max-w-2xl">
                                        {item.body}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                </main>
            </div>

            <Footer />
        </div>
    );
}
