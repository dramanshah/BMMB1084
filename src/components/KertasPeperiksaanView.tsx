import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  RotateCcw,
  Send,
  XCircle,
} from 'lucide-react';
import {
  BAHAGIAN_A_QUESTIONS,
  BAHAGIAN_B_QUESTIONS,
  BAHAGIAN_C_QUESTIONS,
} from '../data/fullExamPaper';

type PaperSectionFilter = 'semua' | 'A' | 'B' | 'C';

interface OpenGradeItem {
  section: 'B' | 'C';
  number: number;
  markah: number;
  betul: boolean;
  ulasan: string;
}

export const KertasPeperiksaanView: React.FC = () => {
  const [sectionFilter, setSectionFilter] = useState<PaperSectionFilter>('semua');
  const [answersA, setAnswersA] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  const [answersB, setAnswersB] = useState<Record<number, string>>({});
  const [answersC, setAnswersC] = useState<Record<number, string>>({});
  const [commandInput, setCommandInput] = useState('');
  const [showScheme, setShowScheme] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isGrading, setIsGrading] = useState(false);
  const [openGrades, setOpenGrades] = useState<Record<string, OpenGradeItem>>({});
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const answeredCountA = Object.keys(answersA).length;
  const answeredCountB = Object.values(answersB).filter((v) => v.trim().length > 0).length;
  const answeredCountC = Object.values(answersC).filter((v) => v.trim().length > 0).length;

  const scoreSummary = useMemo(() => {
    let scoreA = 0;
    for (const q of BAHAGIAN_A_QUESTIONS) {
      if (answersA[q.number] === q.correctKey) {
        scoreA += 1;
      }
    }
    let scoreB = 0;
    for (const q of BAHAGIAN_B_QUESTIONS) {
      scoreB += openGrades[`B-${q.number}`]?.markah ?? 0;
    }
    let scoreC = 0;
    for (const q of BAHAGIAN_C_QUESTIONS) {
      scoreC += openGrades[`C-${q.number}`]?.markah ?? 0;
    }
    return {
      scoreA,
      scoreB,
      scoreC,
      total: scoreA + scoreB + scoreC,
    };
  }, [answersA, openGrades]);

  const parseBulkInput = (text: string) => {
    const nextA = { ...answersA };
    const matchesA = text.matchAll(/\b([1-9]|[1-3][0-9]|40)\s*[.\-):]?\s*([ABCD])\b/gi);
    for (const m of matchesA) {
      const num = Number(m[1]);
      const key = m[2].toUpperCase() as 'A' | 'B' | 'C' | 'D';
      if (num >= 1 && num <= 40) {
        nextA[num] = key;
      }
    }
    setAnswersA(nextA);
  };

  const handleSubmitExam = async () => {
    setErrorMsg(null);
    const openSubmissions = [
      ...BAHAGIAN_B_QUESTIONS.map((q) => ({
        section: 'B' as const,
        number: q.number,
        prompt: q.prompt,
        stimulus: q.stimulus,
        rubric: q.skemaJawapan,
        maxMarks: q.marks,
        studentAnswer: answersB[q.number] || '',
      })),
      ...BAHAGIAN_C_QUESTIONS.map((q) => ({
        section: 'C' as const,
        number: q.number,
        prompt: q.prompt,
        stimulus: q.stimulus,
        rubric: q.skemaJawapan,
        maxMarks: q.marks,
        studentAnswer: answersC[q.number] || '',
      })),
    ];

    const hasOpenAnswers = openSubmissions.some((item) => item.studentAnswer.trim().length > 0);
    if (!hasOpenAnswers) {
      setIsSubmitted(true);
      setOpenGrades({});
      return;
    }

    setIsGrading(true);
    try {
      const res = await fetch('/api/sintaksis/kertas-penuh/semak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ openSubmissions }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menyemak jawapan Bahagian B dan C.');
      }
      const nextMap: Record<string, OpenGradeItem> = {};
      for (const item of (data.results || []) as OpenGradeItem[]) {
        nextMap[`${item.section}-${item.number}`] = item;
      }
      setOpenGrades(nextMap);
      setIsSubmitted(true);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Ralat semasa menyemak kertas peperiksaan.');
    } finally {
      setIsGrading(false);
    }
  };

  const handleCommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const raw = commandInput.trim();
    if (!raw) return;

    if (raw.toUpperCase() === 'SKEMA JAWAPAN') {
      setShowScheme(true);
      setIsSubmitted(true);
      setCommandInput('');
      return;
    }

    parseBulkInput(raw);
    await handleSubmitExam();
  };

  const handleResetPaper = () => {
    setAnswersA({});
    setAnswersB({});
    setAnswersC({});
    setOpenGrades({});
    setIsSubmitted(false);
    setShowScheme(false);
    setErrorMsg(null);
    setCommandInput('');
  };

  return (
    <div className="space-y-6">
      {/* Exam Paper Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-slate-500">
              Institut Pendidikan Guru · BMMB1084: Asas Tatabahasa Bahasa Melayu · HPK 2 (Aras C5)
            </p>
            <h2 className="text-2xl font-semibold text-slate-900">
              Kertas Peperiksaan Ulang Kaji Lengkap: Asas Sintaksis
            </h2>
            <p className="text-sm text-slate-600">
              Berpandukan Tatabahasa Dewan Edisi Ketiga & Kamus Dewan Edisi Keempat · 60 Soalan · Jumlah 100 Markah
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-700 tabular-nums">
            <span>A: {answeredCountA}/40</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>B: {answeredCountB}/10</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>C: {answeredCountC}/10</span>
          </div>
        </div>

        {/* Section Tabs & Actions */}
        <div className="pt-4 border-t border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
            {[
              { id: 'semua', label: 'Semua Bahagian (60)' },
              { id: 'A', label: 'Bahagian A: 40 Objektif [40M]' },
              { id: 'B', label: 'Bahagian B: 10 Struktur [30M]' },
              { id: 'C', label: 'Bahagian C: 10 Esei [30M]' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSectionFilter(tab.id as PaperSectionFilter)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  sectionFilter === tab.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setShowScheme((prev) => !prev)}
              className="px-3.5 py-2 inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {showScheme ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showScheme ? 'Sembunyi Skema' : 'Skema Jawapan'}</span>
            </button>

            <button
              type="button"
              onClick={handleResetPaper}
              className="px-3.5 py-2 inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Set Semula</span>
            </button>

            <button
              type="button"
              onClick={handleSubmitExam}
              disabled={isGrading}
              className="px-4 py-2 inline-flex items-center gap-2 text-xs font-medium text-white bg-blue-800 hover:bg-blue-900 disabled:opacity-60 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {isGrading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Menyemak Kertas…</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Semak Jawapan (100%)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div
          role="alert"
          className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 text-sm text-red-800"
        >
          <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <p>{errorMsg}</p>
        </div>
      )}

      {/* Score Summary Banner (Only shown AFTER submission or schema toggle) */}
      {(isSubmitted || showScheme) && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-blue-800">
              Keputusan Semakan Kertas Peperiksaan BMMB1084
            </p>
            <p className="text-sm text-slate-700">
              {showScheme && !isSubmitted
                ? 'Mod Skema Jawapan diaktifkan. Rujuk ulasan linguistik di bawah setiap soalan.'
                : 'Setiap jawapan telah disemak mengikut piawaian Tatabahasa Dewan Edisi Ketiga.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-5 font-mono text-sm tabular-nums">
            <span className="text-slate-600">
              Bahagian A: <strong className="text-slate-900">{scoreSummary.scoreA}/40</strong>
            </span>
            <span className="text-slate-600">
              Bahagian B: <strong className="text-slate-900">{scoreSummary.scoreB}/30</strong>
            </span>
            <span className="text-slate-600">
              Bahagian C: <strong className="text-slate-900">{scoreSummary.scoreC}/30</strong>
            </span>
            <span className="text-blue-800 font-semibold">
              Jumlah: {scoreSummary.total}/100 ({scoreSummary.total}%)
            </span>
          </div>
        </div>
      )}

      {/* BAHAGIAN A: 40 SOALAN OBJEKTIF */}
      {(sectionFilter === 'semua' || sectionFilter === 'A') && (
        <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
          <div className="pb-4 border-b border-slate-100 flex items-baseline justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                BAHAGIAN A: SOALAN OBJEKTIF (40 Soalan)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Pilih satu jawapan yang paling tepat (A, B, C, atau D) bagi setiap soalan.
              </p>
            </div>
            <span className="font-mono text-xs font-semibold text-slate-700 tabular-nums shrink-0">
              40 Markah
            </span>
          </div>

          <div className="space-y-6 divide-y divide-slate-100">
            {BAHAGIAN_A_QUESTIONS.map((q) => {
              const userChoice = answersA[q.number];
              const reveal = isSubmitted || showScheme;
              const isCorrect = userChoice === q.correctKey;

              return (
                <div key={q.number} className="pt-5 first:pt-0 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium text-slate-900 leading-relaxed">
                      <span className="font-mono font-semibold mr-2 text-slate-700 tabular-nums">
                        {q.number}.
                      </span>
                      {q.prompt}
                    </p>
                    <span className="text-xs text-slate-400 whitespace-nowrap shrink-0">
                      {q.topic}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-0 sm:pl-6">
                    {q.options.map((opt) => {
                      const chosen = userChoice === opt.key;
                      const isAnswerKey = reveal && opt.key === q.correctKey;
                      const isWrongChosen = reveal && chosen && !isCorrect;

                      return (
                        <label
                          key={opt.key}
                          className={`flex items-start gap-2.5 p-3 rounded-lg border text-sm transition-colors cursor-pointer ${
                            isAnswerKey
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
                              : isWrongChosen
                                ? 'bg-red-50 border-red-400 text-red-950'
                                : chosen
                                  ? 'bg-blue-50/70 border-blue-700 text-slate-900'
                                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`exam-a-${q.number}`}
                            value={opt.key}
                            checked={chosen}
                            onChange={() =>
                              setAnswersA((prev) => ({ ...prev, [q.number]: opt.key }))
                            }
                            className="mt-1 h-4 w-4 text-blue-800 border-slate-300"
                          />
                          <span className="leading-relaxed">
                            <strong className="font-mono mr-1.5">{opt.key}.</strong>
                            {opt.text}
                          </span>
                        </label>
                      );
                    })}
                  </div>

                  {reveal && (
                    <div className="sm:ml-6 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2">
                      {isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className="font-semibold text-slate-900">
                          Jawapan Piawai: {q.correctKey}
                        </span>
                        <span aria-hidden="true"> · </span>
                        <span>{q.ulasanRingkas}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* BAHAGIAN B: 10 SOALAN STRUKTUR */}
      {(sectionFilter === 'semua' || sectionFilter === 'B') && (
        <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
          <div className="pb-4 border-b border-slate-100 flex items-baseline justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                BAHAGIAN B: SOALAN STRUKTUR (10 Soalan)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Analisis frasa, klausa, pola ayat, jenis ayat, susunan, dan ragam ayat secara tepat.
              </p>
            </div>
            <span className="font-mono text-xs font-semibold text-slate-700 tabular-nums shrink-0">
              30 Markah
            </span>
          </div>

          <div className="space-y-6 divide-y divide-slate-100">
            {BAHAGIAN_B_QUESTIONS.map((q) => {
              const grade = openGrades[`B-${q.number}`];
              const reveal = isSubmitted || showScheme;
              return (
                <div key={q.number} className="pt-5 first:pt-0 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium text-slate-900 leading-relaxed">
                      <span className="font-mono font-semibold mr-2 text-slate-700 tabular-nums">
                        {q.number}.
                      </span>
                      {q.prompt}
                    </p>
                    <span className="font-mono text-xs text-slate-500 whitespace-nowrap shrink-0 tabular-nums">
                      [{q.marks} Markah]
                    </span>
                  </div>

                  {q.stimulus && (
                    <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-display text-slate-900">
                      {q.stimulus}
                    </div>
                  )}

                  <textarea
                    rows={3}
                    value={answersB[q.number] || ''}
                    onChange={(e) =>
                      setAnswersB((prev) => ({ ...prev, [q.number]: e.target.value }))
                    }
                    placeholder={`Tulis jawapan Bahagian B Soalan ${q.number} di sini…`}
                    className="w-full p-3 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700"
                  />

                  {reveal && (
                    <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                      {grade && (
                        <p className="font-semibold text-slate-900">
                          Semakan Pensyarah ({grade.markah}/{q.marks} markah):{' '}
                          <span className="font-normal text-slate-700">{grade.ulasan}</span>
                        </p>
                      )}
                      <p className="text-slate-700 leading-relaxed">
                        <strong className="text-slate-900">Skema Rujukan: </strong>
                        {q.skemaJawapan}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* BAHAGIAN C: 10 SOALAN ESEI PENDEK / CERAKINAN C4-C5 */}
      {(sectionFilter === 'semua' || sectionFilter === 'C') && (
        <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
          <div className="pb-4 border-b border-slate-100 flex items-baseline justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                BAHAGIAN C: ESEI PENDEK & CERAKINAN SINTAKSIS ARAS TINGGI (C4–C5)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Berikan hujah linguistik, cerakinan konstituen, atau pembetulan berpandukan Tatabahasa Dewan.
              </p>
            </div>
            <span className="font-mono text-xs font-semibold text-slate-700 tabular-nums shrink-0">
              30 Markah
            </span>
          </div>

          <div className="space-y-6 divide-y divide-slate-100">
            {BAHAGIAN_C_QUESTIONS.map((q) => {
              const grade = openGrades[`C-${q.number}`];
              const reveal = isSubmitted || showScheme;
              return (
                <div key={q.number} className="pt-5 first:pt-0 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium text-slate-900 leading-relaxed">
                      <span className="font-mono font-semibold mr-2 text-slate-700 tabular-nums">
                        {q.number}.
                      </span>
                      {q.prompt}
                    </p>
                    <span className="font-mono text-xs text-slate-500 whitespace-nowrap shrink-0 tabular-nums">
                      [{q.marks} Markah]
                    </span>
                  </div>

                  {q.stimulus && (
                    <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-display text-slate-900">
                      {q.stimulus}
                    </div>
                  )}

                  <textarea
                    rows={4}
                    value={answersC[q.number] || ''}
                    onChange={(e) =>
                      setAnswersC((prev) => ({ ...prev, [q.number]: e.target.value }))
                    }
                    placeholder={`Tulis hujah / cerakinan Bahagian C Soalan ${q.number} di sini…`}
                    className="w-full p-3 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700"
                  />

                  {reveal && (
                    <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                      {grade && (
                        <p className="font-semibold text-slate-900">
                          Semakan Pensyarah ({grade.markah}/{q.marks} markah):{' '}
                          <span className="font-normal text-slate-700">{grade.ulasan}</span>
                        </p>
                      )}
                      <p className="text-slate-700 leading-relaxed">
                        <strong className="text-slate-900">Skema Rujukan: </strong>
                        {q.skemaJawapan}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Bottom Submission Instruction Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
        <p className="text-xs text-slate-600">
          Sila hantar jawapan anda (contoh: Bahagian A: 1.A, 2.C... | Bahagian B: ... | Bahagian C: ...) atau taip &apos;SKEMA JAWAPAN&apos; apabila anda bersedia untuk menyemak.
        </p>
        <form onSubmit={handleCommandSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            placeholder="Tampal senarai jawapan Bahagian A (cth: 1.B, 2.C, 3.B...) atau taip SKEMA JAWAPAN…"
            className="flex-1 h-10 px-3.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700"
          />
          <button
            type="submit"
            disabled={isGrading}
            className="h-10 px-5 inline-flex items-center justify-center gap-2 text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 disabled:opacity-60 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {isGrading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>Proses & Semak</span>
          </button>
        </form>
      </div>
    </div>
  );
};
