interface SummarizerInstance {
  summarize: (text: string) => Promise<string>;
  destroy: () => Promise<void>;
}
  