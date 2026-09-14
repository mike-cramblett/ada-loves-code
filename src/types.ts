export interface AdaTribute {
  projectName: string;
  styleArchetype: string;
  poeticalScienceIndex: string;
  algorithmicDiagnostics: string[];
  adaTributeText: string;
  highlights?: string[];
  laurelSigil?: string;
  targetType?: 'self' | 'maintainer';
  recipientName?: string;
  sourceType?: 'github' | 'zip' | 'file' | 'snippet' | 'demo';
  sourceIdentifier?: string;
  // Aliases for compatibility
  styleName?: string;
  'MCE%'?: string;
  biometricSpecs?: string[];
  hypeText?: string;
  friendName?: string;
}

export type ScanResult = AdaTribute;

export interface CreditsResponse {
  userId: string;
  creditsRemaining: number;
  maxCredits?: number;
}

export interface ScanApiResponse {
  success: boolean;
  scanResult?: AdaTribute;
  creditsRemaining?: number;
  error?: string;
}

export interface RepoInspectResponse {
  success: boolean;
  repo?: {
    name: string;
    fullName: string;
    description: string;
    stars: number;
    language: string;
    license?: string;
    topics: string[];
    readmeExcerpt?: string;
    fileTree?: string[];
  };
  error?: string;
}

