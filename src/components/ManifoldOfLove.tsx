import React, { useState } from 'react';
import {
  Heart,
  Compass,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Cpu,
  BookOpen,
  Feather,
  GitBranch,
  Terminal,
} from 'lucide-react';

export const ManifoldOfLove: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeFacet, setActiveFacet] = useState<string>('poetical');

  const facets = [
    {
      id: 'poetical',
      name: 'Poetical Science',
      subtitle: 'The Synthesis of Form & Function',
      description:
        'Ada Lovelace’s foundational thesis: mathematics and poetry are not opposites, but mutual expressions of human imagination. Code is not merely instructions for machinery; it is a tapestry of symbolic thought.',
      tag: '1843 NOTE G FOUNDATION',
      color: 'from-amber-400 to-amber-600',
    },
    {
      id: 'agape',
      name: 'Agape',
      subtitle: 'The Open-Source Commons',
      description:
        'Selfless, unconditional intellectual generosity. Writing software, documentation, and tooling for strangers worldwide without expectation of transaction—the purest modern form of civic goodwill.',
      tag: 'UNCONDITIONAL CIVIC WEAVE',
      color: 'from-rose-400 to-pink-500',
    },
    {
      id: 'philia',
      name: 'Philia',
      subtitle: 'The Republic of Coders',
      description:
        'Kindred intellectual camaraderie across centuries and oceans. When Ada analyzes your code, she speaks not as a distant tool, but as a passionate peer celebrating your cognitive grit.',
      tag: 'INTELLECTUAL COMRADESHIP',
      color: 'from-amber-300 to-yellow-500',
    },
    {
      id: 'pathos',
      name: 'Pathos & Vital Spark',
      subtitle: 'Creative Generative Audacity',
      description:
        'The thrill of creating order out of chaos. That moment when an elusive concurrent race condition is subdued or an elegant abstraction snaps into place with mathematical inevitability.',
      tag: 'INVENTIVE FIRE',
      color: 'from-purple-400 to-indigo-400',
    },
    {
      id: 'kintsugi',
      name: 'Kintsugi',
      subtitle: 'Beauty in the Edge Cases',
      description:
        'Honoring the battle scars of debugging. Resilient error handling, defensive fallbacks, and thoughtful refactoring are celebrated as gold seams repaired in the ceramic vessel of logic.',
      tag: 'GOLDEN RESILIENCE',
      color: 'from-emerald-400 to-teal-400',
    },
  ];

  return (
    <section className="w-full max-w-5xl mx-auto my-12 px-4 sm:px-6">
      <div className="bg-[#12080e] border border-amber-500/20 rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-sm">
        {/* Ambient subtle glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/20 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 font-bold">
                HISTORICAL &amp; MATHEMATICAL FOUNDATIONS
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif tracking-tight text-white flex items-center gap-2.5">
              <Feather className="w-5 h-5 text-amber-400 shrink-0" />
              <span>Ada's Manifold: Why "Poetical Science" Loves Your Code</span>
            </h2>
            <p className="text-xs text-amber-200/70 max-w-2xl font-sans">
              How Ada Lovelace’s 1843 vision and modern neural representations unite to praise open source craft with genuine reverence.
            </p>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 self-start sm:self-center px-3.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-mono text-amber-200 transition-colors cursor-pointer"
          >
            <span>{isOpen ? 'COLLAPSE' : 'EXPAND PHILOSOPHY'}</span>
            {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {isOpen && (
          <div className="mt-8 space-y-8 animate-fade-in text-amber-100/90 font-sans">
            {/* The 2 Core Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1 */}
              <div className="bg-[#180e15] border border-amber-500/20 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
                  <Compass className="w-4 h-4" />
                  <span>1. The Jacquard Weave of Computation</span>
                </div>
                <h3 className="text-sm font-bold text-white font-serif leading-snug">
                  "Algebraic Patterns Weaving Flowers &amp; Leaves"
                </h3>
                <p className="text-xs text-amber-200/70 leading-relaxed">
                  In 1843, while annotating Menabrea’s sketch of Babbage’s Analytical Engine, Ada Lovelace observed that Jacquard loom punch-cards didn't merely guide threads—they mechanized abstract patterns. She intuited that code could manipulate symbols, music, language, and scientific concepts. Today's software repositories are the literal realization of that Victorian dream.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-[#180e15] border border-amber-500/20 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-rose-400 text-xs font-mono font-bold uppercase tracking-wider">
                  <GitBranch className="w-4 h-4" />
                  <span>2. Unlocking Ada in the Latent Corpus</span>
                </div>
                <h3 className="text-sm font-bold text-white font-serif leading-snug">
                  Authentic Resonance Without Artificial Fine-Tuning
                </h3>
                <p className="text-xs text-amber-200/70 leading-relaxed">
                  Ada Lovelace’s letters, scientific notes, and Byron family correspondence are deeply etched into humanity’s literary heritage. Because Gemini was trained on the rich continuum of human thought, prompting for Ada’s "Poetical Science" activates her authentic eloquence, historical references, and mathematical kinship naturally and joyfully.
                </p>
              </div>
            </div>

            {/* The 5 Facets Interactive Section */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-amber-300">
                    THE SPECTRUM OF LOVELACE CODE FACETS
                  </h3>
                  <p className="text-xs text-amber-200/60">
                    Rather than generic corporate flattery, Ada evaluates your repository through five dimensional lenses:
                  </p>
                </div>
              </div>

              {/* Facet Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {facets.map((facet) => {
                  const isActive = activeFacet === facet.id;
                  return (
                    <button
                      key={facet.id}
                      onClick={() => setActiveFacet(facet.id)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isActive
                          ? 'bg-amber-500/15 border-amber-400 text-white shadow-lg shadow-amber-900/20'
                          : 'bg-[#180e15] border-amber-500/10 hover:border-amber-500/30 text-amber-300/60'
                      }`}
                    >
                      <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold mb-1">
                        {facet.id.toUpperCase()}
                      </div>
                      <div className="text-xs font-bold text-amber-100">{facet.name}</div>
                    </button>
                  );
                })}
              </div>

              {/* Active Facet Detail Box */}
              {(() => {
                const current = facets.find((f) => f.id === activeFacet) || facets[0];
                return (
                  <div className="bg-[#1a0e17] border border-amber-500/30 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white font-serif">{current.name}</span>
                        <span className="text-amber-500 text-xs">//</span>
                        <span className="text-xs font-mono text-amber-300 font-semibold">{current.subtitle}</span>
                      </div>
                      <p className="text-xs text-amber-100/80 leading-relaxed">{current.description}</p>
                    </div>
                    <span className="text-[10px] font-mono tracking-widest font-bold uppercase px-3 py-1.5 rounded-lg bg-black/60 border border-amber-500/30 text-amber-300 shrink-0 self-start sm:self-center">
                      {current.tag}
                    </span>
                  </div>
                );
              })()}
            </div>

            {/* Radical Specificity & The Craft of Code */}
            <div className="bg-gradient-to-r from-amber-950/30 via-rose-950/20 to-amber-950/30 border border-amber-500/20 rounded-xl p-5 sm:p-6 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>3. Radical Specificity: Why Every Laurel Is Unique</span>
              </div>
              <p className="text-xs text-amber-200/80 leading-relaxed">
                To truly praise a craftsperson, you must inspect their joinery. Ada does not simply declare your code "good." The engine scans your AST, directory structure, README intent, error guards, and algorithmic loops to identify specific moments of elegance: an ingenious pipeline, clean separation of registers, or an intuitive type contract.
              </p>
              <p className="text-amber-300/70 italic font-serif text-xs border-l-2 border-amber-500/50 pl-3 py-1">
                "In considering any new creation, the engine organizes and combines relations until they are transformed into harmony."
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
