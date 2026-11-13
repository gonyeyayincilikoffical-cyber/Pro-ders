import React, { useState, useEffect, useRef } from 'react';
import { SubjectSummary, QuizTest, InteractiveDeck, AdminAuthState } from '../types';
import { 
  verifyAdminPassword, 
  handleFailedAttempt, 
  checkAdminLockout, 
  MAX_ADMIN_ATTEMPTS
} from '../utils/security';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Eye, 
  EyeOff, 
  Plus, 
  Trash2, 
  Edit3, 
  Download, 
  Upload, 
  Sparkles, 
  LogOut, 
  FileText, 
  CheckSquare, 
  Database, 
  Info,
  AlertTriangle,
  RotateCcw,
  ArrowLeft,
  Layers,
  Volume2
} from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  summaries: SubjectSummary[];
  tests: QuizTest[];
  decks?: InteractiveDeck[];
  onAddNewSummary: (password?: string) => void;
  onEditSummary: (summary: SubjectSummary, password?: string) => void;
  onDeleteSummary: (id: string, password?: string) => void;
  onAddNewTest: (password?: string) => void;
  onEditTest: (test: QuizTest, password?: string) => void;
  onDeleteTest: (id: string, password?: string) => void;
  onAddNewDeck?: (password?: string) => void;
  onEditDeck?: (deck: InteractiveDeck, password?: string) => void;
  onDeleteDeck?: (id: string, password?: string) => void;
  onExportBackup: () => void;
  onImportBackup: (file: File, password?: string) => void;
  onLoadSampleCurriculum: (password?: string) => void;
  onClearAllData: (password?: string) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  summaries,
  tests,
  decks = [],
  onAddNewSummary,
  onEditSummary,
  onDeleteSummary,
  onAddNewTest,
  onEditTest,
  onDeleteTest,
  onAddNewDeck,
  onEditDeck,
  onDeleteDeck,
  onExportBackup,
  onImportBackup,
  onLoadSampleCurriculum,
  onClearAllData,
}) => {
  // Auth state
  const [authState, setAuthState] = useState<AdminAuthState>({
    isAuthenticated: false,
    failedAttempts: 0,
    lockoutUntil: null,
  });
  const [adminKey, setAdminKey] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);

  // Active Admin Tab
  const [adminTab, setAdminTab] = useState<'summaries' | 'tests' | 'decks' | 'backup' | 'system'>('summaries');

  // File upload input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lockout countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (authState.lockoutUntil) {
      interval = setInterval(() => {
        const status = checkAdminLockout(authState.lockoutUntil);
        setLockoutRemaining(status.remainingSeconds);
        if (!status.isLocked) {
          setAuthState((prev) => ({
            ...prev,
            lockoutUntil: null,
            failedAttempts: 0,
          }));
          setAuthError(null);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [authState.lockoutUntil]);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const lockout = checkAdminLockout(authState.lockoutUntil);
    if (lockout.isLocked) {
      setAuthError(`Güvenlik Koruması Devrede: Lütfen ${lockout.remainingSeconds} saniye bekleyiniz.`);
      return;
    }

    const isValid = await verifyAdminPassword(passwordInput);
    if (isValid) {
      setAuthState({
        isAuthenticated: true,
        failedAttempts: 0,
        lockoutUntil: null,
      });
      setAdminKey(passwordInput.trim());
      setPasswordInput('');
      setAuthError(null);
    } else {
      const next = handleFailedAttempt(authState.failedAttempts);
      setAuthState((prev) => ({
        ...prev,
        failedAttempts: next.newAttempts,
        lockoutUntil: next.lockoutUntil,
      }));

      if (next.lockoutUntil) {
        setAuthError(`3 hatalı şifre denemesi yapıldı! Güvenlik nedeniyle sistem 60 saniye süreyle kilitlendi.`);
      } else {
        const remaining = MAX_ADMIN_ATTEMPTS - next.newAttempts;
        setAuthError(`Hatalı yönetici şifresi! Kalan deneme hakkı: ${remaining}`);
      }
    }
  };

  const handleLogout = () => {
    setAuthState({
      isAuthenticated: false,
      failedAttempts: 0,
      lockoutUntil: null,
    });
    setAdminKey('');
    setPasswordInput('');
    setAuthError(null);
  };

  const isLocked = checkAdminLockout(authState.lockoutUntil).isLocked;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-heading">
                  Yönetici Kontrol Paneli (Admin Modu)
                </h2>
                {authState.isAuthenticated && (
                  <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-semibold">
                    Yetkilendirildi
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-500">6. Sınıf Fen Bilimleri Müfredat Yönetimi</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {authState.isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 transition-colors"
                title="Yönetici Oturumunu Kapat"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Çıkış</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              title="Öğrenci Arayüzüne Dön"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Öğrenci Sayfasına Dön</span>
              <X className="w-4 h-4 sm:hidden" />
            </button>
          </div>
        </div>

        {/* 1. AUTHENTICATION GATE (IF NOT AUTHENTICATED) */}
        {!authState.isAuthenticated ? (
          <div className="flex-1 p-6 sm:p-12 flex flex-col items-center justify-center max-w-md mx-auto w-full text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white font-heading">
                Güvenli Yönetici Girişi
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Bu alana yalnızca yetkili öğretmen ve yöneticiler erişebilir. Lütfen Master Yönetici Şifrenizi giriniz.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="w-full space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Master Yönetici Şifresi"
                  value={passwordInput}
                  disabled={isLocked}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full pl-4 pr-11 py-3 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 disabled:opacity-50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2 text-left">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
                  <span>{authError}</span>
                </div>
              )}

              {isLocked && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs text-center font-bold">
                  Kilitlenme Süresi: {lockoutRemaining} saniye kaldı...
                </div>
              )}

              <button
                type="submit"
                disabled={isLocked || !passwordInput}
                className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm transition-all shadow-md shadow-cyan-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Yönetici Olarak Giriş Yap</span>
              </button>
            </form>

            <div className="pt-2 text-xs text-slate-500 dark:text-slate-400">
              Güvenlik Politikası: 3 hatalı denemede 60 saniye kilitlenme uygulanır.
            </div>
          </div>
        ) : (
          /* 2. AUTHENTICATED ADMIN DASHBOARD */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Admin Tabs */}
            <div className="px-6 py-2.5 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 overflow-x-auto shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAdminTab('summaries')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    adminTab === 'summaries'
                      ? 'bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-sm border border-slate-200 dark:border-slate-700'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Konu Özetleri ({summaries.length})</span>
                </button>

                <button
                  onClick={() => setAdminTab('tests')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    adminTab === 'tests'
                      ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200 dark:border-slate-700'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>10 Soruluk Testler ({tests.length})</span>
                </button>

                <button
                  onClick={() => setAdminTab('decks')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    adminTab === 'decks'
                      ? 'bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-sm border border-slate-200 dark:border-slate-700'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Etkileşimli Slaytlar ({decks.length})</span>
                </button>

                <button
                  onClick={() => setAdminTab('backup')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    adminTab === 'backup'
                      ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-sm border border-slate-200 dark:border-slate-700'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Yedek & Yükleme</span>
                </button>

                <button
                  onClick={() => setAdminTab('system')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    adminTab === 'system'
                      ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200 dark:border-slate-700'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>Sistem Durumu</span>
                </button>
              </div>

              {/* Action buttons based on active tab */}
              {adminTab === 'summaries' && (
                <button
                  onClick={() => onAddNewSummary(adminKey)}
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Yeni Konu Özeti Ekle</span>
                </button>
              )}

              {adminTab === 'tests' && (
                <button
                  onClick={() => onAddNewTest(adminKey)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Yeni 10'luk Test Oluştur</span>
                </button>
              )}

              {adminTab === 'decks' && (
                <button
                  onClick={() => onAddNewDeck?.(adminKey)}
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Slayt Stüdyosu: Yeni Slayt</span>
                </button>
              )}
            </div>

            {/* Admin Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* TAB 1: KONU ÖZETLERİ YÖNETİMİ */}
              {adminTab === 'summaries' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                        Yayınlanan Konu Özetleri
                      </h3>
                      <p className="text-xs text-slate-500">
                        Öğrenci modunda görüntülenecek 6. Sınıf Fen Bilimleri ünite özetleri
                      </p>
                    </div>
                  </div>

                  {summaries.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
                      <div className="text-slate-400 text-xs">
                        Henüz sisteme eklenmiş bir konu özeti bulunmamaktadır.
                      </div>
                      <button
                        onClick={() => onAddNewSummary(adminKey)}
                        className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold inline-flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>İlk Konu Özetini Ekle</span>
                      </button>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
                      {summaries.map((summary) => (
                        <div
                          key={summary.id}
                          className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                        >
                          <div className="space-y-1">
                            <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                              {summary.unitTitle}
                            </span>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                              {summary.topicTitle}
                            </h4>
                            <div className="flex items-center gap-3 text-xs text-slate-500">
                              <span>{summary.estimatedReadMinutes} dk okuma</span>
                              <span>·</span>
                              <span>{summary.keyTerms.length} Kavram</span>
                              <span>·</span>
                              <span>{summary.criticalPoints.length} Püf Nokta</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                            <button
                              onClick={() => onEditSummary(summary, adminKey)}
                              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title="Düzenle"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`"${summary.topicTitle}" özetini silmek istediğinize emin misiniz?`)) {
                                  onDeleteSummary(summary.id, adminKey);
                                }
                              }}
                              className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                              title="Sil"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: 10 SORULUK TESTLER YÖNETİMİ */}
              {adminTab === 'tests' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                        Yayınlanan 10 Soruluk Testler
                      </h3>
                      <p className="text-xs text-slate-500">
                        Öğrencilerin pekiştirme için çözeceği 10 soruluk MEB uyumlu testler
                      </p>
                    </div>
                  </div>

                  {tests.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
                      <div className="text-slate-400 text-xs">
                        Henüz sisteme eklenmiş bir test bulunmamaktadır.
                      </div>
                      <button
                        onClick={() => onAddNewTest(adminKey)}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold inline-flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>İlk 10'luk Testi Oluştur</span>
                      </button>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
                      {tests.map((test) => (
                        <div
                          key={test.id}
                          className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                        >
                          <div className="space-y-1">
                            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                              {test.unitTitle}
                            </span>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                              {test.title}
                            </h4>
                            <div className="flex items-center gap-3 text-xs text-slate-500">
                              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                10 Soru (Tamamlandı)
                              </span>
                              <span>·</span>
                              <span>Çözüm Açıklamaları Mevcut</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                            <button
                              onClick={() => onEditTest(test, adminKey)}
                              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title="Testi Düzenle"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`"${test.title}" testini silmek istediğinize emin misiniz?`)) {
                                  onDeleteTest(test.id, adminKey);
                                }
                              }}
                              className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                              title="Sil"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB: ETKİLEŞİMLİ EĞİTİM SLAYTLARI YÖNETİMİ */}
              {adminTab === 'decks' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                        Yayınlanan Etkileşimli Eğitim Slaytları
                      </h3>
                      <p className="text-xs text-slate-500">
                        Yapay zeka seslendirmeli, görsel şema yüklü ve ara kontrol sorulu 6. sınıf slaytları
                      </p>
                    </div>
                  </div>

                  {decks.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
                      <div className="text-slate-400 text-xs">
                        Henüz sisteme eklenmiş bir eğitim slaytı bulunmamaktadır.
                      </div>
                      <button
                        onClick={() => onAddNewDeck?.(adminKey)}
                        className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>İlk Slayt Sunumunu Hazırla</span>
                      </button>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
                      {decks.map((deck) => (
                        <div
                          key={deck.id}
                          className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                        >
                          <div className="space-y-1">
                            <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                              {deck.unitTitle}
                            </span>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                              {deck.title}
                            </h4>
                            <div className="flex items-center gap-3 text-xs text-slate-500">
                              <span className="font-semibold text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
                                <Layers className="w-3.5 h-3.5" />
                                <span>{deck.slides.length} Slayt</span>
                              </span>
                              <span>·</span>
                              <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-medium">
                                <Volume2 className="w-3.5 h-3.5" />
                                <span>Yapay Zeka Seslendirmeli</span>
                              </span>
                              <span>·</span>
                              <span>Bulut Senkronize</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                            <button
                              onClick={() => onEditDeck?.(deck, adminKey)}
                              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title="Slaytı Düzenle"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`"${deck.title}" slayt sunumunu silmek istediğinize emin misiniz?`)) {
                                  onDeleteDeck?.(deck.id, adminKey);
                                }
                              }}
                              className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                              title="Sil"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: VERİ YEDEKLEME & GERİ YÜKLEME */}
              {adminTab === 'backup' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                      Ders Verisi Yedekleme ve Kurtarma
                    </h3>
                    <p className="text-xs text-slate-500">
                      Tüm konu özetlerini ve testleri JSON formatında dışa aktarabilir veya harici bir dosyadan yükleyebilirsiniz.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* JSON Export */}
                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                        <Download className="w-4 h-4 text-cyan-600" />
                        <span>Yedekleme Dosyasını İndir</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Mevcut {summaries.length} konu özeti ve {tests.length} testi tek bir JSON dosyasında bilgisayarınıza yedekler.
                      </p>
                      <button
                        onClick={onExportBackup}
                        className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold transition-all hover:bg-slate-800 dark:hover:bg-slate-100 flex items-center justify-center gap-1.5"
                      >
                        <Download className="w-4 h-4" />
                        <span>JSON Yedek İndir</span>
                      </button>
                    </div>

                    {/* JSON Import */}
                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                        <Upload className="w-4 h-4 text-purple-600" />
                        <span>Yedekten Geri Yükle</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Önceden indirilmiş bir ProDers JSON yedek dosyasını içeri aktararak ders havuzunu günceller.
                      </p>
                      <input
                        type="file"
                        accept=".json"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            onImportBackup(file, adminKey);
                          }
                        }}
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Yedek Dosyası Seç</span>
                      </button>
                    </div>
                  </div>

                  {/* Sample Curriculum Loader & Reset Section */}
                  <div className="p-5 rounded-2xl bg-cyan-50/60 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-800/60 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-cyan-600/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          Hızlı Test Aracı: Örnek MEB Müfredatını Yükle
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                          Sıfırdan tek tek elle veri girmek yerine, 6. Sınıf Fen Bilimleri 1. ve 2. ünitelerine ait eksiksiz hazırlanmış konu özetlerini ve 10 soruluk uzmanlık testlerini tek tıkla sisteme aktarabilirsiniz.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => onLoadSampleCurriculum(adminKey)}
                      className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Örnek 6. Sınıf Fen Müfredatını Yükle</span>
                    </button>
                  </div>

                  {/* Danger Zone: Clear Data */}
                  <div className="p-5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 space-y-3">
                    <h4 className="text-sm font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Tehlikeli Bölge: Tüm Verileri Sıfırla</span>
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Tüm konu özetlerini, 10 soruluk testleri ve öğrenci çözümlerini yerel bellekten silerek platformu başlangıçtaki temiz/boş haline döndürür.
                    </p>
                    <button
                      onClick={() => {
                        if (window.confirm('Tüm veriler kalıcı olarak silinecektir. Devam etmek istiyor musunuz?')) {
                          onClearAllData(adminKey);
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all inline-flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Platformu Sıfırla (Temiz Durum)</span>
                    </button>
                  </div>

                </div>
              )}

              {/* TAB 4: SİSTEM DURUMU & BİLGİ */}
              {adminTab === 'system' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                      ProDers Sistem ve Depolama Durumu
                    </h3>
                    <p className="text-xs text-slate-500">
                      Yerel bellek boyutu ve sistem parametreleri
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center">
                      <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400 tabular-nums font-heading">
                        {summaries.length}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">Konu Özeti</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center">
                      <div className="text-2xl font-black text-blue-600 dark:text-blue-400 tabular-nums font-heading">
                        {tests.length}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">10'luk Test</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center">
                      <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums font-heading">
                        {tests.length * 10}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">Toplam Soru</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center">
                      <div className="text-xl font-black text-purple-600 dark:text-purple-400 tabular-nums font-heading">
                        Bulut (Aktif)
                      </div>
                      <div className="text-xs text-slate-500 mt-1">Firebase Firestore</div>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                    <div className="font-semibold text-slate-900 dark:text-white">Teknik Özellikler:</div>
                    <ul className="list-disc list-inside space-y-1">
                      <li>İstemci: React 19 + Tailwind CSS (Karanlık/Aydınlık Tema)</li>
                      <li>Bulut Veritabanı: Google Firebase Firestore (Tüm Cihazlar Arasında Canlı Eşzamanlama)</li>
                      <li>Çevrimdışı Destek: İnternet kesintilerine karşı otomatik LocalStorage yedek belleği</li>
                      <li>Güvenlik: Şifrelenmiş Admin Geçidi (3 Hatalı Girişte 60 Sn Kilitlenme)</li>
                      <li>Türkçe Dil Uyumu: %100 Türkçe Arayüz, Bildirimler ve Test İçerikleri</li>
                    </ul>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
