import React, { useState, useRef } from 'react';
import { InteractiveDeck, InteractiveSlide, QuestionOption, SlideTheme } from '../types';
import { 
  X, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Upload, 
  Download, 
  Sparkles, 
  Volume2, 
  Image as ImageIcon, 
  HelpCircle, 
  Check, 
  Save, 
  Layers,
  FileText,
  Eye,
  Loader2
} from 'lucide-react';
import { speakText, stopSpeech } from '../utils/speech';

interface SlideStudioModalProps {
  initialDeck?: InteractiveDeck | null;
  onSave: (deck: InteractiveDeck) => void;
  onClose: () => void;
}

const UNIT_OPTIONS = [
  '1. Ünite: Güneş Sistemi ve Tutulmalar',
  '2. Ünite: Vücudumuzdaki Sistemler',
  '3. Ünite: Kuvvet ve Hareket',
  '4. Ünite: Madde ve Isı',
  '5. Ünite: Ses ve Özellikleri',
  '6. Ünite: Vücudumuzdaki Sistemler ve Sağlığı',
  '7. Ünite: Elektriğin İletimi'
];

export const SlideStudioModal: React.FC<SlideStudioModalProps> = ({
  initialDeck,
  onSave,
  onClose,
}) => {
  const [unitTitle, setUnitTitle] = useState(
    initialDeck ? initialDeck.unitTitle : UNIT_OPTIONS[0]
  );
  const [deckTitle, setDeckTitle] = useState(
    initialDeck ? initialDeck.title : ''
  );
  const [description, setDescription] = useState(
    initialDeck ? initialDeck.description : ''
  );

  const [slides, setSlides] = useState<InteractiveSlide[]>(
    initialDeck && initialDeck.slides.length > 0
      ? initialDeck.slides
      : [
          {
            id: `s-${Date.now()}-1`,
            order: 1,
            title: '1. Slayt Başlığı',
            content: 'Bu alana slaytta öğrencilerinize aktaracağınız temel fen bilgisini yazınız.',
            narrationScript: 'Merhaba sevgili öğrenciler! Bu slaytımızda konumuzu birlikte öğreniyoruz.',
            bulletPoints: ['Birinci önemli kavram', 'İkinci kritik kazanım'],
            theme: 'space',
          },
        ]
  );

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [bulletInput, setBulletInput] = useState('');
  const [hasQuiz, setHasQuiz] = useState<boolean>(() => {
    return Boolean(slides[0]?.interactiveQuestion);
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const jsonImportRef = useRef<HTMLInputElement>(null);

  const activeSlide: InteractiveSlide | undefined = slides[activeSlideIndex];

  // Helper to update active slide
  const updateActiveSlide = (updater: (prev: InteractiveSlide) => InteractiveSlide) => {
    setSlides((prev) =>
      prev.map((s, idx) => (idx === activeSlideIndex ? updater(s) : s))
    );
  };

  // Add new slide
  const handleAddSlide = () => {
    const newSlide: InteractiveSlide = {
      id: `s-${Date.now()}-${slides.length + 1}`,
      order: slides.length + 1,
      title: `${slides.length + 1}. Yeni Slayt`,
      content: 'Buraya yeni konunun açıklamasını yazınız.',
      narrationScript: '',
      bulletPoints: [],
      theme: 'space',
    };
    const nextList = [...slides, newSlide];
    setSlides(nextList);
    setActiveSlideIndex(nextList.length - 1);
  };

  // Remove slide
  const handleRemoveSlide = (index: number) => {
    if (slides.length <= 1) {
      alert('Slayt sunumunda en az bir adet slayt bulunmalıdır.');
      return;
    }
    const updated = slides.filter((_, idx) => idx !== index);
    setSlides(updated);
    if (activeSlideIndex >= updated.length) {
      setActiveSlideIndex(updated.length - 1);
    }
  };

  // Reorder slides
  const moveSlide = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= slides.length) return;

    const list = [...slides];
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;
    // re-assign order numbers
    list.forEach((s, idx) => {
      s.order = idx + 1;
    });
    setSlides(list);
    setActiveSlideIndex(targetIdx);
  };

  // Image file upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Lütfen geçerli bir görsel dosyası seçin (PNG, JPG, SVG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Görsel dosyası boyutu 5 MB\'tan küçük olmalıdır.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      updateActiveSlide((s) => ({
        ...s,
        imageUrl: dataUrl,
        imageCaption: s.imageCaption || file.name.replace(/\.[^/.]+$/, ''),
      }));
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // JSON Deck Import handler
  const handleJsonDeckImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.slides && Array.isArray(parsed.slides)) {
          if (parsed.title) setDeckTitle(parsed.title);
          if (parsed.unitTitle) setUnitTitle(parsed.unitTitle);
          if (parsed.description) setDescription(parsed.description);
          setSlides(parsed.slides);
          setActiveSlideIndex(0);
          alert('Slayt dosyası başarıyla içe aktarıldı!');
        } else {
          alert('Geçersiz slayt dosyası biçimi.');
        }
      } catch (err) {
        alert('Dosya okunurken hata oluştu: ' + (err as Error).message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // JSON Deck Export handler
  const handleExportDeckJSON = () => {
    const deckToExport: InteractiveDeck = {
      id: initialDeck?.id || `slayt-${Date.now()}`,
      unitNumber: parseInt(unitTitle.match(/\d+/)?.[0] || '1', 10),
      unitTitle,
      title: deckTitle || '6. Sınıf Fen Bilimleri Slaytı',
      description,
      grade: '6. Sınıf',
      subject: 'Fen Bilimleri',
      slides,
      createdAt: initialDeck?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(deckToExport, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(deckTitle || 'slayt_sunumu').replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // AI Content & Voice Script Generator
  const handleGenerateAiNarration = async () => {
    if (!activeSlide) return;
    setIsAiLoading(true);

    try {
      const response = await fetch('/api/ai/enhance-slide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: `${unitTitle} - ${deckTitle}`,
          title: activeSlide.title,
          rawContent: activeSlide.content,
          grade: '6. Sınıf',
        }),
      });

      const data = await response.json();
      if (data.success && data.slide) {
        const gen = data.slide;
        updateActiveSlide((s) => ({
          ...s,
          title: gen.title || s.title,
          content: gen.content || s.content,
          narrationScript: gen.narrationScript || s.narrationScript,
          bulletPoints: gen.bulletPoints || s.bulletPoints,
          interactiveQuestion: gen.interactiveQuestion || s.interactiveQuestion,
        }));
        if (gen.interactiveQuestion) {
          setHasQuiz(true);
        }
      }
    } catch (err) {
      console.error('Yapay zeka üretim hatası:', err);
      alert('Yapay zeka yanıt vermedi, yerel seslendirme metni kullanılıyor.');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Audio preview
  const handlePreviewSpeech = () => {
    if (!activeSlide) return;
    if (isPlayingPreview) {
      stopSpeech();
      setIsPlayingPreview(false);
      return;
    }

    const textToSpeak = activeSlide.narrationScript || activeSlide.content;
    const ok = speakText(textToSpeak, {
      onStart: () => setIsPlayingPreview(true),
      onEnd: () => setIsPlayingPreview(false),
      onError: () => setIsPlayingPreview(false),
    });
    if (ok) setIsPlayingPreview(true);
  };

  // Save full deck
  const handleSaveDeck = () => {
    if (!deckTitle.trim()) {
      alert('Lütfen sunum için bir başlık giriniz.');
      return;
    }

    const unitNum = parseInt(unitTitle.match(/\d+/)?.[0] || '1', 10);
    const deckToSave: InteractiveDeck = {
      id: initialDeck?.id || `slayt-${Date.now()}`,
      unitNumber: unitNum,
      unitTitle,
      title: deckTitle.trim(),
      description: description.trim() || 'MEB 6. sınıf kazanımlarına uygun etkileşimli eğitim sunumu.',
      grade: '6. Sınıf',
      subject: 'Fen Bilimleri',
      slides: slides.map((s, idx) => ({ ...s, order: idx + 1 })),
      createdAt: initialDeck?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    stopSpeech();
    onSave(deckToSave);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-6xl max-h-[95vh] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden text-slate-900 dark:text-white">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50 dark:bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white flex items-center justify-center shadow-md">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-heading">
                {initialDeck ? 'Eğitim Slaytını Düzenle' : 'Etkileşimli İçerik ve Eğitim Slaydı Stüdyosu'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Görsel yükleyin, yapay zeka ile seslendirme metni oluşturun ve kontrol soruları ekleyin.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* JSON Import/Export Buttons */}
            <input
              ref={jsonImportRef}
              type="file"
              accept=".json"
              onChange={handleJsonDeckImport}
              className="hidden"
            />
            <button
              onClick={() => jsonImportRef.current?.click()}
              title="Slayt Dosyası Yükle (.json)"
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">İçe Aktar (.json)</span>
            </button>
            <button
              onClick={handleExportDeckJSON}
              title="Slayt Dosyasını İndir (.json)"
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dışa Aktar (.json)</span>
            </button>
            <button
              onClick={() => {
                stopSpeech();
                onClose();
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Deck Meta (Unit & Title) */}
        <div className="p-4 sm:px-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 grid grid-cols-1 sm:grid-cols-3 gap-3 shrink-0">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Ünite Seçimi
            </label>
            <select
              value={unitTitle}
              onChange={(e) => setUnitTitle(e.target.value)}
              className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {UNIT_OPTIONS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Sunum / Slayt Başlığı *
            </label>
            <input
              type="text"
              placeholder="Örn: Güneş Sistemi ve Gezegenler - Etkileşimli Sunum"
              value={deckTitle}
              onChange={(e) => setDeckTitle(e.target.value)}
              className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>

        {/* Workspace: Left Slides Sidebar & Right Slide Editor */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          
          {/* Left Sidebar: Slides List & Ordering */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/70 dark:bg-slate-950/40 shrink-0">
            <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Slaytlar ({slides.length})
              </span>
              <button
                onClick={handleAddSlide}
                className="px-2.5 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1 shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ekle</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1.5 max-h-48 md:max-h-none">
              {slides.map((s, idx) => (
                <div
                  key={s.id}
                  onClick={() => setActiveSlideIndex(idx)}
                  className={`group p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between gap-2 ${
                    activeSlideIndex === idx
                      ? 'bg-cyan-500/15 border-cyan-500 text-cyan-700 dark:text-cyan-300 font-semibold'
                      : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-5 h-5 rounded-md bg-slate-200 dark:bg-slate-800 text-xs flex items-center justify-center font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-xs truncate">{s.title || 'Başlıksız Slayt'}</span>
                  </div>

                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveSlide(idx, 'up');
                      }}
                      disabled={idx === 0}
                      title="Yukarı Taşı"
                      className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-20 text-slate-500"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveSlide(idx, 'down');
                      }}
                      disabled={idx === slides.length - 1}
                      title="Aşağı Taşı"
                      className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-20 text-slate-500"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveSlide(idx);
                      }}
                      title="Slaytı Sil"
                      className="p-1 rounded hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-500"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Editor Pane */}
          {activeSlide && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              
              {/* Slide Title and Theme */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Slayt Başlığı *
                  </label>
                  <input
                    type="text"
                    value={activeSlide.title}
                    onChange={(e) =>
                      updateActiveSlide((s) => ({ ...s, title: e.target.value }))
                    }
                    placeholder="Örn: Karasal (İç) Gezegenler"
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Görsel Tema
                  </label>
                  <select
                    value={activeSlide.theme || 'space'}
                    onChange={(e) =>
                      updateActiveSlide((s) => ({
                        ...s,
                        theme: e.target.value as SlideTheme,
                      }))
                    }
                    className="w-full text-sm px-3 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="space">Uzay / Astronomi (Koyu Lacivert)</option>
                    <option value="biology">Biyoloji / Canlılar (Zümrüt Yeşili)</option>
                    <option value="chemistry">Kimya / Maddeler (Mor/Eflatun)</option>
                    <option value="physics">Fizik / Kuvvet (Mavi/Altın)</option>
                    <option value="minimal">Minimal / Sade (Gri/Beyaz)</option>
                  </select>
                </div>
              </div>

              {/* Main Content & Explanation */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Slayt Açıklama ve Ders Metni *
                </label>
                <textarea
                  rows={4}
                  value={activeSlide.content}
                  onChange={(e) =>
                    updateActiveSlide((s) => ({ ...s, content: e.target.value }))
                  }
                  placeholder="Slaytın ana anlatım içeriği..."
                  className="w-full text-sm p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 leading-relaxed"
                />
              </div>

              {/* AI Voice Narration Box */}
              <div className="p-4 rounded-2xl bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800/60 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-cyan-800 dark:text-cyan-300 font-bold text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                    <span>Yapay Zeka Seslendirme ve Öğretmen Anlatımı</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleGenerateAiNarration}
                      disabled={isAiLoading}
                      className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      {isAiLoading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Üretiliyor...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Yapay Zeka ile Metin ve Seslendirme Üret</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handlePreviewSpeech}
                      className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-all"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                      <span>{isPlayingPreview ? 'Durdur' : 'Seslendir (Dinle)'}</span>
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Öğrenciler slaytı açtığında veya "Yapay Zeka ile Seslendir" butonuna bastığında seslendirilecek özel öğretmen konuşma metnidir.
                </p>

                <textarea
                  rows={3}
                  value={activeSlide.narrationScript || ''}
                  onChange={(e) =>
                    updateActiveSlide((s) => ({ ...s, narrationScript: e.target.value }))
                  }
                  placeholder="Yapay zekanın akıcı bir öğretmen üslubuyla seslendirmesini istediğiniz metni buraya yazabilir veya yukarıdaki butonla otomatik üretebilirsiniz..."
                  className="w-full text-xs sm:text-sm p-3 rounded-xl bg-white dark:bg-slate-900 border border-cyan-300 dark:border-cyan-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              {/* File Upload Section: Diagrams & Images */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold text-xs uppercase tracking-wider">
                    <ImageIcon className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                    <span>Slayt İçin Dosya / Görsel Yükleme</span>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Görsel / Şema Yükle</span>
                  </button>
                </div>

                {activeSlide.imageUrl ? (
                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                    <img
                      src={activeSlide.imageUrl}
                      alt="Slayt görseli"
                      className="w-32 h-24 object-contain rounded-lg border bg-slate-100 dark:bg-slate-950"
                    />
                    <div className="flex-1 space-y-2 w-full">
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">
                          Görsel Açıklama / Alt Başlık:
                        </label>
                        <input
                          type="text"
                          value={activeSlide.imageCaption || ''}
                          onChange={(e) =>
                            updateActiveSlide((s) => ({
                              ...s,
                              imageCaption: e.target.value,
                            }))
                          }
                          placeholder="Örn: Gezegenlerin Güneş'e Göre Yörünge Modeli"
                          className="w-full text-xs px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          updateActiveSlide((s) => ({
                            ...s,
                            imageUrl: undefined,
                            imageCaption: undefined,
                          }))
                        }
                        className="text-xs text-rose-500 hover:text-rose-600 font-semibold flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Görseli Kaldır</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    Bu slaytta henüz yüklenmiş bir fen şeması veya görsel bulunmuyor. Bilgisayarınızdan bir dosya yükleyebilirsiniz.
                  </p>
                )}
              </div>

              {/* Bullet Points */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Madde İmleri (Önemli Noktalar)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={bulletInput}
                    onChange={(e) => setBulletInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (bulletInput.trim()) {
                          updateActiveSlide((s) => ({
                            ...s,
                            bulletPoints: [...(s.bulletPoints || []), bulletInput.trim()],
                          }));
                          setBulletInput('');
                        }
                      }
                    }}
                    placeholder="Yeni madde yazıp Ekle'ye veya Enter'a basınız..."
                    className="flex-1 text-xs sm:text-sm px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (bulletInput.trim()) {
                        updateActiveSlide((s) => ({
                          ...s,
                          bulletPoints: [...(s.bulletPoints || []), bulletInput.trim()],
                        }));
                        setBulletInput('');
                      }
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-xs font-semibold"
                  >
                    Ekle
                  </button>
                </div>

                {activeSlide.bulletPoints && activeSlide.bulletPoints.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    {activeSlide.bulletPoints.map((point, pIdx) => (
                      <div
                        key={pIdx}
                        className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs"
                      >
                        <span>• {point}</span>
                        <button
                          type="button"
                          onClick={() =>
                            updateActiveSlide((s) => ({
                              ...s,
                              bulletPoints: s.bulletPoints?.filter((_, i) => i !== pIdx),
                            }))
                          }
                          className="text-slate-400 hover:text-rose-500"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Interactive Checkpoint Quiz on Slide */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      Slayt İçi Mini Kontrol Sorusu (Opsiyonel)
                    </span>
                  </div>

                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={hasQuiz}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setHasQuiz(checked);
                        if (!checked) {
                          updateActiveSlide((s) => ({ ...s, interactiveQuestion: undefined }));
                        } else if (!activeSlide.interactiveQuestion) {
                          updateActiveSlide((s) => ({
                            ...s,
                            interactiveQuestion: {
                              questionText: `${activeSlide.title} konusuyla ilgili mini soru:`,
                              options: {
                                A: 'Doğru seçenek',
                                B: 'Çeldirici 1',
                                C: 'Çeldirici 2',
                                D: 'Çeldirici 3',
                              },
                              correctAnswer: 'A',
                              explanation: 'Bu seçeneğin doğru olma nedeni.',
                            },
                          }));
                        }
                      }}
                      className="w-4 h-4 rounded text-amber-600"
                    />
                    <span>Soru Aktif</span>
                  </label>
                </div>

                {hasQuiz && activeSlide.interactiveQuestion && (
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Soru Metni:
                      </label>
                      <input
                        type="text"
                        value={activeSlide.interactiveQuestion.questionText}
                        onChange={(e) =>
                          updateActiveSlide((s) => ({
                            ...s,
                            interactiveQuestion: {
                              ...s.interactiveQuestion!,
                              questionText: e.target.value,
                            },
                          }))
                        }
                        className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {(['A', 'B', 'C', 'D'] as QuestionOption[]).map((opt) => (
                        <div key={opt} className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center justify-center shrink-0">
                            {opt}
                          </span>
                          <input
                            type="text"
                            value={activeSlide.interactiveQuestion!.options[opt]}
                            onChange={(e) =>
                              updateActiveSlide((s) => ({
                                ...s,
                                interactiveQuestion: {
                                  ...s.interactiveQuestion!,
                                  options: {
                                    ...s.interactiveQuestion!.options,
                                    [opt]: e.target.value,
                                  },
                                },
                              }))
                            }
                            placeholder={`${opt} Seçeneği...`}
                            className="flex-1 text-xs px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                          Doğru Cevap:
                        </label>
                        <select
                          value={activeSlide.interactiveQuestion.correctAnswer}
                          onChange={(e) =>
                            updateActiveSlide((s) => ({
                              ...s,
                              interactiveQuestion: {
                                ...s.interactiveQuestion!,
                                correctAnswer: e.target.value as QuestionOption,
                              },
                            }))
                          }
                          className="w-full text-xs px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                        >
                          <option value="A">A Seçeneği</option>
                          <option value="B">B Seçeneği</option>
                          <option value="C">C Seçeneği</option>
                          <option value="D">D Seçeneği</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                          Çözüm Açıklaması:
                        </label>
                        <input
                          type="text"
                          value={activeSlide.interactiveQuestion.explanation}
                          onChange={(e) =>
                            updateActiveSlide((s) => ({
                              ...s,
                              interactiveQuestion: {
                                ...s.interactiveQuestion!,
                                explanation: e.target.value,
                              },
                            }))
                          }
                          placeholder="Öğrenciye gösterilecek doğru cevap gerekçesi..."
                          className="w-full text-xs px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 px-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between gap-4 shrink-0">
          <div className="text-xs text-slate-500">
            Toplam {slides.length} slayt hazırlanıyor. Değişiklikler tüm cihazlarla anında senkronize edilir.
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                stopSpeech();
                onClose();
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              İptal
            </button>
            <button
              onClick={handleSaveDeck}
              className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md shadow-cyan-600/20 flex items-center gap-2 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Kaydet ve Yayınla</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
