import React, { useState, useEffect } from 'react';
import { SubjectSummary, QuizTest, TestAttempt, InteractiveDeck } from './types';
import { 
  getStoredSummaries, 
  getStoredTests, 
  getStoredDecks,
  getStoredAttempts, 
  saveStoredAttempt,
  exportBackupJSON,
  importBackupJSON,
  fetchCurriculumFromCloud,
  saveSummaryToCloud,
  deleteSummaryFromCloud,
  saveTestToCloud,
  deleteTestFromCloud,
  saveDeckToCloud,
  deleteDeckFromCloud,
  loadSampleCurriculumToCloud,
  importBackupToCloud,
  resetCloudCurriculum
} from './utils/storage';
import { Header } from './components/Header';
import { BentoGrid } from './components/BentoGrid';
import { SummaryReaderModal } from './components/SummaryReaderModal';
import { TestPlayerModal } from './components/TestPlayerModal';
import { InteractiveSlidePlayerModal } from './components/InteractiveSlidePlayerModal';
import { SlideStudioModal } from './components/SlideStudioModal';
import { AdminModal } from './components/AdminModal';
import { SummaryFormModal } from './components/SummaryFormModal';
import { TestFormModal } from './components/TestFormModal';
import { StatsModal } from './components/StatsModal';
import { CheckCircle2, AlertCircle, Cloud } from 'lucide-react';

