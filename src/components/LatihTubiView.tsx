import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Send,
  XCircle,
} from 'lucide-react';
import { CURATED_QUESTIONS, TOPIC_LABELS } from '../data/sintaksisCurriculum';
import type {
  DrillEvaluation,
  DrillQuestion,
  FollowUpMessage,
  QuestionFormat,
  TopicId,
} from '../types/sintaksis';
import { KertasPeperiksaanView } from './KertasPeperiksaanView';

interface LatihTubiViewProps {
  selectedTopic: TopicId;
  onSelectTopic: (topic: TopicId) => void;
  sessionStats: { answered: number; earned: number; possible: number };
  onRecordResult: (earned: number, possible: number) => void;
}

const FORMAT_OPTIONS: { id: QuestionFormat; label: string }[] = [
  { id: 'objektif', label: 'Objektif (Aneka Pilihan)' },
  { id: 'struktur', label: 'Struktur / Esei Ringkas' },
  { id: 'analisis', label: 'Analisis & Pencerakinan' },
];

export const LatihTubiView: React.FC<LatihTubiViewProps> = ({
  selectedTopic,
  onSelectTopic,
  sessionStats,
  onRecordResult,
}) => {
  const [drillMode, setDrillMode] = useState<'kertas-penuh' | 'berfokus'>(() =>
    selectedTopic === 'semua' ? 'kertas-penuh' : 'berfokus',
  );
  const [question, setQuestion] = useState<DrillQuestion>(() => {
    if (selectedTopic === 'semua') return CURATED_QUESTIONS[0];
    return (
      CURATED_QUESTIONS.find((q) => q.topicId === selectedTopic) ||
      CURATED_QUESTIONS[0]
    );
  });
  const [format, setFormat] = useState<QuestionFormat>(() => question.format);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [writtenAnswer, setWrittenAnswer] = useState<string>('');
  const [evaluation, setEvaluation] = useState<DrillEvaluation | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [previousPrompts, setPreviousPrompts] = useState<string[]>([]);
  const [followUpInput, setFollowUpInput] = useState('');
  const [followUpHistory, setFollowUpHistory] = useState<FollowUpMessage[]>([]);
  const [isReplying, setIsReplying] = useState(false);

  const resetQuestionState = (nextQ: DrillQuestion) => {
    setQuestion(nextQ);
    setSelectedOption('');
    setWrittenAnswer('');
    setEvaluation(null);
    setErrorMsg(null);
    setFollowUpHistory([]);
    setFollowUpInput('');
  };

  const handleLoadCurated = (topicFilter: TopicId, fmt: QuestionFormat) => {
    const match =
      CURATED_QUESTIONS.find(
        (q) =>
          (topicFilter === 'semua' || q.topicId === topicFilter) &&
          q.format === fmt,
      ) ||
      CURATED_QUESTIONS.find((q) => q.format === fmt) ||
      CURATED_QUESTIONS[0];
    resetQuestionState(match);
  };

  const handleGenerateQuestion = async (
    targetTopic: TopicId = selectedTopic,
    targetFormat: QuestionFormat = format,
  ) => {
    setIsGenerating(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/sintaksis/soalan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicId: targetTopic,
          format: targetFormat,
          previousPrompts,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menjana soalan baharu.');
      }
      setPreviousPrompts((prev) => [...prev.slice(-6), data.prompt]);
      resetQuestionState(data as DrillQuestion);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Ralat rangkaian semasa menjana soalan.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    const studentAnswer =
      question.format === 'objektif'
        ? selectedOption
          ? `${selectedOption}. ${question.options?.find((o) => o.key === selectedOption)?.text || ''}`
          : ''
        : writtenAnswer.trim();

    if (!studentAnswer) {
      setErrorMsg(
        question.format === 'objektif'
          ? 'Sila pilih satu jawapan (A, B, C, atau D) terlebih dahulu.'
          : 'Sila tulis jawapan anda di dalam ruang jawapan sebelum menghantar.',
      );
      return;
    }

    setIsChecking(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/sintaksis/semak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, studentAnswer }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menyemak jawapan.');
      }
      const evalResult = data as DrillEvaluation;
      setEvaluation(evalResult);
      onRecordResult(evalResult.markah, evalResult.markahMaksimum);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Ralat semasa menyemak jawapan.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleSendFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpInput.trim() || !evaluation) return;

    const userMsg: FollowUpMessage = { role: 'pelajar', content: followUpInput.trim() };
    const nextHistory = [...followUpHistory, userMsg];
    setFollowUpHistory(nextHistory);
    setFollowUpInput('');
    setIsReplying(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/sintaksis/tanya', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          evaluation,
          history: followUpHistory,
          message: userMsg.content,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal mendapatkan respons pensyarah.');
      }
      setFollowUpHistory([
        ...nextHistory,
        { role: 'pensyarah', content: data.reply },
      ]);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Ralat rangkaian semasa bimbingan.');
    } finally {
      setIsReplying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Workspace Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500">
              HPK 2 · Aras Penilaian C5 · Tatabahasa Dewan Edisi Ketiga
            </p>
            <h1 className="text-2xl font-semibold text-slate-900">
              Latih Tubi Peperiksaan BMMB1084
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => setDrillMode('kertas-penuh')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  drillMode === 'kertas-penuh'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Kertas Peperiksaan Penuh (60 Soalan)
              </button>
              <button
                type="button"
                onClick={() => setDrillMode('berfokus')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  drillMode === 'berfokus'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Latih Tubi Berfokus
              </button>
            </div>

            {drillMode === 'berfokus' && (
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 tabular-nums">
                <div>
                  <span className="text-slate-500">Dijawab: </span>
                  <span className="font-semibold text-slate-900">{sessionStats.answered}</span>
                </div>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <div>
                  <span className="text-slate-500">Skor: </span>
                  <span className="font-semibold text-slate-900 font-mono">
                    {sessionStats.earned}/{sessionStats.possible}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Controls for focused drill mode */}
        {drillMode === 'berfokus' && (
        <div className="mt-5 pt-5 border-t border-slate-100 grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
          <div className="lg:col-span-5">
            <label
              htmlFor="topic-select"
              className="block text-xs font-medium text-slate-600 mb-1.5"
            >
              Skop Topik Sintaksis
            </label>
            <select
              id="topic-select"
              value={selectedTopic}
              onChange={(e) => {
                const next = e.target.value as TopicId;
                onSelectTopic(next);
                handleLoadCurated(next, format);
              }}
              className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700"
            >
              {Object.entries(TOPIC_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-5">
            <span className="block text-xs font-medium text-slate-600 mb-1.5">
              Format Soalan
            </span>
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
              {FORMAT_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setFormat(opt.id);
                    handleLoadCurated(selectedTopic, opt.id);
                  }}
                  className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    format === opt.id
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <button
              type="button"
              onClick={() => handleGenerateQuestion(selectedTopic, format)}
              disabled={isGenerating}
              className="w-full h-10 px-4 inline-flex items-center justify-center gap-2 text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 disabled:opacity-60 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              <span>Soalan Baharu</span>
            </button>
          </div>
        </div>
        )}
      </div>

      {drillMode === 'kertas-penuh' ? (
        <KertasPeperiksaanView />
      ) : (
        <>
          {/* Error banner */}
          {errorMsg && (
            <div
              role="alert"
              className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 text-sm text-red-800"
            >
              <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold">Ralat Pemprosesan</p>
                <p>{errorMsg}</p>
              </div>
            </div>
          )}

      {/* Main Split Stage: Question & Submission (Left) + Pensyarah Evaluation & Scaffolding (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Question & Answer Input */}
        <section className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-700">{question.topicTitle}</span>
              <span aria-hidden="true">·</span>
              <span>
                {question.format === 'objektif'
                  ? 'Objektif Aneka Pilihan'
                  : question.format === 'struktur'
                    ? 'Struktur / Esei Ringkas'
                    : 'Analisis & Pencerakinan'}
              </span>
              <span aria-hidden="true">·</span>
              <span>{question.source === 'kurasi' ? 'Soalan Rujukan Teras' : 'Soalan Dijana Pensyarah'}</span>
            </div>
            <span className="font-mono font-semibold text-slate-700 tabular-nums">
              {question.maxMarks} Markah
            </span>
          </div>

          {question.stimulusSentence && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <p className="text-xs font-medium text-slate-500 mb-1.5">
                Ayat Rangsangan
              </p>
              <p className="font-display text-lg font-medium text-slate-900 leading-relaxed">
                “{question.stimulusSentence}”
              </p>
            </div>
          )}

          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900 leading-snug">
              {question.prompt}
            </h2>
            {question.arahanTambahan && (
              <p className="text-sm text-slate-600">{question.arahanTambahan}</p>
            )}
          </div>

          <form onSubmit={handleSubmitAnswer} className="space-y-4">
            {question.format === 'objektif' && question.options ? (
              <div className="space-y-2.5" role="radiogroup" aria-label="Pilihan jawapan">
                {question.options.map((opt) => {
                  const isChosen = selectedOption === opt.key;
                  return (
                    <label
                      key={opt.key}
                      className={`flex items-start gap-3 p-3.5 rounded-lg border transition-colors cursor-pointer ${
                        isChosen
                          ? 'bg-blue-50/70 border-blue-700 text-slate-900'
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <input
                        type="radio"
                        name="mcq-option"
                        value={opt.key}
                        checked={isChosen}
                        disabled={Boolean(evaluation)}
                        onChange={() => setSelectedOption(opt.key)}
                        className="mt-1 h-4 w-4 text-blue-800 border-slate-300 focus:ring-blue-700"
                      />
                      <div className="text-sm leading-relaxed">
                        <span className="font-mono font-semibold mr-2 text-slate-900">
                          {opt.key}.
                        </span>
                        <span>{opt.text}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            ) : (
              <div>
                <label
                  htmlFor="written-answer"
                  className="block text-xs font-medium text-slate-600 mb-1.5"
                >
                  Jawapan Bertulis Pelajar (Gunakan istilah Tatabahasa Dewan)
                </label>
                <textarea
                  id="written-answer"
                  rows={6}
                  value={writtenAnswer}
                  disabled={Boolean(evaluation)}
                  onChange={(e) => setWrittenAnswer(e.target.value)}
                  placeholder={
                    question.format === 'analisis'
                      ? 'Contoh: Klausa Utama ialah "...". Klausa Kecil terdiri daripada klausa relatif "..." yang berfungsi sebagai penerang kepada FN...'
                      : 'Tulis hujah sintaksis dan pembetulan anda di sini...'
                  }
                  className="w-full p-3.5 text-sm leading-relaxed bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 disabled:bg-slate-50"
                />
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <p className="text-xs text-slate-500">
                Jawapan tidak akan dipaparkan sehingga anda menghantar percubaan anda.
              </p>

              {!evaluation ? (
                <button
                  type="submit"
                  disabled={isChecking || isGenerating}
                  className="px-5 py-2.5 inline-flex items-center gap-2 text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 disabled:opacity-60 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {isChecking ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Menyemak Jawapan…</span>
                    </>
                  ) : (
                    <>
                      <span>Hantar Jawapan</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleGenerateQuestion(selectedTopic, format)}
                  disabled={isGenerating}
                  className="px-5 py-2.5 inline-flex items-center gap-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-60 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  <span>Cuba Soalan Seterusnya</span>
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Right: Pensyarah Feedback & Step-by-Step Scaffolding */}
        <aside className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          {!evaluation ? (
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-slate-900">
                Bimbingan & Semakan Pensyarah
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Selesaikan soalan di sebelah kiri terlebih dahulu. Setelah anda menghantar jawapan, sistem akan menilai ketepatan struktur sintaksis anda mengikut piawaian <span className="font-medium text-slate-900">Tatabahasa Dewan Edisi Ketiga</span>.
              </p>
              <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs text-slate-600">
                <p className="font-semibold text-slate-800">Kriteria Pemarkahan Aras C5:</p>
                <p>1. Ketepatan mengenal pasti konstituen (Subjek, Predikat, Frasa, Klausa).</p>
                <p>2. Penggunaan istilah linguistik rasmi tanpa kekeliruan konsep.</p>
                <p>3. Kejelasan hujah sintaksis dan kegramatisan ayat pembetulan.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Dual-coded status header */}
              <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  {evaluation.statusLabel === 'TEPAT' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : evaluation.statusLabel === 'SEPARA TEPAT' ? (
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                  )}
                  <span
                    className={`text-sm font-semibold ${
                      evaluation.statusLabel === 'TEPAT'
                        ? 'text-emerald-700'
                        : evaluation.statusLabel === 'SEPARA TEPAT'
                          ? 'text-amber-700'
                          : 'text-red-700'
                    }`}
                  >
                    {evaluation.statusLabel}
                  </span>
                </div>
                <span className="font-mono text-sm font-semibold text-slate-900 tabular-nums">
                  Markah: {evaluation.markah} / {evaluation.markahMaksimum}
                </span>
              </div>

              {/* Lecturer explanation */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-semibold text-slate-500">
                  Ulasan Pensyarah
                </h3>
                <p className="text-sm text-slate-800 leading-relaxed">
                  {evaluation.ulasanPensyarah}
                </p>
              </div>

              {/* Root error if any */}
              {evaluation.puncaKesilapan && (
                <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-3.5 space-y-1">
                  <p className="text-xs font-semibold text-amber-900">
                    Punca Kesilapan Struktur
                  </p>
                  <p className="text-sm text-amber-900 leading-relaxed">
                    {evaluation.puncaKesilapan}
                  </p>
                </div>
              )}

              {/* Step-by-step guidance */}
              {evaluation.bimbinganLangkah && evaluation.bimbinganLangkah.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-slate-500">
                    {evaluation.betul
                      ? 'Nota Pengukuhan Konsep'
                      : 'Bimbingan Langkah demi Langkah'}
                  </h4>
                  <ol className="space-y-2">
                    {evaluation.bimbinganLangkah.map((step, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-sm text-slate-700 leading-relaxed"
                      >
                        <span className="font-mono text-xs font-semibold text-blue-800 mt-0.5 tabular-nums">
                          {String(idx + 1).padStart(2, '0')}.
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Model Answer */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-1.5">
                <p className="text-xs font-semibold text-slate-600">
                  Jawapan Contoh / Piawaian Tatabahasa Dewan
                </p>
                <p className="text-sm text-slate-900 leading-relaxed">
                  {evaluation.jawapanContoh}
                </p>
                {evaluation.kurunganBerlabel && (
                  <pre className="mt-2 p-2.5 bg-white border border-slate-200 rounded text-xs font-mono text-slate-700 whitespace-pre-wrap break-words">
                    {evaluation.kurunganBerlabel}
                  </pre>
                )}
              </div>

              {/* Interactive follow-up coaching */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h4 className="text-xs font-semibold text-slate-600">
                  Soal Jawab Susulan dengan Pensyarah
                </h4>
                {followUpHistory.length > 0 && (
                  <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                    {followUpHistory.map((msg, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-lg text-sm leading-relaxed ${
                          msg.role === 'pelajar'
                            ? 'bg-blue-50 text-slate-900 border border-blue-100'
                            : 'bg-slate-50 text-slate-800 border border-slate-200'
                        }`}
                      >
                        <p className="text-xs font-semibold text-slate-500 mb-1">
                          {msg.role === 'pelajar' ? 'Pelajar' : 'Pensyarah'}
                        </p>
                        <p className="whitespace-pre-line">{msg.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                <form onSubmit={handleSendFollowUp} className="flex gap-2">
                  <input
                    type="text"
                    value={followUpInput}
                    onChange={(e) => setFollowUpInput(e.target.value)}
                    placeholder="Tanya sebab struktur atau cuba tulis semula jawapan…"
                    className="flex-1 h-10 px-3 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700"
                  />
                  <button
                    type="submit"
                    disabled={isReplying || !followUpInput.trim()}
                    aria-label="Hantar mesej susulan"
                    className="h-10 px-3.5 inline-flex items-center justify-center text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-lg transition-colors cursor-pointer"
                  >
                    {isReplying ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}
        </aside>
      </div>
        </>
      )}
    </div>
  );
};
