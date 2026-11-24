/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useState } from 'react';
import { KamusDewanView } from './components/KamusDewanView';
import { KlinikKegramatisanView } from './components/KlinikKegramatisanView';
import { LatihTubiView } from './components/LatihTubiView';
import { NotaRingkasView } from './components/NotaRingkasView';
import { RajahPohonView } from './components/RajahPohonView';
import type { TopicId } from './types/sintaksis';

type WorkspaceTab =
  | 'latih-tubi'
  | 'rajah-pohon'
  | 'klinik-kegramatisan'
  | 'nota-ringkas'
  | 'kamus-dewan';

const NAV_ITEMS: { id: WorkspaceTab; label: string }[] = [
  { id: 'latih-tubi', label: 'Latih Tubi' },
  { id: 'rajah-pohon', label: 'Rajah Pohon' },
  { id: 'klinik-kegramatisan', label: 'Klinik Kegramatisan' },
  { id: 'nota-ringkas', label: 'Nota Ringkas' },
  { id: 'kamus-dewan', label: 'Kamus Dewan' },
];

const STATS_STORAGE_KEY = 'bmmb1084_sintaksis_stats';

export default function App() {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('latih-tubi');
  const [selectedTopic, setSelectedTopic] = useState<TopicId>('semua');
  const [pendingTreeSentence, setPendingTreeSentence] = useState<string | null>(null);
  const [sessionStats, setSessionStats] = useState<{
    answered: number;
    earned: number;
    possible: number;
  }>(() => {
    try {
      const saved = localStorage.getItem(STATS_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore storage read errors
    }
    return { answered: 0, earned: 0, possible: 0 };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(sessionStats));
    } catch {
      // ignore storage write errors
    }
  }, [sessionStats]);

  const handleRecordResult = (earned: number, possible: number) => {
    setSessionStats((prev) => ({
      answered: prev.answered + 1,
      earned: prev.earned + earned,
      possible: prev.possible + possible,
    }));
  };

  const handleQuickChallenge = () => {
    setSelectedTopic('semua');
    setActiveTab('latih-tubi');
  };

  const handleStartTopicDrill = (topicId: Exclude<TopicId, 'semua'>) => {
    setSelectedTopic(topicId);
    setActiveTab('latih-tubi');
  };

  const handleAnalyzeInTree = (sentence: string) => {
    setPendingTreeSentence(sentence);
    setActiveTab('rajah-pohon');
  };

  const handleConsumedInitialSentence = useCallback(() => {
    setPendingTreeSentence(null);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-[1360px] mx-auto px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('latih-tubi');
            }}
            className="font-display text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
          >
            BMMB1084 Sintaksis
          </a>

          {/* Zone 2: 4 concise single-line text navigation links */}
          <nav
            aria-label="Navigasi utama"
            className="hidden md:flex items-center gap-6 text-sm font-medium"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`py-5 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'border-blue-800 text-slate-900 font-semibold'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={handleQuickChallenge}
              className="px-4 py-2 text-xs font-medium text-white bg-blue-800 hover:bg-blue-900 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Uji Minda C5
            </button>
          </div>
        </div>

        {/* Mobile navigation row */}
        <nav
          aria-label="Navigasi mudah alih"
          className="md:hidden border-t border-slate-100 px-4 flex items-center gap-4 overflow-x-auto"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`py-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'border-blue-800 text-slate-900 font-semibold'
                    : 'border-transparent text-slate-600'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </header>

      {/* Main Content */}
      <main id="top" className="flex-1 w-full max-w-[1360px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'latih-tubi' && (
          <LatihTubiView
            selectedTopic={selectedTopic}
            onSelectTopic={setSelectedTopic}
            sessionStats={sessionStats}
            onRecordResult={handleRecordResult}
          />
        )}

        {activeTab === 'rajah-pohon' && (
          <RajahPohonView
            initialSentence={pendingTreeSentence}
            onConsumedInitialSentence={handleConsumedInitialSentence}
          />
        )}

        {activeTab === 'klinik-kegramatisan' && <KlinikKegramatisanView />}

        {activeTab === 'nota-ringkas' && (
          <NotaRingkasView onStartTopicDrill={handleStartTopicDrill} />
        )}

        {activeTab === 'kamus-dewan' && (
          <KamusDewanView onAnalyzeInTree={handleAnalyzeInTree} />
        )}
      </main>

      {/* Clean Quiet Footer */}
      <footer className="border-t border-slate-200 bg-white mt-8">
        <div className="max-w-[1360px] mx-auto px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-500">
          <p>
            Persediaan Peperiksaan Akhir IPG · BMMB1084: Asas Tatabahasa Bahasa Melayu (Tatabahasa Dewan Edisi Ketiga & Kamus Dewan Edisi Keempat)
          </p>
          <button
            type="button"
            onClick={() => setSessionStats({ answered: 0, earned: 0, possible: 0 })}
            className="text-slate-600 hover:text-slate-900 underline underline-offset-4 cursor-pointer"
          >
            Set Semula Skor Sesi
          </button>
        </div>
      </footer>
    </div>
  );
}
