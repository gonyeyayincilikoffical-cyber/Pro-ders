import React from 'react';
import { ShieldCheck, Moon, Sun, BookOpen, CheckSquare, BarChart3, GraduationCap } from 'lucide-react';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenAdmin: () => void;
  onOpenStats: () => void;
  activeTab: 'all' | 'summaries' | 'tests';
  onChangeTab: (tab: 'all' | 'summaries' | 'tests') => void;
  summariesCount: number;
  testsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  onToggleTheme,
  onOpenAdmin,
  onOpenStats,
  activeTab,
  onChangeTab,
  summariesCount,
  testsCount,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-slate-900/90 dark:bg-slate-950/90 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-heading leading-tight">
              ProDers
            </span>
            <span className="text-xs font-medium text-cyan-600 dark:text-cyan-400">
              6. Sınıf Fen Bilimleri
            </span>
          </div>
        </div>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => onChangeTab('all')}
            className={`transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 pb-1 border-b-2 ${
              activeTab === 'all'
                ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400 font-semibold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <span>Tüm İçerikler</span>
          </button>

          <button
            onClick={() => onChangeTab('summaries')}
            className={`transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 pb-1 border-b-2 ${
              activeTab === 'summaries'
                ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400 font-semibold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Konu Özetleri</span>
            {summariesCount > 0 && (
              <span className="text-xs px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {summariesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onChangeTab('tests')}
            className={`transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 pb-1 border-b-2 ${
              activeTab === 'tests'
                ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400 font-semibold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>10 Soruluk Testler</span>
            {testsCount > 0 && (
              <span className="text-xs px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {testsCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenStats}
            className="transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 pb-1 border-b-2 border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Başarı ve Rapor</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onToggleTheme}
            aria-label={isDarkMode ? 'Aydınlık moda geç' : 'Karanlık moda geç'}
            className="p-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-lg transition-colors whitespace-nowrap"
          >
            <ShieldCheck className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span className="hidden sm:inline">Yönetici Modu</span>
            <span className="sm:hidden">Yönetici</span>
          </button>
        </div>

      </div>
    </header>
  );
};
