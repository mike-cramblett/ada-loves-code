import React, { useState } from 'react';
import {
  Mail,
  Copy,
  Check,
  ExternalLink,
  X,
  Heart,
  Share2,
  Download,
  Github,
  Terminal,
  MessageSquare,
  Award,
} from 'lucide-react';
import { toPng } from 'html-to-image';
import { AdaTribute } from '../types';

interface MaintainerShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  scanResult: AdaTribute;
}

export const MaintainerShareModal: React.FC<MaintainerShareModalProps> = ({
  isOpen,
  onClose,
  scanResult,
}) => {
  const [copiedType, setCopiedType] = useState<'all' | 'pr' | 'email' | 'social' | null>(null);
  const [maintainerEmail, setMaintainerEmail] = useState('');
  const [isSavingImage, setIsSavingImage] = useState(false);

  if (!isOpen) return null;

  const recipient = scanResult.recipientName?.trim() || scanResult.friendName?.trim() || 'Honored Maintainer';
  const projectName = scanResult.projectName || 'Open Source Project';

  const cleanTribute = (scanResult.adaTributeText || scanResult.hypeText || '')
    .replace(/^["'“\s]+|["'”\s]+$/g, '')
    .replace(/\*\*/g, '')
    .trim();

  const archetype = scanResult.styleArchetype || scanResult.styleName || 'WEAVER OF COMPUTATIONAL HARMONY';
  const psi = scanResult.poeticalScienceIndex || scanResult['MCE%'] || '99.9%';
  const diagnostics = scanResult.algorithmicDiagnostics || scanResult.biometricSpecs || [];

  // 1. GitHub PR / Issue Comment Markdown
  const githubCommentMarkdown = `## 🏛️ Commendation from Ada Lovelace & the Open-Source Commons

Dearest **${recipient}**,

Thank you for your tireless stewardship and intellectual craft in **\`${projectName}\`**!

> "${cleanTribute}"
> 
> *— Augusta Ada King, Countess of Lovelace (1815–1852)*

### ✦ Algorithmic Diagnostics
- **Style Archetype:** \`${archetype}\`
- **Poetical Science Index:** \`${psi}\`
${diagnostics.map((d) => `- \`${d.replace(/^[>\s*-]+/, '').replace(/\*\*/g, '')}\``).join('\n')}

*Generated with love and deep respect via Ada Loves Code.*`;

  // 2. Email Body
  const emailSubject = `🏛️ An Ada Lovelace Laurel for your work on ${projectName}!`;
  const emailBody = `Dear ${recipient},

I recently submitted your repository (${projectName}) to Ada Loves Code, an appreciation engine inspired by Ada Lovelace's 1843 concept of "Poetical Science."

Here is your certificate of tribute:

────────────────────────────────────────────
✦ ARCHETYPE: ${archetype}
✦ POETICAL SCIENCE INDEX: ${psi}
────────────────────────────────────────────

ADA LOVELACE'S TRIBUTE:
"${cleanTribute}"

VIRTUES NOTED:
${diagnostics.join('\n')}

Thank you for your open-source devotion and for making technology a more poetic and human space!

With warm gratitude,
A fellow developer`;

  // 3. Social Shoutout (X / LinkedIn)
  const socialText = `Massive appreciation to ${recipient} for their incredible craft on ${projectName}! 

Ada Lovelace's Poetical Science analysis awarded it:
🏛️ Archetype: ${archetype}
✨ Poetical Science Index: ${psi}

"${cleanTribute.slice(0, 160)}..."

#OpenSource #AdaLovelace #SoftwareCraft #Gemini`;

  const handleCopy = (text: string, type: 'all' | 'pr' | 'email' | 'social') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleDownloadStoryPNG = async () => {
    const card = document.getElementById('ada-receipt-card') || document.getElementById('hype-receipt-card');
    if (!card) {
      alert('Card not found. Please scroll down to view the tribute card.');
      return;
    }

    try {
      setIsSavingImage(true);
      const dataUrl = await toPng(card, {
        quality: 0.98,
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: '#140a10',
      });

      const link = document.createElement('a');
      link.download = `ADA_LOVELACE_TRIBUTE_${recipient.toUpperCase().replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export PNG:', err);
      alert('Could not download image. Please use the Download button below the laurel.');
    } finally {
      setIsSavingImage(false);
    }
  };

  const handleSendEmailGmail = () => {
    const encodedSubject = encodeURIComponent(emailSubject);
    const encodedBody = encodeURIComponent(emailBody);
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      maintainerEmail
    )}&su=${encodedSubject}&body=${encodedBody}`;
    window.open(gmailUrl, '_blank');
  };

  const handleSendEmailNative = () => {
    const encodedSubject = encodeURIComponent(emailSubject);
    const encodedBody = encodeURIComponent(emailBody);
    window.location.href = `mailto:${encodeURIComponent(maintainerEmail)}?subject=${encodedSubject}&body=${encodedBody}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative w-full max-w-xl bg-[#160b13] border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden text-amber-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-amber-200/60 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-6">
          {/* Modal Header */}
          <div className="text-center space-y-2 pt-1">
            <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-rose-400 p-[2px] shadow-lg shadow-amber-900/30">
              <div className="w-full h-full bg-[#10060d] rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-rose-400 fill-rose-400/30" />
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
              Commend {recipient}
            </h2>
            <p className="text-xs text-amber-200/70 max-w-md mx-auto">
              Deliver this sincere token of intellectual appreciation via GitHub PR, Issue, Email, or Social Media.
            </p>
          </div>

          {/* OPTION 1: GitHub PR / Issue Comment */}
          <div className="bg-[#1f0f1b] border border-amber-500/20 rounded-xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-black/60 border border-amber-500/30 flex items-center justify-center text-amber-300">
                  <Github className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-200 font-mono">
                    GitHub PR / Issue Commendation
                  </h3>
                  <p className="text-[10px] text-amber-200/50">Formatted Markdown for comments &amp; discussions</p>
                </div>
              </div>
            </div>

            <div className="bg-black/60 p-3 rounded-lg border border-amber-500/20 text-[11px] font-mono text-amber-200/80 max-h-28 overflow-y-auto leading-relaxed">
              <pre className="whitespace-pre-wrap">{githubCommentMarkdown}</pre>
            </div>

            <button
              onClick={() => handleCopy(githubCommentMarkdown, 'pr')}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-amber-400 hover:bg-amber-300 text-black font-mono font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
            >
              {copiedType === 'pr' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>GitHub Markdown Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Copy GitHub Markdown</span>
                </>
              )}
            </button>
          </div>

          {/* OPTION 2: Email to Maintainer */}
          <div className="bg-[#1f0f1b] border border-amber-500/20 rounded-xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-300">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-200 font-mono">
                  Send Letter via Email
                </h3>
                <p className="text-[10px] text-amber-200/50">Gmail Web or Desktop Mail Client</p>
              </div>
            </div>

            <div className="space-y-2">
              <input
                type="email"
                placeholder="Maintainer or contributor email (optional)..."
                value={maintainerEmail}
                onChange={(e) => setMaintainerEmail(e.target.value)}
                className="w-full bg-black/60 border border-amber-500/30 focus:border-rose-400 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 outline-none font-mono"
              />

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleSendEmailGmail}
                  className="py-2.5 px-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Open Gmail</span>
                </button>

                <button
                  onClick={handleSendEmailNative}
                  className="py-2.5 px-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 font-mono font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Mail Client</span>
                </button>
              </div>

              <button
                onClick={() => handleCopy(emailBody, 'email')}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-[11px] font-mono text-amber-300/80 transition-colors cursor-pointer"
              >
                {copiedType === 'email' ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Email Text Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-amber-400" />
                    <span>Copy Full Email Text</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* OPTION 3: Social Shoutout & PNG Image */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={() => handleCopy(socialText, 'social')}
              className="flex items-center justify-center gap-2 py-3 px-3 bg-[#1f0f1b] hover:bg-[#2c1527] border border-amber-500/30 rounded-xl text-xs font-mono font-bold text-amber-200 transition-colors cursor-pointer"
            >
              {copiedType === 'social' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Post Copied!</span>
                </>
              ) : (
                <>
                  <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                  <span>Copy Social Shoutout</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadStoryPNG}
              disabled={isSavingImage}
              className="flex items-center justify-center gap-2 py-3 px-3 bg-[#1f0f1b] hover:bg-[#2c1527] border border-amber-500/30 rounded-xl text-xs font-mono font-bold text-amber-200 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-rose-400" />
              <span>{isSavingImage ? 'Generating PNG...' : 'Save Laurel PNG'}</span>
            </button>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={onClose}
              className="text-xs font-mono text-amber-300/60 hover:text-white uppercase tracking-widest cursor-pointer"
            >
              [Close Window]
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
