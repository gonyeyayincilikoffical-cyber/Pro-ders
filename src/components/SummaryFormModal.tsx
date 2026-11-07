import React, { useState, useEffect } from 'react';
import { SubjectSummary } from '../types';
import { X, Save, BookOpen, AlertCircle } from 'lucide-react';

interface SummaryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (summary: SubjectSummary) => void;
  initialData?: SubjectSummary | null;
}

export const SummaryFormModal: React.FC<SummaryFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [unitNumber, setUnitNumber] = useState<number>(1);
  const [unitTitle, setUnitTitle] = useState('');
  const [topicTitle, setTopicTitle] = useState('');
  const [mebOutcomesRaw, setMebOutcomesRaw] = useState('');
  const [summaryContent, setSummaryContent] = useState('');
  const [keyTermsRaw, setKeyTermsRaw] = useState('');
  const [criticalPointsRaw, setCriticalPointsRaw] = useState('');
  const [estimatedReadMinutes, setEstimatedReadMinutes] = useState<number>(6);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setUnitNumber(initialData.unitNumber);
      setUnitTitle(initialData.unitTitle);
      setTopicTitle(initialData.topicTitle);
      setMebOutcomesRaw(initialData.mebOutcomes.join('\n'));
      setSummaryContent(initialData.summaryContent);
      setKeyTermsRaw(initialData.keyTerms.join(', '));
      setCriticalPointsRaw(initialData.criticalPoints.join('\n'));
      setEstimatedReadMinutes(initialData.estimatedReadMinutes);
    } else {
      setUnitNumber(1);
      setUnitTitle('1. Ünite: Güneş Sistemi ve Tutulmalar');
      setTopicTitle('');
      setMebOutcomesRaw('F.6.1.1.1. Güneş sistemindeki gezegenleri karşılaştırır.');
      setSummaryContent('');
      setKeyTermsRaw('Gezegen, Asteroit, Meteor');
      setCriticalPointsRaw('Güneş sisteminin en sıcak gezegeni Venüs\'tür.');
      setEstimatedReadMinutes(6);
    }
    setValidationError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unitTitle.trim() || !topicTitle.trim() || !summaryContent.trim()) {
      setValidationError('Lütfen Ünite Adı, Konu Başlığı ve Özet İçeriği alanlarını eksiksiz doldurunuz.');
      return;
    }

    const mebOutcomes = mebOutcomesRaw
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const keyTerms = keyTermsRaw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const criticalPoints = criticalPointsRaw
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const newSummary: SubjectSummary = {
      id: initialData?.id || `summary-${Date.now()}`,
      unitNumber: Number(unitNumber) || 1,
      unitTitle: unitTitle.trim(),
      topicTitle: topicTitle.trim(),
      grade: '6. Sınıf',
      subject: 'Fen Bilimleri',
      mebOutcomes,
      summaryContent: summaryContent.trim(),
      keyTerms,
      criticalPoints,
      estimatedReadMinutes: Number(estimatedReadMinutes) || 5,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(newSummary);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-600/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-heading">
                {initialData ? 'Konu Özetini Düzenle' : 'Yeni Konu Özeti Ekle'}
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {validationError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

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
                className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
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
                className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Konu Başlığı
              </label>
              <input
                type="text"
                placeholder="Örn: Güneş Sistemi, Gezegenler ve Asteroitler"
                value={topicTitle}
                onChange={(e) => setTopicTitle(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tahmini Okuma (Dk)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={estimatedReadMinutes}
                onChange={(e) => setEstimatedReadMinutes(parseInt(e.target.value) || 5)}
                className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              MEB Kazanımları (Her satıra bir kazanım kodu ve tanımı giriniz)
            </label>
            <textarea
              rows={3}
              placeholder="F.6.1.1.1. Güneş sistemindeki gezegenleri birbirleri ile karşılaştırır."
              value={mebOutcomesRaw}
              onChange={(e) => setMebOutcomesRaw(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Konu Özeti İçeriği (Markdown başlıkları ### ve madde işaretleri - kullanabilirsiniz)
            </label>
            <textarea
              rows={9}
              placeholder="### 1. Konu Başlığı&#10;Konunun açıklaması buraya yazılır...&#10;- Madde 1&#10;- Madde 2"
              value={summaryContent}
              onChange={(e) => setSummaryContent(e.target.value)}
              className="w-full px-3 py-2 text-sm font-mono rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Önemli Kavramlar / Terimler (Virgülle ayırarak yazınız)
            </label>
            <input
              type="text"
              placeholder="Gezegen, Asteroit Kuşağı, Meteor, Gök Taşı, Sera Etkisi"
              value={keyTermsRaw}
              onChange={(e) => setKeyTermsRaw(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Sınavda Dikkat Edilecek Püf Noktalar (Her satıra bir püf noktası giriniz)
            </label>
            <textarea
              rows={3}
              placeholder="Güneş'e en yakın gezegen Merkür olmasına rağmen en sıcak gezegen Venüs'tür."
              value={criticalPointsRaw}
              onChange={(e) => setCriticalPointsRaw(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-xs sm:text-sm font-bold rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white transition-all shadow-md shadow-cyan-600/20 flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{initialData ? 'Değişiklikleri Kaydet' : 'Konu Özetini Yayınla'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
