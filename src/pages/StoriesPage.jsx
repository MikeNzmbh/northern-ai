import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowUpRight, Mail, Search, FileText, GitPullRequest, Users, Zap, Clock, CheckCircle } from 'lucide-react';

// ─── Story Data ───────────────────────────────────────────────────────────────
const stories = [
    {
        id: 'outreach',
        tag: 'SALES & OUTREACH',
        icon: Mail,
        accentColor: '#ffffff',
        image: '/assets/profile_marcus_1772119747161.png',
        quote: '"Closed 3 new clients in a week. NORTHERN sent 400 personalised emails while I slept."',
        name: 'Marcus T.',
        role: 'Freelance Marketing Consultant',
        narrative: `Marcus built a list of 400 SMBs from LinkedIn and Google Maps. He wrote one template, defined his service, and told NORTHERN to personalise each email with the company name, industry, and a specific pain point. NORTHERN drafted every email, held them for his 10-minute review, then sent the approved batch overnight. Three replied with budgets. None felt templated.`,
        steps: [
            { label: 'Prospect list ingested', detail: '400 companies from LinkedIn + Google Maps' },
            { label: 'Emails personalised per lead', detail: 'Company name, niche, pain point auto-inserted' },
            { label: 'Batch reviewed & approved', detail: '10-minute review before any send' },
            { label: 'Replies with budgets received', detail: '3 leads → 3 contracts' },
        ],
        stats: [
            { label: 'Emails sent', value: '400' },
            { label: 'Time spent by Marcus', value: '25 min' },
            { label: 'Signed contracts', value: '3' },
        ],
    },
    {
        id: 'talent',
        tag: 'TALENT SCOUTING',
        icon: Search,
        accentColor: '#e4e4e7',
        image: '/assets/profile_sofia_1772119766138.png',
        quote: '"I needed a wedding photographer in 48 hours. NORTHERN found 12, pitched them my vision, and booked one by morning."',
        name: 'Sofia R.',
        role: 'Events Director',
        narrative: `Sofia described her aesthetic — golden hour, film grain, candid moments — and gave NORTHERN access to Instagram and X search. It scanned public profiles, filtered by style, follower count, location, and availability signals, then drafted 12 personalised DMs with event details and budget range. It waited for her approval on each message before sending. By morning she had 4 replies and a confirmed booking.`,
        steps: [
            { label: 'Aesthetic brief written', detail: 'Film grain, golden hour, candid style' },
            { label: 'Profiles scanned', detail: 'Instagram & X filtered by style + location' },
            { label: 'Shortlist curated', detail: '84 profiles → 12 matches' },
            { label: 'Personalised DMs drafted & sent', detail: 'One approval round, then sent' },
        ],
        stats: [
            { label: 'Profiles scanned', value: '84' },
            { label: 'Strong matches', value: '12' },
            { label: 'Hours to booking', value: '11' },
        ],
    },
    {
        id: 'jobs',
        tag: 'JOB HUNTING',
        icon: FileText,
        accentColor: '#d4d4d8',
        image: '/assets/profile_jordan_1772119787406.png',
        quote: '"I applied to 60 jobs in one afternoon. Each application had a tailored cover letter that actually referenced the role."',
        name: 'Jordan K.',
        role: 'Product Designer',
        narrative: `Jordan uploaded their CV, defined their ideal role, and gave NORTHERN a target list of 60 job listings. For each one, NORTHERN read the JD, tailored the cover letter to reflect the specific team, product, and language used in the posting, then filled the application form or drafted the email. Jordan reviewed each in batches of 10, approved, and moved on. Final callback rate: 18%.`,
        steps: [
            { label: 'CV and target roles defined', detail: 'Product design, 0–5 years, remote' },
            { label: 'JDs analysed per listing', detail: 'Skills, tone, team focus extracted' },
            { label: 'Cover letters tailored', detail: 'Each references role-specific language' },
            { label: 'Applications submitted', detail: 'Reviewed in batches of 10' },
        ],
        stats: [
            { label: 'Applications sent', value: '60' },
            { label: 'Callback rate', value: '18%' },
            { label: 'Time spent', value: '90 min' },
        ],
    },
    {
        id: 'devteam',
        tag: 'ENGINEERING',
        icon: GitPullRequest,
        accentColor: '#a1a1aa',
        image: '/assets/profile_anya_1772119806143.png',
        quote: '"NORTHERN opened 12 pull requests on Monday morning. By Tuesday our backlog was half-empty."',
        name: 'Anya M.',
        role: 'Solo indie developer',
        narrative: `Anya runs a SaaS product alone. She pointed NORTHERN at her GitHub repo with 50 open issues labelled "good first fix" and "refactor." NORTHERN analysed each issue, wrote the code change, opened a draft PR with a description, added tests where applicable, and flagged only the two it was uncertain about for human review. By end of day, Anya had reviewed and merged 9 PRs — like having a junior dev team come in mid-sprint.`,
        steps: [
            { label: 'GitHub issues analysed', detail: '50 open issues, filtered by label' },
            { label: 'Code changes written', detail: 'Fix, refactor, or test added per issue' },
            { label: 'Draft PRs opened', detail: '12 PRs with descriptions and tests' },
            { label: 'Human review requested', detail: 'Only 2 flagged as uncertain' },
        ],
        stats: [
            { label: 'PRs opened', value: '12' },
            { label: 'PRs merged day-of', value: '9' },
            { label: 'Issues flagged', value: '2' },
        ],
    },
    {
        id: 'research',
        tag: 'RESEARCH & ANALYSIS',
        icon: Zap,
        accentColor: '#f4f4f5',
        image: '/assets/profile_priya_1772119824921.png',
        quote: '"I wake up to a brief every morning. NORTHERN reads 30 sources, pulls what matters, and I\'m caught up in 5 minutes."',
        name: 'Dr. Priya N.',
        role: 'Independent Research Analyst',
        narrative: `Priya covers fintech and emerging markets. She configured a morning workflow: NORTHERN pulls from 30 sources — newsletters, journals, X threads, earnings calls — extracts what's relevant to her coverage areas, clusters it by theme, and delivers a clean brief with source links before 7am. What used to take her two hours now takes five minutes to consume.`,
        steps: [
            { label: 'Sources configured', detail: '30 feeds: newsletters, X, journals' },
            { label: 'Content filtered by relevance', detail: 'Matches her coverage areas' },
            { label: 'Brief compiled by theme', detail: 'Clustered, de-duplicated, citations' },
            { label: 'Delivered before 7am', detail: 'Zero tab juggling required' },
        ],
        stats: [
            { label: 'Sources monitored', value: '30' },
            { label: 'Time to read', value: '5 min' },
            { label: 'Hours saved/wk', value: '10+' },
        ],
    },
];

