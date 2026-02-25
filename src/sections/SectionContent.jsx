import React from 'react';
import {
    ChevronDown,
    Gamepad2,
    FileText,
    Folder,
    ArrowUpRight,
    Bot,
} from 'lucide-react';

// ─── Tokens ───────────────────────────────────────────────────────────────────
const WRAP = 'w-full px-6 md:px-16 lg:px-24 pb-48 max-w-[1600px] mx-auto';
const WHITE = '#ffffff';
const LIGHT = '#e7e5e4';

// ─── Primitives ───────────────────────────────────────────────────────────────
const Pill = ({ children }) => (
    <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.25em', color: WHITE, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', padding: '6px 14px', fontFamily: 'inherit', display: 'inline-block', borderRadius: '4px' }}>
        {children.toUpperCase()}
    </span>
);

const H1 = ({ children }) => (
    <h2 style={{ fontSize: 'clamp(3rem, 7vw, 6.5rem)', fontWeight: 300, color: WHITE, lineHeight: 1.05, letterSpacing: '-0.04em', margin: '0 0 2rem 0', maxWidth: '1200px' }}>
        {children}
    </h2>
);

const Lead = ({ children }) => (
    <p style={{ fontSize: 'clamp(1.2rem, 2vw, 1.75rem)', fontWeight: 300, color: LIGHT, lineHeight: 1.5, maxWidth: '800px', margin: 0, letterSpacing: '-0.01em' }}>
        {children}
    </p>
);

const Rule = ({ className = "" }) => <div className={className} style={{ borderTop: '1px solid rgba(255,255,255,0.15)', width: '100%' }} />;

const GridFeature = ({ title, desc }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2.5rem 0', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 400, color: WHITE, letterSpacing: '-0.02em', margin: 0 }}>{title}</h3>
        <p style={{ fontSize: '1.1rem', fontWeight: 300, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, margin: 0 }}>{desc}</p>
    </div>
);

const MassiveStat = ({ n, label }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ fontSize: 'clamp(4rem, 8vw, 7rem)', fontWeight: 300, color: WHITE, letterSpacing: '-0.04em', lineHeight: 1 }}>{n}</div>
        <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.5)', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>{label.toUpperCase()}</div>
    </div>
);

const MinimalCard = ({ children, style = {} }) => (
    <div style={{
        border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)', padding: '3rem', borderRadius: '8px',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)', ...style,
    }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}>
        {children}
    </div>
);

const PricingCard = ({ tier, price, period, primary, features, cta, note }) => (
    <div style={{
        border: primary ? '2px solid rgba(255,255,255,0.4)' : '1px solid rgba(255,255,255,0.15)',
        background: primary ? 'rgba(255,255,255,0.04)' : 'transparent',
        borderRadius: '8px', padding: '3rem', display: 'flex', flexDirection: 'column', gap: '1.5rem',
    }}>
        {primary && <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.25em', color: WHITE }}>RECOMMENDED</div>}
        <div>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.5)', marginBottom: '0.75rem' }}>{tier.toUpperCase()}</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.3rem' }}>
                <span style={{ fontSize: 'clamp(3rem, 5vw, 4rem)', fontWeight: 300, color: WHITE, letterSpacing: '-0.04em', lineHeight: 1 }}>{price}</span>
                {period && <span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)', paddingBottom: '6px' }}>{period}</span>}
            </div>
        </div>
        {note && <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>{note}</div>}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '1.5rem' }}>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', margin: 0, padding: 0, listStyle: 'none' }}>
                {features.map((f, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '1rem', color: WHITE, lineHeight: 1.5 }}>
                        <span style={{ color: 'rgba(255,255,255,0.35)', flexShrink: 0, marginTop: '2px' }}>&#10003;</span>
                        <span>{f}</span>
                    </li>
                ))}
            </ul>
        </div>
        <button style={{
            width: '100%', padding: '1.125rem', fontSize: '12px', fontWeight: 700, letterSpacing: '0.15em', fontFamily: 'inherit', cursor: 'pointer',
            background: primary ? WHITE : 'transparent', color: primary ? '#000' : WHITE,
            border: primary ? 'none' : '1px solid rgba(255,255,255,0.3)',
            borderRadius: '4px', marginTop: 'auto',
        }}>
            {cta.toUpperCase()}
        </button>
    </div>
);

