/**
 * Turkish Text-to-Speech (AI Voice Narration) Engine.
 * Uses Web Speech Synthesis API with Turkish (tr-TR) language models,
 * providing zero-latency, realistic pronunciation, and offline playback.
 */

export interface SpeechOptions {
  rate?: number; // 0.8 to 1.5 (default 1.0)
  pitch?: number; // 0.8 to 1.2 (default 1.0)
  volume?: number; // 0 to 1 (default 1.0)
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

let activeUtterance: SpeechSynthesisUtterance | null = null;

/**
 * Strips markdown symbols, asterisks, bullet dashes, and URLs so the voice engine
 * speaks natural, fluid Turkish sentences.
 */
export function cleanTextForSpeech(rawText: string): string {
  if (!rawText) return '';
  return rawText
    .replace(/###?\s+/g, '') // remove markdown headings
    .replace(/\*\*(.*?)\*\*/g, '$1') // remove bold
    .replace(/\*(.*?)\*/g, '$1') // remove italic
    .replace(/`([^`]+)`/g, '$1') // remove inline code
    .replace(/^-\s+/gm, '') // remove bullet dashes
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links to text
    .replace(/⚠/g, 'Dikkat:')
    .replace(/·/g, ',')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Finds the optimal Turkish voice available in the client browser.
 */
export function getTurkishVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return null;
  }
  const voices = window.speechSynthesis.getVoices();
  // Try finding a native tr-TR voice (e.g. Google Türkçe, Yelda, Cem, etc.)
  const trVoice = voices.find(
    (v) => v.lang === 'tr-TR' || v.lang.startsWith('tr') || v.name.toLowerCase().includes('turkish')
  );
  return trVoice || null;
}

/**
 * Speaks the provided Turkish text aloud with playback callbacks.
 */
export function speakText(text: string, options: SpeechOptions = {}): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Tarayıcınız Web Speech Synthesis seslendirme API desteğine sahip değil.');
    options.onError?.(new Error('Web Speech API not supported'));
    return false;
  }

  // Cancel any ongoing speech first
  window.speechSynthesis.cancel();

  const cleaned = cleanTextForSpeech(text);
  if (!cleaned) return false;

  const utterance = new SpeechSynthesisUtterance(cleaned);
  utterance.lang = 'tr-TR';
  utterance.rate = options.rate ?? 1.0;
  utterance.pitch = options.pitch ?? 1.0;
  utterance.volume = options.volume ?? 1.0;

  const trVoice = getTurkishVoice();
  if (trVoice) {
    utterance.voice = trVoice;
  }

  utterance.onstart = () => {
    activeUtterance = utterance;
    options.onStart?.();
  };

  utterance.onend = () => {
    activeUtterance = null;
    options.onEnd?.();
  };

  utterance.onerror = (e) => {
    activeUtterance = null;
    // Don't treat cancel as an actual error
    if (e.error !== 'canceled' && e.error !== 'interrupted') {
      console.warn('Seslendirme uyarısı:', e);
      options.onError?.(e);
    } else {
      options.onEnd?.();
    }
  };

  activeUtterance = utterance;
  window.speechSynthesis.speak(utterance);
  return true;
}

/**
 * Stops any ongoing audio speech.
 */
export function stopSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    activeUtterance = null;
  }
}

/**
 * Pauses currently playing speech.
 */
export function pauseSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.pause();
  }
}

/**
 * Resumes paused speech.
 */
export function resumeSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.resume();
  }
}

/**
 * Checks if the voice engine is currently playing.
 */
export function isSpeaking(): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }
  return window.speechSynthesis.speaking;
}
