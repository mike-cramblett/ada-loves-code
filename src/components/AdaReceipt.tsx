import React, { useRef, useState } from 'react';
import {
  Download,
  Share2,
  Check,
  Feather,
  ShieldCheck,
  Zap,
  Sparkles,
  Heart,
  Send,
  Code2,
  Copy,
  BookOpen,
  Award,
  Terminal,
} from 'lucide-react';
import { toPng } from 'html-to-image';
import { AdaTribute } from '../types';

interface AdaReceiptProps {
  scanResult: AdaTribute;
  sourceLabel?: string;
  isDemo?: boolean;
  onUploadReal?: () => void;
  onOpenShareModal?: () => void;
}

function sanitizeText(text?: string): string {
  if (!text) return '';
  return text
    .replace(/^["'“\s]+|["'”\s]+$/g, '')
    .replace(/\*\*/g, '')
    .trim();
}

function sanitizeSpec(spec: string): string {
  const clean = spec.replace(/^[>\s*-]+/, '').replace(/\*\*/g, '').trim();
  return `> ${clean}`;
}

export const AdaReceipt: React.FC<AdaReceiptProps> = ({
  scanResult,
  sourceLabel,
  isDemo = false,
  onUploadReal,
  onOpenShareModal,
}) => {
  const receiptRef = useRef<HTMLDivElement | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);

  const txId = useRef(`ADA-1843-${Math.floor(100000 + Math.random() * 900000)}`).current;
  const timestamp = useRef(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })).current;

  const handleDownload = async () => {
    const card = receiptRef.current || document.getElementById('ada-receipt-card');
    if (!card) return;

    try {
      setIsDownloading(true);
      const dataUrl = await toPng(card, {
        quality: 0.98,
        pixelRatio: 2.5,
        cacheBust: true,
        backgroundColor: '#140a10',
      });

      const link = document.createElement('a');
      const safeProjectName = (scanResult.projectName || 'codebase').replace(/[^a-zA-Z0-9_-]/g, '_');
      link.download = `ADA_LOVELACE_TRIBUTE_${safeProjectName.toUpperCase()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export Laurel PNG:', err);
      alert('Could not export image. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyMarkdown = () => {
    const tribute = sanitizeText(scanResult.adaTributeText || scanResult.hypeText);
    const md = `### 🏛️ The Poetical Science Laurel — Bestowed by Ada Lovelace
**Project:** \`${scanResult.projectName || 'Open Source Project'}\`  
**Archetype:** **${scanResult.styleArchetype || scanResult.styleName}**  
**Poetical Science Index:** **${scanResult.poeticalScienceIndex || scanResult['MCE%'] || '99.9%'}**  

> "${tribute}"
> 
> *— Augusta Ada King, Countess of Lovelace (1815–1852)*

#### Algorithmic Virtues:
${(scanResult.algorithmicDiagnostics || scanResult.biometricSpecs || [])
  .map((d) => `- \`${sanitizeSpec(d)}\``)
  .join('\n')}

