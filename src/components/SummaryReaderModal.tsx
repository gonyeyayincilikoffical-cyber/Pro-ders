import React, { useState } from 'react';
import { SubjectSummary } from '../types';
import { X, BookOpen, Clock, AlertTriangle, Key, Award, Copy, Check, Type, ArrowLeft } from 'lucide-react';

interface SummaryReaderModalProps {
  summary: SubjectSummary | null;
  onClose: () => void;
  onOpenTestForUnit?: (unitNumber: number) => void;
}

export const SummaryReaderModal: React.FC<SummaryReaderModalProps> = ({
  summary,
  onClose,
  onOpenTestForUnit,
}) => {
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'huge'>('normal');
  const [copied, setCopied] = useState(false);

  if (!summary) return null;

  const handleCopy = () => {
    const text = `${summary.unitTitle}\n${summary.topicTitle}\n\n${summary.summaryContent}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Font size styling
  const fontSizeClass = {
    normal: 'text-base leading-relaxed',
    large: 'text-lg leading-relaxed',
    huge: 'text-xl leading-loose',
  }[fontSize];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Sticky Bar */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              title="Kapat"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                {summary.unitTitle}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white line-clamp-1 font-heading">
                {summary.topicTitle}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Font Size Toggle */}
            <div className="hidden sm:flex items-center bg-slate-200 dark:bg-slate-800 p-0.5 rounded-lg text-xs">
              <button
                onClick={() => setFontSize('normal')}
                className={`px-2 py-1 rounded-md font-medium transition-colors ${
                  fontSize === 'normal'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                A
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-2 py-1 rounded-md font-medium transition-colors ${
                  fontSize === 'large'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                A+
              </button>
              <button
                onClick={() => setFontSize('huge')}
                className={`px-2 py-1 rounded-md font-medium transition-colors ${
                  fontSize === 'huge'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                A++
              </button>
            </div>

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              title="Özet Metnini Kopyala"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              title="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-10 py-8 space-y-8 text-slate-800 dark:text-slate-200">
          
          {/* Header Metadata Ribbon */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pb-4 border-b border-slate-200 dark:border-slate-800">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-500" />
              Tahmini Okuma: <strong>{summary.estimatedReadMinutes} Dakika</strong>
            </span>
            <span>·</span>
            <span>Müfredat: <strong>6. Sınıf Fen Bilimleri</strong></span>
            <span>·</span>
            <span>Son Güncelleme: <strong>{new Date(summary.updatedAt).toLocaleDateString('tr-TR')}</strong></span>
          </div>

          {/* MEB Kazanımları Kutusu */}
          {summary.mebOutcomes && summary.mebOutcomes.length > 0 && (
            <div className="p-4 sm:p-5 rounded-2xl bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800/60 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-800 dark:text-cyan-300 uppercase tracking-wide">
                <Award className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>Milli Eğitim Bakanlığı (MEB) Hedef Kazanımları</span>
              </div>
              <ul className="space-y-1.5 text-xs sm:text-sm text-cyan-950 dark:text-cyan-100">
                {summary.mebOutcomes.map((outcome, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-cyan-500 font-bold shrink-0">•</span>
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Summary Prose Body (Formatted with subheadings and lists) */}
          <div className={`space-y-6 ${fontSizeClass}`}>
            {summary.summaryContent.split('\n\n').map((paragraph, idx) => {
              // Heading 3: ### Heading (may have content on subsequent lines)
              if (paragraph.startsWith('### ')) {
                const lines = paragraph.split('\n');
                const headingText = lines[0].replace('### ', '');
                const restLines = lines.slice(1).join('\n');
                return (
                  <div key={idx} className="space-y-4">
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white pt-4 pb-1 border-b border-slate-200 dark:border-slate-800 font-heading">
                      {headingText}
                    </h3>
                    {restLines && (
                      <p
                        className="text-slate-800 dark:text-slate-200 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: formatBold(restLines) }}
                      />
                    )}
                  </div>
                );
              }
              // Heading 4: #### Heading
              if (paragraph.startsWith('#### ')) {
                const lines = paragraph.split('\n');
                const headingText = lines[0].replace('#### ', '');
                const restLines = lines.slice(1);
                return (
                  <div key={idx} className="space-y-3">
                    <h4 className="text-lg font-bold text-cyan-700 dark:text-cyan-300 pt-2 font-heading">
                      {headingText}
                    </h4>
                    {restLines.length > 0 && (
                      <ul className="space-y-1.5 list-disc list-inside pl-2 text-slate-800 dark:text-slate-200">
                        {restLines.map((l, lIdx) => (
                          <li key={lIdx} dangerouslySetInnerHTML={{ __html: formatBold(l.replace(/^- /, '')) }} />
                        ))}
                      </ul>
                    )}
                  </div>
                );
              }
              // Horizontal rule
              if (paragraph.trim() === '---') {
                return <hr key={idx} className="my-6 border-slate-200 dark:border-slate-800" />;
              }
              // List items
              if (paragraph.includes('\n- ') || paragraph.startsWith('- ')) {
                const lines = paragraph.split('\n');
                return (
                  <ul key={idx} className="space-y-2 list-disc list-inside pl-2">
                    {lines.map((line, lIdx) => {
                      const cleanLine = line.replace(/^- /, '');
                      return (
                        <li key={lIdx} className="text-slate-800 dark:text-slate-200 leading-relaxed">
                          <span dangerouslySetInnerHTML={{ __html: formatBold(cleanLine) }} />
                        </li>
                      );
                    })}
                  </ul>
                );
              }
              // Numbered list
              if (/^\d+\.\s/.test(paragraph)) {
                const lines = paragraph.split('\n');
                return (
                  <ol key={idx} className="space-y-1.5 list-decimal list-inside pl-2">
                    {lines.map((line, lIdx) => (
                      <li key={lIdx} className="text-slate-800 dark:text-slate-200">
                        <span dangerouslySetInnerHTML={{ __html: formatBold(line.replace(/^\d+\.\s*/, '')) }} />
                      </li>
                    ))}
                  </ol>
                );
              }
              // Standard paragraph
              return (
                <p
                  key={idx}
                  className="text-slate-800 dark:text-slate-200 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: formatBold(paragraph) }}
                />
              );
            })}
          </div>

          {/* Key Terms / Anahtar Kavramlar */}
          {summary.keyTerms && summary.keyTerms.length > 0 && (
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                <Key className="w-4 h-4 text-cyan-500" />
                <span>Önemli Kavramlar ve Terimler</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {summary.keyTerms.map((term, i) => (
                  <span
                    key={i}
                    className="text-xs sm:text-sm px-3 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium shadow-2xs"
                  >
                    {term}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Critical Exam Points / Sınav İpuçları */}
          {summary.criticalPoints && summary.criticalPoints.length > 0 && (
            <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wide">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Sınavda Dikkat Edilecek Püf Noktalar</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-amber-950 dark:text-amber-100">
                {summary.criticalPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-600 dark:text-amber-400 font-bold shrink-0">⚠</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>

        {/* Modal Bottom Action Bar */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Konu özetini tamamladıktan sonra pekiştirme testini çözebilirsiniz.
          </span>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              Kapat
            </button>
            {onOpenTestForUnit && (
              <button
                onClick={() => {
                  onClose();
                  onOpenTestForUnit(summary.unitNumber);
                }}
                className="flex-1 sm:flex-none px-5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white transition-all shadow-md shadow-cyan-600/20"
              >
                Bu Ünitenin Testini Çöz
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

// Helper for bold and italic markdown tags
function formatBold(str: string): string {
  return str
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');
}
