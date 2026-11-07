import React, { useState, useEffect } from 'react';
import { SubjectSummary, QuizTest, TestAttempt } from './types';
import { 
  getStoredSummaries, 
  saveStoredSummaries, 
  getStoredTests, 
  saveStoredTests, 
  getStoredAttempts, 
  saveStoredAttempt,
  exportBackupJSON,
  importBackupJSON,
  clearAllCourseData,
  fetchCurriculumFromServer,
  serverSaveSummary,
  serverDeleteSummary,
  serverSaveTest,
  serverDeleteTest,
  serverLoadPreset,
  serverImportBackup,
  serverResetCurriculum
} from './utils/storage';
import { Header } from './components/Header';
import { BentoGrid } from './components/BentoGrid';
import { SummaryReaderModal } from './components/SummaryReaderModal';
import { TestPlayerModal } from './components/TestPlayerModal';
import { AdminModal } from './components/AdminModal';
import { SummaryFormModal } from './components/SummaryFormModal';
import { TestFormModal } from './components/TestFormModal';
import { StatsModal } from './components/StatsModal';
import { CheckCircle2, AlertCircle } from 'lucide-react';

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

  // Course content states (Empty by default on initial launch)
  const [summaries, setSummaries] = useState<SubjectSummary[]>([]);
  const [tests, setTests] = useState<QuizTest[]>([]);
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);

  // Navigation / filtering state
  const [activeTab, setActiveTab] = useState<'all' | 'summaries' | 'tests'>('all');

  // Modal visibility states
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminPasswordKey, setAdminPasswordKey] = useState<string>('');
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [activeSummaryForReading, setActiveSummaryForReading] = useState<SubjectSummary | null>(null);
  const [activeTestForPlaying, setActiveTestForPlaying] = useState<QuizTest | null>(null);

  // Form modal states
  const [isSummaryFormOpen, setIsSummaryFormOpen] = useState(false);
  const [editingSummary, setEditingSummary] = useState<SubjectSummary | null>(null);
  const [isTestFormOpen, setIsTestFormOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<QuizTest | null>(null);

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

  // Load content from LocalStorage first, then fetch latest from server (cross-device synchronization)
  useEffect(() => {
    setSummaries(getStoredSummaries());
    setTests(getStoredTests());
    setAttempts(getStoredAttempts());

    // Fetch from server so any other device that published content immediately updates this device
    fetchCurriculumFromServer().then(({ summaries: serverSummaries, tests: serverTests }) => {
      setSummaries(serverSummaries);
      setTests(serverTests);
    });
  }, []);

  const handleToggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Summary handlers (with server sync)
  const handleSaveSummary = async (newSummary: SubjectSummary) => {
    let updated: SubjectSummary[];
    const exists = summaries.some((s) => s.id === newSummary.id);
    if (exists) {
      updated = summaries.map((s) => (s.id === newSummary.id ? newSummary : s));
      showToast('Konu özeti başarıyla güncellendi.');
    } else {
      updated = [newSummary, ...summaries];
      showToast('Yeni konu özeti başarıyla yayınlandı.');
    }
    setSummaries(updated);
    saveStoredSummaries(updated);

    // Sync to server so all devices see this summary
    await serverSaveSummary(newSummary, adminPasswordKey);
  };

  const handleDeleteSummary = async (id: string, password?: string) => {
    const updated = summaries.filter((s) => s.id !== id);
    setSummaries(updated);
    saveStoredSummaries(updated);
    showToast('Konu özeti başarıyla silindi.');

    // Sync deletion to server
    await serverDeleteSummary(id, password || adminPasswordKey);
  };

  // Test handlers (with server sync)
  const handleSaveTest = async (newTest: QuizTest) => {
    let updated: QuizTest[];
    const exists = tests.some((t) => t.id === newTest.id);
    if (exists) {
      updated = tests.map((t) => (t.id === newTest.id ? newTest : t));
      showToast('10 soruluk test başarıyla güncellendi.');
    } else {
      updated = [newTest, ...tests];
      showToast('Yeni 10 soruluk test başarıyla yayınlandı.');
    }
    setTests(updated);
    saveStoredTests(updated);

    // Sync to server so all devices see this test
    await serverSaveTest(newTest, adminPasswordKey);
  };

  const handleDeleteTest = async (id: string, password?: string) => {
    const updated = tests.filter((t) => t.id !== id);
    setTests(updated);
    saveStoredTests(updated);
    showToast('Test başarıyla silindi.');

    // Sync deletion to server
    await serverDeleteTest(id, password || adminPasswordKey);
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

  const handleImportBackup = async (file: File, password?: string) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      if (content) {
        const result = importBackupJSON(content);
        if (result.success) {
          const loadedSummaries = getStoredSummaries();
          const loadedTests = getStoredTests();
          setSummaries(loadedSummaries);
          setTests(loadedTests);
          showToast(result.message);

          // Sync imported data to server
          await serverImportBackup(
            { summaries: loadedSummaries, tests: loadedTests },
            password || adminPasswordKey
          );
        } else {
          showToast(result.message, 'error');
        }
      }
    };
    reader.readAsText(file);
  };

  // Preset loader (sync to server for all devices)
  const handleLoadSampleCurriculum = async (password?: string) => {
    await serverLoadPreset(password || adminPasswordKey);
    const { summaries: serverSummaries, tests: serverTests } = await fetchCurriculumFromServer();
    setSummaries(serverSummaries);
    setTests(serverTests);
    showToast(`Örnek 6. Sınıf müfredatı yüklendi! (${serverSummaries.length} Özet, ${serverTests.length} Test)`);
  };

  // Clear data
  const handleClearAllData = async (password?: string) => {
    await serverResetCurriculum(password || adminPasswordKey);
    clearAllCourseData();
    setSummaries([]);
    setTests([]);
    setAttempts([]);
    showToast('Platform sıfırlandı. Tüm ders verileri temizlendi.');
  };

  // Test Attempt
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

      {/* Header */}
      <Header
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenStats={() => setIsStatsOpen(true)}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        summariesCount={summaries.length}
        testsCount={tests.length}
      />

      {/* Main Content: Bento Grid */}
      <main className="flex-1">
        <BentoGrid
          summaries={summaries}
          tests={tests}
          attempts={attempts}
          onSelectSummary={(s) => setActiveSummaryForReading(s)}
          onSelectTest={(t) => setActiveTestForPlaying(t)}
          onOpenAdmin={() => setIsAdminOpen(true)}
          activeFilter={activeTab}
          onFilterChange={setActiveTab}
        />
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 dark:border-slate-800 py-6 px-4 bg-white/50 dark:bg-slate-950/50 backdrop-blur-xs text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">ProDers</span>
            <span>·</span>
            <span>6. Sınıf Fen Bilimleri Eğitim Platformu</span>
          </div>
          <div>
            <span>Milli Eğitim Bakanlığı Müfredatı ile Tam Uyumlu</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {/* 1. Summary Reader Modal */}
      <SummaryReaderModal
        summary={activeSummaryForReading}
        onClose={() => setActiveSummaryForReading(null)}
        onOpenTestForUnit={handleOpenTestForUnit}
      />

      {/* 2. Interactive Test Player Modal */}
      <TestPlayerModal
        test={activeTestForPlaying}
        onClose={() => setActiveTestForPlaying(null)}
        onSaveAttempt={handleSaveAttempt}
      />

      {/* 3. Ultra Secure Admin Control Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        summaries={summaries}
        tests={tests}
        onAddNewSummary={(pwd) => {
          if (pwd) setAdminPasswordKey(pwd);
          setEditingSummary(null);
          setIsSummaryFormOpen(true);
        }}
        onEditSummary={(s, pwd) => {
          if (pwd) setAdminPasswordKey(pwd);
          setEditingSummary(s);
          setIsSummaryFormOpen(true);
        }}
        onDeleteSummary={handleDeleteSummary}
        onAddNewTest={(pwd) => {
          if (pwd) setAdminPasswordKey(pwd);
          setEditingTest(null);
          setIsTestFormOpen(true);
        }}
        onEditTest={(t, pwd) => {
          if (pwd) setAdminPasswordKey(pwd);
          setEditingTest(t);
          setIsTestFormOpen(true);
        }}
        onDeleteTest={handleDeleteTest}
        onExportBackup={handleExportBackup}
        onImportBackup={handleImportBackup}
        onLoadSampleCurriculum={handleLoadSampleCurriculum}
        onClearAllData={handleClearAllData}
      />

      {/* 4. Summary Form (Add/Edit) */}
      <SummaryFormModal
        isOpen={isSummaryFormOpen}
        onClose={() => {
          setIsSummaryFormOpen(false);
          setEditingSummary(null);
        }}
        onSave={handleSaveSummary}
        initialData={editingSummary}
      />

      {/* 5. 10-Question Test Form (Add/Edit) */}
      <TestFormModal
        isOpen={isTestFormOpen}
        onClose={() => {
          setIsTestFormOpen(false);
          setEditingTest(null);
        }}
        onSave={handleSaveTest}
        initialData={editingTest}
      />

      {/* 6. Student Progress / Stats Modal */}
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
