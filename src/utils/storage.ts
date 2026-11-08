import { SubjectSummary, QuizTest, TestAttempt, AppBackupData } from '../types';
import { SAMPLE_6TH_GRADE_SUMMARIES, SAMPLE_6TH_GRADE_TESTS } from './sampleData';
import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc, 
  writeBatch 
} from 'firebase/firestore';

const STORAGE_KEYS = {
  SUMMARIES: 'proders_summaries_v1',
  TESTS: 'proders_tests_v1',
  ATTEMPTS: 'proders_attempts_v1',
  THEME: 'proders_theme_v1',
};

// Safe localStorage fallback wrapper
function isLocalStorageAvailable(): boolean {
  try {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  } catch {
    return false;
  }
}

/**
 * Loads published subject summaries from LocalStorage (offline fallback).
 */
export function getStoredSummaries(): SubjectSummary[] {
  if (!isLocalStorageAvailable()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SUMMARIES);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Yerel özetler yüklenirken hata oluştu:', err);
    return [];
  }
}

export function saveStoredSummaries(summaries: SubjectSummary[]): boolean {
  if (!isLocalStorageAvailable()) return false;
  try {
    localStorage.setItem(STORAGE_KEYS.SUMMARIES, JSON.stringify(summaries));
    return true;
  } catch (err) {
    console.error('Özetler yerel belleğe kaydedilirken hata oluştu:', err);
    return false;
  }
}

/**
 * Loads published 10-question tests from LocalStorage (offline fallback).
 */
export function getStoredTests(): QuizTest[] {
  if (!isLocalStorageAvailable()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TESTS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Yerel testler yüklenirken hata oluştu:', err);
    return [];
  }
}

