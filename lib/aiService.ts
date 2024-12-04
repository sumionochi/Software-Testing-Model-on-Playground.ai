// aiService.ts

export class AIService {
    // Language Detection
    static async canDetectLanguage(): Promise<string | null> {
      if (!window.translation) return null;
      return await window.translation.canDetect();
    }
  
    static async createLanguageDetector() {
      if (!window.translation) return null;
      return await window.translation.createDetector();
    }
  
    static async detectLanguage(detector: any, text: string) {
      return await detector.detect(text);
    }
  
    // Summarization
    static async canSummarize(): Promise<boolean> {
      if (!window.ai || !window.ai.summarizer) {
          console.warn("AI Summarizer API is not available on window.ai.");
          return false;
      }
      try {
          const capabilities = await window.ai.summarizer.capabilities();
          console.log("AIService.canSummarize(): capabilities =", capabilities);
          return capabilities.available === 'readily';
      } catch (error) {
          console.error("AIService.canSummarize(): Error checking capabilities:", error);
          return false;
      }
  }

  static async createSummarizer(): Promise<SummarizerInstance | null> {
      if (!window.ai || !window.ai.summarizer) {
          console.warn("AI Summarizer API is not available on window.ai.");
          return null;
      }
      try {
          const summarizer = await window.ai.summarizer.create();
          console.log("AIService.createSummarizer(): Summarizer instance created.");
          return summarizer;
      } catch (error) {
          console.error("AIService.createSummarizer(): Error creating summarizer:", error);
          return null;
      }
  }

  static async summarize(summarizer: SummarizerInstance, text: string): Promise<string> {
      try {
          const summary = await summarizer.summarize(text);
          console.log("AIService.summarize(): Summary =", summary);
          return summary;
      } catch (error) {
          console.error("AIService.summarize(): Error during summarization:", error);
          throw error;
      }
  }
  
    // Translation
    static async canTranslate(source: string, target: string): Promise<boolean> {
      if (!window.translation) {
        console.warn("AIService.canTranslate(): window.translation is undefined.");
        return false;
      }
    
      try {
        const status: TranslationAvailability = await window.translation.canTranslate({
          sourceLanguage: source,
          targetLanguage: target,
        });
    
        if (status === 'readily') {
          return true;
        } else if (status === 'after-download') {
          console.log(`Language pack for "${source}" to "${target}" is downloading. Waiting for it to be ready...`);
          while (status === 'after-download') {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
            const newStatus: TranslationAvailability = await window.translation.canTranslate({
              sourceLanguage: source,
              targetLanguage: target,
            });
            if (newStatus !== 'after-download') {
              return newStatus === 'readily';
            }
          }
          return false;
        } else {
          console.error(`Translation from "${source}" to "${target}" is not available.`);
          return false;
        }
      } catch (error) {
        console.error(`AIService.canTranslate(): Error checking translation availability:`, error);
        return false;
      }
    }
  
    static async createTranslator(source: string, target: string): Promise<LanguageTranslator | null> {
      if (!window.translation) {
        console.warn("AIService.createTranslator(): window.translation is undefined.");
        return null;
      }

      try {
        const translator: LanguageTranslator = await window.translation.createTranslator({
          sourceLanguage: source,
          targetLanguage: target,
        });
        console.log("AIService.createTranslator(): Translator instance created.");
        return translator;
      } catch (error) {
        console.error("AIService.createTranslator(): Error creating translator:", error);
        return null;
      }
    }
  
    static async translateText(translator: any, text: string) {
      return await translator.translate(text);
    }
  
// Writer Methods

static async createWriter(): Promise<AIWriter | null> {
  if (!window.ai || !window.ai.writer) {
    console.warn("AIService.createWriter(): window.ai.writer is undefined.");
    return null;
  }

  try {
    const writer = await window.ai.writer.create();
    console.log("AIService.createWriter(): Writer instance created.");
    return writer;
  } catch (error) {
    console.error("AIService.createWriter(): Error creating writer:", error);
    return null;
  }
}

static async writeText(writer: AIWriter, combinedInput: string): Promise<string> {
  try {
    console.log(combinedInput, "hehe");
    const result = await writer.write(combinedInput);
    console.log("AIService.writeText(): Generated text =", result);
    return result;
  } catch (error) {
    console.error("AIService.writeText(): Error during writing:", error);
    throw error;
  }
}


// Rewriter Methods

static async createRewriter(options: AIRewriterCreateOptions): Promise<AIRewriter | null> {
  if (!window.ai || !window.ai.rewriter) {
    console.warn("AIService.createRewriter(): window.ai.rewriter is undefined.");
    return null;
  }

  try {
    const rewriter = await window.ai.rewriter.create(options);
    console.log("AIService.createRewriter(): Rewriter instance created.");
    return rewriter;
  } catch (error) {
    console.error("AIService.createRewriter(): Error creating rewriter:", error);
    return null;
  }
}

static async rewriteText(rewriter: AIRewriter, input: string, context?: string): Promise<string> {
  try {
    const options: AIRewriterRewriteOptions = {};
    if (context) {
      options.context = context;
    }
    const result = await rewriter.rewrite(input, options);
    console.log("AIService.rewriteText(): Rewritten text =", result);
    return result;
  } catch (error) {
    console.error("AIService.rewriteText(): Error during rewriting:", error);
    throw error;
  }
}
  
    // Prompt
    static async canUsePromptAPI(): Promise<boolean> {
      if (!window.ai || !window.ai.languageModel) {
        console.warn("AIService: window.ai.languageModel is not available.");
        return false;
      }
  
      const capabilities = await window.ai.languageModel.capabilities();
      console.log("AIService: Prompt API capabilities:", capabilities);
      return capabilities.available === "readily";
    }
  
    static async createSession(
      options?: AILanguageModelCreateOptions
    ): Promise<AILanguageModel | null> {
      if (!window.ai || !window.ai.languageModel) {
        console.error("AIService: languageModel is not defined on window.ai.");
        return null;
      }
  
      try {
        return await window.ai.languageModel.create(options);
      } catch (error) {
        console.error("AIService: Error creating session:", error);
        return null;
      }
    }
  
    static async prompt(session: AILanguageModel, input: string): Promise<string> {
      try {
        return await session.prompt(input);
      } catch (error) {
        console.error("AIService: Error during prompt:", error);
        throw error;
      }
    }
  
    static async promptStreaming(
      session: AILanguageModel,
      input: string
    ): Promise<string> {
      let result = "";
      let previousChunk = "";
    
      try {
        const stream = session.promptStreaming(input);
        const reader = stream.getReader();
    
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
    
          const newChunk = value.startsWith(previousChunk)
            ? value.slice(previousChunk.length)
            : value;
    
          result += newChunk;
          previousChunk = value;
        }
    
        reader.releaseLock();
      } catch (error) {
        console.error("AIService: Error during streaming prompt:", error);
        throw error;
      }
    
      return result;
    }    
  
    static async destroySession(session: AILanguageModel): Promise<void> {
      try {
        session.destroy();
      } catch (error) {
        console.error("AIService: Error destroying session:", error);
      }
    }
}