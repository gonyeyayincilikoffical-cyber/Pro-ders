import React, { useState, useEffect } from 'react';
import { QuizTest, TestQuestion, QuestionOption } from '../types';
import { X, Save, CheckSquare, AlertCircle, Sparkles } from 'lucide-react';

interface TestFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (test: QuizTest) => void;
  initialData?: QuizTest | null;
}

export const TestFormModal: React.FC<TestFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [unitNumber, setUnitNumber] = useState<number>(1);
  const [unitTitle, setUnitTitle] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [activeQuestionTab, setActiveQuestionTab] = useState(0);
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Initialize or reset 10 questions
  useEffect(() => {
    if (initialData) {
      setUnitNumber(initialData.unitNumber);
      setUnitTitle(initialData.unitTitle);
      setTitle(initialData.title);
      setDescription(initialData.description);
      setQuestions(initialData.questions);
    } else {
      setUnitNumber(1);
      setUnitTitle('1. Ünite: Güneş Sistemi ve Tutulmalar');
      setTitle('Güneş Sistemi Kazanım Değerlendirme Testi');
      setDescription('MEB 6. sınıf kazanımlarına uygun 10 soruluk pekiştirme testi.');
      
      // Generate empty 10 questions template
      const emptyTenQuestions: TestQuestion[] = Array.from({ length: 10 }, (_, i) => ({
        id: `q-${Date.now()}-${i + 1}`,
        questionNumber: i + 1,
        questionText: '',
        options: {
          A: '',
          B: '',
          C: '',
          D: '',
        },
        correctAnswer: 'A' as QuestionOption,
        explanation: '',
      }));
      setQuestions(emptyTenQuestions);
    }
    setActiveQuestionTab(0);
    setValidationError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const currentQ = questions[activeQuestionTab] || questions[0];

  const handleUpdateCurrentQuestion = (field: keyof TestQuestion, value: any) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[activeQuestionTab] = {
        ...copy[activeQuestionTab],
        [field]: value,
      };
      return copy;
    });
  };

  const handleUpdateOption = (optKey: QuestionOption, value: string) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[activeQuestionTab] = {
        ...copy[activeQuestionTab],
        options: {
          ...copy[activeQuestionTab].options,
          [optKey]: value,
        },
      };
      return copy;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !unitTitle.trim()) {
      setValidationError('Lütfen Test Başlığı ve Ünite Adı alanlarını doldurunuz.');
      return;
    }

    // Verify all 10 questions
    for (let i = 0; i < 10; i++) {
      const q = questions[i];
      if (!q || !q.questionText.trim()) {
        setValidationError(`${i + 1}. sorunun metni boş bırakılamaz.`);
        setActiveQuestionTab(i);
        return;
      }
      if (!q.options.A.trim() || !q.options.B.trim() || !q.options.C.trim() || !q.options.D.trim()) {
        setValidationError(`${i + 1}. sorunun tüm seçenekleri (A, B, C, D) doldurulmalıdır.`);
        setActiveQuestionTab(i);
        return;
      }
      if (!q.explanation.trim()) {
        setValidationError(`${i + 1}. soru için çözüm/açıklama metni girilmelidir.`);
        setActiveQuestionTab(i);
        return;
      }
    }

    const newTest: QuizTest = {
      id: initialData?.id || `test-${Date.now()}`,
      unitNumber: Number(unitNumber) || 1,
      unitTitle: unitTitle.trim(),
      title: title.trim(),
      description: description.trim(),
      grade: '6. Sınıf',
      subject: 'Fen Bilimleri',
      questions,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(newTest);
    onClose();
  };

  // Helper to fill with sample question content if admin wants rapid testing
  const handleQuickFillQuestion = () => {
    const qNum = activeQuestionTab + 1;
    handleUpdateCurrentQuestion(
      'questionText',
      `${qNum}. Soru: Güneş sistemindeki gezegenler ve gök cisimleri ile ilgili verilen bilgilerden hangisi doğrudur?`
    );
    handleUpdateOption('A', 'Güneş sisteminin en büyük gezegeni Jüpiter\'dir.');
    handleUpdateOption('B', 'Merkür ve Venüs\'ün çok sayıda uydusu vardır.');
    handleUpdateOption('C', 'Mars gaz devi bir gezegendir.');
    handleUpdateOption('D', 'Uranüs Güneş\'e en yakın gezegendir.');
    handleUpdateCurrentQuestion('correctAnswer', 'A');
    handleUpdateCurrentQuestion(
      'explanation',
      'Jüpiter Güneş sisteminin kütle ve hacimce en büyük gezegenidir. Merkür ve Venüs\'ün hiç uydusu yoktur. Mars karasaldır, en yakın gezegen ise Merkür\'dür.'
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-heading">
                {initialData ? '10 Soruluk Testi Düzenle' : 'Yeni 10 Soruluk Test Oluştur'}
              </h2>
              <span className="text-xs text-slate-500">6. Sınıf Fen Bilimleri Müfredatı</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {validationError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Test Meta Info */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Ünite No (1 - 10)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={unitNumber}
                  onChange={(e) => setUnitNumber(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Ünite Adı
                </label>
                <input
                  type="text"
                  placeholder="Örn: 1. Ünite: Güneş Sistemi ve Tutulmalar"
                  value={unitTitle}
                  onChange={(e) => setUnitTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Test Başlığı
                </label>
                <input
                  type="text"
                  placeholder="Örn: Güneş Sistemi Değerlendirme Testi"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Test Açıklaması
                </label>
                <input
                  type="text"
                  placeholder="Örn: 10 soruluk MEB kazanım pekiştirme testi"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* 10 Question Selector Strip */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                10 Soruluk Soru Düzenleyici:
              </label>
              <button
                type="button"
                onClick={handleQuickFillQuestion}
                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Bu Soruyu Örnek Metinle Doldur</span>
              </button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {questions.map((q, idx) => {
                const isActive = activeQuestionTab === idx;
                const isComplete =
                  q.questionText.trim() &&
                  q.options.A.trim() &&
                  q.options.B.trim() &&
                  q.options.C.trim() &&
                  q.options.D.trim() &&
                  q.explanation.trim();

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveQuestionTab(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                      isActive
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : isComplete
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Soru {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Question Editor Card */}
          {currentQ && (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  {activeQuestionTab + 1}. Soru Detayları
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Doğru Cevap:</span>
                  <select
                    value={currentQ.correctAnswer}
                    onChange={(e) =>
                      handleUpdateCurrentQuestion('correctAnswer', e.target.value as QuestionOption)
                    }
                    className="text-xs font-bold px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-200 border border-blue-300 dark:border-blue-700"
                  >
                    <option value="A">A Şıkkı</option>
                    <option value="B">B Şıkkı</option>
                    <option value="C">C Şıkkı</option>
                    <option value="D">D Şıkkı</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Soru Metni
                </label>
                <textarea
                  rows={3}
                  placeholder="Sorunun açıklamasını ve sorusunu buraya yazınız..."
                  value={currentQ.questionText}
                  onChange={(e) => handleUpdateCurrentQuestion('questionText', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* 4 Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(['A', 'B', 'C', 'D'] as QuestionOption[]).map((opt) => (
                  <div key={opt} className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      {opt})
                    </span>
                    <input
                      type="text"
                      placeholder={`Seçenek ${opt} metni...`}
                      value={currentQ.options[opt]}
                      onChange={(e) => handleUpdateOption(opt, e.target.value)}
                      className={`w-full pl-8 pr-3 py-2 text-sm rounded-xl border text-slate-900 dark:text-white bg-white dark:bg-slate-800 ${
                        currentQ.correctAnswer === opt
                          ? 'border-emerald-500 ring-1 ring-emerald-500/40'
                          : 'border-slate-300 dark:border-slate-700'
                      }`}
                    />
                  </div>
                ))}
              </div>

              {/* Explanation Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Çözüm ve Detaylı Açıklama (Test bittiğinde öğrenciye gösterilir)
                </label>
                <textarea
                  rows={2}
                  placeholder="Doğru cevabın gerekçesini ve MEB kazanım analizini buraya yazınız..."
                  value={currentQ.explanation}
                  onChange={(e) => handleUpdateCurrentQuestion('explanation', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Yayınlamak için 10 sorunun tamamının doldurulması gerekir.
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Vazgeç
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-xs sm:text-sm font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md shadow-blue-600/20 flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>{initialData ? 'Testi Güncelle' : '10 Soruluk Testi Yayınla'}</span>
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};
