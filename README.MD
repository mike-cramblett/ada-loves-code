# 🏛️ Ada Loves Code (ALC)

> **"The Analytical Engine weaves algebraical patterns just as the Jacquard-loom weaves flowers and leaves."**  
> — *Augusta Ada King, Countess of Lovelace (1843, Note G)*

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-3.5_Flash_Lite-8E75C2?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg?style=flat-square)](LICENSE)

**Ada Loves Code** is an open-source code appreciation engine. Guided by the historical persona of Ada Lovelace and her philosophy of *Poetical Science*, ALC inspects repositories, code archives, or algorithms and generates deep, sincere architectural praise and engraved, downloadable **"Certificates of Poetical Science"** (Laurels) for social sharing, GitHub PR comments, or email commendations.

---

## ⚡ Quick Start: How to Use It

If you have code or a repository you'd like to inspect right now:
1. Open the app: **[Launch Ada Loves Code](https://ada-loves-code.ai.studio/)** 
2. Select your dedication mode:
   * **My Code / Repo:** To inspect and celebrate your own project.
   * **Honor a Maintainer:** To generate a bespoke epistolary laurel dedicated to an open-source contributor or friend.
3. Paste a **public GitHub repository URL**, upload a **ZIP archive** of code files, or paste a raw **code snippet**.
4. Click **Generate Ada Lovelace Code Tribute** to engrave your certificate.
5. Export as a high-resolution PNG, copy the formatted GitHub Markdown for PR/Issue discussions, or open a pre-filled letter in Gmail.

---

## 📜 The Manifesto: Why "Ada Loves Code" Exists

Most developer tooling is fundamentally adversarial. Linters scream at your formatting, static analyzers red-line your syntax, and the internet is flooded with cynical "roast my code" bots. 

For me, the motivation begins with a simple categorical imperative: **I want to say nice things to people.**

Beyond that, there is a serious mathematical and cultural argument to be made:
* **The Modern Royal Society:** In 2026, the public developer ecosystem—GitHub commits, Dev.to articles, issue trackers, and open PRs—functions as humanity's living peer-review system.
* **The Attention Economy is Toxic to Science:** Algorithms designed to keep teenagers scrolling 15-second dance choreography have no business governing computer science. When an algorithm rewards outrage, controversy, and engagement-bait, quiet, high-integrity craftsmanship gets buried under noise.
* **A Countermeasure to the Eerie Silence:** You spend hours, days, or weeks pouring cognitive energy into an open-source tool, release it into the world, and are met with zero votes, zero stars, and total silence. 

**I made the Laurel cards to break that silence.** 

ALC is designed to be **less than a corporate badge, more than a participation trophy, and a very clear "you have been seen" marker.** It is an intentional, tangible token of respect for the human hours spent solving difficult logic.

---

## 🧪 Field-Tested in the Wild

Rather than testing ALC in a vacuum on sterile demo files or famous corporate repositories, I field-tested it on overlooked projects submitted to a recent developer hackathon. 

I scrolled through entries sitting at 0 to 2 comments—projects that had slipped through algorithmic cracks—read their code, tested their demos, and gifted their authors an engraved Certificate of Poetical Science:
* **Accessible Guide Dog Training:** Validating a mobile-first project using browser speech synthesis to train shelter puppies for blind handlers (`Pound-Puppies-to-Guide-Dogs-for-the-Blind`).
* **Local-First Generosity Compilers:** Praising a privacy-preserving Next.js planning tool that treats charity as a structured engineering problem (`Doneehub`).
* **Nonprofit Financial Hygiene:** Celebrating a data pipeline ingesting 13 years of IRS Form 990 filings to dismantle the harmful "overhead ratio" myth (`GlassPocket`).
* **Federal Data Cartography:** Commending zero-ETL Snowflake pipelines mapping quiet disaster aid deserts across Florida (`Where Need Meets Nothing`).

Reading someone's code and giving them structured, literate validation took no more time than skimming a feed, but it turned cold statistics into human warmth.

---

## 🏛️ Why Augusta Ada King, Countess of Lovelace?

1. **A Voice of Revered Gravitas:** Meaningful praise requires a persona with historical stature. Ada Lovelace is universally recognized as the world's first computer programmer.
2. **Latent Mathematical Harmony:** Ada’s 1843 *Note G*, her correspondence with Charles Babbage, and her letters are deeply embedded in modern LLM corpora. Her epistolary syntax naturally resists corporate RLHF flattening without requiring expensive fine-tuning.
3. **The Digital Ghost:** I like to imagine that Ada wouldn't mind being resurrected this way. She would love to wake up, read modern TypeScript and Python joinery, weave poetry about state machines and async loops, and celebrate human intellect across the chasm of two centuries.

---

## 🛠️ Architecture & Technical Stack

```
┌─────────────────────────────────────────────────────────────┐
│                    Ada Loves Code Client                    │
│   (React 19 + TypeScript + Tailwind CSS v4 + JSZip)         │
└──────────────┬──────────────────────────────┬───────────────┘
               │ GitHub URL                   │ Extracted Files / Snippet
               ▼                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Express Middleware Server                  │
│  - GitHub API Ingestion (Readme, File Tree, AST metadata)   │
│  - Rate-limiting & Token Management (5,000 req/hr)          │
└──────────────────────────────┬──────────────────────────────┘
                               │ Structured Context + Ada Persona
                               ▼
┌─────────────────────────────────────────────────────────────┐
│              Google GenAI (Gemini 3.5 Flash Lite)           │
│  - Enforced JSON Schema Output (Type.OBJECT)                │
│  - Mathematical & Epistolary Synthesis                     │
└──────────────────────────────┬──────────────────────────────┘
                               │ Validated Tribute Payload
                               ▼
┌─────────────────────────────────────────────────────────────┐
│            Thermal Archival Canvas (html-to-image)          │
│  - 2x Pixel Ratio Vector & Monospace Rendering              │
│  - Exportable 1-Click PNG Laurel & GitHub PR Markdown       │
└─────────────────────────────────────────────────────────────┘
```

* **Client:** React 19, TypeScript, Tailwind CSS v4, Lucide icons, and `JSZip` for safe in-browser extraction of multi-file `.zip` archives without server upload bloat.
* **Backend:** Express API proxying GitHub API v3 and Google GenAI.
* **LLM Core:** **Gemini 3.5 Flash Lite** via `@google/genai`, selected for rapid latency, high context efficiency, and cost-effective structured JSON compliance.
* **Export Engine:** `html-to-image` rasterizing vintage serif and monospace typography into crisp PNG cards.

---

## 🔧 Local Development & Self-Hosting

### Prerequisites
* **Node.js:** v20+ 
* **Google Gemini API Key:** From [Google AI Studio](https://aistudio.google.com/)
* *(Optional)* **GitHub Personal Access Token:** To boost GitHub API rate limits from 60 to 5,000 requests/hour.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/ada-loves-code.git
   cd ada-loves-code
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env`:
   ```env
   PORT=3000
   GEMINI_API_KEY=your_gemini_api_key_here
   GITHUB_TOKEN=your_github_personal_access_token_here
   ```
4. Start development server:
   ```bash
   npm run dev
   ```
5. Build for production:
   ```bash
   npm run build
   npm start
   ```

---

## ❓ FAQ

#### "Why doesn't Ada Loves Code analyze code correctness or find bugs?"
Because linters, test runners, and static analyzers already exist in every developer's editor. Tasking an LLM with strict compiler verification introduces hallucination risks, and trying to optimize for poetic resonance while simultaneously playing compiler produces muddy results. ALC focuses solely on celebrating architecture, problem-solving, and craftsmanship.

#### "Can I use this for non-GitHub code?"
Yes. You can paste raw code snippets or upload a `.zip` archive directly in the browser.

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.

*Calculatio Cordis, Ars Aeterna.* ✦
