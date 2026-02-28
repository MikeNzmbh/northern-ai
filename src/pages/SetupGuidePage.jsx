import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { NORTHERN_DOWNLOAD_LINKS } from '../lib/downloadLinks';
import { getLocalPortalUrl } from '../lib/runtimeProfile';

const macSteps = [
    {
        title: 'Download and unzip',
        detail: 'Download northern-installer-darwin.zip, then double-click it in Downloads to extract the folder.',
        expect: 'You should now have a folder with files like bin/, services/, tools/, and install_northern_services.sh.',
    },
    {
        title: 'Open Terminal in that folder',
        detail: 'In Finder, open the extracted folder. Then right-click inside the folder and open Terminal there.',
        command: 'cd ~/Downloads/<your-extracted-folder>',
        expect: 'Your terminal prompt should now point to that installer folder.',
    },
    {
        title: 'Install services',
        detail: 'Run the installer script below once. This registers the backend, scheduler, and cockpit services.',
        command: 'bash ./install_northern_services.sh',
        expect: 'The script should complete without ERROR. On macOS, you may be asked for your system password.',
    },
    {
        title: 'Start Northern',
        detail: 'Start all services immediately so Northern is available now.',
        command: './bin/northern up',
        expect: 'First launch usually takes 30 to 90 seconds. Wait until startup messages finish.',
    },
    {
        title: 'Confirm everything is running',
        detail: 'You should see backend, scheduler, and cockpit reported as running.',
        command: './bin/northern status',
        expect: 'Look for `running_managed` (or `running_external`) on backend, scheduler, and cockpit.',
    },
];

const windowsSteps = [
    {
        title: 'Download and extract',
        detail: 'Download northern-installer-windows.zip, then right-click it and choose “Extract All…”.',
        expect: 'You should now have a folder with bin\\, services\\, tools\\, and install_northern_services.ps1.',
    },
    {
        title: 'Open PowerShell in that folder',
        detail: 'Open the extracted folder, hold Shift + right-click, then choose “Open PowerShell window here”.',
        command: 'Set-Location "$HOME\\Downloads\\<your-extracted-folder>"',
        expect: 'Your prompt path should now be the installer folder.',
    },
    {
        title: 'Install services',
        detail: 'Run the install script once. This sets up backend, scheduler, and cockpit tasks.',
        command: 'powershell -ExecutionPolicy Bypass -File .\\install_northern_services.ps1',
        expect: 'The script should finish without red ERROR lines.',
    },
    {
        title: 'Start Northern',
        detail: 'Run the command below, then wait for startup to complete.',
        command: '.\\bin\\northern.cmd up',
        expect: 'First launch usually takes 30 to 90 seconds while services initialize.',
    },
    {
        title: 'Confirm everything is running',
        detail: 'You should see backend, scheduler, and cockpit reported as running.',
        command: '.\\bin\\northern.cmd status',
        expect: 'Look for `running_managed` (or `running_external`) on backend, scheduler, and cockpit.',
    },
];

