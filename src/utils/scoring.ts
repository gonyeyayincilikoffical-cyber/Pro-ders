import { QuestionOption, TestQuestion } from '../types';

export interface ScoreSummary {
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  emptyCount: number;
  scorePercentage: number;
  passed: boolean;
  resultsByQuestion: Array<{
    questionNumber: number;
    userAnswer?: QuestionOption;
    correctAnswer: QuestionOption;
    isCorrect: boolean;
    isEmpty: boolean;
    explanation: string;
  }>;
}

export function computeQuizScore(
  answers: Record<number, QuestionOption>,
  questions: TestQuestion[]
): ScoreSummary {
  let correctCount = 0;
  let wrongCount = 0;
  let emptyCount = 0;

  const resultsByQuestion = questions.map((q) => {
    const userAnswer = answers[q.questionNumber];
    const isEmpty = !userAnswer;
    const isCorrect = userAnswer === q.correctAnswer;

    if (isEmpty) {
      emptyCount += 1;
    } else if (isCorrect) {
      correctCount += 1;
    } else {
      wrongCount += 1;
    }

    return {
      questionNumber: q.questionNumber,
      userAnswer,
      correctAnswer: q.correctAnswer,
      isCorrect,
      isEmpty,
      explanation: q.explanation,
    };
  });

  const totalQuestions = questions.length || 10;
  const scorePercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const passed = scorePercentage >= 60; // 60% standard success bar

  return {
    totalQuestions,
    correctCount,
    wrongCount,
    emptyCount,
    scorePercentage,
    passed,
    resultsByQuestion,
  };
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}
