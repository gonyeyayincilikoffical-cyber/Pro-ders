import React, { useState } from 'react';
import { SubjectSummary, QuizTest, TestAttempt, InteractiveDeck } from '../types';
import { 
  BookOpen, 
  CheckSquare, 
  Clock, 
  Search, 
  Sparkles, 
  ArrowRight,
  CheckCircle2,
  ListFilter,
  GraduationCap,
  Layers,
  Volume2,
  Play
} from 'lucide-react';

interface BentoGridProps {
  summaries: SubjectSummary[];
  tests: QuizTest[];
  decks?: InteractiveDeck[];
  attempts: TestAttempt[];
  onSelectSummary: (summary: SubjectSummary) => void;
  onSelectTest: (test: QuizTest) => void;
  onSelectDeck?: (deck: InteractiveDeck) => void;
  activeFilter: 'all' | 'summaries' | 'tests' | 'decks';
  onFilterChange: (filter: 'all' | 'summaries' | 'tests' | 'decks') => void;
}

export const BentoGrid: React.FC<BentoGridProps> = ({
  summaries,
  tests,
  decks = [],
  attempts,
  onSelectSummary,
  onSelectTest,
  onSelectDeck,
  activeFilter,
  onFilterChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<number | 'all'>('all');

  const isEmpty = summaries.length === 0 && tests.length === 0 && decks.length === 0;

  // Extract unique units available
  const availableUnits = Array.from(
    new Set([
      ...summaries.map((s) => s.unitNumber),
      ...tests.map((t) => t.unitNumber),
      ...decks.map((d) => d.unitNumber),
    ])
  ).sort((a, b) => a - b);

  // Filter summaries
  const filteredSummaries = summaries.filter((s) => {
    const matchesSearch =
      s.topicTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.unitTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.keyTerms.some((term) => term.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesUnit = selectedUnit === 'all' || s.unitNumber === selectedUnit;
    return matchesSearch && matchesUnit;
  });

  // Filter tests
  const filteredTests = tests.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.unitTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesUnit = selectedUnit === 'all' || t.unitNumber === selectedUnit;
    return matchesSearch && matchesUnit;
  });

  // Filter decks
  const filteredDecks = decks.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.unitTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.slides.some((s) => s.title.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesUnit = selectedUnit === 'all' || d.unitNumber === selectedUnit;
    return matchesSearch && matchesUnit;
  });

  // Overall student stats
  const averageScore =
    attempts.length > 0
      ? Math.round(attempts.reduce((acc, a) => acc + a.scorePercentage, 0) / attempts.length)
      : 0;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title & Introduction Zone */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
            MEB Müfredatı ile Tam Uyumlu
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1 font-heading">
            6. Sınıf Fen Bilimleri
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Ünite konu özetleri, kritik sınav ipuçları ve 10 soruluk pekiştirme testleriyle bilgilerinizi derinleştirin.
          </p>
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl self-start md:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => onFilterChange('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeFilter === 'all'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Tümü ({summaries.length + tests.length + decks.length})
          </button>
          <button
            onClick={() => onFilterChange('summaries')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeFilter === 'summaries'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Özetler ({summaries.length})
          </button>
          <button
            onClick={() => onFilterChange('tests')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeFilter === 'tests'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Testler ({tests.length})
          </button>
          <button
            onClick={() => onFilterChange('decks')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1 ${
              activeFilter === 'decks'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-cyan-500" />
            <span>Slaytlar ({decks.length})</span>
          </button>
        </div>
      </div>

      {/* Search and Unit Selector */}
      {!isEmpty && (
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Konu, slayt, kavram veya soru ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-colors"
            />
          </div>

          {availableUnits.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs text-slate-500 whitespace-nowrap flex items-center gap-1">
                <ListFilter className="w-3.5 h-3.5" /> Ünite:
              </span>
              <button
                onClick={() => setSelectedUnit('all')}
                className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
                  selectedUnit === 'all'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                Tüm Üniteler
              </button>
              {availableUnits.map((u) => (
                <button
                  key={u}
                  onClick={() => setSelectedUnit(u)}
                  className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
                    selectedUnit === u
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  {u}. Ünite
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 1. STUDENT-FACING CLEAN EMPTY STATE (NO ADMIN PROMPTS) */}
      {isEmpty ? (
        <div className="border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl p-8 sm:p-14 text-center bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm max-w-3xl mx-auto space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
            <BookOpen className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-heading">
              Henüz Eklenmiş Bir Konu Özeti, Test veya Eğitim Slaytı Bulunmamaktadır
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
              6. Sınıf Fen Bilimleri ünitelerine ait konu özetleri, yapay zeka seslendirmeli eğitim slaytları ve 10 soruluk pekiştirme testleri öğretmeniniz tarafından sisteme yüklendiğinde bu alanda otomatik olarak listelenecektir.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center justify-center gap-4">
            <span>• Bulut Veritabanı ile Canlı Senkron</span>
            <span>• Sesli Yapay Zeka Anlatımlı Slaytlar</span>
            <span>• MEB Müfredatı ile Tam Uyumlu</span>
            <span>• PDF Ders Notu İndirme Desteği</span>
          </div>
        </div>
      ) : (
        /* 2. DYNAMIC BENTO GRID LAYOUT */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Bento Tile 1: Top Statistics & Study Overview */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-950 text-white p-6 border border-slate-700 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Öğrenci Çalışma Paneli</span>
              </div>
              <h3 className="text-2xl font-bold font-heading">
                6. Sınıf Fen Bilimleri Konuları Yayında
              </h3>
              <p className="text-sm text-slate-300 max-w-xl">
                Konu özetlerini okuyun, yapay zeka seslendirmeli etkileşimli slaytları keşfedin ve 10 soruluk değerlendirme testleriyle bilginizi ölçün.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 bg-slate-900/60 p-4 rounded-xl border border-slate-700/60 shrink-0">
              <div className="text-center px-2">
                <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-heading tabular-nums">
                  {summaries.length}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">Konu Özeti</div>
              </div>

              <div className="w-px h-8 bg-slate-700 hidden sm:block" />

              <div className="text-center px-2">
                <div className="text-2xl sm:text-3xl font-extrabold text-blue-400 font-heading tabular-nums">
                  {tests.length}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">10'luk Test</div>
              </div>

              <div className="w-px h-8 bg-slate-700 hidden sm:block" />

              <div className="text-center px-2">
                <div className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-heading tabular-nums">
                  {decks.length}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">Eğitim Slaytı</div>
              </div>

              <div className="w-px h-8 bg-slate-700 hidden sm:block" />

              <div className="text-center px-2">
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-heading tabular-nums">
                  %{averageScore}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">Ortalama Başarı</div>
              </div>
            </div>
          </div>

          {/* Render Summaries */}
          {(activeFilter === 'all' || activeFilter === 'summaries') &&
            filteredSummaries.map((summary) => (
              <div
                key={summary.id}
                className="group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between hover:border-cyan-500/50 dark:hover:border-cyan-500/50 transition-all hover:shadow-lg dark:hover:shadow-cyan-950/20"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-cyan-600 dark:text-cyan-400">
                      {summary.unitTitle}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {summary.estimatedReadMinutes} dk okuma
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    {summary.topicTitle}
                  </h3>

                  {summary.mebOutcomes.length > 0 && (
                    <div className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                      <strong className="text-slate-700 dark:text-slate-300">MEB Kazanımı:</strong> {summary.mebOutcomes[0]}
                    </div>
                  )}

                  {summary.keyTerms.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {summary.keyTerms.slice(0, 4).map((term, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-medium"
                        >
                          {term}
                        </span>
                      ))}
                      {summary.keyTerms.length > 4 && (
                        <span className="text-xs text-slate-500 self-center">
                          +{summary.keyTerms.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {summary.criticalPoints.length} Püf Noktası
                  </span>
                  <button
                    onClick={() => onSelectSummary(summary)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 group-hover:translate-x-0.5 transition-all"
                  >
                    <span>Özeti Oku</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

          {/* Render Tests */}
          {(activeFilter === 'all' || activeFilter === 'tests') &&
            filteredTests.map((test) => {
              const attempt = attempts.find((a) => a.testId === test.id);
              return (
                <div
                  key={test.id}
                  className="group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all hover:shadow-lg dark:hover:shadow-blue-950/20"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        {test.unitTitle}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold">
                        10 Soru
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {test.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                      {test.description || 'MEB 6. sınıf kazanımlarına uygun çoktan seçmeli 10 soruluk pekiştirme testi.'}
                    </p>

                    {attempt && (
                      <div className="pt-2 flex items-center gap-2 text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-slate-600 dark:text-slate-300">
                          Tamamlandı: <strong>%{attempt.scorePercentage}</strong> ({attempt.correctCount} Doğru)
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Çözüm Açıklamalı
                    </span>
                    <button
                      onClick={() => onSelectTest(test)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-sm"
                    >
                      <span>{attempt ? 'Tekrar Çöz' : 'Testi Başlat'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}

          {/* Render Interactive Slide Decks */}
          {(activeFilter === 'all' || activeFilter === 'decks') &&
            filteredDecks.map((deck) => (
              <div
                key={deck.id}
                className="group rounded-2xl bg-gradient-to-br from-white via-white to-cyan-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-cyan-950/20 border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between hover:border-cyan-500/50 dark:hover:border-cyan-500/50 transition-all hover:shadow-xl dark:hover:shadow-cyan-950/30 relative overflow-hidden"
              >
                {/* Subtle top indicator bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 opacity-80" />

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs gap-2 flex-wrap">
                    <span className="font-semibold text-cyan-600 dark:text-cyan-400 truncate">
                      {deck.unitTitle}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 font-bold flex items-center gap-1">
                        <Layers className="w-3 h-3" />
                        <span>{deck.slides.length} Slayt</span>
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-semibold flex items-center gap-1 text-[11px]">
                        <Volume2 className="w-3 h-3" />
                        <span>Sesli</span>
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    {deck.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    {deck.description || 'Yapay zeka seslendirmeli ve interaktif kontrol sorularıyla zenginleştirilmiş MEB 6. sınıf slaytı.'}
                  </p>

                  {/* Slide contents mini pill list */}
                  {deck.slides.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {deck.slides.slice(0, 3).map((s, idx) => (
                        <span
                          key={s.id || idx}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium truncate max-w-[180px]"
                        >
                          {idx + 1}. {s.title}
                        </span>
                      ))}
                      {deck.slides.length > 3 && (
                        <span className="text-[11px] text-slate-400 self-center">
                          +{deck.slides.length - 3} slayt
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
                    <span>Yapay Zeka Anlatımı</span>
                  </span>
                  <button
                    onClick={() => onSelectDeck?.(deck)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white transition-all shadow-sm shadow-cyan-600/20 group-hover:scale-105"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Slaytı Başlat</span>
                  </button>
                </div>
              </div>
            ))}

          {/* Search fallback message */}
          {((activeFilter === 'summaries' && filteredSummaries.length === 0) ||
            (activeFilter === 'tests' && filteredTests.length === 0) ||
            (activeFilter === 'decks' && filteredDecks.length === 0) ||
            (activeFilter === 'all' && filteredSummaries.length === 0 && filteredTests.length === 0 && filteredDecks.length === 0)) && (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12 text-slate-500 text-sm">
              Arama kriterinize uygun konu özeti, test veya slayt bulunamadı.
            </div>
          )}

        </div>
      )}

    </div>
  );
};
