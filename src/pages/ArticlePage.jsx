import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Share2, Twitter, Linkedin, Link as LinkIcon } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Use same article data structure as NewsPage
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

export default function ArticlePage() {
    const { id } = useParams();
    const article = articles.find(a => a.id === id) || articles[0]; // Fallback to first if not found

    return (
        <div
            className="min-h-screen bg-[#000000] text-[#f4f4f5] selection:bg-zinc-800 overflow-x-hidden flex flex-col"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&display=swap');
                
                .article-body p { margin-bottom: 1.5rem; line-height: 1.8; color: #a1a1aa; }
                .article-body h2 { font-size: 1.875rem; font-weight: 700; color: #ffffff; margin-top: 3rem; margin-bottom: 1.5rem; letter-spacing: -0.025em; }
                .article-body h3 { font-size: 1.25rem; font-weight: bold; color: #e4e4e7; margin-top: 2rem; margin-bottom: 1rem; }
                .article-body blockquote { border-left: 2px solid #3f3f46; padding-left: 1.5rem; margin: 2rem 0; font-size: 1.25rem; font-style: italic; color: #e4e4e7; }
                .article-body ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 2rem; color: #a1a1aa; }
                .article-body li { margin-bottom: 0.5rem; }
            `}</style>

            <Navbar title="THE NORTHERN LOG" />

            <div className="pt-32 px-6 max-w-[800px] mx-auto w-full flex-1 mb-32">
                <main className="flex flex-col">

                    {/* Back link */}
                    <div className="mb-12">
                        <Link to="/news" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors group">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to all articles
                        </Link>
                    </div>

                    {/* Article Header */}
                    <header className="flex flex-col gap-6 mb-12">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold tracking-[0.25em] text-white bg-zinc-800 px-3 py-1 rounded-md">
                                {article.tag}
                            </span>
                            <span className="text-zinc-500 text-sm flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                {article.readTime}
                            </span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] text-white">
                            {article.title}
                        </h1>

                        <p className="text-xl text-zinc-400 leading-relaxed font-light">
                            {article.summary}
                        </p>

                        <div className="flex flex-wrap items-center justify-between gap-4 py-6 border-y border-zinc-800 mt-4">
                            <div className="flex items-center gap-4">
                                <img src={article.author.image} alt={article.author.name} className="w-12 h-12 rounded-full object-cover border border-zinc-700 filter grayscale" />
                                <div>
                                    <div className="text-base font-medium text-white">{article.author.name}</div>
                                    <div className="text-sm text-zinc-500">{article.author.role}</div>
                                </div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-zinc-300">{article.date}</div>
                                <div className="flex items-center gap-3 mt-2 text-zinc-500">
                                    <button className="hover:text-white transition-colors"><Twitter className="w-4 h-4" /></button>
                                    <button className="hover:text-white transition-colors"><Linkedin className="w-4 h-4" /></button>
                                    <button className="hover:text-white transition-colors"><LinkIcon className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Article Cover Image */}
                    <div className="w-full aspect-[21/9] rounded-2xl overflow-hidden mb-16 border border-zinc-800 bg-zinc-900">
                        <img src={article.coverImage} alt="Cover" className="w-full h-full object-cover" />
                    </div>

                    {/* Article Body (Simulated Content) */}
                    <article className="article-body">
                        <p>
                            The landscape of automated systems requires absolute precision when bridging the gap between intent and execution. For years, the industry consensus was to heavily centralize trust models. We're changing that.
                        </p>
                        <p>
                            When building NORTHERN, our primary objective wasn't simply speed or scale—it was <strong>verifiable autonomy</strong>. The realization that an agent is only as useful as the trust you place in it drove the core architectural decisions discussed in this report. Let's break down the technical pivot.
                        </p>

                        <h2>The Fallacy of the Runtime Check</h2>
                        <p>
                            Most LLM wrappers rely on post-generation filtering. The model outputs a payload, and a python script validates it before execution. The issue? Dynamic languages provide too many avenues for runtime mutation.
                        </p>
                        <blockquote>
                            "You cannot bolt security onto an agent after it has decided to act. The constraints must exist at the compiler level."
                        </blockquote>
                        <p>
                            By moving our core governance stack out of a dynamic environment and into Rust, we achieved two immediate gains:
                        </p>
                        <ul>
                            <li><strong>Memory Safety by Default:</strong> Buffer overflows and unexpected memory mutations in the execution queue dropped to zero.</li>
                            <li><strong>Type-Driven Constraints:</strong> Action payloads are strictly typed. If an action does not match the static signature of a safe operation, it simply will not compile into the queue.</li>
                        </ul>

                        <h2>Latency vs. Integrity</h2>
                        <p>
                            A common counterargument to rigorous pre-execution validation is latency. However, our benchmarks show that by leveraging Rust's zero-cost abstractions, we actually <em>decreased</em> the validation overhead by nearly 40%. The time spent waiting is almost entirely bound by the LLM generation itself, not the safety checks.
                        </p>
                        <p>
                            We implemented a bespoke idempotency key system that hashes the AST of the proposed action. If the exact same semantic action was attempted and failed a safety check within the last hour, it is blocked at the edge router—before hitting the Rust core.
                        </p>

                        <h2>Looking Ahead to Next Quarter</h2>
                        <p>
                            The foundation is now laid for what we're calling <em>Contextual Thresholds</em>. Soon, the system won't just ask "is this safe?" but rather "is this safe <em>for this user</em> in <em>this specific repository</em>?".
                        </p>
                        <p>
                            Stay tuned as we roll out the enterprise RBAC features built directly on top of this new core engine.
                        </p>
                    </article>

                    {/* Footer Share */}
                    <div className="mt-16 pt-8 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-4">
                        <div className="text-zinc-400 font-medium">Share this article</div>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-700 bg-zinc-900 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors">
                                <Twitter className="w-4 h-4" /> Twitter
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-700 bg-zinc-900 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors">
                                <Share2 className="w-4 h-4" /> Copy Link
                            </button>
                        </div>
                    </div>

                </main>
            </div>
            <Footer />
        </div>
    );
}
