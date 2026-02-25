import React from 'react';
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
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import {
  BusinessSection,
  IndividualsSection,
  StoriesSection,
  IntegrationsSection,
  NewsSection,
} from './sections/SectionContent';

function WelcomePage() {
  return (
    <div
      className="min-h-screen bg-[#070707] text-[#f4f4f5] selection:bg-zinc-800 overflow-x-hidden"
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&display=swap');
      `}</style>
      <Navbar />
      <main className="pt-24">
        <IndividualsSection />
        <BusinessSection />
        <StoriesSection />
        <IntegrationsSection />
        <NewsSection />
      </main>
      <Footer />
    </div>
  );
}

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
