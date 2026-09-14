import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { getUserCredits, getUserCreditInfo, decrementUserCredits, getDb, saveDb } from './server/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '20mb' }));

// Serve static assets directory
const assetsDir = path.join(process.cwd(), 'assets');
if (fs.existsSync(assetsDir)) {
  app.use('/assets', express.static(assetsDir));
}
const publicDir = path.join(process.cwd(), 'public');
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
}

// Cached Demo Scan Data for Ada Lovelace Code Praise
const CACHED_DEMO_RESULT = {
  projectName: 'babbage-analytical-engine-simulator',
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
};

// 0. GET /api/demo-scan (Simulated zero-credit demo scan)
app.get('/api/demo-scan', (req, res) => {
  res.json({
    success: true,
    isDemo: true,
    scanResult: CACHED_DEMO_RESULT,
    creditsRemaining: null,
  });
});

// Helper to parse GitHub URLs (e.g. 'https://github.com/owner/repo', 'owner/repo')
function parseGitHubUrl(input: string): { owner: string; repo: string } | null {
  if (!input) return null;
  const clean = input.trim().replace(/\/+$/, '');
  const match = clean.match(/(?:github\.com\/|^)([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)/);
  if (match) {
    return { owner: match[1], repo: match[2].replace(/\.git$/, '') };
  }
  return null;
}

// Helper to fetch GitHub repo details
async function fetchGitHubRepoDetails(owner: string, repo: string) {
  const headers: Record<string, string> = {
    'User-Agent': 'AdaLovesCode-Agent/1.0',
    Accept: 'application/vnd.github.v3+json',
  };

  // Add the token if present in your environment
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN.trim()}`;
  }

  const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
  if (!repoRes.ok) {
    throw new Error(`GitHub repository "${owner}/${repo}" was not found or rate-limited (${repoRes.status})`);
  }
  const repoData = await repoRes.json();

  let readmeExcerpt = '';
  try {
    const readmeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, { headers });
    if (readmeRes.ok) {
      const readmeData = await readmeRes.json();
      if (readmeData.content) {
        const decoded = Buffer.from(readmeData.content, 'base64').toString('utf-8');
        readmeExcerpt = decoded.slice(0, 3000);
      }
    }
  } catch (err) {
    // Ignore readme fetch error
  }

  let fileTree: string[] = [];
  try {
    const branch = repoData.default_branch || 'main';
    const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`, { headers });
    if (treeRes.ok) {
      const treeData = await treeRes.json();
      if (Array.isArray(treeData.tree)) {
        fileTree = treeData.tree.map((f: any) => f.path).slice(0, 100);
      }
    }
  } catch (err) {
    // Ignore tree fetch error
  }

  return {
    name: repoData.name,
    fullName: repoData.full_name,
    description: repoData.description || 'Open source repository',
    stars: repoData.stargazers_count,
    forks: repoData.forks_count,
    language: repoData.language || 'Code',
    topics: repoData.topics || [],
    license: repoData.license?.spdx_id || repoData.license?.name || 'Open Source',
    readmeExcerpt,
    fileTree,
  };
}

// GitHub inspection endpoint
app.get('/api/github-inspect', async (req, res) => {
  try {
    const repoQuery = (req.query.repo || req.query.url) as string;
    if (!repoQuery) {
      return res.status(400).json({ error: 'Missing repo parameter' });
    }
    const parsed = parseGitHubUrl(repoQuery);
    if (!parsed) {
      return res.status(400).json({ error: 'Invalid GitHub repository format. Use "owner/repo" or full URL' });
    }
    const details = await fetchGitHubRepoDetails(parsed.owner, parsed.repo);
    res.json({ success: true, repo: details });
  } catch (err: any) {
    console.error('GitHub inspect error:', err);
    res.status(404).json({ error: err.message || 'Failed to inspect GitHub repository' });
  }
});

// Helper to get userId from Authorization header
function getUserIdFromReq(req: express.Request): string {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    if (token) return token;
  }
  return 'default-anon-user';
}

