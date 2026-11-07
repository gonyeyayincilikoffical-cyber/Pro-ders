import test from 'node:test';
import assert from 'node:assert/strict';
import { verifyAdminPassword, handleFailedAttempt, checkAdminLockout, MASTER_ADMIN_PASSWORD } from './security';
import { computeQuizScore, formatDuration } from './scoring';
import { importBackupJSON } from './storage';
import { TestQuestion } from '../types';

test('security: admin master password verification', () => {
  assert.equal(verifyAdminPassword(MASTER_ADMIN_PASSWORD), true);
  assert.equal(verifyAdminPassword('wrongPassword'), false);
  assert.equal(verifyAdminPassword(''), false);
  assert.equal(verifyAdminPassword('  ProDers2026!AdminSecuredKey#8492  '), true, 'handles whitespace trimming');
});

test('security: lockout triggers after 3 failed attempts', () => {
  const t0 = 1000000;
  const attempt1 = handleFailedAttempt(0, t0);
  assert.equal(attempt1.newAttempts, 1);
  assert.equal(attempt1.lockoutUntil, null);

  const attempt2 = handleFailedAttempt(1, t0);
  assert.equal(attempt2.newAttempts, 2);
  assert.equal(attempt2.lockoutUntil, null);

  const attempt3 = handleFailedAttempt(2, t0);
  assert.equal(attempt3.newAttempts, 3);
  assert.notEqual(attempt3.lockoutUntil, null);

  const lockCheckActive = checkAdminLockout(attempt3.lockoutUntil, t0 + 10000); // 10s into 60s lockout
  assert.equal(lockCheckActive.isLocked, true);
  assert.equal(lockCheckActive.remainingSeconds, 50);

  const lockCheckExpired = checkAdminLockout(attempt3.lockoutUntil, t0 + 70000); // 70s later
  assert.equal(lockCheckExpired.isLocked, false);
  assert.equal(lockCheckExpired.remainingSeconds, 0);
});

test('scoring: correctly scores answers and detects empty responses', () => {
  const dummyQuestions: TestQuestion[] = [
    {
      id: 'q1',
      questionNumber: 1,
      questionText: 'Soru 1',
      options: { A: 'A', B: 'B', C: 'C', D: 'D' },
      correctAnswer: 'A',
      explanation: 'Açıklama 1',
    },
    {
      id: 'q2',
      questionNumber: 2,
      questionText: 'Soru 2',
      options: { A: 'A', B: 'B', C: 'C', D: 'D' },
      correctAnswer: 'B',
      explanation: 'Açıklama 2',
    },
    {
      id: 'q3',
      questionNumber: 3,
      questionText: 'Soru 3',
      options: { A: 'A', B: 'B', C: 'C', D: 'D' },
      correctAnswer: 'C',
      explanation: 'Açıklama 3',
    },
  ];

  // User answered: Q1: A (correct), Q2: D (wrong), Q3: not answered (empty)
  const answers = { 1: 'A' as const, 2: 'D' as const };
  const score = computeQuizScore(answers, dummyQuestions);

  assert.equal(score.totalQuestions, 3);
  assert.equal(score.correctCount, 1);
  assert.equal(score.wrongCount, 1);
  assert.equal(score.emptyCount, 1);
  assert.equal(score.scorePercentage, 33);
  assert.equal(score.passed, false);
  assert.equal(score.resultsByQuestion[0].isCorrect, true);
  assert.equal(score.resultsByQuestion[1].isCorrect, false);
  assert.equal(score.resultsByQuestion[2].isEmpty, true);
});

test('scoring: formatDuration formats mm:ss correctly', () => {
  assert.equal(formatDuration(0), '0:00');
  assert.equal(formatDuration(65), '1:05');
  assert.equal(formatDuration(360), '6:00');
});

test('storage: importBackupJSON handles bad JSON and valid structures', () => {
  const badResult = importBackupJSON('not valid json');
  assert.equal(badResult.success, false);

  const emptyValidResult = importBackupJSON(JSON.stringify({ summaries: [], tests: [] }));
  assert.equal(emptyValidResult.success, true);
  assert.deepEqual(emptyValidResult.counts, { summaries: 0, tests: 0 });
});