export default function App() {
  // Theme state: defaults to dark mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('proders_theme_v1');
      if (saved !== null) {
        return saved === 'dark';
      }
    }
    return true; // default dark
  });

  // Secret route handling: only "/adminpanelyonetici" triggers Admin Mode
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes('adminpanelyonetici') || hash.includes('adminpanelyonetici')) {
        return '/adminpanelyonetici';
      }
    }
    return '/';
  });

  // Course content states (Empty by default on initial launch)
  const [summaries, setSummaries] = useState<SubjectSummary[]>([]);
  const [tests, setTests] = useState<QuizTest[]>([]);
  const [decks, setDecks] = useState<InteractiveDeck[]>([]);
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);

  // Navigation / filtering state
  const [activeTab, setActiveTab] = useState<'all' | 'summaries' | 'tests' | 'decks'>('all');

  // Modal visibility states
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [activeSummaryForReading, setActiveSummaryForReading] = useState<SubjectSummary | null>(null);
  const [activeTestForPlaying, setActiveTestForPlaying] = useState<QuizTest | null>(null);
  const [activeDeckForPlaying, setActiveDeckForPlaying] = useState<InteractiveDeck | null>(null);

  // Form modal states
  const [isSummaryFormOpen, setIsSummaryFormOpen] = useState(false);
  const [editingSummary, setEditingSummary] = useState<SubjectSummary | null>(null);
  const [isTestFormOpen, setIsTestFormOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<QuizTest | null>(null);
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [editingDeck, setEditingDeck] = useState<InteractiveDeck | null>(null);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Sync dark mode class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('proders_theme_v1', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('proders_theme_v1', 'light');
    }
  }, [isDarkMode]);

  // Sync URL changes (e.g. user types /adminpanelyonetici or navigates back)
  useEffect(() => {
    const syncRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes('adminpanelyonetici') || hash.includes('adminpanelyonetici')) {
        setCurrentRoute('/adminpanelyonetici');
      } else {
        setCurrentRoute('/');
      }
    };

    window.addEventListener('popstate', syncRoute);
    window.addEventListener('hashchange', syncRoute);
    return () => {
      window.removeEventListener('popstate', syncRoute);
      window.removeEventListener('hashchange', syncRoute);
    };
  }, []);

  const navigateToStudent = () => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/');
      window.location.hash = '';
      setCurrentRoute('/');
    }
  };

  // Load content: First instant LocalStorage offline fallback, then fetch from Firebase Firestore Cloud
  useEffect(() => {
    setSummaries(getStoredSummaries());
    setTests(getStoredTests());
    setDecks(getStoredDecks());
    setAttempts(getStoredAttempts());

    fetchCurriculumFromCloud()
      .then(({ summaries: cloudSummaries, tests: cloudTests, decks: cloudDecks }) => {
        setSummaries(cloudSummaries);
        setTests(cloudTests);
        if (cloudDecks) setDecks(cloudDecks);
      })
      .catch((err) => {
        console.warn('Bulut veritabanı senkronizasyon uyarısı:', err);
      });
  }, []);

  const handleToggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Summary handlers (Firebase Cloud Sync + LocalStorage fallback)
  const handleSaveSummary = async (newSummary: SubjectSummary) => {
    let updated: SubjectSummary[];
    const exists = summaries.some((s) => s.id === newSummary.id);
    if (exists) {
      updated = summaries.map((s) => (s.id === newSummary.id ? newSummary : s));
      showToast('Konu özeti buluta kaydedildi ve güncellendi.');
    } else {
      updated = [newSummary, ...summaries];
      showToast('Yeni konu özeti bulut veritabanında yayınlandı.');
    }
    setSummaries(updated);

    await saveSummaryToCloud(newSummary);
  };

  const handleDeleteSummary = async (id: string) => {
    const updated = summaries.filter((s) => s.id !== id);
    setSummaries(updated);
    await deleteSummaryFromCloud(id);
    showToast('Konu özeti bulut veritabanından silindi.');
  };

  // Test handlers (Firebase Cloud Sync + LocalStorage fallback)
  const handleSaveTest = async (newTest: QuizTest) => {
    let updated: QuizTest[];
    const exists = tests.some((t) => t.id === newTest.id);
    if (exists) {
      updated = tests.map((t) => (t.id === newTest.id ? newTest : t));
      showToast('10 soruluk test buluta kaydedildi ve güncellendi.');
    } else {
      updated = [newTest, ...tests];
      showToast('Yeni 10 soruluk test bulut veritabanında yayınlandı.');
    }
    setTests(updated);

    await saveTestToCloud(newTest);
  };

  const handleDeleteTest = async (id: string) => {
    const updated = tests.filter((t) => t.id !== id);
    setTests(updated);
    await deleteTestFromCloud(id);
    showToast('Test bulut veritabanından silindi.');
  };

  // Interactive Deck handlers (Firebase Cloud Sync + LocalStorage fallback)
  const handleSaveDeck = async (newDeck: InteractiveDeck) => {
    let updated: InteractiveDeck[];
    const exists = decks.some((d) => d.id === newDeck.id);
    if (exists) {
      updated = decks.map((d) => (d.id === newDeck.id ? newDeck : d));
      showToast('Eğitim slaytı buluta kaydedildi ve güncellendi.');
    } else {
      updated = [newDeck, ...decks];
      showToast('Yeni eğitim slaytı bulut veritabanında yayınlandı.');
    }
    setDecks(updated);
    setIsStudioOpen(false);
    setEditingDeck(null);

    await saveDeckToCloud(newDeck);
  };

  const handleDeleteDeck = async (id: string) => {
    const updated = decks.filter((d) => d.id !== id);
    setDecks(updated);
    await deleteDeckFromCloud(id);
    showToast('Eğitim slaytı silindi.');
  };

  // Backup & Restore
  const handleExportBackup = () => {
    const jsonStr = exportBackupJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `proders_6_sinif_fen_yedek_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Yedek dosyası başarıyla indirildi.');
  };

  const handleImportBackup = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      if (content) {
        const result = importBackupJSON(content);
        if (result.success) {
          const loadedSummaries = getStoredSummaries();
          const loadedTests = getStoredTests();
          const loadedDecks = getStoredDecks();
          setSummaries(loadedSummaries);
          setTests(loadedTests);
          setDecks(loadedDecks);
          await importBackupToCloud(loadedSummaries, loadedTests, loadedDecks);
          showToast(`Yedekleme bulut veritabanına yüklendi! (${loadedSummaries.length} Özet, ${loadedTests.length} Test, ${loadedDecks.length} Slayt)`);
        } else {
          showToast(result.message, 'error');
        }
      }
    };
    reader.readAsText(file);
  };

  // Preset loader (Firebase Cloud Sync)
  const handleLoadSampleCurriculum = async () => {
    const counts = await loadSampleCurriculumToCloud();
    const { summaries: cloudSummaries, tests: cloudTests, decks: cloudDecks } = await fetchCurriculumFromCloud();
    setSummaries(cloudSummaries);
    setTests(cloudTests);
    if (cloudDecks) setDecks(cloudDecks);
    showToast(`Örnek müfredat bulut veritabanına aktarıldı! (${counts.summariesCount} Özet, ${counts.testsCount} Test, ${counts.decksCount} Slayt)`);
  };

  // Clear data (Firebase Cloud Sync + LocalStorage)
  const handleClearAllData = async () => {
    await resetCloudCurriculum();
    setSummaries([]);
    setTests([]);
    setDecks([]);
    setAttempts([]);
    showToast('Bulut veritabanı ve yerel bellek sıfırlandı.');
  };

  // Test Attempt (local progress)
  const handleSaveAttempt = (attempt: TestAttempt) => {
    saveStoredAttempt(attempt);
    setAttempts(getStoredAttempts());
    showToast(`Test tamamlandı! Başarı puanınız: %${attempt.scorePercentage}`);
  };

  // Trigger test for unit from summary reader
  const handleOpenTestForUnit = (unitNumber: number) => {
    const matchingTest = tests.find((t) => t.unitNumber === unitNumber);
    if (matchingTest) {
      setActiveTestForPlaying(matchingTest);
    } else {
      showToast(`${unitNumber}. Üniteye ait henüz bir test eklenmemiştir.`, 'error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl shadow-xl border bg-white dark:bg-slate-900 text-xs sm:text-sm font-semibold animate-in slide-in-from-top duration-300">
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          )}
          <span className={toastMessage.type === 'success' ? 'text-slate-900 dark:text-white' : 'text-rose-600 dark:text-rose-400'}>
            {toastMessage.text}
          </span>
        </div>
      )}

      {/* Header - Strictly Student Mode with no Admin/Studio links */}
      <Header
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
        onOpenStats={() => setIsStatsOpen(true)}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        summariesCount={summaries.length}
        testsCount={tests.length}
        decksCount={decks.length}
      />

      {/* Main Content: Bento Grid */}
      <main className="flex-1">
        <BentoGrid
          summaries={summaries}
          tests={tests}
          decks={decks}
          attempts={attempts}
          onSelectSummary={(s) => setActiveSummaryForReading(s)}
          onSelectTest={(t) => setActiveTestForPlaying(t)}
          onSelectDeck={(d) => setActiveDeckForPlaying(d)}
          activeFilter={activeTab}
          onFilterChange={setActiveTab}
        />
      </main>

      {/* Footer with Cloud Status indicator */}
      <footer className="w-full border-t border-slate-200 dark:border-slate-800 py-6 px-4 bg-white/50 dark:bg-slate-950/50 backdrop-blur-xs text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">ProDers</span>
            <span>·</span>
            <span>6. Sınıf Fen Bilimleri Eğitim Platformu</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400 font-medium">
              <Cloud className="w-3.5 h-3.5" />
              <span>Bulut Veritabanı (Firestore) & Çevrimdışı Bellek Aktif</span>
            </span>
            <span>·</span>
            <span>MEB Müfredatı ile Tam Uyumlu</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {/* 1. Summary Reader Modal with PDF Download */}
      <SummaryReaderModal
        summary={activeSummaryForReading}
        onClose={() => setActiveSummaryForReading(null)}
        onOpenTestForUnit={handleOpenTestForUnit}
      />

      {/* 2. Interactive Test Player Modal with PDF Download */}
      <TestPlayerModal
        test={activeTestForPlaying}
        onClose={() => setActiveTestForPlaying(null)}
        onSaveAttempt={handleSaveAttempt}
      />

      {/* 3. Interactive Slide Player Modal with AI Voice Narration */}
      {activeDeckForPlaying && (
        <InteractiveSlidePlayerModal
          deck={activeDeckForPlaying}
          onClose={() => setActiveDeckForPlaying(null)}
        />
      )}

      {/* 4. Educational Slide Studio Modal (Interactive Content Builder & File Upload) */}
      {isStudioOpen && (
        <SlideStudioModal
          initialDeck={editingDeck}
          onClose={() => {
            setIsStudioOpen(false);
            setEditingDeck(null);
          }}
          onSave={handleSaveDeck}
        />
      )}

      {/* 5. Ultra Secure Admin Control Modal: Only accessible via secret route "/adminpanelyonetici" */}
      <AdminModal
        isOpen={currentRoute === '/adminpanelyonetici'}
        onClose={navigateToStudent}
        summaries={summaries}
        tests={tests}
        decks={decks}
        onAddNewSummary={() => {
          setEditingSummary(null);
          setIsSummaryFormOpen(true);
        }}
        onEditSummary={(s) => {
          setEditingSummary(s);
          setIsSummaryFormOpen(true);
        }}
        onDeleteSummary={handleDeleteSummary}
        onAddNewTest={() => {
          setEditingTest(null);
          setIsTestFormOpen(true);
        }}
        onEditTest={(t) => {
          setEditingTest(t);
          setIsTestFormOpen(true);
        }}
        onDeleteTest={handleDeleteTest}
        onAddNewDeck={() => {
          setEditingDeck(null);
          setIsStudioOpen(true);
        }}
        onEditDeck={(d) => {
          setEditingDeck(d);
          setIsStudioOpen(true);
        }}
        onDeleteDeck={handleDeleteDeck}
        onExportBackup={handleExportBackup}
        onImportBackup={handleImportBackup}
        onLoadSampleCurriculum={handleLoadSampleCurriculum}
        onClearAllData={handleClearAllData}
      />

      {/* 6. Summary Form (Add/Edit) */}
      <SummaryFormModal
        isOpen={isSummaryFormOpen}
        onClose={() => {
          setIsSummaryFormOpen(false);
          setEditingSummary(null);
        }}
        onSave={handleSaveSummary}
        initialData={editingSummary}
      />

      {/* 7. 10-Question Test Form (Add/Edit) */}
      <TestFormModal
        isOpen={isTestFormOpen}
        onClose={() => {
          setIsTestFormOpen(false);
          setEditingTest(null);
        }}
        onSave={handleSaveTest}
        initialData={editingTest}
      />

      {/* 8. Student Progress / Stats Modal */}
      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        attempts={attempts}
        onClearHistory={() => {
          localStorage.removeItem('proders_attempts_v1');
          setAttempts([]);
          showToast('Geçmiş test kayıtları sıfırlandı.');
        }}
      />

    </div>
  );
}
