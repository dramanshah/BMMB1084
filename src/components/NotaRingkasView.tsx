import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { STUDY_TOPICS } from '../data/sintaksisCurriculum';
import type { TopicId } from '../types/sintaksis';

interface NotaRingkasViewProps {
  onStartTopicDrill: (topicId: Exclude<TopicId, 'semua'>) => void;
}

export const NotaRingkasView: React.FC<NotaRingkasViewProps> = ({
  onStartTopicDrill,
}) => {
  const [selectedId, setSelectedId] = useState<Exclude<TopicId, 'semua'>>(
    STUDY_TOPICS[0].id,
  );

  const activeTopic =
    STUDY_TOPICS.find((t) => t.id === selectedId) || STUDY_TOPICS[0];

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-500">
            Rujukan Teras · Tatabahasa Dewan Edisi Ketiga (Nik Safiah Karim et al.)
          </p>
          <h1 className="text-2xl font-semibold text-slate-900">
            Peta Konsep Sintaksis BMMB1084
          </h1>
        </div>

        {/* Topic Filter Buttons */}
        <div className="flex flex-wrap gap-2 pt-2">
          {STUDY_TOPICS.map((topic) => {
            const active = topic.id === activeTopic.id;
            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => setSelectedId(topic.id)}
                className={`px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-blue-800 text-white border-blue-800'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {topic.number}. {topic.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Topic Study Sheet */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="space-y-1.5 max-w-3xl">
            <p className="font-mono text-xs font-semibold text-blue-800">
              Topik {activeTopic.number} · {activeTopic.subtitle}
            </p>
            <h2 className="text-2xl font-semibold text-slate-900">
              {activeTopic.title}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed pt-1">
              {activeTopic.ringkasan}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onStartTopicDrill(activeTopic.id)}
            className="px-4 py-2.5 inline-flex items-center gap-2 text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 rounded-lg transition-colors whitespace-nowrap shrink-0 self-start sm:self-end cursor-pointer"
          >
            <span>Latih Topik Ini</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Key Concepts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeTopic.konsepUtama.map((item, idx) => (
            <div
              key={idx}
              className="border border-slate-200 rounded-xl p-5 space-y-3 bg-slate-50/40"
            >
              <h3 className="text-base font-semibold text-slate-900">
                {item.istilah}
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                {item.huraian}
              </p>
              <div className="pt-2 border-t border-slate-200/70">
                <p className="text-xs font-semibold text-slate-500 mb-1">
                  Contoh Binaan
                </p>
                <p className="text-sm font-medium text-slate-900 leading-relaxed">
                  {item.contoh}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Exam Traps */}
        <div className="pt-6 border-t border-slate-100 space-y-3">
          <h3 className="text-sm font-semibold text-slate-900">
            Perangkap Lazim Peperiksaan Akhir (Aras C5)
          </h3>
          <ul className="space-y-2.5">
            {activeTopic.perangkapPeperiksaan.map((trap, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-sm text-slate-700 leading-relaxed"
              >
                <span className="font-mono text-xs font-semibold text-amber-700 mt-0.5 tabular-nums">
                  {String(i + 1).padStart(2, '0')}.
                </span>
                <span>{trap}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