// 1. GET /api/credits
app.get('/api/credits', async (req, res) => {
  try {
    const userId = getUserIdFromReq(req);
    const { creditsRemaining, maxCredits } = await getUserCreditInfo(userId);
    res.json({ userId, creditsRemaining, maxCredits });
  } catch (error: any) {
    console.error('Error fetching credits:', error);
    res.status(500).json({ error: 'Failed to fetch credit balance' });
  }
});

// 2. POST /api/scan
app.post('/api/scan', async (req, res) => {
  try {
    const {
      repoUrl,
      files,
      codeSnippet,
      projectName,
      sourceType = 'github',
      imageBase64,
      mimeType = 'image/jpeg',
      isDemo,
      targetType = 'self',
      recipientName = '',
      friendName = '',
    } = req.body;

    const actualRecipient = recipientName || friendName;

    // Zero-credit instant simulated scan for demo mode
    if (isDemo) {
      return res.json({
        success: true,
        isDemo: true,
        scanResult: {
          ...CACHED_DEMO_RESULT,
          targetType,
          recipientName: targetType === 'maintainer' ? (actualRecipient || 'Honored Maintainer') : undefined,
          sourceType: 'demo',
          sourceIdentifier: 'babbage-analytical-engine-simulator',
        },
        creditsRemaining: null,
      });
    }

    const userId = getUserIdFromReq(req);
    const creditsRemaining = await getUserCredits(userId);

    if (creditsRemaining <= 0) {
      return res.status(429).json({
        error: "You've reached today's 25 Ada tribute limit! Your daily quota resets at midnight.",
        creditsRemaining: 0,
      });
    }

    // Prepare code and context details
    let codeContext = '';
    let detectedProjectName = projectName || 'Open Source Project';

    // 1. GitHub repo fetch if provided
    if (repoUrl) {
      const parsed = parseGitHubUrl(repoUrl);
      if (parsed) {
        try {
          const details = await fetchGitHubRepoDetails(parsed.owner, parsed.repo);
          detectedProjectName = details.fullName;
          codeContext += `REPOSITORY: ${details.fullName}\n`;
          codeContext += `DESCRIPTION: ${details.description}\n`;
          codeContext += `PRIMARY LANGUAGE: ${details.language}\n`;
          codeContext += `STARS: ${details.stars} | FORKS: ${details.forks} | LICENSE: ${details.license}\n`;
          if (details.topics.length > 0) {
            codeContext += `TOPICS: ${details.topics.join(', ')}\n`;
          }
          if (details.fileTree && details.fileTree.length > 0) {
            codeContext += `FILE ARCHITECTURE TREE SAMPLE:\n${details.fileTree.slice(0, 40).map(p => `- ${p}`).join('\n')}\n\n`;
          }
          if (details.readmeExcerpt) {
            codeContext += `README EXCERPT:\n${details.readmeExcerpt}\n\n`;
          }
        } catch (err: any) {
          console.warn('Could not fetch GitHub details directly:', err.message);
          codeContext += `REPOSITORY URL: ${repoUrl}\n`;
        }
      }
    }

    // 2. Uploaded code files or unpacked zip contents
    if (Array.isArray(files) && files.length > 0) {
      codeContext += `\nUPLOADED PROJECT FILES (${files.length} files):\n`;
      for (const f of files.slice(0, 15)) {
        if (f.name && f.content) {
          codeContext += `--- FILE: ${f.name} ---\n${f.content.slice(0, 2500)}\n\n`;
        }
      }
    }

    // 3. Raw code snippet
    if (codeSnippet && codeSnippet.trim()) {
      codeContext += `\nCODE SNIPPET:\n${codeSnippet.slice(0, 6000)}\n\n`;
    }

    // Fallback if empty
    if (!codeContext && !imageBase64) {
      return res.status(400).json({ error: 'Please provide a GitHub repository, upload a zip / code files, or paste a code snippet.' });
    }

    // Read Ada Lovelace persona prompt
    const promptPath = path.join(process.cwd(), 'server', 'prompts', 'ada_persona.txt');
    let personaPrompt = '';
    try {
      personaPrompt = fs.readFileSync(promptPath, 'utf-8');
    } catch (e) {
      console.error('Failed to read ada_persona.txt prompt:', e);
      personaPrompt = `You are Augusta Ada King, Countess of Lovelace. Praise this open source codebase with poetical science, high intellectual reverence, and Victorian eloquence.`;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY environment variable is not configured' });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    let contextDirective = '';
    if (targetType === 'maintainer' || targetType === 'friend') {
      const sanitizedName = (actualRecipient || 'the open-source maintainer / collaborator').trim();
      contextDirective = `\n\nSPECIAL DEDICATION - COMMENDING A MAINTAINER / CONTRIBUTOR:\nThis compliment is being generated as a personal epistolary tribute for ${sanitizedName}. Frame your words as a heartfelt, inspiring letter of admiration addressed directly to ${sanitizedName}, celebrating their tireless devotion, architectural clarity, and generous gift to humanity.`;
    }

    const promptText = `${personaPrompt}${contextDirective}\n\nINSPECT THIS CODEBASE AND GENERATE THE TRIBUTE:\n${codeContext}`;

    const parts: any[] = [];
    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      parts.push({
        inlineData: {
          mimeType,
          data: cleanBase64,
        },
      });
    }
    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash-lite',
      contents: { parts },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            projectName: {
              type: Type.STRING,
              description: 'Name of the repository or project',
            },
            styleArchetype: {
              type: Type.STRING,
              description: 'Poetic, evocative architectural archetype in uppercase (e.g. WEAVER OF ASYNC HARMONIES)',
            },
            poeticalScienceIndex: {
              type: Type.STRING,
              description: 'Poetical Science Index percentage string (e.g. 99.8% ELEGANCE)',
            },
            algorithmicDiagnostics: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Array of EXACTLY 4 to 5 lines, each beginning with "> "',
            },
            adaTributeText: {
              type: Type.STRING,
              description: 'Uncut, deeply sincere, eloquent epistolary tribute in Ada Lovelace voice referencing specific details',
            },
            highlights: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3 to 4 specific architectural virtues observed in the code',
            },
            laurelSigil: {
              type: Type.STRING,
              description: 'A poetic Latin or Victorian computational motto',
            },
          },
          required: [
            'projectName',
            'styleArchetype',
            'poeticalScienceIndex',
            'algorithmicDiagnostics',
            'adaTributeText',
            'highlights',
            'laurelSigil',
          ],
        },
      },
    });

    const rawText = response.text || '{}';
    let scanResult: any;
    try {
      scanResult = JSON.parse(rawText);
      scanResult.targetType = targetType;
      scanResult.recipientName = actualRecipient || undefined;
      scanResult.sourceType = sourceType;
      scanResult.sourceIdentifier = detectedProjectName;
      if (!scanResult.projectName) {
        scanResult.projectName = detectedProjectName;
      }
      // Set backward compatibility aliases
      scanResult.styleName = scanResult.styleArchetype;
      scanResult['MCE%'] = scanResult.poeticalScienceIndex;
      scanResult.biometricSpecs = scanResult.algorithmicDiagnostics;
      scanResult.hypeText = scanResult.adaTributeText;
      scanResult.friendName = actualRecipient || undefined;
    } catch (e) {
      console.error('Failed to parse Gemini JSON response:', rawText);
      return res.status(500).json({ error: 'Failed to parse AI response' });
    }

    // Decrement credit atomically on success
    const newCredits = await decrementUserCredits(userId);

    return res.json({
      success: true,
      scanResult,
      creditsRemaining: newCredits,
    });
  } catch (error: any) {
    console.error('Scan API error:', error);
    return res.status(500).json({ error: error.message || 'An error occurred during codebase analysis' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
