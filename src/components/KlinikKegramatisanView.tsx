import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Loader2,
  RefreshCw,
  XCircle,
} from 'lucide-react';
import { CURATED_GRAMMAR_CASES } from '../data/sintaksisCurriculum';
import type {
  GrammarCase,
  GrammarErrorCategory,
  GrammarEvaluation,
} from '../types/sintaksis';

const ERROR_CATEGORIES: { id: GrammarErrorCategory; label: string }[] = [
  { id: 'ayat-tergantung', label: 'Ayat Tergantung (Tiada Subjek / Predikat)' },
  { id: 'pasif', label: 'Kesalahan Struktur Ayat Pasif' },
  { id: 'kata-hubung', label: 'Kesalahan Kata Hubung' },
  { id: 'kelewahan', label: 'Kelewahan Bahasa' },
];

export const KlinikKegramatisanView: React.FC = () => {
  const [activeCase, setActiveCase] = useState<GrammarCase>(
    CURATED_GRAMMAR_CASES[0],
  );
  const [selectedCategory, setSelectedCategory] = useState<GrammarErrorCategory>(
    'ayat-tergantung',
  );
  const [studentExplanation, setStudentExplanation] = useState('');
  const [studentCorrection, setStudentCorrection] = useState('');
  const [evaluation, setEvaluation] = useState<GrammarEvaluation | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadCuratedCase = (item: GrammarCase) => {
    setActiveCase(item);
    setStudentExplanation('');
    setStudentCorrection('');
    setEvaluation(null);
    setErrorMsg(null);
  };

  const handleGenerateCase = async (category: GrammarErrorCategory) => {
    setIsGenerating(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/sintaksis/kegramatisan/jana', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menjana kes kegramatisan baharu.');
      }
      loadCuratedCase(data as GrammarCase);
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Ralat rangkaian semasa menjana kes.',
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentCorrection.trim()) {
      setErrorMsg('Sila tulis ayat pembetulan yang gramatis terlebih dahulu.');
      return;
    }

    const chosenLabel =
      ERROR_CATEGORIES.find((c) => c.id === selectedCategory)?.label ||
      selectedCategory;

    setIsChecking(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/sintaksis/kegramatisan/semak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          faultySentence: activeCase.faultySentence,
          selectedCategoryLabel: chosenLabel,
          studentExplanation: studentExplanation.trim(),
          studentCorrection: studentCorrection.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menyemak pembetulan ayat.');
      }
      setEvaluation(data as GrammarEvaluation);
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Ralat semasa menyemak pembetulan.',
      );
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500">
              Topik 7 · Analisis Kegramatisan Sintaksis · Aras Penilaian C5
            </p>
            <h1 className="text-2xl font-semibold text-slate-900">
              Klinik Diagnosis & Pembetulan Ayat
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {CURATED_GRAMMAR_CASES.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => loadCuratedCase(item)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeCase.id === item.id
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Kes 0{idx + 1}: {item.categoryLabel}
              </button>
            ))}
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Diagnostic Workbench */}
        <section className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              {activeCase.source === 'kurasi'
                ? 'Kes Rujukan Peperiksaan'
                : 'Kes Dijana Pensyarah'}
            </span>
            <span className="font-mono font-semibold text-slate-700 tabular-nums">
              6 Markah
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
            <p className="text-xs font-semibold text-red-700">
              Ayat Bermasalah untuk Dinilai
            </p>
            <p className="font-display text-lg font-medium text-slate-900 leading-relaxed">
              *{activeCase.faultySentence}
            </p>
            <p className="text-xs text-slate-500">{activeCase.contextNote}</p>
          </div>

          <form onSubmit={handleCheck} className="space-y-4">
            <div>
              <span className="block text-xs font-semibold text-slate-700 mb-2">
                Langkah 1: Diagnosis Kategori Kesalahan Sintaksis
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ERROR_CATEGORIES.map((cat) => {
                  const chosen = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      disabled={Boolean(evaluation)}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`text-left px-3.5 py-2.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                        chosen
                          ? 'bg-blue-50 border-blue-700 text-blue-900'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label
                htmlFor="grammar-reason"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Langkah 2: Huraian Punca Kesalahan (Istilah Tatabahasa Dewan)
              </label>
              <input
                id="grammar-reason"
                type="text"
                value={studentExplanation}
                disabled={Boolean(evaluation)}
                onChange={(e) => setStudentExplanation(e.target.value)}
                placeholder="Cth: Ayat tergantung kerana kehadiran kata sendi nama di hadapan subjek…"
                className="w-full h-10 px-3.5 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 disabled:bg-slate-50"
              />
            </div>

            <div>
              <label
                htmlFor="grammar-fix"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Langkah 3: Tulis Semula Ayat yang Gramatis
              </label>
              <textarea
                id="grammar-fix"
                rows={3}
                value={studentCorrection}
                disabled={Boolean(evaluation)}
                onChange={(e) => setStudentCorrection(e.target.value)}
                placeholder="Tulis semula ayat lengkap tanpa mengubah maksud asal…"
                className="w-full p-3.5 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 disabled:bg-slate-50"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleGenerateCase(selectedCategory)}
                disabled={isGenerating}
                className="px-4 py-2 inline-flex items-center gap-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {isGenerating ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="w-3.5 h-3.5" />
                )}
                <span>Jana Kes Baharu Kategori Ini</span>
              </button>

              {!evaluation && (
                <button
                  type="submit"
                  disabled={isChecking}
                  className="px-5 py-2.5 inline-flex items-center gap-2 text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 disabled:opacity-60 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {isChecking ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Menyemak…</span>
                    </>
                  ) : (
                    <>
                      <span>Semak Pembetulan</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Right: Evaluation & Guided Correction */}
        <aside className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          {!evaluation ? (
            <div className="space-y-3">
              <h2 className="text-base font-semibold text-slate-900">
                Panduan Diagnosis Kegramatisan
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Dalam peperiksaan akhir BMMB1084, pelajar sering kehilangan markah kerana hanya membetulkan ayat secara intuitif tanpa mengenal pasti kecacatan struktur konstituennya.
              </p>
              <ul className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                <li>1. Kenal pasti Subjek (FN) dan Predikat terlebih dahulu.</li>
                <li>2. Periksa urutan pelaku dalam ayat pasif (KGND 1/2 vs 3).</li>
                <li>3. Sahkan fungsi kata hubung serta buang unsur bertindih.</li>
              </ul>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  {evaluation.statusLabel === 'TEPAT' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : evaluation.statusLabel === 'SEPARA TEPAT' ? (
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
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

              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-slate-500">
                  Ulasan Pensyarah
                </p>
                <p className="text-sm text-slate-800 leading-relaxed">
                  {evaluation.ulasanPensyarah}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-1">
                <p className="text-xs font-semibold text-slate-600">
                  Punca Sebenar Kesalahan
                </p>
                <p className="text-sm text-slate-800 leading-relaxed">
                  {evaluation.puncaKesilapan}
                </p>
              </div>

              {evaluation.bimbinganLangkah.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500">
                    Langkah Analisis Pembetulan
                  </p>
                  <ol className="space-y-2">
                    {evaluation.bimbinganLangkah.map((step, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-sm text-slate-700 leading-relaxed"
                      >
                        <span className="font-mono text-xs font-semibold text-blue-800 mt-0.5 tabular-nums">
                          {String(i + 1).padStart(2, '0')}.
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-3.5 space-y-1">
                <p className="text-xs font-semibold text-emerald-800">
                  Ayat Gramatis Cadangan
                </p>
                <p className="font-display text-base font-medium text-emerald-950 leading-relaxed">
                  {evaluation.ayatGramatis}
                </p>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
