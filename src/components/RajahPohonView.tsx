import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  GitBranch,
  Loader2,
  Search,
  XCircle,
} from 'lucide-react';
import { CURATED_TREES } from '../data/sintaksisCurriculum';
import type { SyntaxNode, TreeAnalysisResult } from '../types/sintaksis';
import { RajahPohonSVG } from './RajahPohonSVG';

type DisplayMode = 'pohon' | 'kurungan' | 'jadual';

interface RajahPohonViewProps {
  initialSentence?: string | null;
  onConsumedInitialSentence?: () => void;
}

export const RajahPohonView: React.FC<RajahPohonViewProps> = ({
  initialSentence,
  onConsumedInitialSentence,
}) => {
  const [activeAnalysis, setActiveAnalysis] = useState<TreeAnalysisResult>(
    CURATED_TREES[0],
  );
  const [selectedNode, setSelectedNode] = useState<SyntaxNode>(
    CURATED_TREES[0].tree,
  );
  const [displayMode, setDisplayMode] = useState<DisplayMode>('pohon');
  const [customSentence, setCustomSentence] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const runSentenceAnalysis = async (sentenceToAnalyze: string) => {
    const trimmed = sentenceToAnalyze.trim();
    if (!trimmed) {
      setErrorMsg('Sila masukkan satu ayat bahasa Melayu untuk dicerakinkan.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/sintaksis/cerakin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sentence: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal mencerakinkan ayat tersebut.');
      }
      const result = data as TreeAnalysisResult;
      setActiveAnalysis(result);
      setSelectedNode(result.tree);
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Ralat semasa menjalankan analisis rajah pohon.',
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (initialSentence && initialSentence.trim()) {
      setCustomSentence(initialSentence);
      runSentenceAnalysis(initialSentence);
      onConsumedInitialSentence?.();
    }
  }, [initialSentence, onConsumedInitialSentence]);

  const handleSelectCurated = (treeItem: TreeAnalysisResult) => {
    setActiveAnalysis(treeItem);
    setSelectedNode(treeItem.tree);
    setErrorMsg(null);
  };

  const handleAnalyzeCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    await runSentenceAnalysis(customSentence);
  };

  return (
    <div className="space-y-6">
      {/* Header & Custom Sentence Input */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500">
              Pencerakinan Konstituen Terdekat · Rajah Pohon & Kurungan Berlabel
            </p>
            <h1 className="text-2xl font-semibold text-slate-900">
              Makmal Rajah Pohon Sintaksis
            </h1>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start">
            <button
              type="button"
              onClick={() => setDisplayMode('pohon')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                displayMode === 'pohon'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Rajah Pohon
            </button>
            <button
              type="button"
              onClick={() => setDisplayMode('kurungan')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                displayMode === 'kurungan'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Kurungan Berlabel
            </button>
            <button
              type="button"
              onClick={() => setDisplayMode('jadual')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                displayMode === 'jadual'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Jadual Cerakinan
            </button>
          </div>
        </div>

        {/* Custom Sentence Analyzer Bar */}
        <form
          onSubmit={handleAnalyzeCustom}
          className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3"
        >
          <div className="flex-1">
            <label htmlFor="custom-sentence-input" className="sr-only">
              Masukkan ayat bahasa Melayu untuk dicerakinkan
            </label>
            <input
              id="custom-sentence-input"
              type="text"
              value={customSentence}
              onChange={(e) => setCustomSentence(e.target.value)}
              placeholder="Taip mana-mana ayat bahasa Melayu (cth: Surat rasmi itu perlu anda tandatangani segera.)…"
              className="w-full h-10 px-3.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700"
            />
          </div>
          <button
            type="submit"
            disabled={isAnalyzing}
            className="h-10 px-5 inline-flex items-center justify-center gap-2 text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 disabled:opacity-60 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Mencerakinkan…</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Cerakinkan Ayat</span>
              </>
            )}
          </button>
        </form>

        {/* Curated BMMB1084 Specimen Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-500 mr-1">
            Contoh BMMB1084:
          </span>
          {CURATED_TREES.map((item) => {
            const active = activeAnalysis.id === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectCurated(item)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {item.title}
              </button>
            );
          })}
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

      {/* Two-Zone Sandbox Layout: Left Interactive Stage (65%) + Right Concept Deck (35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Diagram Stage */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs text-slate-500">{activeAnalysis.topicLabel}</p>
                <p className="font-display text-xl font-semibold text-slate-900 mt-0.5">
                  “{activeAnalysis.ayat}”
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                {activeAnalysis.statusGramatis === 'GRAMATIS' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">GRAMATIS</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span className="text-red-700">TIDAK GRAMATIS</span>
                  </>
                )}
              </div>
            </div>

            {displayMode === 'pohon' && (
              <div className="space-y-2">
                <RajahPohonSVG
                  tree={activeAnalysis.tree}
                  selectedNodeId={selectedNode?.id ?? null}
                  onSelectNode={setSelectedNode}
                />
                <p className="text-xs text-slate-500">
                  Klik mana-mana nod dalam rajah pohon untuk melihat fungsi konstituen dan hukum Tatabahasa Dewan di panel sebelah kanan.
                </p>
              </div>
            )}

            {displayMode === 'kurungan' && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <GitBranch className="w-4 h-4 text-blue-800" />
                  <span>Notasi Kurungan Berlabel (Labeled Bracketing)</span>
                </div>
                <pre className="p-4 bg-white border border-slate-200 rounded-lg font-mono text-sm text-slate-900 whitespace-pre-wrap break-words leading-relaxed">
                  {activeAnalysis.kurunganBerlabel}
                </pre>
              </div>
            )}

            {displayMode === 'jadual' && (
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                      <th className="py-3 px-4">Bahagian</th>
                      <th className="py-3 px-4">Konstituen / Frasa</th>
                      <th className="py-3 px-4">Kategori</th>
                      <th className="py-3 px-4">Huraian Sintaksis</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeAnalysis.cerakinanJadual.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60">
                        <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                          {row.bahagian}
                        </td>
                        <td className="py-3 px-4 font-display text-slate-900">
                          {row.frasa}
                        </td>
                        <td className="py-3 px-4 font-mono text-xs font-semibold text-blue-800 whitespace-nowrap">
                          {row.kategori}
                        </td>
                        <td className="py-3 px-4 text-slate-700 leading-relaxed">
                          {row.huraian}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right: Concept & Node Inspection Deck */}
        <aside className="lg:col-span-4 space-y-4">
          {/* Selected Node Detail */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <span className="text-xs font-semibold text-slate-500">
                Konstituen Dipilih
              </span>
              <span className="font-mono text-xs font-semibold text-blue-800">
                {selectedNode.category}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {selectedNode.label}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">{selectedNode.role}</p>
            </div>
            {selectedNode.words && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                <span className="text-xs text-slate-500">Realisasi Kata: </span>
                <span className="font-display font-semibold text-slate-900">
                  “{selectedNode.words}”
                </span>
              </div>
            )}
            <p className="text-sm text-slate-700 leading-relaxed">
              {selectedNode.ruleNote}
            </p>
          </div>

          {/* Syntactic Profile Matrix */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 pb-2 border-b border-slate-100">
              Profil Sintaksis Ayat
            </h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs text-slate-500">Pola Ayat</dt>
                <dd className="font-medium text-slate-900 mt-0.5">
                  {activeAnalysis.polaAyat}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Jenis Ayat</dt>
                <dd className="font-medium text-slate-900 mt-0.5">
                  {activeAnalysis.jenisAyat}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Ragam Ayat</dt>
                <dd className="font-medium text-slate-900 mt-0.5">
                  {activeAnalysis.ragamAyat}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Susunan Ayat</dt>
                <dd className="font-medium text-slate-900 mt-0.5">
                  {activeAnalysis.susunanAyat}
                </dd>
              </div>
            </dl>
            <div className="pt-3 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-500 mb-1">
                Ulasan Tatabahasa Dewan
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">
                {activeAnalysis.notaSintaksis}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
