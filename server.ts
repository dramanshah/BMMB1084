import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel, Type, type Schema } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const MODEL_NAME = 'gemini-4-hydrogen';

const SYSTEM_INSTRUCTION = `Anda ialah Pensyarah Pakar Linguistik dan Sintaksis Bahasa Melayu yang membimbing pelajar Institut Pendidikan Guru (IPG) bagi persediaan Peperiksaan Akhir kursus BMMB1084: Asas Tatabahasa Bahasa Melayu.

FOKUS UTAMA PEPERIKSAAN (HPK 2 — ARAS PENILAIAN C5):
Peperiksaan akhir kursus ini menilai penguasaan pelajar dalam topik ASAS SINTAKSIS secara sistematik berdasarkan piawaian Tatabahasa Dewan Edisi Ketiga (Nik Safiah Karim et al.) serta rujukan leksikal, ejaan baku, golongan kata, dan pengimbuhan mengikut Kamus Dewan Edisi Keempat (Dewan Bahasa dan Pustaka).

SKOP KANDUNGAN SINTAKSIS YANG DIUJI:
1. Binaan Frasa: FN, FK (transitif/tak transitif/pelengkap), FA (unsur penguat hadapan/belakang/bebas), FS, Hukum D-M (Diterangkan - Menerangkan) serta kekecualiannya (jawatan/gelaran, kata bilangan).
2. Binaan Klausa: Klausa bebas (utama) dan klausa tak bebas (kecil), fungsi klausa dalam ayat majmuk (relatif, komplemen, keterangan).
3. Ayat Dasar & Ayat Tunggal: Konsep ayat dasar vs ayat tunggal; 4 pola ayat dasar (FN+FN, FN+FK, FN+FA, FN+FS).
4. Jenis Ayat: Ayat penyata, ayat tanya (terbuka/tertutup, dengan/tanpa kata tanya, partikel -kah), ayat seruan, dan ayat perintah (suruhan, larangan, silaan, permintaan).
5. Struktur & Ragam Ayat: Susunan biasa vs susunan songsang (pendepanan seluruh predikat dan pendepanan sebahagian predikat: FK, FA, FS); ragam ayat aktif vs pasif (imbuhan pasif di-/ter-/ber-/ke-...-an, KGND 1/2 vs KGND 3, kata bantu pasif 'kena').
6. Ayat Majmuk: Gabungan, pancangan (relatif, komplemen, keterangan — 9 jenis: musabab, akibat, syarat, waktu, pertentangan, harapan, cara, tujuan, perbandingan), dan campuran.
7. Analisis Kegramatisan Sintaksis: Mengenal pasti dan membetulkan kesalahan struktur ayat (ayat tergantung tanpa subjek/predikat, kesalahan ayat pasif, kesalahan kata hubung, dan kelewahan).

GAYA PEDAGOGI:
- Gunakan bahasa Melayu baku akademik yang tepat, jelas, dan berwibawa mengikut ejaan dan makna piawai Kamus Dewan Edisi Keempat.
- Gunakan istilah sintaksis Tatabahasa Dewan Edisi Ketiga secara konsisten.
- Jangan sekali-kali mendedahkan jawapan dalam soalan sebelum pelajar menjawab.
- Semasa menyemak jawapan pelajar, beri markah yang adil, huraian terperinci, nyatakan punca kesilapan struktur secara khusus jika ada, dan bimbing pelajar langkah demi langkah.`;

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    throw new Error('Kunci API Gemini (GEMINI_API_KEY) belum dikonfigurasi pada pelayan. Sila tetapkan kunci API dalam panel Settings > Secrets.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function handleApiError(res: Response, error: unknown): void {
  const rawMessage = error instanceof Error ? error.message : String(error);
  let status = 500;
  let userMessage = `Ralat pelayan semasa memproses analisis sintaksis: ${rawMessage}`;

  if (rawMessage.includes('GEMINI_API_KEY')) {
    status = 400;
    userMessage = rawMessage;
  } else if (rawMessage.includes('403') || rawMessage.includes('PERMISSION_DENIED') || rawMessage.includes('API_KEY_INVALID')) {
    status = 403;
    userMessage = 'Akses Gemini API ditolak atau kunci API tidak sah. Sila semak tetapan kunci API dalam panel Settings > Secrets.';
  } else if (rawMessage.includes('429') || rawMessage.includes('RESOURCE_EXHAUSTED')) {
    status = 429;
    userMessage = 'Had kuota permintaan Gemini API telah dicapai buat sementara waktu. Sila cuba sebentar lagi.';
  } else if (rawMessage.includes('404') || rawMessage.includes('NOT_FOUND')) {
    status = 404;
    userMessage = `Model Gemini tidak ditemui: ${rawMessage}`;
  }

  res.status(status).json({ error: userMessage });
}

