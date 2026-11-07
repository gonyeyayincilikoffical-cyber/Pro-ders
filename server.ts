import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SAMPLE_6TH_GRADE_SUMMARIES, SAMPLE_6TH_GRADE_TESTS } from './src/utils/sampleData';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

const MASTER_ADMIN_PASSWORD = 'ProDers2026!AdminSecuredKey#8492';

const DATA_DIR = path.resolve(__dirname, 'data');
const DATA_FILE = path.resolve(DATA_DIR, 'curriculum.json');

// Ensure data folder and file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial state is strictly empty by default
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ summaries: [], tests: [] }, null, 2), 'utf-8');
}

function readCurriculumData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return {
      summaries: Array.isArray(parsed.summaries) ? parsed.summaries : [],
      tests: Array.isArray(parsed.tests) ? parsed.tests : [],
    };
  } catch (err) {
    console.error('Veri okuma hatası:', err);
    return { summaries: [], tests: [] };
  }
}

function writeCurriculumData(data: { summaries: any[]; tests: any[] }) {
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

// 6. POST /api/curriculum/preset - Protected: Load sample curriculum
app.post('/api/curriculum/preset', (req: Request, res: Response) => {
  if (!verifyAdmin(req, res)) return;
  const data = {
    summaries: SAMPLE_6TH_GRADE_SUMMARIES,
    tests: SAMPLE_6TH_GRADE_TESTS,
  };
  writeCurriculumData(data);
  res.json({ success: true, data });
});

// 7. POST /api/curriculum/import - Protected: Import JSON backup
app.post('/api/curriculum/import', (req: Request, res: Response) => {
  if (!verifyAdmin(req, res)) return;
  const { summaries, tests } = req.body;
  const data = {
    summaries: Array.isArray(summaries) ? summaries : [],
    tests: Array.isArray(tests) ? tests : [],
  };
  writeCurriculumData(data);
  res.json({ success: true, data });
});

// 8. POST /api/curriculum/reset - Protected: Clear all data
app.post('/api/curriculum/reset', (req: Request, res: Response) => {
  if (!verifyAdmin(req, res)) return;
  const data = { summaries: [], tests: [] };
  writeCurriculumData(data);
  res.json({ success: true, data });
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
