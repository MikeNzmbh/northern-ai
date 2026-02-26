import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ChatPortal from './pages/ChatPortal';
import PersonalityOnboarding from './pages/PersonalityOnboarding';
import Settings from './pages/Settings';
import BusinessPage from './pages/BusinessPage';
import IndividualsPage from './pages/IndividualsPage';
import IntegrationsPage from './pages/IntegrationsPage';
import StoriesPage from './pages/StoriesPage';
import NewsPage from './pages/NewsPage';
import SolutionsPage from './pages/SolutionsPage';
import Footer from './components/Footer';

// ─── Starfield ────────────────────────────────────────────────────────────────
const Starfield = () => {
  const snorthern = useMemo(() => {
    return Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5,
      delay: Math.random() * 6,
      duration: Math.random() * 4 + 3,
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {snorthern.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-[var(--text-stone)]"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite alternate`,
          }}
        />
      ))}
    </div>
  );
};

// ─── AgentSymbol ──────────────────────────────────────────────────────────────
const AgentSymbol = () => (
  <div className="relative inline-flex items-center justify-center w-16 h-20 group select-none z-10">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(242,240,237,0.2)_0%,transparent_60%)] blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
    <svg viewBox="0 0 64 64" className="w-full h-full overflow-visible" aria-label="NORTHERN Agentic Symbol">
      <rect x="10" y="24" width="8" height="16" fill="var(--text-stone)" className="opacity-70 transition-all duration-700 group-hover:opacity-100" />
      <rect x="22" y="12" width="8" height="40" fill="var(--text-stone)" className="opacity-70 transition-all duration-700 group-hover:opacity-100" />
      <rect x="34" y="6" width="8" height="40" fill="var(--text-bone)" style={{ animation: 'agentic-float 4s ease-in-out infinite', filter: 'drop-shadow(0 0 8px rgba(242, 240, 237, 0.4))' }} />
      <rect x="46" y="24" width="8" height="16" fill="var(--text-stone)" className="opacity-70 transition-all duration-700 group-hover:opacity-100" />
      <path d="M 0 0 L 4 0 M 0 0 L 0 4" stroke="var(--text-stone)" strokeWidth="1" fill="none" className="opacity-40" />
      <path d="M 64 64 L 60 64 M 64 64 L 64 60" stroke="var(--text-stone)" strokeWidth="1" fill="none" className="opacity-40" />
    </svg>
  </div>
);

// ─── NorthernLogo ─────────────────────────────────────────────────────────────
const NorthernLogo = () => (
  <div className="relative inline-flex items-center group select-none cursor-pointer z-10" aria-label="NORTHERN Logo">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(242,240,237,0.15)_0%,transparent_70%)] blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
    <span
      className="relative font-['JetBrains_Mono'] text-4xl md:text-6xl font-light tracking-[0.25em] text-transparent bg-clip-text uppercase"
      style={{ backgroundImage: 'linear-gradient(180deg, var(--text-bone) 20%, var(--text-stone) 100%)', filter: 'drop-shadow(0 0 15px rgba(242, 240, 237, 0.3))' }}
    >
      NORTHERN
    </span>
    <span
      className="inline-block w-[0.4em] h-[1.1em] ml-2 align-middle bg-[var(--text-bone)] shadow-[0_0_15px_rgba(242,240,237,0.8)]"
      style={{ animation: 'blink-heavy 1.2s step-end infinite' }}
    />
  </div>
);

// ─── Arc menu entries → each navigates to a dedicated page ───────────────────
const menuItems = [
  { label: 'BUSINESS', href: '/business' },
  { label: 'INDIVIDUALS', href: '/individuals' },
  { label: 'INTEGRATIONS', href: '/integrations' },
  { label: 'STORIES', href: '/stories' },
  { label: 'NEWS', href: '/news' },
];

