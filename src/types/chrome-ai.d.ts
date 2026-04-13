// Chrome Built-in AI: Prompt API (Gemini Nano)
// https://developer.chrome.com/docs/ai/prompt-api

interface AILanguageModelSession {
  prompt(input: string): Promise<string>;
  destroy(): void;
}

interface AILanguageModelMonitor extends EventTarget {
  addEventListener(type: "downloadprogress", listener: (e: { loaded: number }) => void): void;
}

interface AILanguageModelCreateOptions {
  monitor?: (monitor: AILanguageModelMonitor) => void;
}

type AIAvailability = "unavailable" | "downloadable" | "downloading" | "available";

interface AILanguageModelFactory {
  availability(options?: Record<string, unknown>): Promise<AIAvailability>;
  create(options?: AILanguageModelCreateOptions): Promise<AILanguageModelSession>;
}

// Глобальный объект LanguageModel (Chrome 138+)
declare const LanguageModel: AILanguageModelFactory | undefined;
