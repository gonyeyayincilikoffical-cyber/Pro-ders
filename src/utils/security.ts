// SHA-256 hash of "ProDers2026!AdminSecuredKey#8492"
export const MASTER_ADMIN_HASH = "797df55e9d46b0f9e2bf83e1730e618494b2953b345d42bc1dc8e78e82a96507";
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

/**
 * Computes the SHA-256 hash in hex format using standard Web Crypto API.
 * The plain-text password is never stored or compared in plain text.
 */
export async function sha256Hex(text: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(text);
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  // Node fallback for unit test environments
  try {
    const nodeCrypto = await import('node:crypto');
    return nodeCrypto.createHash('sha256').update(text).digest('hex');
  } catch {
    throw new Error('Kriptografik özetleme modülü bulunamadı.');
  }
}

/**
 * Compares the SHA-256 hash of the entered password against the secure master hash.
 */
export async function verifyAdminPassword(input: string): Promise<boolean> {
  const trimmed = input.trim();
  if (!trimmed) return false;
  const hash = await sha256Hex(trimmed);
  return hash === MASTER_ADMIN_HASH;
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