// ─── CircularMenu ─────────────────────────────────────────────────────────────
const CircularMenu = () => {
  const [mounted, setMounted] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="w-full flex justify-center px-2 md:px-6 transition-all duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]"
      style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(-20px)' }}
    >
      <svg
        viewBox="-220 -8 1640 280"
        className="w-full max-w-none h-auto overflow-visible"
        style={{ animation: 'orbital-sway 24s ease-in-out infinite alternate' }}
        aria-label="Main Orbital Navigation"
      >
        <defs>
          <path id="menu-curve" d="M 80 252 A 760 760 0 0 1 1120 252" />
        </defs>
        <text className="font-['JetBrains_Mono'] text-[9px] md:text-[11px] tracking-[0.25em] md:tracking-[0.4em] uppercase" fill="var(--text-stone)">
          <textPath href="#menu-curve" startOffset="50%" textAnchor="middle">
            {menuItems.map((item, index) => {
              const isHovered = hoveredIndex === index;
              return (
                <React.Fragment key={item.label}>
                  <tspan
                    className="cursor-pointer pointer-events-auto"
                    style={{
                      fill: isHovered ? 'var(--text-bone)' : hoveredIndex !== null ? 'rgba(120, 113, 108, 0.4)' : 'var(--text-stone)',
                      filter: isHovered ? 'drop-shadow(0 0 8px rgba(242,240,237,0.8))' : 'none',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                    onClick={() => { window.location.href = item.href; }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {item.label}
                  </tspan>
                  {index < menuItems.length - 1 && (
                    <tspan style={{ fill: 'var(--text-stone)', opacity: hoveredIndex !== null ? 0.2 : 0.4, transition: 'opacity 0.4s ease', pointerEvents: 'none' }}>
                      {'\u00A0\u00A0\u00A0\u00A0 · \u00A0\u00A0\u00A0\u00A0'}
                    </tspan>
                  )}
                </React.Fragment>
              );
            })}
          </textPath>
        </text>
      </svg>
    </div>
  );
};

// ─── Welcome / Home Page ──────────────────────────────────────────────────────
function WelcomePage() {
  return (
    <div className="relative w-screen min-h-screen bg-[#070707] flex flex-col items-center selection:bg-[rgba(242,240,237,0.2)] overflow-x-hidden font-['JetBrains_Mono']">
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;700&display=swap');
        :root { --text-bone: #f2f0ed; --text-stone: #78716c; }

        @keyframes twinkle {
          0%   { opacity: 0.2; transform: scale(0.8); }
          100% { opacity: 1;   transform: scale(1.1); }
        }
        @keyframes blink-heavy {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes agentic-float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-6px); }
        }
        @keyframes orbital-sway {
          0%   { transform: rotate(-0.9deg) scale(1); }
          100% { transform: rotate(0.9deg)  scale(1.01); }
        }
        @keyframes cta-rise {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50%       { opacity: 0.6; transform: scale(1.08); }
        }
      `}} />

      {/* ── Hero Viewport ── */}
      <div className="relative w-full min-h-screen flex flex-col items-center justify-center pb-32 overflow-hidden">
        {/* Depth radial gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_0%,#070707_80%)] pointer-events-none z-0" />



        {/* Starfield */}
        <Starfield />

        {/* Central ambient glow behind hero */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-[600px] h-[600px] rounded-full pointer-events-none z-0"
          style={{ background: 'radial-gradient(circle, rgba(242,240,237,0.06) 0%, transparent 70%)', animation: 'glow-pulse 6s ease-in-out infinite' }}
        />

        {/* Hero lockup */}
        <div className="relative z-10 flex flex-col items-center gap-6 mt-16 md:mt-24">
          {/* Symbol + wordmark row */}
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-10 group">
            <AgentSymbol />
            <div className="hidden md:block w-[1px] h-20 bg-gradient-to-b from-transparent via-[var(--text-stone)] to-transparent opacity-30 group-hover:opacity-70 transition-opacity duration-700" />
            <NorthernLogo />
          </div>
          {/* Sub-brand label */}
          <p className="text-[11px] tracking-[0.4em] uppercase text-[var(--text-stone)] opacity-60 mt-2">
            Personal AI Orchestrator
          </p>
        </div>

        {/* CTA */}
        <div className="relative z-10 flex flex-col items-center text-center gap-4 mt-10 w-full px-6" style={{ animation: 'cta-rise 1.2s ease-out 0.6s both' }}>
          <a
            href="/chat"
            className="mx-auto block bg-[var(--text-bone)] text-[#070707] font-semibold px-14 py-4 rounded-xl text-sm tracking-[0.2em] uppercase transition-all duration-300 hover:bg-white hover:shadow-[0_0_40px_rgba(242,240,237,0.25)] active:scale-[0.98]"
          >
            Open NORTHERN
          </a>
          <p className="text-[11px] text-[var(--text-stone)]/50 tracking-[0.2em] uppercase">
            Free · No account required
          </p>
        </div>

        {/* Arc Menu — bottom of hero viewport */}
        <div className="absolute bottom-0 w-full translate-y-[15%] pointer-events-none z-40">
          <div className="pointer-events-auto">
            <CircularMenu />
          </div>
        </div>

        {/* Bottom HUD */}
        <div className="absolute bottom-0 left-0 w-full pointer-events-none z-30 p-8 flex flex-col justify-end">
          <div className="flex justify-between items-end text-[8px] md:text-[10px] text-[var(--text-stone)] tracking-[0.3em] opacity-50 uppercase">
            <div className="flex flex-col gap-2">
              <span className="w-8 h-[1px] bg-[var(--text-stone)]" />
              <div>NORTHERN SYSTEM ARC</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-[var(--text-bone)] drop-shadow-[0_0_4px_rgba(242,240,237,0.4)]">
                <span className="w-1.5 h-1.5 bg-[var(--text-bone)] rounded-sm animate-pulse" />
                AUTONOMOUS YIELD
              </div>
              <div className="w-[1px] h-3 bg-[var(--text-stone)] opacity-50" />
              <div>ID.01</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full relative z-20">
        <Footer />
      </div>
    </div>
  );
}

// ─── App Router ───────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/business" element={<BusinessPage />} />
        <Route path="/solutions" element={<SolutionsPage />} />
        <Route path="/individuals" element={<IndividualsPage />} />
        <Route path="/integrations" element={<IntegrationsPage />} />
        <Route path="/stories" element={<StoriesPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/chat" element={<ChatPortal />} />
        <Route path="/onboarding" element={<PersonalityOnboarding />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<WelcomePage />} />
      </Routes>
    </BrowserRouter>
  );
}