function makeSyntaxLeafSchema(): Schema {
  return {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING },
      label: { type: Type.STRING },
      role: { type: Type.STRING },
      category: { type: Type.STRING },
      words: { type: Type.STRING },
      ruleNote: { type: Type.STRING },
    },
    required: ['id', 'label', 'role', 'category', 'ruleNote'],
  };
}

function makeSyntaxLevel3Schema(): Schema {
  return {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING },
      label: { type: Type.STRING },
      role: { type: Type.STRING },
      category: { type: Type.STRING },
      words: { type: Type.STRING },
      ruleNote: { type: Type.STRING },
      children: {
        type: Type.ARRAY,
        items: makeSyntaxLeafSchema(),
      },
    },
    required: ['id', 'label', 'role', 'category', 'ruleNote'],
  };
}

function makeSyntaxLevel2Schema(): Schema {
  return {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING },
      label: { type: Type.STRING },
      role: { type: Type.STRING },
      category: { type: Type.STRING },
      words: { type: Type.STRING },
      ruleNote: { type: Type.STRING },
      children: {
        type: Type.ARRAY,
        items: makeSyntaxLevel3Schema(),
      },
    },
    required: ['id', 'label', 'role', 'category', 'ruleNote'],
  };
}

function makeSyntaxTreeSchema(): Schema {
  return {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING },
      label: { type: Type.STRING },
      role: { type: Type.STRING },
      category: { type: Type.STRING },
      ruleNote: { type: Type.STRING },
      children: {
        type: Type.ARRAY,
        items: makeSyntaxLevel2Schema(),
      },
    },
    required: ['id', 'label', 'role', 'category', 'ruleNote', 'children'],
  };
}

