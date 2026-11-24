import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Loader2,
  Search,
  XCircle,
} from 'lucide-react';
import { CURATED_KAMUS_ENTRIES } from '../data/kamusDewanData';
import type { KamusCategory, KamusEntry } from '../types/sintaksis';

interface KamusDewanViewProps {
  onAnalyzeInTree: (sentence: string) => void;
}

const CATEGORY_TABS: { id: 'semua' | KamusCategory; label: string }[] = [
  { id: 'semua', label: 'Semua Entri Teras' },
  { id: 'istilah', label: 'Istilah Sintaksis' },
  { id: 'kata-tugas', label: 'Kata Tugas & Pasangan Keliru' },
  { id: 'imbuhan', label: 'Kata Kerja & Pengimbuhan' },
];

export const KamusDewanView: React.FC<KamusDewanViewProps> = ({
  onAnalyzeInTree,
}) => {
  const [filterCat, setFilterCat] = useState<'semua' | KamusCategory>('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [entries, setEntries] = useState<KamusEntry[]>(CURATED_KAMUS_ENTRIES);
  const [activeEntry, setActiveEntry] = useState<KamusEntry>(
    CURATED_KAMUS_ENTRIES[0],
  );
  const [isSearching, setIsSearching] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const visibleEntries = entries.filter((entry) =>
    filterCat === 'semua' ? true : entry.category === filterCat,
  );

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setErrorMsg('Sila masukkan kata dasar, istilah, atau pasangan kata untuk dirujuk.');
      return;
    }

    // Check if an exact curated match already exists first
    const existing = entries.find(
      (item) => item.kata.toLowerCase() === trimmed.toLowerCase(),
    );
    if (existing) {
      setActiveEntry(existing);
      setErrorMsg(null);
      return;
    }

    setIsSearching(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/kamus/cari', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal merujuk entri kamus.');
      }
      const newEntry = data as KamusEntry;
      setEntries((prev) => [newEntry, ...prev]);
      setActiveEntry(newEntry);
      setFilterCat('semua');
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Ralat rangkaian semasa merujuk Kamus Dewan Edisi Keempat.',
      );
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500">
              Rujukan Leksikal & Ejaan Piawai · Kamus Dewan Edisi Keempat (DBP)
            </p>
            <h1 className="text-2xl font-semibold text-slate-900">
              Kamus Dewan Edisi Keempat & Peranan Sintaksis
            </h1>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterCat(tab.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  filterCat === tab.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSearch}
          className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3"
        >
          <div className="flex-1">
            <label htmlFor="kamus-search-input" className="sr-only">
              Cari kata atau istilah dalam Kamus Dewan Edisi Keempat
            </label>
            <input
              id="kamus-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kata dasar, imbuhan, atau pasangan keliru (cth: beransur, antara vs di antara, memperisteri, kelewahan)…"
              className="w-full h-10 px-3.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="h-10 px-5 inline-flex items-center justify-center gap-2 text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 disabled:opacity-60 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {isSearching ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Merujuk Kamus…</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Cari Entri</span>
              </>
            )}
          </button>
        </form>
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

      {/* Split View: Entry Index (Left) + Detailed Kamus Dewan Card (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <aside className="lg:col-span-4 bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Senarai Kata Entri</span>
            <span className="tabular-nums">{visibleEntries.length} entri</span>
          </div>
          <div className="divide-y divide-slate-100 max-h-[560px] overflow-y-auto">
            {visibleEntries.map((item) => {
              const isSelected = activeEntry.id === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveEntry(item)}
                  className={`w-full text-left px-4 py-3.5 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/70'
                      : 'bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display text-base font-semibold text-slate-900">
                      {item.kata}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      {item.source === 'ai' ? 'Carian' : 'Teras'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 truncate">
                    {item.golonganKata}
                  </p>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
          <div className="pb-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold text-blue-800">{activeEntry.golonganKata}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono">/{activeEntry.sebutan}/</span>
                <span aria-hidden="true">·</span>
                <span>Kamus Dewan Edisi Keempat</span>
              </div>
              <h2 className="font-display text-3xl font-semibold text-slate-900">
                {activeEntry.kata}
              </h2>
              <p className="text-xs text-slate-600">
                Ejaan piawai: <span className="font-semibold text-slate-900">{activeEntry.ejaanBaku}</span>
              </p>
            </div>

            <button
              type="button"
              onClick={() => onAnalyzeInTree(activeEntry.contohAyat)}
              className="px-4 py-2 inline-flex items-center gap-2 text-xs font-medium text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 self-start sm:self-end cursor-pointer"
            >
              <span>Cerakinkan Contoh Ayat</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Takrifan Kamus Dewan */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-blue-800" />
              <span>Takrifan Leksikal</span>
            </h3>
            <ol className="space-y-2">
              {activeEntry.takrifan.map((def, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-sm text-slate-800 leading-relaxed"
                >
                  <span className="font-mono text-xs font-semibold text-slate-500 mt-0.5 tabular-nums">
                    {idx + 1}.
                  </span>
                  <span>{def}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Bentuk Terbitan */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-500">
              Bentuk Terbitan & Rangkaian Kata
            </h3>
            <p className="text-sm font-mono text-slate-800 leading-relaxed">
              {activeEntry.bentukTerbitan.join(' · ')}
            </p>
          </div>

          {/* Peranan Sintaksis */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1.5">
            <h3 className="text-xs font-semibold text-slate-600">
              Fungsi & Hukum Sintaksis (Tatabahasa Dewan Edisi Ketiga)
            </h3>
            <p className="text-sm text-slate-800 leading-relaxed">
              {activeEntry.perananSintaksis}
            </p>
          </div>

          {/* Contoh Ayat */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-semibold text-slate-500">
              Contoh Penggunaan dalam Ayat Gramatis
            </h3>
            <p className="font-display text-lg text-slate-900 leading-relaxed">
              “{activeEntry.contohAyat}”
            </p>
          </div>

          {/* Catatan Perbandingan */}
          {activeEntry.catatanPerbandingan && (
            <div className="pt-4 border-t border-slate-100 space-y-1">
              <h3 className="text-xs font-semibold text-amber-800">
                Catatan Kekeliruan Lazim Peperiksaan
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                {activeEntry.catatanPerbandingan}
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
