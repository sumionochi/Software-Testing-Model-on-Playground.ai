// global.d.ts

interface TranslationLanguageOptions {
  sourceLanguage: string; // e.g., 'en'
  targetLanguage: string; // e.g., 'ja'
}

enum TranslationAvailability {
  Readily = 'readily',
  AfterDownload = 'after-download',
  No = 'no',
}

interface LanguageTranslator {
  translate: (text: string) => Promise<string>;
  destroy: () => Promise<void>;
}

interface TranslationAPI {
  canTranslate: (options: TranslationLanguageOptions) => Promise<TranslationAvailability>;
  createTranslator: (options: TranslationLanguageOptions) => Promise<LanguageTranslator>;
  canDetect: () => Promise<TranslationAvailability>;
  createDetector: () => Promise<LanguageDetector>;
}
  
  interface SummarizerAPI {
    capabilities: () => Promise<{ available: 'readily' | 'downloading' | 'no' }>;
    create: () => Promise<SummarizerInstance>;
  }

  interface SummarizerInstance {
      summarize: (text: string) => Promise<string>;
      destroy: () => Promise<void>;
  }
  
// Common Types
type AIWriterTone = 'formal' | 'neutral' | 'casual';
type AIRewriterTone = 'as-is' | 'more-formal' | 'more-casual';

type AIWriterLength = 'short' | 'medium' | 'long';
type AIRewriterLength = 'as-is' | 'shorter' | 'longer';

type AIWriterFormat = 'plain-text' | 'markdown';
type AIRewriterFormat = 'as-is' | 'plain-text' | 'markdown';

interface AbortSignal {
  // Standard AbortSignal interface
}

// Writer API Interfaces

interface AIWriterFactory {
  create(): Promise<AIWriter>;
}

interface AIWriter {
  write(input: string, options?: AIWriterWriteOptions): Promise<string>;
  writeStreaming(input: string, options?: AIWriterWriteOptions): AsyncIterable<string>;
  destroy(): void;
}

interface AIWriterWriteOptions {
  context?: string;
  signal?: AbortSignal;
}

// Rewriter API Interfaces

interface AIRewriterFactory {
  create(options?: AIRewriterCreateOptions): Promise<AIRewriter>;
}

interface AIRewriter {
  rewrite(input: string, options?: AIRewriterRewriteOptions): Promise<string>;
  rewriteStreaming(input: string, options?: AIRewriterRewriteOptions): AsyncIterable<string>;
  destroy(): void;
}

interface AIRewriterCreateOptions {
  sharedContext: string;
  tone?: AIRewriterTone;
  length?: AIRewriterLength;
  format?: AIRewriterFormat;
  signal?: AbortSignal;
}

interface AIRewriterRewriteOptions {
  context?: string;
  signal?: AbortSignal;
}

//Language
  
  interface AILanguageModel {
    prompt(input: string, options?: AILanguageModelPromptOptions): Promise<string>;
    promptStreaming(input: string, options?: AILanguageModelPromptOptions): ReadableStream<string>;
    countPromptTokens(input: string, options?: AILanguageModelPromptOptions): Promise<number>;
    destroy(): void;
    tokensSoFar: number;
    maxTokens: number;
    tokensLeft: number;
    topK: number;
    temperature: number;
  }
  
  interface AILanguageModelCapabilities {
    available: "readily" | "after-download" | "no";
    defaultTopK: number | null;
    maxTopK: number | null;
    defaultTemperature: number | null;
  }
  
  interface AILanguageModelCreateOptions {
    signal?: AbortSignal;
    monitor?: (monitor: AICreateMonitor) => void;
    systemPrompt?: string;
    initialPrompts?: AILanguageModelPrompt[];
    topK?: number;
    temperature?: number;
  }
  
  interface AILanguageModelPromptOptions {
    signal?: AbortSignal;
  }
  
  interface AILanguageModelPrompt {
    role: "system" | "user" | "assistant";
    content: string;
  }
  
  interface AICreateMonitor {
    addEventListener(
      type: "downloadprogress",
      listener: (e: ProgressEvent) => void
    ): void;
  }

  interface LanguageModelAPI {
    capabilities(): Promise<AILanguageModelCapabilities>;
      create(options?: AILanguageModelCreateOptions): Promise<AILanguageModel>;
  }
  
  interface AIAPI {
    summarizer?: SummarizerAPI;
    writer: AIWriterFactory;
    rewriter: AIRewriterFactory;
    languageModel?: LanguageModelAPI;
    translation?: TranslationAPI;
  }
  
  interface Window {
    translation?: TranslationAPI;
    ai?: AIAPI;
  }
  