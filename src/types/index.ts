export interface AlgorithmSnippet {
  id: string;
  title: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  language: string;
  description: string;
  code: string;
}
export interface TypingAttempt {
  timestamp: number;
  algorithmTitle: string;
  category: string;
  difficulty: string;
  wpm: number;
  cpm: number;
  accuracy: number;
  mistakeCount: number;
  timeTakenInSeconds: number;
}