function StepList({ steps, accentClass }) {
    return (
        <div className="space-y-5">
            {steps.map((step, idx) => (
                <div key={step.title} className="rounded-2xl border border-zinc-800 bg-[#0c0c0c] p-5 sm:p-6">
                    <div className="flex items-start gap-4">
                        <span className={`text-[11px] font-bold tracking-[0.2em] uppercase ${accentClass}`}>
                            {String(idx + 1).padStart(2, '0')}
                        </span>
                        <div className="space-y-3 flex-1">
                            <h3 className="text-white text-lg font-semibold leading-snug">{step.title}</h3>
                            <p className="text-zinc-400 text-sm leading-relaxed">{step.detail}</p>
                            {step.command ? (
                                <div className="space-y-2">
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Run this command</p>
                                    <pre className="rounded-xl border border-zinc-700 bg-[#050505] px-4 py-3 overflow-x-auto">
                                        <code className="text-zinc-100 text-[13px] sm:text-sm">{step.command}</code>
                                    </pre>
                                </div>
                            ) : null}
                            {step.expect ? (
                                <div className="rounded-xl border border-zinc-700/70 bg-[#090909] px-4 py-3">
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-1.5">What to expect</p>
                                    <p className="text-zinc-300 text-sm leading-relaxed">{step.expect}</p>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function SetupGuidePage() {
    const localPortalUrl = getLocalPortalUrl();

    return (
        <div
            className="min-h-screen bg-[#000000] text-[#f4f4f5] selection:bg-zinc-800 overflow-x-hidden flex flex-col"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&display=swap');
            `}</style>

            <Navbar title="NORTHERN Setup" backLink="/individuals" />

            <div className="pt-32 px-6 max-w-[1600px] mx-auto w-full flex-1">
                <main className="flex flex-col gap-24 pb-24">
                    <section className="max-w-4xl">
                        <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] font-bold tracking-[0.25em] text-white mb-6">
                            GETTING STARTED
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-8 leading-[1.05]">
                            Downloaded Northern?<br />Start it step by step.
                        </h1>
                        <p className="text-zinc-400 text-lg md:text-xl leading-relaxed max-w-3xl mb-10">
                            This is the exact first-time setup flow after download. Follow your OS section in order. Each step includes what you should expect to see, so you know you are on track.
                        </p>
                        <div className="flex flex-wrap gap-4">
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
                                href="/chat"
                                className="bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-zinc-200 transition-colors inline-flex items-center gap-2 group"
                            >
                                Open launcher
                                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </a>
                        </div>
                    </section>

                    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="rounded-3xl border border-zinc-800 bg-[#080808] p-6">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-3">Before you start</p>
                            <p className="text-zinc-300 text-sm leading-relaxed">
                                Use commands from inside the extracted installer folder, not from another directory.
                            </p>
                        </div>
                        <div className="rounded-3xl border border-zinc-800 bg-[#080808] p-6">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-3">First launch timing</p>
                            <p className="text-zinc-300 text-sm leading-relaxed">
                                First startup can take up to 90 seconds. That delay is normal while services initialize.
                            </p>
                        </div>
                        <div className="rounded-3xl border border-zinc-800 bg-[#080808] p-6">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-3">Need the launcher?</p>
                            <p className="text-zinc-300 text-sm leading-relaxed">
                                If the website says “Northern isn’t awake”, complete these setup steps, then refresh `/chat`.
                            </p>
                        </div>
                    </section>

                    <section>
                        <p className="text-[10px] font-bold tracking-[0.3em] text-zinc-600 uppercase mb-8 border-b border-zinc-900 pb-4">
                            Install steps
                        </p>
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            <div className="rounded-3xl border border-zinc-800 bg-[#080808] p-6 sm:p-8">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-white">macOS</h2>
                                    <p className="text-zinc-500 text-sm mt-2">Use Terminal commands exactly as shown.</p>
                                </div>
                                <StepList steps={macSteps} accentClass="text-zinc-500" />
                            </div>

                            <div className="rounded-3xl border border-zinc-800 bg-[#080808] p-6 sm:p-8">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-white">Windows</h2>
                                    <p className="text-zinc-500 text-sm mt-2">Run commands in PowerShell from the extracted folder.</p>
                                </div>
                                <StepList steps={windowsSteps} accentClass="text-zinc-500" />
                            </div>
                        </div>
                    </section>

                    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="rounded-3xl border border-zinc-800 bg-[#080808] p-6 sm:p-8">
                            <h3 className="text-xl font-semibold text-white mb-4">Status meanings</h3>
                            <ul className="space-y-3 text-zinc-400 text-sm leading-relaxed">
                                <li>1. <code className="text-zinc-100">running_managed</code>: started and managed by installer scripts.</li>
                                <li>2. <code className="text-zinc-100">running_external</code>: running, but outside managed service control.</li>
                                <li>3. <code className="text-zinc-100">starting</code>: still booting, wait and check again.</li>
                                <li>4. <code className="text-zinc-100">stopped</code>: not running yet; run <code className="text-zinc-100">northern up</code>.</li>
                            </ul>
                            <a
                                href={localPortalUrl}
                                className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-zinc-200 transition-colors"
                            >
                                Open local portal
                                <ArrowUpRight className="w-4 h-4" />
                            </a>
                        </div>

                        <div className="rounded-3xl border border-zinc-800 bg-[#080808] p-6 sm:p-8">
                            <h3 className="text-xl font-semibold text-white mb-4">If it does not start</h3>
                            <ul className="space-y-3 text-zinc-400 text-sm leading-relaxed">
                                <li>1. Make sure you are running commands from the extracted installer folder.</li>
                                <li>2. If <code className="text-zinc-100">northern</code> is not found, run the bundled command instead: <code className="text-zinc-100">./bin/northern</code> (macOS) or <code className="text-zinc-100">.\\bin\\northern.cmd</code> (Windows).</li>
                                <li>3. Run <code className="text-zinc-100">northern doctor</code> (or bundled equivalent) and follow the suggested fix.</li>
                                <li>4. Retry <code className="text-zinc-100">northern up</code>, then refresh <code className="text-zinc-100">/chat</code> after 10 to 15 seconds.</li>
                            </ul>
                            <a href="mailto:sales@northern.ai" className="mt-6 inline-flex text-sm text-zinc-300 hover:text-white transition-colors">
                                Need help? Contact support →
                            </a>
                        </div>
                    </section>
                </main>
            </div>

            <Footer />
        </div>
    );
}
