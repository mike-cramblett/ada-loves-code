import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CodeUploader } from './components/CodeUploader';
import { AdaReceipt } from './components/AdaReceipt';
import { MaintainerShareModal } from './components/MaintainerShareModal';
import { ManifoldOfLove } from './components/ManifoldOfLove';
import { AdaTribute, CreditsResponse, ScanApiResponse } from './types';
import { DEMO_PROJECTS, DEMO_DATA } from './data/demoData';
import { AlertTriangle, Cpu, Feather, CheckCircle, Sparkles, Heart, BookOpen, Code2 } from 'lucide-react';

export default function App() {
  const [userId, setUserId] = useState<string>('');
  const [creditsRemaining, setCreditsRemaining] = useState<number | null>(null);
  const [maxCredits, setMaxCredits] = useState<number>(25);

  // Input states
  const [repoUrl, setRepoUrl] = useState<string>('');
  const [files, setFiles] = useState<{ name: string; content: string; size: number }[]>([]);
  const [codeSnippet, setCodeSnippet] = useState<string>('');
  const [isDemo, setIsDemo] = useState<boolean>(false);

  // Dedication state: Self vs Maintainer / Colleague
  const [targetType, setTargetType] = useState<'self' | 'maintainer'>('self');
  const [recipientName, setRecipientName] = useState<string>('');
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

  // Scan states
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<AdaTribute | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Initialize persistent user ID & fetch credits
  useEffect(() => {
    let storedId = localStorage.getItem('adalovescode_user_id');
    if (!storedId) {
      storedId = 'ada_user_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
      localStorage.setItem('adalovescode_user_id', storedId);
    }
    setUserId(storedId);
    fetchCredits(storedId);
  }, []);

  const fetchCredits = async (uid: string) => {
    try {
      const res = await fetch('/api/credits', {
        headers: {
          Authorization: `Bearer ${uid}`,
        },
      });
      if (res.ok) {
        const data: CreditsResponse = await res.json();
        setCreditsRemaining(data.creditsRemaining);
        if (typeof data.maxCredits === 'number') {
          setMaxCredits(data.maxCredits);
        }
      }
    } catch (err) {
      console.error('Failed to fetch user credits:', err);
    }
  };

  const handleSelectDemo = (demoId: string = 'babbage-engine') => {
    const demo = DEMO_PROJECTS.find((p) => p.id === demoId) || DEMO_PROJECTS[0];
    setRepoUrl(demo.repoUrl);
    setCodeSnippet(demo.snippet || '');
    setFiles([]);
    setIsDemo(true);
    setScanResult(null);
    setErrorMessage(null);
  };

  const handleClearInput = () => {
    setRepoUrl('');
    setFiles([]);
    setCodeSnippet('');
    setIsDemo(false);
    setScanResult(null);
    setErrorMessage(null);
  };

  const handleStartScan = async (mode: 'github' | 'zip' | 'snippet') => {
    setIsScanning(true);
    setErrorMessage(null);

    // If demo mode is active, simulate scanning animation and output cached result
    if (isDemo) {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const demo = DEMO_PROJECTS[0];
        const tribute: AdaTribute = {
          ...demo.scanResult,
          targetType,
          recipientName: targetType === 'maintainer' ? (recipientName.trim() || 'Honored Maintainer') : undefined,
          adaTributeText:
            targetType === 'maintainer'
              ? `My deepest homage to ${recipientName.trim() || 'the maintainer'}! To shepherd this open-source creation is an act of profound intellectual benevolence. You have woven algebraical patterns just as the Jacquard loom weaves flowers and leaves. In the serene cadence of your architecture, humanity inherits a work of everlasting grace.`
              : demo.scanResult.adaTributeText,
        };
        setScanResult(tribute);
        if (targetType === 'maintainer') {
          setSuccessBanner(`Laurel for ${recipientName.trim() || 'Maintainer'} woven! You can now send it via GitHub PR, Issue, or Email.`);
        }
      } catch (err: any) {
        setErrorMessage('Failed to generate demo tribute.');
      } finally {
        setIsScanning(false);
      }
      return;
    }

    if (!userId) {
      setIsScanning(false);
      return;
    }

    try {
      const payload: any = {
        sourceType: mode,
        targetType,
        recipientName: targetType === 'maintainer' ? recipientName.trim() : undefined,
      };

      if (mode === 'github') {
        payload.repoUrl = repoUrl.trim();
        payload.projectName = repoUrl.trim();
      } else if (mode === 'zip') {
        payload.files = files;
        payload.projectName = files[0]?.name.split('/')[0] || 'Uploaded Codebase Archive';
      } else if (mode === 'snippet') {
        payload.codeSnippet = codeSnippet;
        payload.projectName = 'Algorithm & Code Snippet';
      }

      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userId}`,
        },
        body: JSON.stringify(payload),
      });

      const data: ScanApiResponse = await res.json();

      if (res.status === 429 || res.status === 402) {
        setCreditsRemaining(0);
        setErrorMessage(data.error || 'Daily tribute quota (25/25) reached for today. Resets tomorrow!');
        return;
      }

      if (!res.ok || !data.success || !data.scanResult) {
        throw new Error(data.error || 'Failed to analyze repository with Ada Lovelace.');
      }

      setScanResult(data.scanResult);
      if (typeof data.creditsRemaining === 'number') {
        setCreditsRemaining(data.creditsRemaining);
      }

      if (targetType === 'maintainer') {
        setSuccessBanner(`Epistolary tribute for ${recipientName.trim() || 'Maintainer'} generated! Ready to commend via GitHub or Email.`);
      }
    } catch (err: any) {
      console.error('Scan error:', err);
      setErrorMessage(err.message || 'An error occurred while evaluating the code. Please check the URL or files.');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d060b] text-amber-50 flex flex-col font-sans selection:bg-amber-400 selection:text-black">
      {/* Header */}
      <Header
        creditsRemaining={creditsRemaining}
        maxCredits={maxCredits}
      />

      {/* Success Notification Banner */}
      {successBanner && (
        <div className="bg-gradient-to-r from-amber-950/80 via-rose-950/80 to-purple-950/80 border-b border-amber-500/30 text-amber-200 px-6 py-2.5 flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successBanner}</span>
          </div>
          <button
            onClick={() => setSuccessBanner(null)}
            className="text-gray-400 hover:text-white text-xs uppercase font-mono cursor-pointer ml-4"
          >
            [CLOSE]
          </button>
        </div>
      )}

      {/* Main Grid View */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0">
        {/* Left Column: Control Room / Code Input Stage */}
        <section className="lg:col-span-5 p-6 sm:p-10 lg:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-amber-500/20 bg-[#12080f] relative overflow-hidden">
          {/* Subtle grid background pattern */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#d4af37 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          <div className="relative z-10 space-y-7">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 text-xs">✦</span>
                <span className="text-[10px] font-mono tracking-widest uppercase text-amber-300 font-semibold">
                  1843 Analytical Engine Laboratory
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif leading-tight tracking-tight text-white">
                {targetType === 'maintainer' ? (
                  <>
                    Honor an Open-Source <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-amber-100 italic">
                      Maintainer.
                    </span>
                  </>
                ) : (
                  <>
                    Weave Code into <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-400 to-amber-100 italic">
                      Poetical Science.
                    </span>
                  </>
                )}
              </h2>
              <p className="text-amber-200/70 text-xs sm:text-sm max-w-sm leading-relaxed font-sans">
                {targetType === 'maintainer'
                  ? 'Submit any GitHub repository or code archive to bestow an authentic letter of admiration upon its maintainer or contributor.'
                  : 'Enter a public GitHub repository, upload a zip of code files, or paste an algorithm. Ada Lovelace will inspect your computational architecture and bestow a sincere tribute of mathematical praise.'}
              </p>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="bg-red-950/60 border border-red-500/30 text-red-200 p-4 rounded-xl flex items-start gap-3 shadow-lg">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div className="flex-1 text-xs font-medium">
                  <p>{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Code Uploader */}
            <CodeUploader
              repoUrl={repoUrl}
              onRepoUrlChange={setRepoUrl}
              files={files}
              onFilesChange={setFiles}
              codeSnippet={codeSnippet}
              onCodeSnippetChange={setCodeSnippet}
              targetType={targetType}
              onTargetTypeChange={setTargetType}
              recipientName={recipientName}
              onRecipientNameChange={setRecipientName}
              onSelectDemo={handleSelectDemo}
              onClearInput={handleClearInput}
              onStartScan={handleStartScan}
              isScanning={isScanning}
              creditsRemaining={creditsRemaining}
              isDemoActive={isDemo}
            />
          </div>

          {/* System Status Pill */}
          <div className="mt-8 relative z-10 p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
            <p className="text-[10px] text-amber-200 font-mono leading-tight uppercase tracking-wider">
              {isScanning
                ? 'Ada Lovelace reading code structures & weaving laurel...'
                : isDemo
                ? 'Note G Babbage Engine simulator demo active (0 credits). Ready to scan.'
                : repoUrl || files.length > 0 || codeSnippet
                ? `Codebase loaded (${targetType === 'maintainer' ? (recipientName || 'Maintainer') : 'Self'}). Ready for evaluation.`
                : 'Waiting for GitHub repo, ZIP archive, or code excerpt...'}
            </p>
          </div>
        </section>

        {/* Right Column: Tribute Output Stage */}
        <section className="lg:col-span-7 bg-[#0b040a] p-6 sm:p-10 lg:p-12 flex flex-col items-center justify-center relative overflow-hidden min-h-[500px]">
          {/* Ambient Glow Orbs */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 blur-[130px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-500/10 blur-[130px] rounded-full pointer-events-none" />

          {scanResult ? (
            <div className="w-full flex justify-center animate-fade-in relative z-10">
              <AdaReceipt
                scanResult={scanResult}
                sourceLabel={repoUrl || (files.length > 0 ? `${files.length} code files` : 'Code Snippet')}
                isDemo={isDemo}
                onUploadReal={handleClearInput}
                onOpenShareModal={() => setIsShareModalOpen(true)}
              />
            </div>
          ) : (
            <div className="relative z-10 text-center max-w-md p-8 border border-amber-500/20 bg-[#160a13]/80 rounded-2xl backdrop-blur-md space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300">
                <Feather className="w-8 h-8" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-serif font-bold text-white">
                  The Analytical Engine Laurel Stage
                </h3>
                <p className="text-xs text-amber-200/70 font-sans leading-relaxed">
                  {repoUrl || files.length > 0 || codeSnippet
                    ? isDemo
                      ? 'Note G demo loaded. Click "GENERATE ADA LOVELACE CODE TRIBUTE" on the left to engrave your certificate.'
                      : 'Repository loaded. Click "GENERATE ADA LOVELACE CODE TRIBUTE" on the left to begin Lady Lovelace’s analysis.'
                    : 'Provide a GitHub repository URL, drop a code archive, or select the Note G demo to receive your certificate of Poetical Science.'}
                </p>
              </div>
              <div className="pt-2 flex justify-center items-center gap-2 text-[10px] text-amber-400 font-mono uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>POETICAL SCIENCE ENGINE • 25 FREE TRIBUTES DAILY</span>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Maintainer Commendation Modal */}
      {scanResult && (
        <MaintainerShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          scanResult={scanResult}
        />
      )}

      {/* Philosophy Section */}
      <ManifoldOfLove />

      {/* Footer */}
      <footer className="px-6 sm:px-8 py-4 bg-[#0a0408] border-t border-amber-500/20 flex flex-wrap justify-between items-center text-[9px] text-amber-300/60 font-mono tracking-widest uppercase gap-2">
        <p className="flex items-center gap-2">
          <span>DAILY TRIBUTES: 25 FREE</span>
          <span>//</span>
          <span>OPEN SOURCE CELEBRATION</span>
          <span>//</span>
          <span>POETICAL SCIENCE 1843</span>
        </p>
        <div className="flex items-center gap-4">
          <span>GEMINI FLASH</span>
          <span>//</span>
          <span>ADA LOVES CODE</span>
        </div>
      </footer>
    </div>
  );
}