const DonateCard = ({ message }) => (
    <div style={{
        border: '2px dashed rgba(255,255,255,0.2)', borderRadius: '8px', padding: '3rem',
        display: 'flex', flexDirection: 'column', gap: '1.5rem', justifyContent: 'space-between',
    }}>
        <div>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.25em', color: 'rgba(255,255,255,0.5)', marginBottom: '1rem' }}>OPEN PROTOCOL</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 300, color: WHITE, lineHeight: 1.3, marginBottom: '1rem' }}>Keep TARS open-source.</div>
            <div style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{message}</div>
        </div>
        <button style={{ width: '100%', padding: '1.125rem', fontSize: '12px', fontWeight: 700, letterSpacing: '0.15em', fontFamily: 'inherit', cursor: 'pointer', background: 'transparent', color: WHITE, border: '1px solid rgba(255,255,255,0.35)', borderRadius: '4px' }}>
            DONATE TO PROTOCOL
        </button>
    </div>
);

// ════════════════════════════════════════════════════════════════════════════════
// FOR BUSINESS — Governed autonomy for operators
// ════════════════════════════════════════════════════════════════════════════════
export const BusinessSection = () => {
    const workItems = [
        ['Build a lead routing app', '1h'],
        ['Analyze campaign ROI', '1h'],
        ['Model ARR impact', '13h'],
        ['Create launch assets', '5d'],
    ];

    const featureCards = [
        {
            title: 'TARS Chat for Business',
            description: 'Empower your entire workforce with frontier AI.',
            bullets: [
                <>
                    Boost productivity with our{' '}
                    <span className="text-white border-b border-zinc-600 group-hover:border-white transition-colors">
                        Business and Enterprise plans.
                    </span>
                </>,
                'Unlimited chats and access to advanced models, tools, and custom data analysis.',
            ],
        },
        {
            title: 'API Platform',
            description: 'Create AI applications, experiences, and automated operations.',
            bullets: [
                <>
                    The fastest, most powerful{' '}
                    <span className="text-white border-b border-zinc-600 group-hover:border-white transition-colors">
                        API platform
                    </span>{' '}
                    for building AI products.
                </>,
                'Frontier models that think longer, ideal for complex, multi-step reasoning tasks.',
            ],
        },
    ];

    return (
        <div className={WRAP}>
            <div className="flex flex-col xl:flex-row gap-16 xl:gap-8 items-start justify-between mb-24 pt-6 md:pt-10">
                <div className="max-w-xl flex-1">
                    <p className="text-zinc-400 text-sm font-semibold tracking-wide uppercase mb-4">
                        The next era of work is here
                    </p>
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.08] text-white">
                        Create, code, and innovate with TARS tools and APIs
                    </h2>
                    <p className="text-zinc-400 text-base md:text-lg mb-10 leading-relaxed max-w-md">
                        TARS-1 is our smartest, most accurate model, delivering results your business can trust.
                    </p>

                    <div className="flex flex-wrap items-center gap-4">
                        <a
                            href="/chat"
                            className="bg-white text-black px-5 py-2.5 rounded-full font-medium hover:bg-zinc-200 transition-colors flex items-center gap-2 group"
                        >
                            Try for free
                            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </a>
                        <a
                            href="mailto:sales@tars.ai"
                            className="bg-zinc-900 border border-zinc-800 text-white px-5 py-2.5 rounded-full font-medium hover:bg-zinc-800 transition-colors"
                        >
                            Contact sales
                        </a>
                    </div>
                </div>

                <div className="w-full xl:w-[600px] xl:shrink-0 relative">
                    <div className="w-full aspect-square md:aspect-[4/3] rounded-[2rem] bg-gradient-to-br from-[#cce0ff] via-[#e8f0fe] to-[#e6ccff] p-4 md:p-8 relative overflow-visible">
                        <div className="relative w-full h-full flex items-center justify-center">
                            <div className="bg-white w-full h-full rounded-[1.5rem] shadow-2xl flex flex-col justify-center items-center p-6 relative overflow-hidden">
                                <div className="flex flex-col items-center mb-8">
                                    <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mb-4">
                                        <Bot className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-black text-2xl font-semibold mb-1">Let&apos;s build</h3>
                                    <button
                                        type="button"
                                        className="text-zinc-500 font-medium flex items-center gap-1 hover:text-black transition-colors"
                                    >
                                        TARS World <ChevronDown className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-md mb-8">
                                    <div className="border border-zinc-200 rounded-xl p-4 flex flex-col items-start gap-2 hover:bg-zinc-50 cursor-pointer transition-colors">
                                        <Gamepad2 className="w-5 h-5 text-blue-500" />
                                        <p className="text-black text-sm font-medium leading-tight">
                                            Build a classic Snake game in this repo.
                                        </p>
                                    </div>
                                    <div className="border border-zinc-200 rounded-xl p-4 flex flex-col items-start gap-2 hover:bg-zinc-50 cursor-pointer transition-colors">
                                        <FileText className="w-5 h-5 text-purple-500" />
                                        <p className="text-black text-sm font-medium leading-tight">
                                            Create a one-page PDF that summarizes this app.
                                        </p>
                                    </div>
                                </div>

                                <div className="w-full max-w-md border border-zinc-200 rounded-full px-4 py-3 flex items-center text-zinc-400 text-sm">
                                    Ask TARS anything, @ to add files, / for commands
                                </div>

                                <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-purple-500/10 to-transparent rounded-b-[1.5rem] pointer-events-none" />
                            </div>

                            <div className="hidden md:block absolute left-3 lg:-left-10 bottom-8 lg:bottom-12 bg-[#fafafa] border border-zinc-200 rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] w-72 overflow-hidden z-10">
                                <div className="px-4 py-3 border-b border-zinc-100 flex items-center gap-2 text-zinc-600 font-medium text-sm">
                                    <Folder className="w-4 h-4" /> TARS Work
                                </div>
                                <div className="p-2 flex flex-col text-sm">
                                    {workItems.map(([label, time]) => (
                                        <div
                                            key={label}
                                            className="flex items-center justify-between px-3 py-2 hover:bg-zinc-100 rounded-lg cursor-pointer text-black transition-colors"
                                        >
                                            <span>{label}</span>
                                            <span className="text-zinc-400">{time}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                {featureCards.map((card) => (
                    <div
                        key={card.title}
                        className="border border-zinc-800 bg-[#0a0a0a] rounded-2xl p-8 hover:border-zinc-700 transition-colors cursor-pointer group"
                    >
                        <h3 className="text-2xl font-semibold mb-4 text-white">{card.title}</h3>
                        <p className="text-zinc-400 mb-6">{card.description}</p>
                        <ul className="space-y-3">
                            {card.bullets.map((bullet, index) => (
                                <li key={`${card.title}-${index}`} className="flex items-start gap-3 text-sm text-zinc-300">
                                    <span className="mt-1.5 w-1 h-1 rounded-full bg-white shrink-0" />
                                    <p>{bullet}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ════════════════════════════════════════════════════════════════════════════════
// FOR INDIVIDUALS — Operator-grade personal AI
// ════════════════════════════════════════════════════════════════════════════════
export const IndividualsSection = () => (
    <div className={WRAP}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '8rem', paddingTop: '4rem' }}>
            <div><Pill>PERSONAL RUNTIME</Pill></div>
            <H1>Run real work. Not just questions.</H1>
            <Lead>
                TARS is not a chatbot. It is an <strong style={{ color: WHITE, fontWeight: 400 }}>operator-grade AI runtime</strong> that combines chat, tools, governance, and autonomous workflows. Give it a task, approve the gate, and let 9 specialized agents execute safely while you focus on what matters.
            </Lead>
        </div>

        <div style={{ marginBottom: '2rem' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.3em', color: LIGHT, marginBottom: '2.5rem' }}>FIRST ACTION IN UNDER 3 MINUTES</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0', borderTop: '1px solid rgba(255,255,255,0.15)', marginBottom: '8rem' }}>
            {[
                {
                    title: 'Total Recall',
                    desc: 'Every conversation, every context — stored locally and instantly searchable. Ask what was discussed three weeks ago and get a cited, accurate answer in milliseconds. Nothing is ever lost or hallucinated.',
                },
                {
                    title: 'Autonomous Workflows',
                    desc: 'Describe an intent. TARS routes it across its 9 specialist agents, pauses at an approval gate, and executes. Email triage, GitHub issue resolution, research briefs — handled end-to-end without you babysitting each step.',
                },
                {
                    title: 'Human-In-The-Loop by Default',
                    desc: 'TARS will not send, deploy, commit, or change anything without your thumbprint approval. The Human-In-The-Loop gate is not optional. It is architecturally enforced at the runtime level.',
                },
                {
                    title: 'Model-Agnostic',
                    desc: 'OpenAI, DeepSeek, Gemini, or fully local models — TARS routes each task to the right provider automatically. No model lock-in. No data sent to cloud APIs if you choose local.',
                },
                {
                    title: 'Desktop-First, Browser Fallback',
                    desc: 'Install the native Tauri desktop client and get the full runtime experience. If you prefer not to install, the browser client gives you the same interface with a managed backend. Your choice.',
                },
            ].map((feature, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) 2fr', gap: '4rem', padding: '4rem 0', borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
                    <h3 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300, color: WHITE, lineHeight: 1.1, margin: 0, letterSpacing: '-0.02em' }}>{feature.title}</h3>
                    <p style={{ fontSize: '1.25rem', fontWeight: 300, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, margin: 0, maxWidth: '600px', alignSelf: 'center' }}>{feature.desc}</p>
                </div>
            ))}
        </div>

        {/* Pricing */}
        <Rule className="mb-16" />
        <div>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.3em', color: LIGHT, marginBottom: '2.5rem' }}>PRICING</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', maxWidth: '1100px' }}>
                <PricingCard
                    tier="Student"
                    price="Free"
                    period=""
                    note="We believe students deserve access to real AI infrastructure, not toy demos. Available to verified students in the US and Canada."
                    features={[
                        'Full conversational and workflow interface',
                        'All 9 specialist agents',
                        'Personality and preferences configuration',
                        'Standard tool and integration access',
                        'Requires verified .edu email — US &amp; Canada',
                    ]}
                    cta="Verify Student Status"
                />
                <PricingCard
                    tier="Operator"
                    price="$5"
                    period="/month"
                    primary
                    note="For individuals who want TARS running reliably, with priority support and the full autonomous workflow stack."
                    features={[
                        'Everything in Student',
                        'Unlimited persistent memory',
                        'Automated daily research and intelligence briefs',
                        'All model routing unlocked (DeepSeek, OpenAI, Gemini)',
                        'Custom workflow and automation builder',
                        'Priority security patches',
                    ]}
                    cta="Start for $5/mo"
                />
                <DonateCard message="Every contribution funds free access for students and researchers. Help keep operator-grade AI infrastructure accessible to those who need it most." />
            </div>
        </div>
    </div>
);

// ════════════════════════════════════════════════════════════════════════════════
// STORIES — Aspirational: what TARS makes possible
// ════════════════════════════════════════════════════════════════════════════════
export const StoriesSection = () => (
    <div className={WRAP}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '8rem', paddingTop: '4rem' }}>
            <div><Pill>WHAT BECOMES POSSIBLE</Pill></div>
            <H1>What operators do with TARS.</H1>
            <Lead>
                These are the workflows TARS is built for. Real use cases from the kinds of operators, developers, and researchers who push the runtime to its limits every day.
            </Lead>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <MinimalCard>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.2rem', color: 'rgba(255,255,255,0.5)' }}>RESEARCH ANALYST</div>
                    <blockquote style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 300, color: WHITE, lineHeight: 1.1, letterSpacing: '-0.02em', margin: 0, maxWidth: '1000px' }}>
                        &#8220;Two hours of my morning back. Every single day.&#8221;
                    </blockquote>
                    <p style={{ fontSize: '1.25rem', fontWeight: 300, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, maxWidth: '700px' }}>
                        TARS&#8217;s RESEARCH_LIBRARIAN and NEWS_SCOUT agents run overnight, digest 12 feeds, and deliver a structured, cited intelligence brief by 8 AM. No tabs. No copy-pasting. Setup in one afternoon.
                    </p>
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem', display: 'flex', gap: '4rem' }}>
                        <div>
                            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>TIME SAVED</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 400, color: WHITE }}>2 hrs/day</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>SETUP TIME</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 400, color: WHITE }}>1 afternoon</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>AGENTS DEPLOYED</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 400, color: WHITE }}>3</div>
                        </div>
                    </div>
                </div>
            </MinimalCard>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 1fr)', gap: '2rem' }}>
                <MinimalCard>
                    <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.2rem', color: 'rgba(255,255,255,0.5)', marginBottom: '1.5rem' }}>TRADING OPERATOR</div>
                    <blockquote style={{ fontSize: '2rem', fontWeight: 300, color: WHITE, lineHeight: 1.2, margin: '0 0 1.5rem 0' }}>
                        &#8220;We updated live risk parameters and the Evidence Gate held. Zero surprises. 48-hour review enforced automatically.&#8221;
                    </blockquote>
                    <p style={{ fontSize: '1rem', fontWeight: 300, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>RISK_GOVERNOR and CHANGE_CONTROL working exactly as designed.</p>
                </MinimalCard>

                <MinimalCard>
                    <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.2rem', color: 'rgba(255,255,255,0.5)', marginBottom: '1.5rem' }}>INDEPENDENT DEVELOPER</div>
                    <blockquote style={{ fontSize: '2rem', fontWeight: 300, color: WHITE, lineHeight: 1.2, margin: '0 0 1.5rem 0' }}>
                        &#8220;I gave TARS a GitHub repo with 50 open issues. It queued 12 PRs for my approval. Like a senior engineer on retainer.&#8221;
                    </blockquote>
                    <p style={{ fontSize: '1rem', fontWeight: 300, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>From triage to pull request in under 10 minutes.</p>
                </MinimalCard>
            </div>

            <MinimalCard>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) 2fr', gap: '4rem' }}>
                    <div>
                        <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.2rem', color: 'rgba(255,255,255,0.5)', marginBottom: '1.5rem' }}>BUSINESS OPERATOR</div>
                        <blockquote style={{ fontSize: '2rem', fontWeight: 300, color: WHITE, lineHeight: 1.2, margin: 0 }}>
                            &#8220;TARS handles our email triage, meeting prep briefs, and outreach queues. My team ships twice as fast.&#8221;
                        </blockquote>
                    </div>
                    <div style={{ alignSelf: 'center' }}>
                        <p style={{ fontSize: '1.25rem', fontWeight: 300, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, maxWidth: '600px' }}>
                            TARS&#8217;s autonomous workflow stack processes incoming requests, categorizes them, drafts responses, and holds them at an approval gate before anything is sent. The operator reviews and hits approve. Nothing goes out unreviewed.
                        </p>
                    </div>
                </div>
            </MinimalCard>
        </div>
    </div>
);

// ════════════════════════════════════════════════════════════════════════════════
// INTEGRATIONS
// ════════════════════════════════════════════════════════════════════════════════
export const IntegrationsSection = () => (
    <div className={WRAP}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '6rem', paddingTop: '4rem', alignItems: 'flex-start', maxWidth: '800px' }}>
            <div><Pill>ECOSYSTEM</Pill></div>
            <H1>Your tools. One runtime.</H1>
            <Lead>
                TARS pulls live context from where you already work &#8212; Slack, GitHub, Drive, Notion &#8212; and routes it through the agent fleet. No copy-pasting between tabs. Analyze, approve, and execute across your entire stack from one interface.
            </Lead>
        </div>

        <div style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', gap: '2rem', overflowX: 'auto', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.15)', fontSize: '13px', color: LIGHT, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                <span style={{ fontWeight: 700, color: WHITE, cursor: 'pointer', borderBottom: '2px solid white', paddingBottom: '0.5rem' }}>All Platforms</span>
                <span style={{ cursor: 'pointer', opacity: 0.5 }}>Collaboration</span>
                <span style={{ cursor: 'pointer', opacity: 0.5 }}>File Sharing</span>
                <span style={{ cursor: 'pointer', opacity: 0.5 }}>Dev Tools</span>
                <span style={{ cursor: 'pointer', opacity: 0.5 }}>Data</span>
            </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
            {[
                { name: 'Google Drive', color: '#0F9D58', initial: 'G' },
                { name: 'Slack', color: '#E01E5A', initial: 'S' },
                { name: 'Notion', color: '#FFFFFF', initial: 'N', darkText: true },
                { name: 'GitHub', color: '#FAFBFC', initial: 'G', darkText: true },
                { name: 'Jira', color: '#0052CC', initial: 'J' },
                { name: 'AWS CloudWatch', color: '#FF9900', initial: 'A' },
                { name: 'PostgreSQL', color: '#336791', initial: 'P' },
                { name: 'Figma', color: '#F24E1E', initial: 'F' },
            ].map(app => (
                <div key={app.name} style={{ display: 'flex', alignItems: 'center', padding: '1.5rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', cursor: 'pointer', transition: 'all 0.3s ease' }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '4px', background: app.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1rem', flexShrink: 0, opacity: 0.9 }}>
                        <span style={{ fontSize: '14px', fontWeight: 800, color: app.darkText ? '#000' : '#fff' }}>{app.initial}</span>
                    </div>
                    <span style={{ fontSize: '1rem', fontWeight: 300, color: WHITE }}>{app.name}</span>
                </div>
            ))}
        </div>

        {/* Coming Soon */}
        <div style={{ marginTop: '4rem', padding: '3rem', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', background: 'rgba(255,255,255,0.01)' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.25em', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>IN DEVELOPMENT · Q2 2026</div>
            <div style={{ fontSize: '2rem', fontWeight: 300, color: WHITE, marginBottom: '1rem' }}>Native Slack &amp; Notion integrations arriving Q2 2026.</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 300, color: 'rgba(255,255,255,0.5)' }}>Receive your morning intelligence brief in Slack. Push research summaries directly to Notion. TARS will live where you already work, not in yet another tab.</div>
        </div>
    </div>
);

// ════════════════════════════════════════════════════════════════════════════════
// NEWS / ROADMAP
// ════════════════════════════════════════════════════════════════════════════════
export const NewsSection = () => (
    <div className={WRAP}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '8rem', paddingTop: '4rem' }}>
            <div><Pill>ROADMAP</Pill></div>
            <H1>What we&#39;re shipping next.</H1>
            <Lead>
                Three near-term bets from the TARS engineering team: web-linked chat presence, broader real-world autonomy, and self-improving agent generation. Here&#39;s where the runtime is heading.
            </Lead>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
            {[
                {
                    tag: 'Q1 2026',
                    status: 'UPCOMING',
                    title: 'Web & Device Linked Chat',
                    body: 'Login with online/offline device presence and queued message delivery. TARS stays connected across your devices so nothing falls through the cracks — even when you\'re offline.',
                },
                {
                    tag: 'Q1 2026',
                    status: 'UPCOMING',
                    title: 'TARS Voice',
                    body: 'Start a research workflow with your voice while driving. Full runtime power, zero screen required. Desktop first, then mobile.',
                },
                {
                    tag: 'Q2 2026',
                    status: 'IN DEVELOPMENT',
                    title: 'Broader Business Autonomy',
                    body: 'Expanded scenario coverage for email, outreach, reporting, and approval workflows. TARS handles end-to-end business operations — with a governance gate before every send.',
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
                    body: 'TARS now connects DeepSeek, OpenAI, Gemini, and mock providers out of the box. Each task is routed to the optimal model automatically based on complexity, latency requirements, and cost.',
                },
            ].map((item, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) 3fr', gap: '2rem', padding: '4rem 0', borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '0.5rem' }}>
                        <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.2rem', color: item.status === 'SHIPPED' ? 'rgba(100,220,130,0.7)' : 'rgba(255,255,255,0.4)' }}>{item.status}</div>
                        <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.15rem', color: 'rgba(255,255,255,0.3)' }}>{item.tag}</div>
                    </div>
                    <div>
                        <h4 style={{ fontSize: '2rem', fontWeight: 300, color: WHITE, lineHeight: 1.2, marginBottom: '1.5rem' }}>{item.title}</h4>
                        <p style={{ fontSize: '1.25rem', fontWeight: 300, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, maxWidth: '800px' }}>{item.body}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);
