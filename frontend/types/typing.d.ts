export interface TypingStatsEventBus {
  $on(event: string, callback: (...args: any[]) => void): void;
  $off(event: string, callback?: (...args: any[]) => void): void;
  $emit(event: string, ...args: any[]): void;
}

export interface TypingStats {
  totalCorrectTypedCount: number;
  totalMistypedCount: number;
  typingAccuracy: number;
}

export interface TextGenerateResponse {
  generatedPairs: [string, string][];
}

export type SentencePair = [string, string];
export type SentenceArray = SentencePair[];

export interface SentenceData {
  sentences: SentenceArray;
}
