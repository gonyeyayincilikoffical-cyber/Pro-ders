export const MASTER_ADMIN_PASSWORD = "ProDers2026!AdminSecuredKey#8492";
export const MAX_ADMIN_ATTEMPTS = 3;
export const LOCKOUT_DURATION_MS = 60 * 1000; // 60 seconds

export interface LockoutStatus {
  isLocked: boolean;
  remainingSeconds: number;
}

export function checkAdminLockout(lockoutUntil: number | null, currentTime: number = Date.now()): LockoutStatus {
  if (!lockoutUntil) {
    return { isLocked: false, remainingSeconds: 0 };
  }
  if (currentTime < lockoutUntil) {
    const diff = Math.ceil((lockoutUntil - currentTime) / 1000);
    return { isLocked: true, remainingSeconds: Math.max(diff, 1) };
  }
  return { isLocked: false, remainingSeconds: 0 };
}

export function verifyAdminPassword(input: string): boolean {
  return input.trim() === MASTER_ADMIN_PASSWORD;
}

export function handleFailedAttempt(
  currentAttempts: number,
  now: number = Date.now()
): { newAttempts: number; lockoutUntil: number | null } {
  const newAttempts = currentAttempts + 1;
  if (newAttempts >= MAX_ADMIN_ATTEMPTS) {
    return {
      newAttempts,
      lockoutUntil: now + LOCKOUT_DURATION_MS,
    };
  }
  return {
    newAttempts,
    lockoutUntil: null,
  };
}
