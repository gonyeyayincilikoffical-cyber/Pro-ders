import React from 'react';
import { TestAttempt } from '../types';
import { formatDuration } from '../utils/scoring';
import { X, BarChart3, Trophy, CheckCircle, Clock, Calendar, Award } from 'lucide-react';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  attempts: TestAttempt[];
  onClearHistory: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  attempts,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  const totalAttempts = attempts.length;
  const avgScore =
    totalAttempts > 0
      ? Math.round(attempts.reduce((acc, a) => acc + a.scorePercentage, 0) / totalAttempts)
      : 0;

  const totalCorrect = attempts.reduce((acc, a) => acc + a.correctCount, 0);
  const totalQuestions = attempts.reduce(
    (acc, a) => acc + a.correctCount + a.wrongCount + a.emptyCount,
    0
  );
  const totalSeconds = attempts.reduce((acc, a) => acc + a.timeSpentSeconds, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-600/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-heading">
                Öğrenci Başarı ve İlerleme Raporu
              </h2>
              <span className="text-xs text-slate-500">6. Sınıf Fen Bilimleri İstatistikleri</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Top Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-cyan-600 dark:text-cyan-400 tabular-nums font-heading">
                {totalAttempts}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Çözülen Test</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400 tabular-nums font-heading">
                %{avgScore}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Genel Başarı</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums font-heading">
                {totalCorrect}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Toplam Doğru</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400 tabular-nums font-heading">
                {formatDuration(totalSeconds)}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Toplam Süre</div>
            </div>
          </div>

          {/* Past Attempts History */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
                Geçmiş Test Denemeleri
              </h3>
              {attempts.length > 0 && (
                <button
                  onClick={onClearHistory}
                  className="text-xs text-rose-500 hover:text-rose-600 underline font-medium"
                >
                  Geçmişi Sıfırla
                </button>
              )}
            </div>

            {attempts.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 text-xs">
                Henüz tamamlanmış bir test denemeniz bulunmamaktadır. Testleri çözdükçe başarı kayıtlarınız burada listelenecektir.
              </div>
            ) : (
              <div className="space-y-2">
                {attempts.map((att) => (
                  <div
                    key={att.id}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="text-xs text-slate-500">{att.unitTitle}</div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        {att.testTitle}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(att.completedAt).toLocaleDateString('tr-TR')}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDuration(att.timeSpentSeconds)}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-base sm:text-lg font-extrabold text-blue-600 dark:text-blue-400 tabular-nums">
                        %{att.scorePercentage}
                      </div>
                      <div className="text-xs text-slate-500">
                        {att.correctCount} Doğru / {att.wrongCount} Yanlış
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
          >
            Kapat
          </button>
        </div>

      </div>
    </div>
  );
};
