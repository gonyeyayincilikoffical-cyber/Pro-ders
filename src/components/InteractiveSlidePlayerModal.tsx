import React, { useState, useEffect, useRef } from 'react';
import { InteractiveDeck, InteractiveSlide, QuestionOption } from '../types';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  CheckCircle, 
  XCircle, 
  Sparkles, 
  Image as ImageIcon,
  HelpCircle,
  FileDown
} from 'lucide-react';
import { speakText, stopSpeech, pauseSpeech, resumeSpeech, isSpeaking } from '../utils/speech';

interface InteractiveSlidePlayerModalProps {
  deck: InteractiveDeck;
  onClose: () => void;
}

export const InteractiveSlidePlayerModal: React.FC<InteractiveSlidePlayerModalProps> = ({
  deck,
  onClose,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isAudioPaused, setIsAudioPaused] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [autoNarrate, setAutoNarrate] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Interactive question state on current slide
  const [selectedAnswer, setSelectedAnswer] = useState<QuestionOption | null>(null);
  const [showAnswerResult, setShowAnswerResult] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const currentSlide: InteractiveSlide | undefined = deck.slides[currentSlideIndex];

  // Stop speech on unmount
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  // Reset question state when slide changes
  useEffect(() => {
    setSelectedAnswer(null);
    setShowAnswerResult(false);
    stopSpeech();
    setIsPlayingAudio(false);
    setIsAudioPaused(false);

    if (autoNarrate && currentSlide) {
      const timer = setTimeout(() => {
        handlePlayNarration();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentSlideIndex, autoNarrate]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        goToNextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        goToPrevSlide();
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex, deck.slides.length, isFullscreen]);

  const goToNextSlide = () => {
    if (currentSlideIndex < deck.slides.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
    }
  };

  const goToPrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
    }
  };

  const handlePlayNarration = () => {
    if (!currentSlide) return;

    if (isAudioPaused) {
      resumeSpeech();
      setIsAudioPaused(false);
      setIsPlayingAudio(true);
      return;
    }

    const textToSpeak = currentSlide.narrationScript || currentSlide.content;
    const ok = speakText(textToSpeak, {
      rate: speechRate,
      onStart: () => {
        setIsPlayingAudio(true);
        setIsAudioPaused(false);
      },
      onEnd: () => {
        setIsPlayingAudio(false);
        setIsAudioPaused(false);
      },
      onError: () => {
        setIsPlayingAudio(false);
        setIsAudioPaused(false);
      },
    });

    if (ok) {
      setIsPlayingAudio(true);
    }
  };

  const handlePauseNarration = () => {
    pauseSpeech();
    setIsAudioPaused(true);
    setIsPlayingAudio(false);
  };

  const handleStopNarration = () => {
    stopSpeech();
    setIsPlayingAudio(false);
    setIsAudioPaused(false);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen().catch(() => {});
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!currentSlide) {
    return null;
  }

  // Visual theme badge and card background
  const getThemeStyles = (theme?: string) => {
    switch (theme) {
      case 'space':
        return {
          wrapper: 'bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 border-indigo-500/30 text-white',
          pill: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
          accent: 'text-cyan-400',
          card: 'bg-indigo-950/40 border-indigo-500/20',
        };
      case 'biology':
        return {
          wrapper: 'bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 border-emerald-500/30 text-white',
          pill: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          accent: 'text-emerald-400',
          card: 'bg-emerald-950/40 border-emerald-500/20',
        };
      case 'chemistry':
        return {
          wrapper: 'bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 border-purple-500/30 text-white',
          pill: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
          accent: 'text-fuchsia-400',
          card: 'bg-purple-950/40 border-purple-500/20',
        };
      case 'physics':
        return {
          wrapper: 'bg-gradient-to-br from-slate-950 via-sky-950 to-slate-900 border-sky-500/30 text-white',
          pill: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
          accent: 'text-amber-400',
          card: 'bg-sky-950/40 border-sky-500/20',
        };
      default:
        return {
          wrapper: 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white',
          pill: 'bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
          accent: 'text-cyan-600 dark:text-cyan-400',
          card: 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700',
        };
    }
  };

  const themeStyles = getThemeStyles(currentSlide.theme);

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          stopSpeech();
          onClose();
        }
      }}
    >
      <div
        ref={containerRef}
        className={`w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl flex flex-col border transition-all ${themeStyles.wrapper} ${
          isFullscreen ? 'h-full max-w-none rounded-none' : 'max-h-[94vh]'
        }`}
      >
        {/* Header Bar */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between gap-4 shrink-0 bg-black/20 backdrop-blur-sm">
          <div className="flex items-center gap-3 min-w-0">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${themeStyles.pill}`}>
              {deck.unitTitle}
            </span>
            <div className="flex flex-col truncate">
              <h2 className="text-sm sm:text-base font-bold truncate">
                {deck.title}
              </h2>
              <span className="text-xs opacity-70">
                Slayt {currentSlideIndex + 1} / {deck.slides.length}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrint}
              title="Yazdır / PDF"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white"
            >
              <FileDown className="w-4 h-4" />
            </button>
            <button
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Tam Ekrandan Çık' : 'Tam Ekran Yap'}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => {
                stopSpeech();
                onClose();
              }}
              title="Kapat"
              className="p-2 rounded-xl bg-white/10 hover:bg-red-500/80 transition-colors text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Slide Content Area (Scrollable if needed) */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          
          {/* Slide Title */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase opacity-80">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Etkileşimli Eğitim Slaytı</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight font-heading">
              {currentSlide.title}
            </h1>
          </div>

          {/* Main Slide Layout: Visual and Content */}
          <div className={`grid grid-cols-1 ${currentSlide.imageUrl ? 'lg:grid-cols-2' : 'grid-cols-1'} gap-6 items-start`}>
            
            {/* Optional Image / Diagram Uploaded */}
            {currentSlide.imageUrl && (
              <div className="rounded-2xl overflow-hidden border border-white/15 bg-black/30 p-2 shadow-inner space-y-2">
                <img
                  src={currentSlide.imageUrl}
                  alt={currentSlide.imageCaption || currentSlide.title}
                  className="w-full h-auto max-h-72 object-contain rounded-xl mx-auto"
                />
                {currentSlide.imageCaption && (
                  <p className="text-xs text-center opacity-75 italic px-2 pb-1">
                    {currentSlide.imageCaption}
                  </p>
                )}
              </div>
            )}

            {/* Explanation & Bullet Points */}
            <div className="space-y-5">
              <div className="text-base sm:text-lg leading-relaxed opacity-95">
                {currentSlide.content}
              </div>

              {currentSlide.bulletPoints && currentSlide.bulletPoints.length > 0 && (
                <div className="space-y-2.5 pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider opacity-70">
                    Önemli Noktalar:
                  </span>
                  <ul className="space-y-2">
                    {currentSlide.bulletPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm sm:text-base">
                        <span className={`w-2 h-2 rounded-full mt-2 shrink-0 bg-cyan-400`} />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

          </div>

          {/* Interactive Checkpoint Question (if provided) */}
          {currentSlide.interactiveQuestion && (
            <div className={`rounded-2xl p-5 border ${themeStyles.card} space-y-4 transition-all shadow-md mt-4`}>
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Kontrol Noktası: Kendini Dene!
                </span>
              </div>

              <p className="text-sm sm:text-base font-semibold">
                {currentSlide.interactiveQuestion.questionText}
              </p>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(['A', 'B', 'C', 'D'] as QuestionOption[]).map((optionKey) => {
                  const optionText = currentSlide.interactiveQuestion!.options[optionKey];
                  const isSelected = selectedAnswer === optionKey;
                  const isCorrect = optionKey === currentSlide.interactiveQuestion!.correctAnswer;

                  let buttonStyles = 'bg-white/10 hover:bg-white/15 border-white/10 text-white';
                  if (showAnswerResult) {
                    if (isCorrect) {
                      buttonStyles = 'bg-emerald-600/30 border-emerald-500 text-emerald-200 font-bold';
                    } else if (isSelected && !isCorrect) {
                      buttonStyles = 'bg-rose-600/30 border-rose-500 text-rose-200';
                    } else {
                      buttonStyles = 'opacity-40 border-transparent';
                    }
                  } else if (isSelected) {
                    buttonStyles = 'bg-cyan-500/30 border-cyan-400 text-cyan-200';
                  }

                  return (
                    <button
                      key={optionKey}
                      disabled={showAnswerResult}
                      onClick={() => {
                        setSelectedAnswer(optionKey);
                        setShowAnswerResult(true);
                      }}
                      className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-start gap-2.5 ${buttonStyles}`}
                    >
                      <span className="w-5 h-5 rounded-md bg-white/15 flex items-center justify-center font-bold text-xs shrink-0">
                        {optionKey}
                      </span>
                      <span className="flex-1">{optionText}</span>
                    </button>
                  );
                })}
              </div>

              {/* Result & Explanation Feedback */}
              {showAnswerResult && (
                <div className={`p-3.5 rounded-xl text-xs sm:text-sm border flex items-start gap-3 ${
                  selectedAnswer === currentSlide.interactiveQuestion.correctAnswer
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200'
                    : 'bg-rose-500/20 border-rose-500/40 text-rose-200'
                }`}>
                  {selectedAnswer === currentSlide.interactiveQuestion.correctAnswer ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <p className="font-bold">
                      {selectedAnswer === currentSlide.interactiveQuestion.correctAnswer
                        ? 'Tebrikler, Doğru Cevap!'
                        : `Yanlış Seçenek (Doğru Cevap: ${currentSlide.interactiveQuestion.correctAnswer})`}
                    </p>
                    <p className="opacity-90">
                      {currentSlide.interactiveQuestion.explanation}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* AI Voice Narration & Slide Control Footer */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-black/40 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          
          {/* AI Voice Player Controls */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-2">
              {!isPlayingAudio ? (
                <button
                  onClick={handlePlayNarration}
                  className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-600/30 transition-all hover:scale-105"
                  title="Yapay Zeka ile Seslendir"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Yapay Zeka ile Seslendir</span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handlePauseNarration}
                    className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs flex items-center gap-1.5 shadow-md transition-all"
                    title="Duraklat"
                  >
                    <Pause className="w-4 h-4 fill-current" />
                  </button>
                  <button
                    onClick={handleStopNarration}
                    className="p-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md transition-all"
                    title="Durdur"
                  >
                    <VolumeX className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Animated Soundwave indicator when speaking */}
              {isPlayingAudio && (
                <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 text-xs font-semibold">
                  <div className="flex items-end gap-0.5 h-3.5">
                    <span className="w-0.5 h-full bg-cyan-400 animate-pulse" />
                    <span className="w-0.5 h-2/3 bg-cyan-400 animate-pulse delay-75" />
                    <span className="w-0.5 h-4/5 bg-cyan-400 animate-pulse delay-150" />
                  </div>
                  <span className="hidden md:inline">Anlatılıyor...</span>
                </div>
              )}
            </div>

            {/* Playback speed selector */}
            <div className="flex items-center gap-1 text-xs opacity-80">
              <span>Hız:</span>
              <button
                onClick={() => setSpeechRate(0.9)}
                className={`px-1.5 py-0.5 rounded ${speechRate === 0.9 ? 'bg-white/20 font-bold' : 'hover:bg-white/10'}`}
              >
                0.9x
              </button>
              <button
                onClick={() => setSpeechRate(1.0)}
                className={`px-1.5 py-0.5 rounded ${speechRate === 1.0 ? 'bg-white/20 font-bold' : 'hover:bg-white/10'}`}
              >
                1x
              </button>
              <button
                onClick={() => setSpeechRate(1.25)}
                className={`px-1.5 py-0.5 rounded ${speechRate === 1.25 ? 'bg-white/20 font-bold' : 'hover:bg-white/10'}`}
              >
                1.25x
              </button>
            </div>
          </div>

          {/* Slide Navigation Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <label className="flex items-center gap-2 text-xs opacity-75 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoNarrate}
                onChange={(e) => setAutoNarrate(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-white/20 accent-cyan-500"
              />
              <span>Otomatik Seslendir</span>
            </label>

            <div className="flex items-center gap-1.5">
              <button
                onClick={goToPrevSlide}
                disabled={currentSlideIndex === 0}
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none transition-colors text-white flex items-center gap-1 text-xs sm:text-sm font-semibold"
                title="Önceki Slayt (Sol Ok)"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Önceki</span>
              </button>

              <div className="px-2.5 py-1 text-xs font-semibold tabular-nums opacity-80">
                {currentSlideIndex + 1} / {deck.slides.length}
              </div>

              <button
                onClick={goToNextSlide}
                disabled={currentSlideIndex === deck.slides.length - 1}
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-30 disabled:pointer-events-none transition-colors text-white flex items-center gap-1 text-xs sm:text-sm font-semibold shadow-md"
                title="Sonraki Slayt (Sağ Ok)"
              >
                <span className="hidden sm:inline">Sonraki</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
