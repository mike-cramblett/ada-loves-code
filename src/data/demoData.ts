import { AdaTribute } from '../types';

export interface DemoProject {
  id: string;
  name: string;
  repoUrl: string;
  language: string;
  description: string;
  snippet?: string;
  scanResult: AdaTribute;
}

export const DEMO_PROJECTS: DemoProject[] = [
  {
    id: 'babbage-engine',
    name: 'babbage-analytical-engine',
    repoUrl: 'https://github.com/lovelace-labs/babbage-analytical-engine',
    language: 'Python / Rust',
    description: 'A cycle-accurate simulator of Charles Babbage’s Analytical Engine and Jacquard card weaving punch reader.',
    snippet: `class AnalyticalEngine:
    """A simulator of the 1843 Mechanical Computing Engine."""
    def __init__(self, registers: int = 1000):
        self.store = [0] * registers  # Mechanical column registers
        self.mill = ArithmeticMill()   # Central processing gears
        self.operation_cards = []

    def weave_bernoulli(self, n: int) -> float:
        # Note G: Recurrence relation for Bernoulli Numbers
        # "The Analytical Engine weaves algebraical patterns
        #  just as the Jacquard-loom weaves flowers and leaves."
        b = [0.0] * (n + 1)
        b[0] = 1.0
        for m in range(1, n + 1):
            s = sum(comb(m + 1, k) * b[k] for k in range(m))
            b[m] = -s / (m + 1)
        return b[n]`,
    scanResult: {
      projectName: 'babbage-analytical-engine',
      styleArchetype: 'ALGEBRAIC WEAVER OF THE CELESTIAL JACQUARD',
      poeticalScienceIndex: '99.9% POETICAL HARMONY',
      algorithmicDiagnostics: [
        '> JACQUARD MODULARITY: Operational card sequences separated with exquisite architectural lucidity',
        '> ARITHMETICAL HARMONY: Bernoulli recurrence calculation executed with zero register drift',
        '> SYMBOLIC WEAVE: Memory store and execution mill orchestrated in pristine mathematical accord',
        '> OPEN NOBILITY: A luminous, selfless gift to the collective library of human computational thought',
      ],
      adaTributeText:
        'My dearest fellow programmer! How my heart thrills to witness this magnificent creation! You have not merely written instructions for a machine; you have woven algebraical patterns just as the Jacquard loom weaves flowers and leaves. In the elegant cadence of your loops and the serene clarity of your state management, I recognize the true spirit of Poetical Science. You have given humanity an enduring work of intellectual grace—a testament that code is our modern poetry.',
      highlights: [
        'Exemplary separation between the "Store" (memory registers) and the "Mill" (computation engine)',
        'Immaculate numerical precision avoiding overflow in dynamic iteration cycles',
        'Generous open-source documentation inviting minds from every corner of the world to learn and create',
      ],
      laurelSigil: 'Textura Algebraica, Mens Aeterna',
      sourceType: 'demo',
      sourceIdentifier: 'babbage-analytical-engine',
      // Compatibility aliases
      styleName: 'ALGEBRAIC WEAVER OF THE CELESTIAL JACQUARD',
      'MCE%': '99.9%',
      biometricSpecs: [
        '> JACQUARD MODULARITY: Operational card sequences separated with exquisite architectural lucidity',
        '> ARITHMETICAL HARMONY: Bernoulli recurrence calculation executed with zero register drift',
        '> SYMBOLIC WEAVE: Memory store and execution mill orchestrated in pristine mathematical accord',
        '> OPEN NOBILITY: A luminous, selfless gift to the collective library of human computational thought',
      ],
      hypeText:
        'My dearest fellow programmer! How my heart thrills to witness this magnificent creation! You have not merely written instructions for a machine; you have woven algebraical patterns just as the Jacquard loom weaves flowers and leaves. In the elegant cadence of your loops and the serene clarity of your state management, I recognize the true spirit of Poetical Science. You have given humanity an enduring work of intellectual grace—a testament that code is our modern poetry.',
    },
  },
  {
    id: 'fastapi',
    name: 'tiangolo/fastapi',
    repoUrl: 'https://github.com/tiangolo/fastapi',
    language: 'Python',
    description: 'Modern, fast (high-performance) web framework for building APIs with Python based on standard type hints.',
    scanResult: {
      projectName: 'tiangolo/fastapi',
      styleArchetype: 'ARCHITECT OF ASYNC INTELLECTUAL SYMMETRY',
      poeticalScienceIndex: '99.7% TYPE ELEGANCE',
      algorithmicDiagnostics: [
        '> TYPE INTUITION: Elegant type hinting transformed into living runtime validation contracts',
        '> CONCURRENT CHOREOGRAPHY: Asynchronous coroutines executed with effortless clockwork poise',
        '> DEVELOPER ERGONOMICS: Pristine OpenAPI documentation generated as pure mathematical byproduct',
        '> GLOBAL COMMONWEALTH: Millions of services running upon the shoulders of this open benevolence',
      ],
      adaTributeText:
        'What breathtaking ingenuity! In FastAPI, one sees how rigorous mechanical constraints—type definitions and asynchronous event loops—need not bind the mind, but rather liberate it to build towering architectures of light and speed. You have made the act of engineering an API feel like composing a sonata where every parameter is harmonious. It is a profound triumph of Poetical Science.',
      highlights: [
        'Declarative dependency injection that reads like pure symbolic deduction',
        'Seamless union of Pydantic schemas and Starlette routing',
        'Remarkable empathy for fellow engineers reflected in every thoughtful error diagnostic',
      ],
      laurelSigil: 'In Arte Computandi, Anima Vivens',
      sourceType: 'demo',
      sourceIdentifier: 'tiangolo/fastapi',
      styleName: 'ARCHITECT OF ASYNC INTELLECTUAL SYMMETRY',
      'MCE%': '99.7%',
      biometricSpecs: [
        '> TYPE INTUITION: Elegant type hinting transformed into living runtime validation contracts',
        '> CONCURRENT CHOREOGRAPHY: Asynchronous coroutines executed with effortless clockwork poise',
        '> DEVELOPER ERGONOMICS: Pristine OpenAPI documentation generated as pure mathematical byproduct',
        '> GLOBAL COMMONWEALTH: Millions of services running upon the shoulders of this open benevolence',
      ],
      hypeText:
        'What breathtaking ingenuity! In FastAPI, one sees how rigorous mechanical constraints—type definitions and asynchronous event loops—need not bind the mind, but rather liberate it to build towering architectures of light and speed. You have made the act of engineering an API feel like composing a sonata where every parameter is harmonious. It is a profound triumph of Poetical Science.',
    },
  },
];

export const DEMO_DATA = {
  portraitUrl: '/assets/ada-lovelace.jpg',
  scanResult: DEMO_PROJECTS[0].scanResult,
};
