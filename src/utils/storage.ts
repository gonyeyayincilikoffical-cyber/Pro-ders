import { SubjectSummary, QuizTest, TestAttempt, AppBackupData } from '../types';
import { SAMPLE_6TH_GRADE_SUMMARIES, SAMPLE_6TH_GRADE_TESTS } from './sampleData';

const STORAGE_KEYS = {
  SUMMARIES: 'proders_summaries_v1',
  TESTS: 'proders_tests_v1',
  ATTEMPTS: 'proders_attempts_v1',
  THEME: 'proders_theme_v1',
};

// Safe localStorage wrapper
function isLocalStorageAvailable(): boolean {
  try {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  } catch {
    return false;
  }
}

/**
 * Loads published subject summaries.
 * Initial state MUST be an empty array unless published via Admin mode.
 */
export function getStoredSummaries(): SubjectSummary[] {
  if (!isLocalStorageAvailable()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SUMMARIES);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Özetler yüklenirken hata oluştu:', err);
    return [];
  }
}

export function saveStoredSummaries(summaries: SubjectSummary[]): boolean {
  if (!isLocalStorageAvailable()) return false;
  try {
    localStorage.setItem(STORAGE_KEYS.SUMMARIES, JSON.stringify(summaries));
    return true;
  } catch (err) {
    console.error('Özetler kaydedilirken hata oluştu:', err);
    return false;
  }
}

/**
 * Loads published 10-question tests.
 * Initial state MUST be an empty array unless published via Admin mode.
 */
export function getStoredTests(): QuizTest[] {
  if (!isLocalStorageAvailable()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TESTS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Testler yüklenirken hata oluştu:', err);
    return [];
  }
}

export function saveStoredTests(tests: QuizTest[]): boolean {
  if (!isLocalStorageAvailable()) return false;
  try {
    localStorage.setItem(STORAGE_KEYS.TESTS, JSON.stringify(tests));
    return true;
  } catch (err) {
    console.error('Testler kaydedilirken hata oluştu:', err);
    return false;
  }
}

export function getStoredAttempts(): TestAttempt[] {
  if (!isLocalStorageAvailable()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ATTEMPTS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStoredAttempt(attempt: TestAttempt): void {
  if (!isLocalStorageAvailable()) return;
  try {
    const current = getStoredAttempts();
    const updated = [attempt, ...current].slice(0, 100); // keep last 100 attempts
    localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(updated));
  } catch (err) {
    console.error('Sonuç kaydedilirken hata oluştu:', err);
  }
}

export function exportBackupJSON(): string {
  const data: AppBackupData = {
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    summaries: getStoredSummaries(),
    tests: getStoredTests(),
  };
  return JSON.stringify(data, null, 2);
}

export interface ImportResult {
  success: boolean;
  message: string;
  counts?: { summaries: number; tests: number };
}

export function importBackupJSON(jsonStr: string): ImportResult {
  try {
    const parsed = JSON.parse(jsonStr);
    if (!parsed || typeof parsed !== 'object') {
      return { success: false, message: 'Geçersiz JSON dosyası yapısı.' };
    }

    const summaries = Array.isArray(parsed.summaries) ? parsed.summaries : [];
    const tests = Array.isArray(parsed.tests) ? parsed.tests : [];

    saveStoredSummaries(summaries);
    saveStoredTests(tests);

    return {
      success: true,
      message: `Yedekleme başarıyla yüklendi! (${summaries.length} konu özeti, ${tests.length} test)`,
      counts: { summaries: summaries.length, tests: tests.length },
    };
  } catch (err) {
    return {
      success: false,
      message: `İçe aktarma hatası: ${(err as Error).message || 'Bilinmeyen hata'}`,
    };
  }
}

/**
 * Loads authentic sample curriculum data on demand from Admin mode.
 */
export function loadSampleCurriculum(): { summariesCount: number; testsCount: number } {
  saveStoredSummaries(SAMPLE_6TH_GRADE_SUMMARIES);
  saveStoredTests(SAMPLE_6TH_GRADE_TESTS);
  return {
    summariesCount: SAMPLE_6TH_GRADE_SUMMARIES.length,
    testsCount: SAMPLE_6TH_GRADE_TESTS.length,
  };
}

/**
 * Clears all content, reverting to a clean slate.
 */
export function clearAllCourseData(): void {
  if (!isLocalStorageAvailable()) return;
  localStorage.removeItem(STORAGE_KEYS.SUMMARIES);
  localStorage.removeItem(STORAGE_KEYS.TESTS);
  localStorage.removeItem(STORAGE_KEYS.ATTEMPTS);
}
