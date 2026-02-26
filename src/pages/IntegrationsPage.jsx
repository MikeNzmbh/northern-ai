import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// All logo SVGs live in /public/logos/ — served locally, no CDN dependency
const L = (file) => `/logos/${file}`;

const apps = [
    // Collaboration
    { name: 'Slack', category: 'Collaboration', logo: L('slack.svg') },
    { name: 'Notion', category: 'Collaboration', logo: L('notion.svg') },
    { name: 'Jira', category: 'Dev Tools', logo: L('jira.svg') },
    { name: 'Linear', category: 'Dev Tools', logo: L('linear.svg') },
    // File Sharing
    { name: 'Google Drive', category: 'File Sharing', logo: L('googledrive.svg') },
    { name: 'Dropbox', category: 'File Sharing', logo: L('dropbox.svg') },
    { name: 'OneDrive', category: 'File Sharing', logo: L('microsoftonedrive.svg') },
    // Dev Tools
    { name: 'GitHub', category: 'Dev Tools', logo: L('github.svg') },
    { name: 'GitLab', category: 'Dev Tools', logo: L('gitlab.svg') },
    { name: 'VS Code', category: 'Dev Tools', logo: L('visualstudiocode.svg') },
    // Data
    { name: 'PostgreSQL', category: 'Data', logo: L('postgresql.svg') },
    { name: 'Supabase', category: 'Data', logo: L('supabase.svg') },
    { name: 'MongoDB', category: 'Data', logo: L('mongodb.svg') },
    // AI models
    { name: 'OpenAI', category: 'AI', logo: L('openai.svg') },
    { name: 'Google Gemini', category: 'AI', logo: L('googlegemini.svg') },
    { name: 'AWS', category: 'Data', logo: L('amazonwebservices.svg') },
];

const categories = ['All Platforms', 'Collaboration', 'File Sharing', 'Dev Tools', 'Data', 'AI'];

export default function IntegrationsPage() {
    const [active, setActive] = React.useState('All Platforms');
    const visible = active === 'All Platforms' ? apps : apps.filter(a => a.category === active);

    return (
        <div
            className="min-h-screen bg-[#000000] text-[#f4f4f5] selection:bg-zinc-800 overflow-x-hidden flex flex-col"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&display=swap');
                .logo-img {
                    width: 36px;
                    height: 36px;
                    object-fit: contain;
                    transition: transform 0.25s ease;
                    display: block;
                }
                .int-card:hover .logo-img { transform: scale(1.1); }
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
                            NORTHERN connects to the tools you already use — like Slack, GitHub, Drive, and Notion — so you can work from one place instead of jumping between tabs.
                        </p>
                    </div>

                    {/* Category filter */}
                    <div className="mb-12 border-b border-zinc-800">
                        <div className="flex gap-8 overflow-x-auto pb-4 text-xs font-bold tracking-[0.1em] uppercase">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActive(cat)}
                                    className={`whitespace-nowrap pb-2 transition-colors ${active === cat
                                            ? 'text-white border-b-2 border-white'
                                            : 'text-zinc-500 hover:text-zinc-300'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Integration cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 mb-24">
                        {visible.map(app => (
                            <div
                                key={app.name}
                                className="int-card group flex flex-col items-center justify-center gap-4 p-6 rounded-2xl bg-white hover:bg-zinc-50 border border-zinc-200 hover:border-zinc-300 transition-all cursor-pointer shadow-sm hover:shadow-md"
                            >
                                <div className="w-16 h-16 rounded-xl flex items-center justify-center bg-zinc-50 border border-zinc-100 shadow-sm">
                                    <img
                                        src={app.logo}
                                        alt={`${app.name} logo`}
                                        className="logo-img"
                                        loading="lazy"
                                    />
                                </div>
                                <span className="text-sm font-semibold text-zinc-900 text-center leading-snug">
                                    {app.name}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Coming Soon banner */}
                    <div className="max-w-4xl border border-zinc-800 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.05),transparent_50%)] bg-[#0a0a0a] rounded-3xl p-12 relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="inline-block px-3 py-1 bg-white/10 text-white rounded-full text-[10px] font-bold tracking-[0.2em] mb-6">
                                IN DEVELOPMENT · Q2 2026
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-snug">
                                Native Slack &amp; Notion integrations arriving Q2 2026.
                            </h2>
                            <p className="text-zinc-400 text-lg max-w-2xl leading-relaxed">
                                Get updates in Slack and send summaries to Notion. NORTHERN is built to fit into your existing workflow.
                            </p>
                        </div>
                    </div>

                </main>
            </div>

            <Footer />
        </div>
    );
}