export function saveStoredTests(tests: QuizTest[]): boolean {
  if (!isLocalStorageAvailable()) return false;
  try {
    localStorage.setItem(STORAGE_KEYS.TESTS, JSON.stringify(tests));
    return true;
  } catch (err) {
    console.error('Testler yerel belleğe kaydedilirken hata oluştu:', err);
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
    const updated = [attempt, ...current].slice(0, 100);
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

export function clearAllCourseData(): void {
  if (!isLocalStorageAvailable()) return;
  localStorage.removeItem(STORAGE_KEYS.SUMMARIES);
  localStorage.removeItem(STORAGE_KEYS.TESTS);
  localStorage.removeItem(STORAGE_KEYS.ATTEMPTS);
}

// --------------------------------------------------------------------------
// CLOUD DATABASE SYNC (Firebase Firestore + LocalStorage Fallback)
// --------------------------------------------------------------------------

/**
 * Loads the curriculum from Firebase Firestore.
 * Ensures any unit summary or test added on any device is instantly visible everywhere.
 * Falls back to LocalStorage if offline.
 */
export async function fetchCurriculumFromCloud(): Promise<{ summaries: SubjectSummary[]; tests: QuizTest[] }> {
  try {
    // 1. Fetch summaries from Firestore
    const summariesSnapshot = await getDocs(collection(db, 'summaries'));
    const summaries: SubjectSummary[] = [];
    summariesSnapshot.forEach((docSnap) => {
      summaries.push(docSnap.data() as SubjectSummary);
    });

    // 2. Fetch tests from Firestore
    const testsSnapshot = await getDocs(collection(db, 'tests'));
    const tests: QuizTest[] = [];
    testsSnapshot.forEach((docSnap) => {
      tests.push(docSnap.data() as QuizTest);
    });

    // Sort by unitNumber ascending
    summaries.sort((a, b) => a.unitNumber - b.unitNumber);
    tests.sort((a, b) => a.unitNumber - b.unitNumber);

    // Update LocalStorage offline fallback cache
    saveStoredSummaries(summaries);
    saveStoredTests(tests);

    return { summaries, tests };
  } catch (err) {
    console.warn('Bulut veritabanına bağlanılamadı, yerel yedek bellek (LocalStorage) kullanılıyor:', err);
    return {
      summaries: getStoredSummaries(),
      tests: getStoredTests(),
    };
  }
}

/**
 * Saves a SubjectSummary to Firebase Firestore and updates LocalStorage.
 */
export async function saveSummaryToCloud(summary: SubjectSummary): Promise<boolean> {
  // Always update LocalStorage immediately
  const localSummaries = getStoredSummaries();
  const existingIdx = localSummaries.findIndex((s) => s.id === summary.id);
  let updatedLocal: SubjectSummary[];
  if (existingIdx >= 0) {
    updatedLocal = localSummaries.map((s) => (s.id === summary.id ? summary : s));
  } else {
    updatedLocal = [summary, ...localSummaries];
  }
  saveStoredSummaries(updatedLocal);

  try {
    await setDoc(doc(db, 'summaries', summary.id), summary);
    return true;
  } catch (err) {
    console.error('Özet bulut veritabanına kaydedilirken hata oluştu (yerel belleğe kaydedildi):', err);
    return false;
  }
}

/**
 * Deletes a SubjectSummary from Firebase Firestore and updates LocalStorage.
 */
export async function deleteSummaryFromCloud(id: string): Promise<boolean> {
  const localSummaries = getStoredSummaries().filter((s) => s.id !== id);
  saveStoredSummaries(localSummaries);

  try {
    await deleteDoc(doc(db, 'summaries', id));
    return true;
  } catch (err) {
    console.error('Özet bulut veritabanından silinirken hata oluştu:', err);
    return false;
  }
}

/**
 * Saves a QuizTest to Firebase Firestore and updates LocalStorage.
 */
export async function saveTestToCloud(test: QuizTest): Promise<boolean> {
  const localTests = getStoredTests();
  const existingIdx = localTests.findIndex((t) => t.id === test.id);
  let updatedLocal: QuizTest[];
  if (existingIdx >= 0) {
    updatedLocal = localTests.map((t) => (t.id === test.id ? test : t));
  } else {
    updatedLocal = [test, ...localTests];
  }
  saveStoredTests(updatedLocal);

  try {
    await setDoc(doc(db, 'tests', test.id), test);
    return true;
  } catch (err) {
    console.error('Test bulut veritabanına kaydedilirken hata oluştu (yerel belleğe kaydedildi):', err);
    return false;
  }
}

/**
 * Deletes a QuizTest from Firebase Firestore and updates LocalStorage.
 */
export async function deleteTestFromCloud(id: string): Promise<boolean> {
  const localTests = getStoredTests().filter((t) => t.id !== id);
  saveStoredTests(localTests);

  try {
    await deleteDoc(doc(db, 'tests', id));
    return true;
  } catch (err) {
    console.error('Test bulut veritabanından silinirken hata oluştu:', err);
    return false;
  }
}

/**
 * Loads authentic sample MEB curriculum preset into Firestore and LocalStorage.
 */
export async function loadSampleCurriculumToCloud(): Promise<{ summariesCount: number; testsCount: number }> {
  // Save to local storage first
  saveStoredSummaries(SAMPLE_6TH_GRADE_SUMMARIES);
  saveStoredTests(SAMPLE_6TH_GRADE_TESTS);

  try {
    const batch = writeBatch(db);
    for (const summary of SAMPLE_6TH_GRADE_SUMMARIES) {
      batch.set(doc(db, 'summaries', summary.id), summary);
    }
    for (const test of SAMPLE_6TH_GRADE_TESTS) {
      batch.set(doc(db, 'tests', test.id), test);
    }
    await batch.commit();
  } catch (err) {
    console.error('Örnek müfredat buluta yüklenirken hata oluştu (yerel belleğe kaydedildi):', err);
  }

  return {
    summariesCount: SAMPLE_6TH_GRADE_SUMMARIES.length,
    testsCount: SAMPLE_6TH_GRADE_TESTS.length,
  };
}

/**
 * Uploads an imported JSON backup into Firebase Firestore and LocalStorage.
 */
export async function importBackupToCloud(summaries: SubjectSummary[], tests: QuizTest[]): Promise<boolean> {
  saveStoredSummaries(summaries);
  saveStoredTests(tests);

  try {
    const batch = writeBatch(db);
    for (const s of summaries) {
      batch.set(doc(db, 'summaries', s.id), s);
    }
    for (const t of tests) {
      batch.set(doc(db, 'tests', t.id), t);
    }
    await batch.commit();
    return true;
  } catch (err) {
    console.error('Yedek veriler buluta aktarılırken hata oluştu:', err);
    return false;
  }
}

/**
 * Clears all data from both Firebase Firestore and LocalStorage.
 */
export async function resetCloudCurriculum(): Promise<boolean> {
  clearAllCourseData();

  try {
    const summariesSnapshot = await getDocs(collection(db, 'summaries'));
    const testsSnapshot = await getDocs(collection(db, 'tests'));

    const batch = writeBatch(db);
    summariesSnapshot.forEach((docSnap) => {
      batch.delete(docSnap.ref);
    });
    testsSnapshot.forEach((docSnap) => {
      batch.delete(docSnap.ref);
    });
    await batch.commit();
    return true;
  } catch (err) {
    console.error('Bulut veritabanı sıfırlanırken hata oluştu:', err);
    return false;
  }
}
