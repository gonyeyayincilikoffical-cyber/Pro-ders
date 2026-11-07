import React, { useState, useEffect } from 'react';
import { QuizTest, QuestionOption, TestAttempt } from '../types';
import { computeQuizScore, formatDuration, ScoreSummary } from '../utils/scoring';
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ArrowLeft, 
  ArrowRight, 
  RotateCcw, 
  Check, 
  HelpCircle,
  Clock,
  Sparkles,
  Trophy
} from 'lucide-react';

interface TestPlayerModalProps {
  test: QuizTest | null;
  onClose: () => void;
  onSaveAttempt: (attempt: TestAttempt) => void;
}

export const TestPlayerModal: React.FC<TestPlayerModalProps> = ({
  test,
  onClose,
  onSaveAttempt,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, QuestionOption>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [showInstantExplanation, setShowInstantExplanation] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [scoreSummary, setScoreSummary] = useState<ScoreSummary | null>(null);

  // Timer
  useEffect(() => {
    if (!test || isFinished) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [test, isFinished]);

  if (!test) return null;

  const currentQuestion = test.questions[currentQuestionIndex];
  const totalQuestions = test.questions.length;
  const currentAnswer = currentQuestion ? answers[currentQuestion.questionNumber] : undefined;

  const handleSelectOption = (option: QuestionOption) => {
    if (isFinished) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.questionNumber]: option,
    }));
  };

  const handleClearAnswer = () => {
    if (isFinished) return;
    setAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentQuestion.questionNumber];
      return copy;
    });
  };

  const handleFinishTest = () => {
    const summary = computeQuizScore(answers, test.questions);
    setScoreSummary(summary);
    setIsFinished(true);

    const attempt: TestAttempt = {
      id: `attempt-${Date.now()}`,
      testId: test.id,
      testTitle: test.title,
      unitTitle: test.unitTitle,
      answers,
      correctCount: summary.correctCount,
      wrongCount: summary.wrongCount,
      emptyCount: summary.emptyCount,
      scorePercentage: summary.scorePercentage,
      completedAt: new Date().toISOString(),
      timeSpentSeconds: elapsedSeconds,
    };
    onSaveAttempt(attempt);
  };

  const handleRestartTest = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setIsFinished(false);
    setElapsedSeconds(0);
    setScoreSummary(null);
  };

  const answeredCount = Object.keys(answers).length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              title="Testten Çık"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                {test.unitTitle}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white line-clamp-1 font-heading">
                {test.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Timer Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-xs font-mono font-medium text-slate-700 dark:text-slate-300">
              <Clock className="w-3.5 h-3.5 text-cyan-500" />
              <span>{formatDuration(elapsedSeconds)}</span>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 10-Question Navigator Strip */}
        <div className="px-6 py-2.5 bg-slate-100 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 overflow-x-auto shrink-0">
          <div className="flex items-center gap-2">
            {test.questions.map((q, idx) => {
              const isCurrent = currentQuestionIndex === idx;
              const hasAnswer = answers[q.questionNumber] !== undefined;
              let btnClass = 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700';

              if (isCurrent) {
                btnClass = 'bg-blue-600 text-white font-bold ring-2 ring-blue-500/40 border-blue-600';
              } else if (hasAnswer) {
                btnClass = 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 font-semibold';
              }

              return (
                <button
                  key={q.id || idx}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`w-8 h-8 rounded-lg text-xs flex items-center justify-center transition-all shrink-0 ${btnClass}`}
                >
                  {q.questionNumber}
                </button>
              );
            })}
          </div>

          <div className="hidden sm:flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 shrink-0">
            <span>İlerleme: <strong>{answeredCount} / {totalQuestions}</strong></span>
          </div>
        </div>

        {/* Content Area: Practice Mode vs Results Mode */}
        {!isFinished ? (
          <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-6">
            
            {/* Question Card */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Soru {currentQuestion.questionNumber} / {totalQuestions}
                </span>
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  <input
                    type="checkbox"
                    checked={showInstantExplanation}
                    onChange={(e) => setShowInstantExplanation(e.target.checked)}
                    className="rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Anında Çözümü Göster</span>
                </label>
              </div>

              <div className="text-base sm:text-lg font-medium text-slate-900 dark:text-slate-100 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                {currentQuestion.questionText}
              </div>
            </div>

            {/* Options A, B, C, D */}
            <div className="grid grid-cols-1 gap-3 pt-2">
              {(['A', 'B', 'C', 'D'] as QuestionOption[]).map((optKey) => {
                const optText = currentQuestion.options[optKey];
                const isSelected = currentAnswer === optKey;
                const isCorrect = currentQuestion.correctAnswer === optKey;

                let stateClass = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 text-slate-800 dark:text-slate-200';
                
                if (isSelected) {
                  stateClass = 'bg-blue-50 dark:bg-blue-950/40 border-blue-600 text-blue-900 dark:text-blue-100 font-semibold ring-1 ring-blue-500';
                }

                // If instant explanation is enabled and option is selected
                if (showInstantExplanation && isSelected) {
                  if (isCorrect) {
                    stateClass = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-100';
                  } else {
                    stateClass = 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-100';
                  }
                }

                return (
                  <button
                    key={optKey}
                    onClick={() => handleSelectOption(optKey)}
                    className={`w-full text-left p-4 rounded-xl border flex items-start gap-3 transition-all ${stateClass}`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {optKey}
                    </div>
                    <div className="text-sm sm:text-base leading-normal flex-1 pt-0.5">
                      {optText}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Instant Solution Feedback (if enabled) */}
            {showInstantExplanation && currentAnswer && (
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 space-y-1.5 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-800 dark:text-blue-300">
                  <HelpCircle className="w-4 h-4" />
                  <span>Soru Çözümü ve Açıklaması:</span>
                </div>
                <p className="text-xs sm:text-sm text-blue-900 dark:text-blue-200 leading-relaxed">
                  {currentQuestion.explanation}
                </p>
              </div>
            )}

          </div>
        ) : (
          /* Results and Detailed Review View */
          <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8">
            
            {/* Scorecard Hero */}
            <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white p-6 sm:p-8 border border-slate-700 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Trophy className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold font-heading">
                  Test Tamamlandı!
                </h3>
                <p className="text-sm text-slate-300 mt-1">
                  {scoreSummary?.passed
                    ? 'Tebrikler! Konu kazanımlarını başarıyla kavradınız.'
                    : 'Konuyu pekiştirmek için konu özetini tekrar gözden geçirmeniz önerilir.'}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto pt-4">
                <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-700">
                  <div className="text-2xl font-black text-blue-400 tabular-nums">
                    %{scoreSummary?.scorePercentage}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">Başarı Puanı</div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-700">
                  <div className="text-2xl font-black text-emerald-400 tabular-nums">
                    {scoreSummary?.correctCount}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">Doğru</div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-700">
                  <div className="text-2xl font-black text-rose-400 tabular-nums">
                    {scoreSummary?.wrongCount}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">Yanlış</div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-700">
                  <div className="text-2xl font-black text-amber-400 tabular-nums">
                    {scoreSummary?.emptyCount}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">Boş</div>
                </div>
              </div>
            </div>

            {/* Detailed Question by Question Review */}
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
                Detaylı Soru ve Çözüm İncelemesi
              </h4>

              <div className="space-y-4">
                {test.questions.map((q) => {
                  const userAns = answers[q.questionNumber];
                  const isCorrect = userAns === q.correctAnswer;
                  const isEmpty = !userAns;

                  return (
                    <div
                      key={q.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        isCorrect
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40'
                          : isEmpty
                          ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40'
                          : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-semibold pb-2">
                        <span className="text-slate-600 dark:text-slate-400">
                          Soru {q.questionNumber}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {isCorrect && (
                            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                              <CheckCircle2 className="w-4 h-4" /> Doğru
                            </span>
                          )}
                          {!isCorrect && !isEmpty && (
                            <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400">
                              <XCircle className="w-4 h-4" /> Yanlış
                            </span>
                          )}
                          {isEmpty && (
                            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                              <AlertCircle className="w-4 h-4" /> Boş Bırakıldı
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-sm sm:text-base font-medium text-slate-900 dark:text-white pb-3">
                        {q.questionText}
                      </p>

                      {/* Options Recap */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {(['A', 'B', 'C', 'D'] as QuestionOption[]).map((key) => {
                          const isKeyCorrect = q.correctAnswer === key;
                          const isUserPicked = userAns === key;

                          let badgeClass = 'bg-white/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';

                          if (isKeyCorrect) {
                            badgeClass = 'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold';
                          } else if (isUserPicked) {
                            badgeClass = 'bg-rose-100 dark:bg-rose-950/80 border-rose-500 text-rose-900 dark:text-rose-200 font-bold';
                          }

                          return (
                            <div
                              key={key}
                              className={`p-2.5 rounded-xl border flex items-center gap-2 ${badgeClass}`}
                            >
                              <span className="font-bold shrink-0">{key})</span>
                              <span className="truncate">{q.options[key]}</span>
                              {isKeyCorrect && <span className="ml-auto text-emerald-600 font-bold">✓ Doğru</span>}
                              {!isKeyCorrect && isUserPicked && <span className="ml-auto text-rose-600 font-bold">✗ Yanıtınız</span>}
                            </div>
                          );
                        })}
                      </div>

                      {/* Solution Explanation */}
                      <div className="mt-3 p-3 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        <strong className="text-blue-600 dark:text-blue-400">Çözüm ve Açıklama:</strong> {q.explanation}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* Bottom Navigation & Controls */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          {!isFinished ? (
            <>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {currentAnswer && (
                  <button
                    onClick={handleClearAnswer}
                    className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline"
                  >
                    Cevabı Temizle
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                  className="flex-1 sm:flex-none px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Önceki Soru</span>
                </button>

                {currentQuestionIndex < totalQuestions - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                    className="flex-1 sm:flex-none px-5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Sonraki Soru</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleFinishTest}
                    className="flex-1 sm:flex-none px-6 py-2 text-xs sm:text-sm font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Testi Bitir</span>
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between w-full">
              <button
                onClick={handleRestartTest}
                className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Testi Tekrar Çöz</span>
              </button>

              <button
                onClick={onClose}
                className="px-6 py-2 text-xs sm:text-sm font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md"
              >
                Tamamla ve Çık
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