*Commended with unconditional gratitude for open-source human intellect.*`;

    navigator.clipboard.writeText(md);
    setCopiedMarkdown(true);
    setTimeout(() => setCopiedMarkdown(false), 2200);
  };

  const handleCopyText = () => {
    const tribute = sanitizeText(scanResult.adaTributeText || scanResult.hypeText);
    const recipientTag = scanResult.recipientName ? ` (Dedicated to ${scanResult.recipientName})` : '';
    const shareText = `🏛️ ADA LOVES CODE TRIBUTE${recipientTag} 🏛️\n\nProject: ${scanResult.projectName}\nArchetype: ${scanResult.styleArchetype || scanResult.styleName}\nPoetical Science Index: ${scanResult.poeticalScienceIndex || scanResult['MCE%']}\n\n"${tribute}"\n\n— Bestowed with love by Ada Lovelace & Gemini`;
    navigator.clipboard.writeText(shareText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const diagnostics = scanResult.algorithmicDiagnostics || scanResult.biometricSpecs || [];
  const highlights = scanResult.highlights || [];
  const tributeText = sanitizeText(scanResult.adaTributeText || scanResult.hypeText);
  const archetype = scanResult.styleArchetype || scanResult.styleName || 'WEAVER OF COMPUTATIONAL HARMONY';
  const psiScore = scanResult.poeticalScienceIndex || scanResult['MCE%'] || '99.9% HARMONY';
  const sigil = scanResult.laurelSigil || 'Textura Algebraica, Mens Aeterna';

  return (
    <div className="w-full flex flex-col items-center gap-5 my-2">
      {/* Demo Banner */}
      {isDemo && (
        <div className="w-full max-w-lg bg-gradient-to-r from-amber-950/40 via-purple-950/40 to-amber-950/40 border border-amber-500/40 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-md">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-mono text-amber-300 font-bold">
              NOTE G DEMO LAUREL READY
            </span>
          </div>
          {onUploadReal && (
            <button
              onClick={onUploadReal}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 via-rose-400 to-amber-200 text-black font-black uppercase text-[10px] tracking-wider hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3" />
              <span>Compliment Real Repository</span>
            </button>
          )}
        </div>
      )}

      {/* Main Action Bar: Commend Maintainer */}
      {onOpenShareModal && (
        <button
          onClick={onOpenShareModal}
          className="w-full max-w-lg py-3.5 px-5 rounded-xl bg-gradient-to-r from-amber-400 via-rose-400 to-amber-200 text-black font-black uppercase text-xs tracking-wider shadow-xl shadow-amber-900/30 hover:brightness-110 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2.5"
        >
          <Heart className="w-4 h-4 fill-black" />
          <span>
            {scanResult.recipientName
              ? `SEND COMMENDATION TO ${scanResult.recipientName.toUpperCase()} (PR / ISSUE / EMAIL)`
              : 'COMMEND REPOSITORY MAINTAINER (PR / ISSUE / EMAIL)'}
          </span>
          <Send className="w-3.5 h-3.5 ml-1" />
        </button>
      )}

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 w-full max-w-lg">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-amber-400 hover:bg-amber-300 text-black font-black uppercase text-xs tracking-wider transition-colors cursor-pointer shadow-lg active:scale-95 rounded-lg font-mono"
        >
          <Download className="w-4 h-4" />
          <span>{isDownloading ? 'ENGRAVING PNG...' : 'DOWNLOAD LAUREL PNG'}</span>
        </button>

        <button
          onClick={handleCopyMarkdown}
          className="flex items-center justify-center gap-2 py-3 px-4 bg-[#23121d] hover:bg-[#301827] border border-amber-500/30 text-amber-200 font-bold text-xs uppercase tracking-wider active:scale-95 transition-all cursor-pointer rounded-lg font-mono"
          title="Copy Markdown for GitHub PR Comment or Issue"
        >
          {copiedMarkdown ? <Check className="w-4 h-4 text-emerald-400" /> : <Terminal className="w-4 h-4" />}
          <span>{copiedMarkdown ? 'MARKDOWN COPIED!' : 'PR / ISSUE MARKDOWN'}</span>
        </button>

        <button
          onClick={handleCopyText}
          className="flex items-center justify-center gap-2 py-3 px-3 bg-[#1d0e18] hover:bg-[#2c1524] border border-amber-500/20 text-amber-300/80 font-bold text-xs uppercase tracking-wider active:scale-95 transition-all cursor-pointer rounded-lg font-mono"
          title="Copy Plain Text"
        >
          {copiedText ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          <span>{copiedText ? 'COPIED!' : 'SHARE'}</span>
        </button>
      </div>

      {/* THE VICTORIAN COMPUTATIONAL LAUREL CARD */}
      <div
        id="ada-receipt-card"
        ref={receiptRef}
        className="relative w-full max-w-lg bg-[#140a10] text-amber-100 shadow-2xl overflow-hidden border-2 border-amber-500/40 rounded-2xl p-6 sm:p-8 space-y-6 font-serif"
      >
        {/* Subtle Ornamental Background Pattern */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, #d4af37 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Top Gold Border & Seal */}
        <div className="relative border-b border-amber-500/30 pb-5 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-amber-400">
            <span className="text-xs">✦</span>
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-amber-300 font-semibold">
              The Analytical Engine Laurel
            </span>
            <span className="text-xs">✦</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-serif italic">
            Certificate of Poetical Science
          </h2>

          <p className="text-[10px] font-mono text-amber-300/60 uppercase tracking-widest">
            Augusta Ada King, Countess of Lovelace • Note G • {timestamp}
          </p>

          {scanResult.recipientName && (
            <div className="pt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono font-bold tracking-wide">
              <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
              <span>DEDICATED TO: {scanResult.recipientName.toUpperCase()}</span>
            </div>
          )}
        </div>

        {/* Portrait & Project Badge */}
        <div className="flex items-center gap-4 bg-black/40 p-4 rounded-xl border border-amber-500/20">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border-2 border-amber-400/50 shrink-0 shadow-lg shadow-amber-950">
            <img
              src="/assets/ada-lovelace.jpg"
              alt="Ada Lovelace"
              className="w-full h-full object-cover object-top filter contrast-110"
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-amber-300/30" />
          </div>

          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="bg-amber-400 text-black text-[10px] font-mono font-black px-2 py-0.5 rounded uppercase">
                PSI: {psiScore}
              </span>
              <span className="bg-rose-500 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase">
                {scanResult.targetType === 'maintainer' ? 'MAINTAINER_TRIBUTE' : 'OPEN_SOURCE_CRAFT'}
              </span>
            </div>

            <div className="font-mono text-xs text-amber-300/80 truncate font-semibold">
              REPO: <span className="text-white">{scanResult.projectName}</span>
            </div>

            <h3 className="text-xs sm:text-sm font-bold tracking-tight text-amber-200 font-sans uppercase leading-tight break-words">
              {archetype}
            </h3>
          </div>
        </div>

        {/* Algorithmic Diagnostics */}
        {/* Change space-y-1.5 to space-y-2.5 and ensure leading-relaxed */}
        <div className="space-y-2.5 py-3 border-y border-dashed border-amber-500/30 font-mono text-[11px]">
          <div className="text-[9px] uppercase tracking-widest text-amber-400/80 font-bold mb-1">
            Algorithmic Diagnostics:
          </div>
          {diagnostics.map((diag, idx) => (
            <p key={idx} className="text-amber-200/90 leading-relaxed break-words pb-0.5">
              {sanitizeSpec(diag)}
            </p>
          ))}
        </div>

        {/* Ada Lovelace Epistolary Tribute Letter */}
        <div className="space-y-2.5 bg-[#1f0f1b]/70 p-4 sm:p-5 rounded-xl border border-amber-500/30">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
            <span className="flex items-center gap-1.5">
              <Feather className="w-3.5 h-3.5 text-amber-300" />
              <span>Epistle from Lady Lovelace</span>
            </span>
            <span className="text-amber-200/50">Poetical Science</span>
          </div>

          <blockquote className="text-xs sm:text-sm text-amber-50 font-serif leading-relaxed italic border-l-2 border-amber-400/60 pl-3.5 break-words">
            "{tributeText}"
          </blockquote>

          <div className="text-right font-serif italic text-xs text-amber-300/80 pt-1">
            — Augusta Ada King, Countess of Lovelace
          </div>
        </div>

        {/* Architectural Highlights */}
        {highlights.length > 0 && (
          <div className="space-y-1.5 font-sans text-xs">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300/70 font-bold block">
              Architectural Virtues Noted:
            </span>
            <ul className="space-y-1">
              {highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2 text-amber-100/90 text-xs">
                  <span className="text-amber-400 font-serif text-sm leading-none">•</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Card Footer */}
        <div className="pt-4 border-t border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left font-mono text-[10px] text-amber-300/60">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="italic font-serif text-amber-200 text-xs font-normal">
              "{sigil}"
            </span>
          </div>
          <span className="tracking-widest uppercase text-amber-400/70">
            *{txId}*
          </span>
        </div>
      </div>
    </div>
  );
};
