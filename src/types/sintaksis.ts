export type TopicId =
  | 'semua'
  | 'frasa'
  | 'klausa'
  | 'ayat-dasar'
  | 'jenis-ayat'
  | 'struktur-ragam'
  | 'ayat-majmuk'
  | 'kegramatisan';

export type QuestionFormat = 'objektif' | 'struktur' | 'analisis';

export interface SyntaxNode {
  id: string;
  label: string;
  role: string;
  category: 'A' | 'S' | 'P' | 'FN' | 'FK' | 'FA' | 'FS' | 'K' | 'KK' | 'KN' | 'KA' | 'KSN' | 'KH' | 'KB' | 'PEN' | 'LEK' | 'INTI' | 'PENERANG' | 'KLAUSA' | 'LAIN';
  words?: string;
  ruleNote: string;
  children?: SyntaxNode[];
}

export interface McqOption {
  key: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface DrillQuestion {
  id: string;
  topicId: Exclude<TopicId, 'semua'>;
  topicTitle: string;
  format: QuestionFormat;
  prompt: string;
  stimulusSentence?: string;
  options?: McqOption[];
  maxMarks: number;
  arahanTambahan?: string;
  source: 'kurasi' | 'ai';
}

export interface DrillEvaluation {
  betul: boolean;
  markah: number;
  markahMaksimum: number;
  statusLabel: 'TEPAT' | 'SEPARA TEPAT' | 'PERLU PEMBETULAN';
  ulasanPensyarah: string;
  puncaKesilapan: string | null;
  bimbinganLangkah: string[];
  jawapanContoh: string;
  kurunganBerlabel?: string;
  treeData?: SyntaxNode;
}

export interface FollowUpMessage {
  role: 'pelajar' | 'pensyarah';
  content: string;
}

export interface CerakinanRow {
  bahagian: string;
  frasa: string;
  kategori: string;
  huraian: string;
}

export interface TreeAnalysisResult {
  id: string;
  title: string;
  topicLabel: string;
  ayat: string;
  polaAyat: string;
  jenisAyat: string;
  ragamAyat: string;
  susunanAyat: string;
  statusGramatis: 'GRAMATIS' | 'TIDAK GRAMATIS';
  notaSintaksis: string;
  kurunganBerlabel: string;
  tree: SyntaxNode;
  cerakinanJadual: CerakinanRow[];
}

export type GrammarErrorCategory =
  | 'ayat-tergantung'
  | 'pasif'
  | 'kata-hubung'
  | 'kelewahan';

export interface GrammarCase {
  id: string;
  category: GrammarErrorCategory;
  categoryLabel: string;
  faultySentence: string;
  contextNote: string;
  source: 'kurasi' | 'ai';
}

export interface GrammarEvaluation {
  betul: boolean;
  markah: number;
  markahMaksimum: number;
  statusLabel: 'TEPAT' | 'SEPARA TEPAT' | 'PERLU PEMBETULAN';
  diagnosisPelajarTepat: boolean;
  ulasanPensyarah: string;
  puncaKesilapan: string;
  bimbinganLangkah: string[];
  ayatGramatis: string;
}

export interface StudyTopicSection {
  id: Exclude<TopicId, 'semua'>;
  number: string;
  title: string;
  subtitle: string;
  ringkasan: string;
  konsepUtama: {
    istilah: string;
    huraian: string;
    contoh: string;
  }[];
  perangkapPeperiksaan: string[];
}

export type KamusCategory = 'istilah' | 'kata-tugas' | 'imbuhan';

export interface KamusEntry {
  id: string;
  kata: string;
  ejaanBaku: string;
  sebutan: string;
  golonganKata: string;
  category: KamusCategory;
  takrifan: string[];
  bentukTerbitan: string[];
  perananSintaksis: string;
  contohAyat: string;
  catatanPerbandingan?: string;
  source: 'kurasi' | 'ai';
}