// ─── Featured Story (hero card) ───────────────────────────────────────────────
function HeroStoryCard({ story }) {
    const Icon = story.icon;
    return (
        <div className="mb-8 p-8 md:p-12 border border-zinc-800 bg-[#080808] rounded-3xl hover:border-zinc-700 transition-all duration-300 group">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                {/* Left */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: story.accentColor + '22', border: `1px solid ${story.accentColor}44` }}>
                            <Icon className="w-4 h-4" style={{ color: story.accentColor }} />
                        </div>
                        <span className="text-[10px] font-bold tracking-[0.25em] text-zinc-500">{story.tag}</span>
                    </div>

                    <blockquote className="text-2xl md:text-3xl font-light text-white leading-tight tracking-tight">
                        {story.quote}
                    </blockquote>

                    <div className="flex items-center gap-3 pt-2">
                        <img src={story.image} alt={story.name} className="w-8 h-8 rounded-full object-cover border border-zinc-700 filter grayscale" />
                        <div>
                            <div className="text-sm font-medium text-white">{story.name}</div>
                            <div className="text-xs text-zinc-500">{story.role}</div>
                        </div>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-4 pt-6 border-t border-zinc-800">
                        {story.stats.map((s) => (
                            <div key={s.label}>
                                <div className="text-2xl font-semibold text-white mb-0.5" style={{ color: story.accentColor }}>{s.value}</div>
                                <div className="text-[10px] font-bold tracking-[0.18em] text-zinc-500 uppercase">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: narrative + steps */}
                <div className="lg:col-span-7 flex flex-col gap-5">
                    <p className="text-zinc-400 leading-relaxed text-base">{story.narrative}</p>

                    <div className="bg-[#0d0d0d] border border-zinc-800 rounded-2xl p-6 flex flex-col gap-4">
                        <div className="text-[10px] font-bold tracking-[0.25em] text-zinc-600 mb-1">HOW IT HAPPENED</div>
                        {story.steps.map((step, i) => (
                            <div key={i} className="flex items-start gap-4">
                                <div className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: story.accentColor + '33', border: `1px solid ${story.accentColor}55` }}>
                                    <span className="text-[9px] font-bold" style={{ color: story.accentColor }}>{i + 1}</span>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-white">{step.label}</div>
                                    <div className="text-xs text-zinc-500 mt-0.5">{step.detail}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Compact Story Card ───────────────────────────────────────────────────────
function StoryCard({ story }) {
    const Icon = story.icon;
    return (
        <div className="p-8 border border-zinc-800 bg-[#080808] rounded-3xl hover:border-zinc-700 transition-all duration-300 flex flex-col gap-6 group">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: story.accentColor + '22', border: `1px solid ${story.accentColor}44` }}>
                    <Icon className="w-4 h-4" style={{ color: story.accentColor }} />
                </div>
                <span className="text-[10px] font-bold tracking-[0.25em] text-zinc-500">{story.tag}</span>
            </div>

            <blockquote className="text-xl md:text-2xl font-light text-white leading-snug tracking-tight flex-1">
                {story.quote}
            </blockquote>

            <div className="flex items-center gap-3">
                <img src={story.image} alt={story.name} className="w-7 h-7 rounded-full object-cover border border-zinc-700 filter grayscale" />
                <div>
                    <div className="text-sm font-medium text-white">{story.name}</div>
                    <div className="text-[11px] text-zinc-500">{story.role}</div>
                </div>
            </div>

            {/* Steps condensed */}
            <div className="border-t border-zinc-800 pt-5 flex flex-col gap-3">
                {story.steps.map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: story.accentColor }} />
                        <span className="text-xs text-zinc-400"><span className="text-zinc-200 font-medium">{step.label}</span> — {step.detail}</span>
                    </div>
                ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-zinc-800">
                {story.stats.map((s) => (
                    <div key={s.label}>
                        <div className="text-lg font-semibold mb-0.5" style={{ color: story.accentColor }}>{s.value}</div>
                        <div className="text-[9px] font-bold tracking-[0.15em] text-zinc-600 uppercase leading-tight">{s.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function StoriesPage() {
    const [hero] = useState(stories[0]);
    const rest = stories.slice(1);

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

                    {/* ── Hero Header ─────────────────────────────────────── */}
                    <div className="max-w-3xl mb-16">
                        <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] font-bold tracking-[0.25em] text-white mb-6">
                            REAL THINGS PEOPLE BUILT
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.05]">
                            NORTHERN at work.
                        </h1>
                        <p className="text-zinc-400 text-lg md:text-xl leading-relaxed max-w-2xl">
                            Not demos. Not benchmarks. Real outcomes from people who handed NORTHERN the boring, repetitive, high-effort work — and got their time back.
                        </p>
                    </div>

                    {/* ── Featured Story ─────────────────────────────────── */}
                    <HeroStoryCard story={hero} />

                    {/* ── 2-column grid ──────────────────────────────────── */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {rest.slice(0, 2).map((s) => <StoryCard key={s.id} story={s} />)}
                    </div>

                    {/* ── Bottom row ─────────────────────────────────────── */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                        {rest.slice(2).map((s) => <StoryCard key={s.id} story={s} />)}
                    </div>

                    {/* ── CTA Banner ─────────────────────────────────────── */}
                    <div className="p-10 md:p-14 border border-zinc-800 bg-[#080808] rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <p className="text-zinc-500 text-xs font-bold tracking-[0.2em] uppercase mb-3">YOUR TURN</p>
                            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">What will you delegate first?</h2>
                            <p className="text-zinc-400 max-w-xl leading-relaxed">
                                Everything above started with someone describing a task in plain language. NORTHERN handles the execution — you handle the decisions that matter.
                            </p>
                        </div>
                        <div className="shrink-0">
                            <a
                                href="/chat"
                                className="flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full text-sm font-semibold hover:bg-zinc-100 transition-colors group whitespace-nowrap"
                            >
                                Start for free
                                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </a>
                        </div>
                    </div>

                </main>
            </div>

            <Footer />
        </div>
    );
}
