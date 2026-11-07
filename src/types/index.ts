export type QuestionOption = 'A' | 'B' | 'C' | 'D';

export interface TestQuestion {
  id: string;
  questionNumber: number; // 1 to 10
  questionText: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: QuestionOption;
  explanation: string;
}

export interface SubjectSummary {
  id: string;
  unitNumber: number;
  unitTitle: string;
  topicTitle: string;
  grade: string; // "6. Sınıf"
  subject: string; // "Fen Bilimleri"
  mebOutcomes: string[];
  summaryContent: string;
  keyTerms: string[];
  criticalPoints: string[];
  estimatedReadMinutes: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuizTest {
  id: string;
  unitNumber: number;
  unitTitle: string;
  title: string;
  description: string;
  grade: string; // "6. Sınıf"
  subject: string; // "Fen Bilimleri"
  questions: TestQuestion[]; // Strictly 10 questions
  createdAt: string;
  updatedAt: string;
}

export interface TestAttempt {
  id: string;
  testId: string;
  testTitle: string;
  unitTitle: string;
  answers: Record<number, QuestionOption>;
  correctCount: number;
  wrongCount: number;
  emptyCount: number;
  scorePercentage: number;
  completedAt: string;
  timeSpentSeconds: number;
}

export interface AdminAuthState {
  isAuthenticated: boolean;
  failedAttempts: number;
  lockoutUntil: number | null;
}

export interface AppBackupData {
  version: string;
  exportDate: string;
  summaries: SubjectSummary[];
  tests: QuizTest[];
}