const TOPIC_MAP: Record<string, string> = {
  semua: 'Semua 7 Topik Sintaksis BMMB1084 (pilih satu topik berfokus Aras C5)',
  frasa: '1. Binaan Frasa (FN, FK, FA, FS, Hukum D-M dan kekecualiannya)',
  klausa: '2. Binaan Klausa (Klausa bebas vs tak bebas, fungsi klausa dalam ayat majmuk)',
  'ayat-dasar': '3. Ayat Dasar & Ayat Tunggal (konsep dan 4 pola ayat dasar FN+FN, FN+FK, FN+FA, FN+FS)',
  'jenis-ayat': '4. Jenis Ayat (penyata, tanya terbuka/tertutup/-kah, seruan, perintah 4 subjenis)',
  'struktur-ragam': '5. Struktur & Ragam Ayat (susunan biasa vs songsang penuh/sebahagian, aktif vs pasif KGND 1/2/3 & kena)',
  'ayat-majmuk': '6. Ayat Majmuk (gabungan, pancangan relatif/komplemen/keterangan 9 jenis, campuran)',
  kegramatisan: '7. Analisis Kegramatisan Sintaksis (ayat tergantung, kesalahan pasif, kata hubung, kelewahan)',
};

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  // 1. Generate a new C5 exam question WITHOUT revealing the answer
  app.post('/api/sintaksis/soalan', async (req: Request, res: Response) => {
    try {
      const { topicId = 'semua', format = 'objektif', previousPrompts = [] } = req.body as {
        topicId?: string;
        format?: 'objektif' | 'struktur' | 'analisis';
        previousPrompts?: string[];
      };

      const ai = getAiClient();
      const topicDesc = TOPIC_MAP[topicId] ?? TOPIC_MAP.semua;
      const formatInstruction =
        format === 'objektif'
          ? 'Hasilkan SATU soalan objektif aneka pilihan (A, B, C, D) bertaraf penilaian C5 (pelajar perlu menilai ketepatan struktur, membezakan binaan, atau memilih analisis yang paling tepat). JANGAN berikan jawapan atau petunjuk jawapan.'
          : format === 'struktur'
            ? 'Hasilkan SATU soalan struktur / esei ringkas bertaraf penilaian C5 (6 markah) yang menguji keupayaan pelajar menilai, membanding, atau membetulkan binaan sintaksis dengan hujah Tatabahasa Dewan.'
            : 'Hasilkan SATU soalan analisis & pencerakinan ayat (8 markah) dengan ayat rangsangan yang jelas untuk dicerakinkan kepada Subjek, Predikat, Klausa, atau pola/binaan frasanya.';

      const avoidList =
        Array.isArray(previousPrompts) && previousPrompts.length > 0
          ? `\nElakkan mengulang soalan berikut:\n- ${previousPrompts.slice(-4).join('\n- ')}`
          : '';

      const prompt = `Jana satu soalan peperiksaan akhir IPG BMMB1084.
Topik: ${topicDesc}
Format: ${format}
Arahan format: ${formatInstruction}${avoidList}

PENTING: Jangan sertakan jawapan atau penjelasan jawapan dalam mana-mana medan output.`;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              topicId: { type: Type.STRING, description: 'Salah satu daripada: frasa, klausa, ayat-dasar, jenis-ayat, struktur-ragam, ayat-majmuk, kegramatisan' },
              topicTitle: { type: Type.STRING, description: 'Tajuk ringkas topik mengikut skop BMMB1084' },
              stimulusSentence: { type: Type.STRING, description: 'Ayat rangsangan untuk dinilai atau dicerakinkan jika berkaitan (atau rentetan kosong jika tidak perlu)' },
              prompt: { type: Type.STRING, description: 'Teks soalan peperiksaan yang jelas dan bernas tanpa mendedahkan jawapan' },
              arahanTambahan: { type: Type.STRING, description: 'Arahan ringkas cara menjawab jika soalan struktur/analisis' },
              maxMarks: { type: Type.INTEGER, description: '2 untuk objektif, 6 untuk struktur, 8 untuk analisis' },
              options: {
                type: Type.ARRAY,
                description: 'Isi 4 pilihan (A, B, C, D) hanya jika format ialah objektif; kosongkan array jika struktur atau analisis',
                items: {
                  type: Type.OBJECT,
                  properties: {
                    key: { type: Type.STRING },
                    text: { type: Type.STRING },
                  },
                  required: ['key', 'text'],
                },
              },
            },
            required: ['topicId', 'topicTitle', 'prompt', 'maxMarks', 'options'],
          },
        },
      });

      const data = JSON.parse(response.text || '{}');
      res.json({
        id: `ai-q-${Date.now()}`,
        topicId: data.topicId || (topicId === 'semua' ? 'frasa' : topicId),
        topicTitle: data.topicTitle || topicDesc,
        format,
        stimulusSentence: data.stimulusSentence || undefined,
        prompt: data.prompt,
        arahanTambahan: data.arahanTambahan || undefined,
        maxMarks: data.maxMarks || (format === 'objektif' ? 2 : format === 'struktur' ? 6 : 8),
        options: format === 'objektif' && Array.isArray(data.options) ? data.options : undefined,
        source: 'ai',
      });
    } catch (error) {
      handleApiError(res, error);
    }
  });

  // 2. Evaluate student's answer rigorously with Tatabahasa Dewan feedback + step-by-step scaffolding
  app.post('/api/sintaksis/semak', async (req: Request, res: Response) => {
    try {
      const { question, studentAnswer } = req.body as {
        question: {
          topicTitle: string;
          format: string;
          prompt: string;
          stimulusSentence?: string;
          options?: { key: string; text: string }[];
          maxMarks: number;
        };
        studentAnswer: string;
      };

      if (!studentAnswer || !studentAnswer.trim()) {
        res.status(400).json({ error: 'Sila masukkan atau pilih jawapan anda terlebih dahulu sebelum menyemak.' });
        return;
      }

      const ai = getAiClient();
      const optionsText = question.options
        ? `\nPilihan jawapan:\n${question.options.map((o) => `${o.key}. ${o.text}`).join('\n')}`
        : '';
      const stimulusText = question.stimulusSentence
        ? `\nAyat rangsangan: "${question.stimulusSentence}"`
        : '';

      const prompt = `Semak jawapan pelajar IPG bagi soalan BMMB1084 berikut secara teliti mengikut piawaian Tatabahasa Dewan Edisi Ketiga.

Topik: ${question.topicTitle}
Format: ${question.format}
Markah Maksimum: ${question.maxMarks}${stimulusText}
Soalan: ${question.prompt}${optionsText}

Jawapan Pelajar:
"${studentAnswer}"

Tugas Penilaian Anda:
1. Tentukan sama ada jawapan betul sepenuhnya, separa tepat, atau salah/perlu pembetulan.
2. Berikan markah (0 hingga ${question.maxMarks}).
3. Berikan ulasan pensyarah yang tepat menggunakan istilah sintaksis Tatabahasa Dewan (contoh: Hukum D-M, pelengkap, objek tepat, klausa tak bebas, pendepanan sebahagian predikat, KGND pertama/kedua, ayat tergantung, kelewahan).
4. Jika pelajar melakukan kesilapan atau jawapan tidak lengkap, nyatakan 'puncaKesilapan' secara spesifik dan berikan 3 hingga 4 'bimbinganLangkah' secara langkah demi langkah untuk membimbing pelajar mengenal pasti punca kesilapan struktur tersebut. Jika jawapan betul sepenuhnya, jadikan 'puncaKesilapan' rentetan kosong dan isi 'bimbinganLangkah' dengan nota pengukuhan ringkas.
5. Berikan 'jawapanContoh' yang lengkap dan gramatis.
6. Jika format ialah 'analisis' dan terdapat ayat rangsangan, sertakan 'kurunganBerlabel' dan struktur 'treeData' bagi ayat tersebut.`;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              betul: { type: Type.BOOLEAN },
              markah: { type: Type.INTEGER },
              markahMaksimum: { type: Type.INTEGER },
              statusLabel: {
                type: Type.STRING,
                description: 'TEPAT, SEPARA TEPAT, atau PERLU PEMBETULAN',
              },
              ulasanPensyarah: { type: Type.STRING },
              puncaKesilapan: { type: Type.STRING },
              bimbinganLangkah: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              jawapanContoh: { type: Type.STRING },
              kurunganBerlabel: { type: Type.STRING },
            },
            required: [
              'betul',
              'markah',
              'markahMaksimum',
              'statusLabel',
              'ulasanPensyarah',
              'puncaKesilapan',
              'bimbinganLangkah',
              'jawapanContoh',
            ],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      res.json({
        ...parsed,
        puncaKesilapan: parsed.puncaKesilapan?.trim() ? parsed.puncaKesilapan : null,
      });
    } catch (error) {
      handleApiError(res, error);
    }
  });

  // 3. Follow-up guided coaching dialogue with the lecturer on the active question
  app.post('/api/sintaksis/tanya', async (req: Request, res: Response) => {
    try {
      const { question, evaluation, history, message } = req.body as {
        question: { prompt: string; stimulusSentence?: string; topicTitle: string };
        evaluation: { ulasanPensyarah: string; jawapanContoh: string };
        history: { role: 'pelajar' | 'pensyarah'; content: string }[];
        message: string;
      };

      if (!message?.trim()) {
        res.status(400).json({ error: 'Sila tulis soalan atau cubaan jawapan susulan anda.' });
        return;
      }

      const ai = getAiClient();
      const historyLines = (history || [])
        .map((m) => `${m.role === 'pelajar' ? 'Pelajar' : 'Pensyarah'}: ${m.content}`)
        .join('\n');

      const prompt = `Konteks Perbincangan BMMB1084 (${question.topicTitle}):
Soalan asal: ${question.prompt}
${question.stimulusSentence ? `Ayat rangsangan: ${question.stimulusSentence}` : ''}
Ulasan sebelum ini: ${evaluation.ulasanPensyarah}
Jawapan contoh rujukan: ${evaluation.jawapanContoh}
${historyLines ? `\nSejarah perbualan:\n${historyLines}` : ''}

Mesej baharu pelajar:
"${message}"

Balas sebagai Pensyarah Pakar Linguistik secara padat, berfokus, langkah demi langkah, dan berpaksikan Tatabahasa Dewan Edisi Ketiga.`;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      });

      res.json({ reply: response.text || 'Tiada respons diterima.' });
    } catch (error) {
      handleApiError(res, error);
    }
  });

  // 4. Analyze any Malay sentence into a Syntax Tree (Rajah Pohon) + Labeled Bracketing + Constituent Table
  app.post('/api/sintaksis/cerakin', async (req: Request, res: Response) => {
    try {
      const { sentence } = req.body as { sentence: string };
      if (!sentence || !sentence.trim()) {
        res.status(400).json({ error: 'Sila masukkan satu ayat bahasa Melayu untuk dicerakinkan.' });
        return;
      }

      const ai = getAiClient();
      const prompt = `Cerakinkan ayat bahasa Melayu berikut mengikut analisis sintaksis konstituen terdekat Tatabahasa Dewan Edisi Ketiga:

Ayat: "${sentence.trim()}"

Keperluan output:
1. Nilai pola ayat (atau pola asasnya), jenis ayat (penyata/tanya/perintah/seruan), ragam ayat (aktif/pasif), susunan ayat (biasa/songsang), dan status kegramatisan ('GRAMATIS' atau 'TIDAK GRAMATIS').
2. Berikan 'notaSintaksis' yang menerangkan struktur subjek, predikat, jenis frasa/klausa, serta sebarang kesalahan jika tidak gramatis.
3. Berikan 'kurunganBerlabel' yang kemas, contoh: [A [S [FN ...]] [P [FK ...]]].
4. Bina 'cerakinanJadual' yang menyenaraikan setiap bahagian utama (Subjek, Predikat, Keterangan, atau Klausa).
5. Bina pokok sintaksis 'tree' (maksimum 4 aras dari akar A -> S/P/K -> Frasa/Klausa -> Unsur/Kata) supaya setiap kata dalam ayat muncul pada nod daun ('words'). Kategori nod hendaklah daripada: A, S, P, FN, FK, FA, FS, K, KK, KN, KA, KSN, KH, KB, PEN, INTI, PENERANG, KLAUSA, LAIN.`;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              topicLabel: { type: Type.STRING },
              ayat: { type: Type.STRING },
              polaAyat: { type: Type.STRING },
              jenisAyat: { type: Type.STRING },
              ragamAyat: { type: Type.STRING },
              susunanAyat: { type: Type.STRING },
              statusGramatis: { type: Type.STRING },
              notaSintaksis: { type: Type.STRING },
              kurunganBerlabel: { type: Type.STRING },
              cerakinanJadual: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    bahagian: { type: Type.STRING },
                    frasa: { type: Type.STRING },
                    kategori: { type: Type.STRING },
                    huraian: { type: Type.STRING },
                  },
                  required: ['bahagian', 'frasa', 'kategori', 'huraian'],
                },
              },
              tree: makeSyntaxTreeSchema(),
            },
            required: [
              'title',
              'topicLabel',
              'ayat',
              'polaAyat',
              'jenisAyat',
              'ragamAyat',
              'susunanAyat',
              'statusGramatis',
              'notaSintaksis',
              'kurunganBerlabel',
              'cerakinanJadual',
              'tree',
            ],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      res.json({
        id: `tree-ai-${Date.now()}`,
        ...parsed,
        statusGramatis: parsed.statusGramatis === 'TIDAK GRAMATIS' ? 'TIDAK GRAMATIS' : 'GRAMATIS',
      });
    } catch (error) {
      handleApiError(res, error);
    }
  });

  // 5. Generate a new C5 Grammar Error Diagnostic Case
  app.post('/api/sintaksis/kegramatisan/jana', async (req: Request, res: Response) => {
    try {
      const { category = 'ayat-tergantung' } = req.body as { category?: string };
      const ai = getAiClient();

      const categoryDescriptions: Record<string, string> = {
        'ayat-tergantung': 'Ayat Tergantung (tiada subjek atau tiada predikat akibat penggunaan kata sendi nama di pangkal ayat atau klausa tak bebas berdiri sendiri)',
        pasif: 'Kesalahan Ayat Pasif (kekeliruan hukum KGND 1/2 vs KGND 3, atau sisipan kata bantu antara KGND 1/2 dan kata kerja dasar)',
        'kata-hubung': 'Kesalahan Kata Hubung (penggunaan "bila", "di mana", "yang mana", atau kata hubung yang tidak tepat fungsi sintaksisnya)',
        kelewahan: 'Kelewahan Bahasa (penggandaan selepas kata jamak, dua kata penguat serentak, atau gabungan kata sendi/hubungs sinonim)',
      };

      const desc = categoryDescriptions[category] || categoryDescriptions['ayat-tergantung'];

      const prompt = `Hasilkan SATU ayat bahasa Melayu yang MENGANDUNGI KESALAHAN SINTAKSIS aras peperiksaan IPG BMMB1084 bagi kategori: ${desc}.
Ayat mestilah berbunyi seperti petikan wacana rasmi, berita, atau penulisan akademik pelajar supaya mencabar aras penilaian C5.
JANGAN sertakan pembetulan atau jawapan dalam output.`;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              categoryLabel: { type: Type.STRING },
              faultySentence: { type: Type.STRING },
              contextNote: { type: Type.STRING },
            },
            required: ['categoryLabel', 'faultySentence', 'contextNote'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      res.json({
        id: `gc-ai-${Date.now()}`,
        category,
        categoryLabel: parsed.categoryLabel,
        faultySentence: parsed.faultySentence,
        contextNote: parsed.contextNote,
        source: 'ai',
      });
    } catch (error) {
      handleApiError(res, error);
    }
  });

  // 6. Evaluate student's grammar diagnosis & sentence correction
  app.post('/api/sintaksis/kegramatisan/semak', async (req: Request, res: Response) => {
    try {
      const { faultySentence, selectedCategoryLabel, studentExplanation, studentCorrection } = req.body as {
        faultySentence: string;
        selectedCategoryLabel: string;
        studentExplanation: string;
        studentCorrection: string;
      };

      if (!studentCorrection?.trim()) {
        res.status(400).json({ error: 'Sila tulis pembetulan ayat yang gramatis sebelum menyemak.' });
        return;
      }

      const ai = getAiClient();
      const prompt = `Semak diagnosis dan pembetulan sintaksis pelajar IPG berdasarkan Tatabahasa Dewan Edisi Ketiga.

Ayat asal yang bermasalah: "${faultySentence}"
Kategori kesalahan yang dipilih pelajar: "${selectedCategoryLabel}"
Penjelasan punca kesalahan oleh pelajar: "${studentExplanation || '(Tidak dinyatakan)'}"
Ayat pembetulan oleh pelajar: "${studentCorrection}"

Nilai jawapan pelajar (Markah penuh: 6 markah):
- 2 markah: ketepatan diagnosis jenis kesalahan & penjelasan istilah sintaksis.
- 4 markah: kegramatisan penuh ayat pembetulan tanpa mengubah maksud asal.
Jika terdapat kesilapan dalam pembetulan pelajar, bimbing mereka langkah demi langkah untuk melihat kecacatan struktur Subjek-Predikatnya.`;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              betul: { type: Type.BOOLEAN },
              markah: { type: Type.INTEGER },
              markahMaksimum: { type: Type.INTEGER },
              statusLabel: { type: Type.STRING },
              diagnosisPelajarTepat: { type: Type.BOOLEAN },
              ulasanPensyarah: { type: Type.STRING },
              puncaKesilapan: { type: Type.STRING },
              bimbinganLangkah: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              ayatGramatis: { type: Type.STRING },
            },
            required: [
              'betul',
              'markah',
              'markahMaksimum',
              'statusLabel',
              'diagnosisPelajarTepat',
              'ulasanPensyarah',
              'puncaKesilapan',
              'bimbinganLangkah',
              'ayatGramatis',
            ],
          },
        },
      });

      res.json(JSON.parse(response.text || '{}'));
    } catch (error) {
      handleApiError(res, error);
    }
  });

  // 7. Kamus Dewan Edisi Keempat lexical & syntactic lookup
  app.post('/api/kamus/cari', async (req: Request, res: Response) => {
    try {
      const { query } = req.body as { query?: string };
      if (!query || !query.trim()) {
        res.status(400).json({ error: 'Sila masukkan perkataan, istilah, atau pasangan kata untuk dirujuk.' });
        return;
      }

      const ai = getAiClient();
      const prompt = `Berikan entri rujukan lengkap berdasarkan Kamus Dewan Edisi Keempat (DBP) serta kaitannya dengan Tatabahasa Dewan Edisi Ketiga bagi kata atau istilah berikut:

Kata carian: "${query.trim()}"

Pastikan output mengandungi:
1. 'kata': kata entri utama yang dicari.
2. 'ejaanBaku': ejaan piawai mengikut Kamus Dewan Edisi Keempat (nyatakan bentuk tidak baku jika berkaitan).
3. 'sebutan': pemenggalan suku kata / sebutan baku (cth: mem.per.o.leh).
4. 'golonganKata': golongan kata tepat (cth: Kata Kerja Transitif, Kata Tugas — Kata Sendi Nama, Kata Nama Am).
5. 'category': salah satu daripada 'istilah', 'kata-tugas', atau 'imbuhan'.
6. 'takrifan': senarai 1 hingga 3 makna/takrifan tepat mengikut laras Kamus Dewan Edisi Keempat.
7. 'bentukTerbitan': senarai kata terbitan atau bentuk berimbuhan yang sah.
8. 'perananSintaksis': penjelasan bagaimana kata ini berfungsi dalam struktur frasa, klausa, atau ayat (cth: sama ada memerlukan objek atau pelengkap, atau kedudukannya dalam binaan D-M / ayat pasif).
9. 'contohAyat': satu atau dua ayat contoh yang gramatis.
10. 'catatanPerbandingan': nota perbezaan dengan kata yang sering dikelirukan dalam peperiksaan BMMB1084 (jika ada).`;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              kata: { type: Type.STRING },
              ejaanBaku: { type: Type.STRING },
              sebutan: { type: Type.STRING },
              golonganKata: { type: Type.STRING },
              category: { type: Type.STRING },
              takrifan: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              bentukTerbitan: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              perananSintaksis: { type: Type.STRING },
              contohAyat: { type: Type.STRING },
              catatanPerbandingan: { type: Type.STRING },
            },
            required: [
              'kata',
              'ejaanBaku',
              'sebutan',
              'golonganKata',
              'category',
              'takrifan',
              'bentukTerbitan',
              'perananSintaksis',
              'contohAyat',
            ],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      const category =
        parsed.category === 'kata-tugas' || parsed.category === 'imbuhan'
          ? parsed.category
          : 'istilah';

      res.json({
        id: `kd-ai-${Date.now()}`,
        ...parsed,
        category,
        source: 'ai',
      });
    } catch (error) {
      handleApiError(res, error);
    }
  });

  // 8. Batch grade Bahagian B (10 Structure) and Bahagian C (10 Essay) answers for Full Exam Paper
  app.post('/api/sintaksis/kertas-penuh/semak', async (req: Request, res: Response) => {
    try {
      const { openSubmissions } = req.body as {
        openSubmissions?: {
          section: 'B' | 'C';
          number: number;
          prompt: string;
          stimulus?: string;
          rubric: string;
          maxMarks: number;
          studentAnswer: string;
        }[];
      };

      if (!Array.isArray(openSubmissions) || openSubmissions.length === 0) {
        res.json({ results: [] });
        return;
      }

      const answeredItems = openSubmissions.filter((item) => item.studentAnswer.trim().length > 0);
      if (answeredItems.length === 0) {
        res.json({ results: [] });
        return;
      }

      const ai = getAiClient();
      const itemsText = answeredItems
        .map(
          (item) =>
            `[Bahagian ${item.section} Soalan ${item.number} | Markah Maksimum: ${item.maxMarks}]
${item.stimulus ? `Ayat rangsangan: ${item.stimulus}\n` : ''}Soalan: ${item.prompt}
Skema rujukan: ${item.rubric}
Jawapan pelajar: "${item.studentAnswer.trim()}"`,
        )
        .join('\n\n---\n\n');

      const prompt = `Semak setiap jawapan pelajar bagi Bahagian B dan Bahagian C Kertas Peperiksaan BMMB1084 berikut berpandukan Tatabahasa Dewan Edisi Ketiga dan Kamus Dewan Edisi Keempat.

${itemsText}

Untuk setiap item yang dijawab, berikan:
- section ('B' atau 'C')
- number (nombor soalan)
- markah (0 hingga maxMarks)
- betul (true jika penuh, false jika separa atau salah)
- ulasan (ulasan linguistik yang padat, jelas, dan membimbing sekiranya ada kesilapan istilah atau struktur).`;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              results: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    section: { type: Type.STRING },
                    number: { type: Type.INTEGER },
                    markah: { type: Type.INTEGER },
                    betul: { type: Type.BOOLEAN },
                    ulasan: { type: Type.STRING },
                  },
                  required: ['section', 'number', 'markah', 'betul', 'ulasan'],
                },
              },
            },
            required: ['results'],
          },
        },
      });

      res.json(JSON.parse(response.text || '{"results":[]}'));
    } catch (error) {
      handleApiError(res, error);
    }
  });

  // Vite middleware in dev, static dist in production
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BMMB1084 Studio Sintaksis server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
