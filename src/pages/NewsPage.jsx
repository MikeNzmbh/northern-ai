import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowUpRight, Clock } from 'lucide-react';

const articles = [
    {
        id: 'northern-voice',
        tag: 'PRODUCT',
        title: 'NORTHERN Voice: Desktop First, Then Mobile',
        summary: 'Start a task with your voice and let NORTHERN continue the workflow across your system.',
        date: 'March 15, 2026',
        readTime: '6 min read',
        author: {
            name: 'Anya M.',
            role: 'Lead Engineer, Platform',
            image: '/assets/profile_anya_1772119806143.png'
        },
        coverImage: '/assets/article_voice_1772120829478.png'
    },
    {
        id: 'web-device-link',
        tag: 'PRODUCT',
        title: 'Web & Device Linked Chat: The Future of Automation',
        summary: 'Sign in from the web, see whether your NORTHERN device is online, and queue messages when it is offline.',
        date: 'February 28, 2026',
        readTime: '5 min read',
        author: {
            name: 'Jordan K.',
            role: 'Staff Systems Engineer',
            image: '/assets/profile_jordan_1772119787406.png'
        },
        coverImage: '/assets/article_link_1772120848351.png'
    },
    {
        id: 'rust-safety-core',
        tag: 'ENGINEERING',
        title: 'Rust Safety Core v2: 40% Faster Risk Validation',
        summary: 'The governance, idempotency, and audit logging stack rebuilt in Rust. Compile-time safety guarantees eliminate runtime bypass vectors.',
        date: 'February 10, 2026',
        readTime: '12 min read',
        author: {
            name: 'Dr. Priya N.',
            role: 'Head of Security & Trust',
            image: '/assets/profile_priya_1772119824921.png'
        },
        coverImage: '/assets/article_rust_1772120864843.png'
    }
];

export default function NewsPage() {
    return (
        <div
            className="min-h-screen bg-[#000000] text-[#f4f4f5] selection:bg-zinc-800 overflow-x-hidden flex flex-col"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&display=swap');
            `}</style>

            <Navbar title="THE NORTHERN LOG" />

            <div className="pt-32 px-6 max-w-[1200px] mx-auto w-full flex-1 mb-24">
                <main className="flex flex-col">

                    {/* Hero */}
                    <div className="mb-20">
                        <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] font-bold tracking-[0.25em] text-white mb-6 uppercase">
                            News & Engineering
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-8 leading-[1.05]">
                            The NORTHERN Log.
                        </h1>
                        <p className="text-zinc-400 text-lg md:text-xl leading-relaxed max-w-2xl">
                            Engineering deep dives, product updates, and essays on building safe autonomous systems.
                        </p>
                    </div>

                    {/* Articles Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {articles.map((article) => (
                            <Link
                                to={`/news/${article.id}`}
                                key={article.id}
                                className="group flex flex-col h-full bg-[#0a0a0a] border border-zinc-800 rounded-3xl overflow-hidden hover:border-zinc-600 transition-all duration-300"
                            >
                                {/* Cover Image */}
                                <div className="w-full aspect-[16/10] overflow-hidden relative border-b border-zinc-800">
                                    <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur px-3 py-1 rounded text-[10px] font-bold tracking-[0.2em] text-white border border-white/10 uppercase">
                                        {article.tag}
                                    </div>
                                    <img
                                        src={article.coverImage}
                                        alt={article.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                    />
                                </div>

                                {/* Content */}
                                <div className="p-6 md:p-8 flex flex-col flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="text-xs text-zinc-500 font-medium">
                                            {article.date}
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-zinc-500">
                                            <Clock className="w-3 h-3" />
                                            {article.readTime}
                                        </div>
                                    </div>

                                    <h3 className="text-xl md:text-2xl font-bold text-white mb-3 leading-snug group-hover:text-zinc-300 transition-colors">
                                        {article.title}
                                    </h3>

                                    <p className="text-sm text-zinc-400 leading-relaxed mb-8 flex-1">
                                        {article.summary}
                                    </p>

                                    {/* Author Profile Footer */}
                                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-zinc-800/50">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={article.author.image}
                                                alt={article.author.name}
                                                className="w-8 h-8 rounded-full object-cover border border-zinc-700 filter grayscale"
                                            />
                                            <div>
                                                <div className="text-xs font-semibold text-white">{article.author.name}</div>
                                                <div className="text-[10px] text-zinc-500">{article.author.role}</div>
                                            </div>
                                        </div>
                                        <ArrowUpRight className="w-5 h-5 text-zinc-600 group-hover:text-white transition-colors" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                </main>
            </div>

            <Footer />
        </div>
    );
}
