import React, { useState, useRef } from 'react';
import JSZip from 'jszip';
import {
  Github,
  FileArchive,
  Code2,
  Sparkles,
  Upload,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Heart,
  User,
  Zap,
  BookOpen,
  FileCode,
  ExternalLink,
} from 'lucide-react';
import { DEMO_PROJECTS } from '../data/demoData';

interface CodeFileItem {
  name: string;
  content: string;
  size: number;
}

interface CodeUploaderProps {
  repoUrl: string;
  onRepoUrlChange: (url: string) => void;
  files: CodeFileItem[];
  onFilesChange: (files: CodeFileItem[]) => void;
  codeSnippet: string;
  onCodeSnippetChange: (snippet: string) => void;
  targetType: 'self' | 'maintainer';
  onTargetTypeChange: (target: 'self' | 'maintainer') => void;
  recipientName: string;
  onRecipientNameChange: (name: string) => void;
  onSelectDemo: (demoId?: string) => void;
  onStartScan: (mode: 'github' | 'zip' | 'snippet') => void;
  isScanning: boolean;
  creditsRemaining: number | null;
  isDemoActive: boolean;
  onClearInput: () => void;
}

type TabType = 'github' | 'zip' | 'snippet';

export const CodeUploader: React.FC<CodeUploaderProps> = ({
  repoUrl,
  onRepoUrlChange,
  files,
  onFilesChange,
  codeSnippet,
  onCodeSnippetChange,
  targetType,
  onTargetTypeChange,
  recipientName,
  onRecipientNameChange,
  onSelectDemo,
  onStartScan,
  isScanning,
  creditsRemaining,
  isDemoActive,
  onClearInput,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('github');
  const [isUnpacking, setIsUnpacking] = useState(false);
  const [unpackError, setUnpackError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle zip and raw code file uploads via JSZip / FileReader
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles || uploadedFiles.length === 0) return;

    setUnpackError(null);
    setIsUnpacking(true);

    try {
      const file = uploadedFiles[0];
      const isZip = file.name.endsWith('.zip') || file.type.includes('zip');

      if (isZip) {
        const zip = new JSZip();
        const zipData = await zip.loadAsync(file);
        const extracted: CodeFileItem[] = [];

        const fileEntries = Object.entries(zipData.files).filter(
          ([path, entry]) =>
            !entry.dir &&
            !path.includes('node_modules/') &&
            !path.includes('.git/') &&
            !path.includes('dist/') &&
            !path.includes('__pycache__/') &&
            !path.startsWith('__MACOSX')
        );

        // Read up to 20 representative text/code files
        for (const [path, entry] of fileEntries.slice(0, 20)) {
          const content = await entry.async('string');
          extracted.push({
            name: path,
            content: content.slice(0, 4000),
            size: content.length,
          });
        }

        if (extracted.length === 0) {
          throw new Error('No readable source code files found in archive.');
        }

        onFilesChange(extracted);
      } else {
        // Multiple code files uploaded directly
        const fileList: CodeFileItem[] = [];
        for (let i = 0; i < Math.min(uploadedFiles.length, 15); i++) {
          const f = uploadedFiles[i];
          const text = await f.text();
          fileList.push({
            name: f.name,
            content: text.slice(0, 4000),
            size: f.size,
          });
        }
        onFilesChange(fileList);
      }
    } catch (err: any) {
      console.error('File parsing error:', err);
      setUnpackError(err.message || 'Failed to extract code files from upload.');
    } finally {
      setIsUnpacking(false);
      if (e.target) e.target.value = '';
    }
  };

  const hasContent =
    activeTab === 'github'
      ? repoUrl.trim().length > 0
      : activeTab === 'zip'
      ? files.length > 0
      : codeSnippet.trim().length > 0;

  const quickPicks = [
    { label: 'fastapi', url: 'https://github.com/tiangolo/fastapi' },
    { label: 'shadcn/ui', url: 'https://github.com/shadcn-ui/ui' },
    { label: 'astral-sh/uv', url: 'https://github.com/astral-sh/uv' },
    { label: 'pallets/flask', url: 'https://github.com/pallets/flask' },
  ];

  return (
    <div className="w-full space-y-5">
      {/* Target Selector: Myself vs Maintainer / Colleague */}
      <div className="bg-[#180e15] p-1.5 rounded-xl border border-amber-500/20 flex items-center gap-1.5 shadow-sm">
        <button
          type="button"
          onClick={() => onTargetTypeChange('self')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
            targetType === 'self'
              ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-black shadow-md'
              : 'text-amber-200/60 hover:text-amber-100'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>My Code / Repo</span>
        </button>

        <button
          type="button"
          onClick={() => onTargetTypeChange('maintainer')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
            targetType === 'maintainer'
              ? 'bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300 text-black shadow-md'
              : 'text-amber-200/60 hover:text-amber-100'
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          <span>Honor a Maintainer</span>
        </button>
      </div>

      {/* Maintainer Name Field */}
      {targetType === 'maintainer' && (
        <div className="bg-[#1b0d16] border border-rose-500/30 rounded-xl p-3.5 space-y-2 animate-fade-in">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-mono text-rose-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/20" />
              <span>Maintainer / Contributor Name or Handle</span>
            </label>
            <span className="text-[9px] font-mono text-rose-200/60 uppercase">
              PR &amp; Issue Ready
            </span>
          </div>
          <input
            type="text"
            placeholder="e.g. @tiangolo, Linus, or Alex..."
            value={recipientName}
            onChange={(e) => onRecipientNameChange(e.target.value)}
            className="w-full bg-black/60 border border-amber-500/30 focus:border-rose-400 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 outline-none font-sans"
          />
          <p className="text-[10px] text-amber-200/70 font-sans leading-tight">
            Ada will dedicate her letter of tribute specifically to this maintainer to celebrate their open-source devotion.
          </p>
        </div>
      )}

      {/* Input Mode Tabs */}
      <div className="flex border-b border-amber-500/20 text-xs font-mono">
        <button
          type="button"
          onClick={() => setActiveTab('github')}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 font-bold transition-all cursor-pointer ${
            activeTab === 'github'
              ? 'border-amber-400 text-amber-300 bg-amber-500/10'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <Github className="w-3.5 h-3.5" />
          <span>GitHub Repo</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('zip')}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 font-bold transition-all cursor-pointer ${
            activeTab === 'zip'
              ? 'border-amber-400 text-amber-300 bg-amber-500/10'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <FileArchive className="w-3.5 h-3.5" />
          <span>ZIP / Code Files</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('snippet')}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 font-bold transition-all cursor-pointer ${
            activeTab === 'snippet'
              ? 'border-amber-400 text-amber-300 bg-amber-500/10'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Code Snippet</span>
        </button>
      </div>

      {/* Tab 1: GitHub Repository */}
      {activeTab === 'github' && (
        <div className="space-y-3.5">
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-amber-300 font-bold uppercase tracking-wider flex items-center justify-between">
              <span>Enter Repository URL or owner/repo:</span>
              <span className="text-[10px] text-gray-500 font-normal">Public GitHub</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. https://github.com/facebook/react or tiangolo/fastapi"
                value={repoUrl}
                onChange={(e) => onRepoUrlChange(e.target.value)}
                className="w-full bg-black/60 border border-amber-500/30 focus:border-amber-400 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 outline-none font-mono pr-10"
              />
              <Github className="w-4 h-4 text-amber-400 absolute right-3.5 top-3.5 pointer-events-none" />
            </div>
          </div>

          {/* Quick Pick Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] text-amber-200/50 font-mono">Quick test:</span>
            {quickPicks.map((pick) => (
              <button
                key={pick.label}
                type="button"
                onClick={() => onRepoUrlChange(pick.url)}
                className="text-[10px] font-mono px-2 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-300 transition-colors cursor-pointer"
              >
                {pick.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: ZIP File Upload */}
      {activeTab === 'zip' && (
        <div className="space-y-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".zip,application/zip,.ts,.tsx,.js,.jsx,.py,.rs,.go,.cpp,.c,.java,.rb,.json,.md"
            multiple
            className="hidden"
          />

          {files.length === 0 ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="group border-2 border-dashed border-amber-500/30 hover:border-amber-400 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 bg-[#160c13] transition-all cursor-pointer text-center"
            >
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-amber-200 uppercase tracking-wider">
                  Upload Code Archive (.ZIP) or Files
                </p>
                <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                  Drag and drop or click to browse (.zip, .py, .rs, .ts, .go, etc.)
                </p>
              </div>
              <span className="text-[9px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                Extracted safely in your browser
              </span>
            </div>
          ) : (
            <div className="bg-[#160c13] border border-amber-500/30 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-2.5">
                <div className="flex items-center gap-2 text-xs font-mono text-amber-300 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{files.length} Code Files Ready for Analysis</span>
                </div>
                <button
                  type="button"
                  onClick={() => onFilesChange([])}
                  className="text-[10px] font-mono text-gray-400 hover:text-white underline cursor-pointer"
                >
                  Clear Files
                </button>
              </div>

              <div className="max-h-36 overflow-y-auto space-y-1 pr-1 font-mono text-[10px] text-gray-300 divide-y divide-white/5">
                {files.map((file, i) => (
                  <div key={i} className="py-1 flex items-center justify-between">
                    <span className="truncate max-w-[240px] flex items-center gap-1.5">
                      <FileCode className="w-3 h-3 text-amber-400 shrink-0" />
                      {file.name}
                    </span>
                    <span className="text-gray-500 shrink-0">
                      {Math.round(file.size / 1024)} KB
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isUnpacking && (
            <div className="text-xs font-mono text-amber-300 flex items-center gap-2 p-2 bg-amber-500/10 rounded">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Unpacking and indexing source code archive...</span>
            </div>
          )}

          {unpackError && (
            <div className="text-xs font-mono text-red-400 flex items-center gap-2 p-2 bg-red-950/40 border border-red-500/30 rounded">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{unpackError}</span>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Code Snippet */}
      {activeTab === 'snippet' && (
        <div className="space-y-2">
          <label className="text-[11px] font-mono text-amber-300 font-bold uppercase tracking-wider flex items-center justify-between">
            <span>Paste Code or Algorithm Excerpt:</span>
            <span className="text-[10px] text-gray-500 font-normal">Functions, Classes, Loops</span>
          </label>
          <textarea
            rows={5}
            placeholder={`// Paste your algorithm or code snippet here...\nfunction calculateHarmony(data) {\n  return data.reduce((acc, v) => acc + v, 0);\n}`}
            value={codeSnippet}
            onChange={(e) => onCodeSnippetChange(e.target.value)}
            className="w-full bg-black/60 border border-amber-500/30 focus:border-amber-400 rounded-xl p-3 text-xs text-amber-100 placeholder-gray-600 font-mono outline-none resize-y"
          />
        </div>
      )}

      {/* Instant Demo Option Card */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-rose-950/40 border border-amber-500/30 backdrop-blur-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-[11px] font-mono font-bold text-amber-200 uppercase tracking-wider">
              Instant Demo: Note G Analytical Engine
            </span>
          </div>
          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold uppercase">
            0 Credits Used
          </span>
        </div>

        <p className="text-[11px] text-gray-300 leading-relaxed font-sans">
          Test drive Ada’s evaluation of the legendary Analytical Engine Bernoulli recurrence program.
        </p>

        <button
          type="button"
          onClick={() => onSelectDemo('babbage-engine')}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-200 text-xs font-bold font-mono uppercase tracking-wider transition-all cursor-pointer active:scale-98"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Load Note G Simulator Demo</span>
        </button>
      </div>

      {/* Main Action Button */}
      <div className="space-y-2 pt-2">
        <button
          type="button"
          onClick={() => onStartScan(activeTab)}
          disabled={isScanning || (!hasContent && !isDemoActive) || creditsRemaining === 0}
          className={`w-full py-4 px-6 rounded-xl font-black uppercase text-xs tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2.5 shadow-xl ${
            isScanning
              ? 'bg-neutral-800 text-neutral-400 cursor-not-allowed'
              : creditsRemaining === 0
              ? 'bg-neutral-800 text-red-400 border border-red-500/20 cursor-not-allowed'
              : !hasContent && !isDemoActive
              ? 'bg-neutral-800/80 text-gray-500 border border-white/5 cursor-not-allowed'
              : 'bg-gradient-to-r from-amber-400 via-rose-400 to-amber-200 text-black hover:brightness-110 shadow-amber-500/20 active:scale-98'
          }`}
        >
          {isScanning ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
              <span>WEAVING POETICAL SCIENCE TRIBUTE...</span>
            </>
          ) : creditsRemaining === 0 ? (
            <>
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span>DAILY LIMIT (25/25) REACHED — RESETS TOMORROW</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-neutral-950" />
              <span>
                {targetType === 'maintainer'
                  ? `WEAVE COMPLIMENT FOR ${recipientName ? recipientName.toUpperCase() : 'MAINTAINER'}`
                  : 'GENERATE ADA LOVELACE CODE TRIBUTE'}
              </span>
            </>
          )}
        </button>

        {isDemoActive && (
          <div className="flex items-center justify-center gap-2">
            <span className="text-[10px] font-mono text-amber-300/80">
              ⚡ Demo test active. Zero credits used.
            </span>
            <button
              onClick={onClearInput}
              className="text-[10px] font-mono text-gray-400 hover:text-white underline cursor-pointer"
            >
              Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
