import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SAMPLE_6TH_GRADE_SUMMARIES, SAMPLE_6TH_GRADE_TESTS, SAMPLE_6TH_GRADE_DECKS } from './src/utils/sampleData';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '25mb' }));

const MASTER_ADMIN_PASSWORD = 'ProDers2026!AdminSecuredKey#8492';

const DATA_DIR = path.resolve(__dirname, 'data');
const DATA_FILE = path.resolve(DATA_DIR, 'curriculum.json');

// Ensure data folder and file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial state is strictly empty by default
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ summaries: [], tests: [], decks: [] }, null, 2), 'utf-8');
}

function readCurriculumData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return {
      summaries: Array.isArray(parsed.summaries) ? parsed.summaries : [],
      tests: Array.isArray(parsed.tests) ? parsed.tests : [],
      decks: Array.isArray(parsed.decks) ? parsed.decks : [],
    };
  } catch (err) {
    console.error('Veri okuma hatası:', err);
    return { summaries: [], tests: [], decks: [] };
  }
}

function writeCurriculumData(data: { summaries: any[]; tests: any[]; decks: any[] }) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

function verifyAdmin(req: Request, res: Response): boolean {
  const password = req.headers['x-admin-password'];
  if (password !== MASTER_ADMIN_PASSWORD) {
    res.status(401).json({ error: 'Yetkisiz erişim: Yönetici şifresi geçersiz.' });
    return false;
  }
  return true;
}

// 1. GET /api/curriculum - Public: Accessible by all devices and students
app.get('/api/curriculum', (_req: Request, res: Response) => {
  const data = readCurriculumData();
  res.json(data);
});

// 2. POST /api/summaries - Protected: Add or update summary
app.post('/api/summaries', (req: Request, res: Response) => {
  if (!verifyAdmin(req, res)) return;
  const summary = req.body;
  if (!summary || !summary.id) {
    res.status(400).json({ error: 'Geçersiz konu özeti verisi.' });
    return;
  }
  const data = readCurriculumData();
  const index = data.summaries.findIndex((s: any) => s.id === summary.id);
  if (index >= 0) {
    data.summaries[index] = summary;
  } else {
    data.summaries.unshift(summary);
  }
  writeCurriculumData(data);
  res.json({ success: true, summary, data });
});

// 3. DELETE /api/summaries/:id - Protected: Delete summary
app.delete('/api/summaries/:id', (req: Request, res: Response) => {
  if (!verifyAdmin(req, res)) return;
  const { id } = req.params;
  const data = readCurriculumData();
  data.summaries = data.summaries.filter((s: any) => s.id !== id);
  writeCurriculumData(data);
  res.json({ success: true, data });
});

// 4. POST /api/tests - Protected: Add or update 10-question test
app.post('/api/tests', (req: Request, res: Response) => {
  if (!verifyAdmin(req, res)) return;
  const test = req.body;
  if (!test || !test.id) {
    res.status(400).json({ error: 'Geçersiz test verisi.' });
    return;
  }
  const data = readCurriculumData();
  const index = data.tests.findIndex((t: any) => t.id === test.id);
  if (index >= 0) {
    data.tests[index] = test;
  } else {
    data.tests.unshift(test);
  }
  writeCurriculumData(data);
  res.json({ success: true, test, data });
});

// 5. DELETE /api/tests/:id - Protected: Delete test
app.delete('/api/tests/:id', (req: Request, res: Response) => {
  if (!verifyAdmin(req, res)) return;
  const { id } = req.params;
  const data = readCurriculumData();
  data.tests = data.tests.filter((t: any) => t.id !== id);
  writeCurriculumData(data);
  res.json({ success: true, data });
});

// 6. GET /api/decks - Public: Get all interactive decks
app.get('/api/decks', (_req: Request, res: Response) => {
  const data = readCurriculumData();
  res.json(data.decks || []);
});

// 7. POST /api/decks - Protected: Add or update interactive deck
app.post('/api/decks', (req: Request, res: Response) => {
  if (!verifyAdmin(req, res)) return;
  const deck = req.body;
  if (!deck || !deck.id) {
    res.status(400).json({ error: 'Geçersiz slayt sunumu verisi.' });
    return;
  }
  const data = readCurriculumData();
  const index = data.decks.findIndex((d: any) => d.id === deck.id);
  if (index >= 0) {
    data.decks[index] = deck;
  } else {
    data.decks.unshift(deck);
  }
  writeCurriculumData(data);
  res.json({ success: true, deck, data });
});

// 8. DELETE /api/decks/:id - Protected: Delete interactive deck
app.delete('/api/decks/:id', (req: Request, res: Response) => {
  if (!verifyAdmin(req, res)) return;
  const { id } = req.params;
  const data = readCurriculumData();
  data.decks = data.decks.filter((d: any) => d.id !== id);
  writeCurriculumData(data);
  res.json({ success: true, data });
});

// 9. POST /api/curriculum/preset - Protected: Load sample curriculum
app.post('/api/curriculum/preset', (req: Request, res: Response) => {
  if (!verifyAdmin(req, res)) return;
  const data = {
    summaries: SAMPLE_6TH_GRADE_SUMMARIES,
    tests: SAMPLE_6TH_GRADE_TESTS,
    decks: SAMPLE_6TH_GRADE_DECKS,
  };
  writeCurriculumData(data);
  res.json({ success: true, data });
});

// 10. POST /api/curriculum/import - Protected: Import JSON backup
app.post('/api/curriculum/import', (req: Request, res: Response) => {
  if (!verifyAdmin(req, res)) return;
  const { summaries, tests, decks } = req.body;
  const data = {
    summaries: Array.isArray(summaries) ? summaries : [],
    tests: Array.isArray(tests) ? tests : [],
    decks: Array.isArray(decks) ? decks : [],
  };
  writeCurriculumData(data);
  res.json({ success: true, data });
});

// 11. POST /api/curriculum/reset - Protected: Clear all data
app.post('/api/curriculum/reset', (req: Request, res: Response) => {
  if (!verifyAdmin(req, res)) return;
  const data = { summaries: [], tests: [], decks: [] };
  writeCurriculumData(data);
  res.json({ success: true, data });
});

// 12. POST /api/ai/enhance-slide - AI Voice Script & Slide Content Generator
app.post('/api/ai/enhance-slide', async (req: Request, res: Response) => {
  const { topic, rawContent, title, grade = '6. Sınıf' } = req.body;

  if (!topic && !rawContent && !title) {
    res.status(400).json({ error: 'Konu veya slayt içeriği belirtilmelidir.' });
    return;
  }

  // Attempt using Gemini API if key is present
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      const ai = new GoogleGenAI({});
      const prompt = `Sen Türkiye MEB müfredatına tam hakim uzman bir 6. Sınıf Fen Bilimleri öğretmenisin.
Aşağıda verilen konuya göre etkileşimli bir eğitim slaydı içeriği ve bu slaydın sesli anlatımı için öğretmen seslendirme metni ("narrationScript") oluşturacaksın.

Girdi Bilgileri:
- Başlık / Konu: ${title || topic || 'Fen Bilimleri Konusu'}
- Ham Not / İçerik: ${rawContent || topic}
- Sınıf Seviyesi: ${grade}

Lütfen YALNIZCA aşağıdaki JSON formatında, geçerli bir JSON objesi döndür (markdown kod bloğu veya başka metin ekleme):
{
  "title": "Kısa, ilgi çekici slayt başlığı",
  "content": "2-3 cümlelik net, MEB 6. sınıf düzeyinde pedagojik açıklama metni",
  "narrationScript": "Öğretmenin öğrencilere doğrudan hitap ederek akıcı, cana yakın ve öğretici bir dille seslendireceği yaklaşık 3-4 cümlelik Türkçe konuşma metni",
  "bulletPoints": [
    "Önemli madde 1",
    "Önemli madde 2",
    "Önemli madde 3"
  ],
  "interactiveQuestion": {
    "questionText": "Bu slaytta anlatılan kavramla ilgili 6. sınıf seviyesinde kısa kontrol sorusu",
    "options": {
      "A": "Seçenek A",
      "B": "Seçenek B",
      "C": "Seçenek C",
      "D": "Seçenek D"
    },
    "correctAnswer": "A",
    "explanation": "Neden A seçeneğinin doğru olduğunu açıklayan kısa cümle"
  }
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const responseText = response.text?.trim() || '';
      try {
        const parsed = JSON.parse(responseText);
        res.json({ success: true, slide: parsed, source: 'gemini' });
        return;
      } catch {
        // Fall through to deterministic fallback if JSON parse fails
      }
    } catch (apiErr) {
      console.warn('Gemini API çağrısı sırasında uyarı, yerel oluşturucuya geçiliyor:', apiErr);
    }
  }

  // Smart Turkish Pedagogical Fallback Generator
  const cleanTitle = title || topic || '6. Sınıf Fen Bilimleri Keşfi';
  const cleanContent = rawContent || `${cleanTitle} konusu, 6. sınıf Fen Bilimleri dersinin temel kazanımları arasında yer alır. Doğadaki olayları ve bilimsel süreçleri anlamamızı sağlar.`;
  const fallbackNarration = `Merhaba sevgili öğrenciler! Bu slaytımızda "${cleanTitle}" konusunu birlikte inceliyoruz. ${cleanContent} Dikkatlice dinleyin ve öğrendiklerinizi kontrol sorumuzla hemen pekiştirin!`;

  res.json({
    success: true,
    slide: {
      title: cleanTitle,
      content: cleanContent,
      narrationScript: fallbackNarration,
      bulletPoints: [
        `${cleanTitle} ile ilgili temel kavramları öğrenme`,
        'MEB kazanımlarına uygun bilimsel açıklamalar',
        'Günlük hayatla bağlantılı fen örnekleri'
      ],
      interactiveQuestion: {
        questionText: `${cleanTitle} konusu ile ilgili aşağıdakilerden hangisi doğrudur?`,
        options: {
          A: 'Bu kavram fen bilimlerinde temel bir süreçtir.',
          B: 'Hiçbir canlı veya madde üzerinde etkisi yoktur.',
          C: 'Yalnızca laboratuvarda geçerlidir.',
          D: 'Müfredatta yer almayan bir varsayımdır.'
        },
        correctAnswer: 'A',
        explanation: `${cleanTitle} konusu MEB 6. sınıf fen bilimleri dersinin temel taşlarındandır.`
      }
    },
    source: 'local-pedagogy'
  });
});

async function startServer() {
  if (process.env.NODE_ENV === 'production' && fs.existsSync(path.resolve(__dirname, 'dist'))) {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ProDers sunucusu http://0.0.0.0:${PORT} adresinde aktif.`);
  });
}

startServer();
