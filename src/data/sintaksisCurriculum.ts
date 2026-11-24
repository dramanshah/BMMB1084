import type {
  DrillQuestion,
  GrammarCase,
  StudyTopicSection,
  TreeAnalysisResult,
} from '../types/sintaksis';

export const TOPIC_LABELS: Record<string, string> = {
  semua: 'Semua Topik (Campuran C5)',
  frasa: '1. Binaan Frasa',
  klausa: '2. Binaan Klausa',
  'ayat-dasar': '3. Ayat Dasar & Ayat Tunggal',
  'jenis-ayat': '4. Jenis Ayat',
  'struktur-ragam': '5. Struktur & Ragam Ayat',
  'ayat-majmuk': '6. Ayat Majmuk',
  kegramatisan: '7. Analisis Kegramatisan Sintaksis',
};

export const STUDY_TOPICS: StudyTopicSection[] = [
  {
    id: 'frasa',
    number: '01',
    title: 'Binaan Frasa',
    subtitle: 'FN, FK, FA, FS serta Hukum D-M dan kekecualiannya',
    ringkasan:
      'Frasa ialah binaan yang boleh terdiri daripada satu susunan kata atau satu patah kata yang berpotensi diperluas menjadi dua perkataan atau lebih dan mengisi fungsi subjek atau predikat.',
    konsepUtama: [
      {
        istilah: 'Frasa Nama (FN) & Hukum D-M',
        huraian:
          'Dalam binaan FN, unsur yang diterangkan (D — Inti) hadir dahulu, diikuti unsur yang menerangkan (M — Penerang). Kekecualian Hukum D-M berlaku apabila penerang mendahului inti bagi nama jawatan/gelaran atau kata bilangan.',
        contoh:
          'D-M: guru bahasa, sos cili, kedai buku · Kekecualian D-M: Perdana Menteri, Naib Canselor, ibu pejabat, lima orang pelajar.',
      },
      {
        istilah: 'Frasa Kerja (FK)',
        huraian:
          'FK terbahagi kepada FK tanpa objek (tak transitif: berpelengkap atau tanpa pelengkap) dan FK dengan objek (transitif: satu objek atau dua objek/objek tepat + objek sipi).',
        contoh:
          'Tak transitif berpelengkap: Dia menjadi guru. · Transitif dua objek: Ibu membelikan adik buku cerita.',
      },
      {
        istilah: 'Frasa Adjektif (FA)',
        huraian:
          'Berintikan kata adjektif dan boleh disertai kata penguat hadapan (terlalu, paling), belakang (sekali, benar), atau bebas (amat, sangat, sungguh).',
        contoh:
          'Sungai itu amat dalam sekali. · Bangunan baharu itu sangat tinggi.',
      },
      {
        istilah: 'Frasa Sendi Nama (FS)',
        huraian:
          'Terbentuk daripada satu kata sendi nama (di, ke, dari, daripada, pada, kepada, untuk, tentang, dengan) diikuti oleh FN. Kata arah dan kata bantu boleh hadir secara pilihan.',
        contoh:
          'di dalam bilik kuliah · daripada kayu jati · ke selatan semenanjung.',
      },
    ],
    perangkapPeperiksaan: [
      'Membezakan pelengkap (wajib hadir selepas KK tak transitif seperti "tinggal di kampung", "beransur pulih") dengan objek (boleh dipasifkan selepas KK transitif).',
      'Mengenal pasti frasa yang melanggar Hukum D-M secara salah seperti "Mini Market" (sepatutnya Pasar Mini) berbanding kekecualian yang diiktiraf seperti "Perdana Menteri".',
      'Tidak menggabungkan kata penguat hadapan "paling" atau "ter-" dengan kata penguat belakang "sekali" dalam satu binaan (*paling tertinggi sekali — tidak gramatis).',
    ],
  },
  {
    id: 'klausa',
    number: '02',
    title: 'Binaan Klausa',
    subtitle: 'Klausa bebas, klausa tak bebas, dan fungsinya dalam ayat majmuk',
    ringkasan:
      'Klausa ialah satu unit rangkaian perkataan yang mengandungi subjek dan predikat serta menjadi konstituen kepada ayat.',
    konsepUtama: [
      {
        istilah: 'Klausa Bebas (Klausa Utama)',
        huraian:
          'Klausa yang boleh berdiri sendiri sebagai satu ayat yang lengkap apabila diucapkan dengan intonasi yang sempurna.',
        contoh: 'Pelajar itu membaca buku di perpustakaan.',
      },
      {
        istilah: 'Klausa Tak Bebas (Klausa Kecil)',
        huraian:
          'Klausa yang tidak dapat berdiri sendiri dan dipancangkan ke dalam klausa utama menggunakan kata hubung pancangan (yang, bahawa, untuk, kerana, apabila, jika).',
        contoh:
          '...yang memenangi anugerah itu · ...bahawa peperiksaan akan bermula minggu hadapan.',
      },
      {
        istilah: 'Fungsi Klausa dalam Ayat Majmuk',
        huraian:
          'Klausa tak bebas berfungsi sebagai klausa relatif (menerangkan FN), klausa komplemen (pelengkap kepada KK/FN), atau klausa keterangan (menerangkan KK dari segi waktu, syarat, sebab, dll.).',
        contoh:
          'Komplemen Subjek: Bahawa dia bersalah adalah jelas. · Keterangan Waktu: Ketika hujan turun, kami berteduh.',
      },
    ],
    perangkapPeperiksaan: [
      'Menghasilkan ayat tergantung apabila hanya menulis klausa tak bebas tanpa klausa bebas (contoh: *"Kerana hujan lebat sejak pagi tadi."*).',
      'Keliru antara fungsi "untuk" sebagai kata sendi nama (diikuti FN: untuk ibu) dengan kata hubung pancangan komplemen/keterangan tujuan (diikuti klausa/FK).',
    ],
  },
  {
    id: 'ayat-dasar',
    number: '03',
    title: 'Ayat Dasar & Ayat Tunggal',
    subtitle: 'Perbezaan konsep dan empat pola ayat dasar bahasa Melayu',
    ringkasan:
      'Semua ayat dasar ialah ayat tunggal, tetapi tidak semua ayat tunggal ialah ayat dasar. Ayat dasar mestilah ayat penyata, aktif, susunan biasa, dan tiada unsur pengguguran.',
    konsepUtama: [
      {
        istilah: 'Pola 1: FN + FN',
        huraian: 'Subjek terdiri daripada Frasa Nama dan Predikat juga terdiri daripada Frasa Nama.',
        contoh: 'Encik Ahmad / pensyarah linguistik di IPG.',
      },
      {
        istilah: 'Pola 2: FN + FK',
        huraian: 'Subjek terdiri daripada Frasa Nama dan Predikat terdiri daripada Frasa Kerja.',
        contoh: 'Siswa pendidik itu / sedang menganalisis struktur ayat.',
      },
      {
        istilah: 'Pola 3: FN + FA',
        huraian: 'Subjek terdiri daripada Frasa Nama dan Predikat terdiri daripada Frasa Adjektif.',
        contoh: 'Huraian tatabahasa tersebut / amat jelas dan tepat.',
      },
      {
        istilah: 'Pola 4: FN + FS',
        huraian: 'Subjek terdiri daripada Frasa Nama dan Predikat terdiri daripada Frasa Sendi Nama.',
        contoh: 'Buku rujukan Tatabahasa Dewan itu / di atas meja pensyarah.',
      },
    ],
    perangkapPeperiksaan: [
      'Ayat songsang, ayat pasif, ayat tanya, ayat perintah, dan ayat seruan ialah AYAT TUNGGAL (jika satu klausa), BUKAN ayat dasar.',
      'Jika ayat dasar mengalami pengguguran subjek (seperti dalam ayat perintah "Keluar!"), ia masih ayat tunggal tetapi bukan ayat dasar.',
    ],
  },
  {
    id: 'jenis-ayat',
    number: '04',
    title: 'Jenis Ayat',
    subtitle: 'Ayat penyata, ayat tanya, ayat perintah, dan ayat seruan',
    ringkasan:
      'Penggolongan ayat berdasarkan intonasi dan tujuan ujaran dalam komunikasi rasmi serta wacana akademik.',
    konsepUtama: [
      {
        istilah: 'Ayat Penyata',
        huraian: 'Ayat yang diucapkan dengan maksud membuat sesuatu pernyataan atau memberikan keterangan.',
        contoh: 'Kursus BMMB1084 membincangkan morfologi dan sintaksis bahasa Melayu.',
      },
      {
        istilah: 'Ayat Tanya',
        huraian:
          'Terbahagi kepada ayat tanya tanpa kata tanya (menggunakan intonasi menaik atau partikel -kah pada unsur yang dikedepankan) dan ayat tanya dengan kata tanya (apa, siapa, mana, bila, bagaimana, mengapa). Boleh bersifat terbuka atau tertutup (jawapan ya/tidak).',
        contoh:
          'Tertutup: Sudahkah anda menyiapkan tugasan itu? · Terbuka: Apakah perbezaan antara pelengkap dengan objek?',
      },
      {
        istilah: 'Ayat Perintah (4 Subjenis)',
        huraian:
          'Terdiri daripada ayat suruhan (memberi arahan), larangan (kata larangan jangan/usah), silaan (jemput/sila), dan permintaan (minta/tolong).',
        contoh:
          'Suruhan: Tulis jawapan dengan kemas. · Larangan: Jangan bising di dalam dewan peperiksaan. · Silaan: Sila masuk ke makmal bahasa. · Permintaan: Tolong serahkan kertas jawapan anda.',
      },
      {
        istilah: 'Ayat Seruan',
        huraian:
          'Ayat yang diucapkan dengan nada atau intonasi seru untuk melahirkan perasaan (terkejut, kagum, geram, sedih), lazimnya menggunakan kata seru dan diakhiri tanda seru (!).',
        contoh: 'Wah, sungguh kemas rajah pohon sintaksis yang kamu lukis!',
      },
    ],
    perangkapPeperiksaan: [
      'Dalam bahasa tulisan rasmi, kata tanya yang hadir di hadapan ayat MESTI disertai partikel -kah (contoh: "Siapakah pengerusi majlis itu?", bukan *"Siapa pengerusi majlis itu?").',
      'Penggunaan partikel -lah dalam ayat perintah berfungsi melembutkan perintah, bukan menukarnya menjadi ayat penyata.',
    ],
  },
  {
    id: 'struktur-ragam',
    number: '05',
    title: 'Struktur & Ragam Ayat',
    subtitle: 'Susunan biasa vs songsang dan ragam ayat aktif vs pasif',
    ringkasan:
      'Menganalisis proses transformasi susunan konstituen (pendepanan) serta pertukaran ragam antara aktif dengan pasif mengikut hukum kata ganti nama diri.',
    konsepUtama: [
      {
        istilah: 'Ayat Songsang (Pendepanan Seluruh Predikat)',
        huraian: 'Seluruh konstituen predikat dikedepankan mendahului subjek.',
        contoh: 'Sungguh merdu nyanyian pelajar itu. (Asal: Pelajar itu / sungguh merdu nyanyiannya → atau: Merdu sungguh suara penyanyi itu.)',
      },
      {
        istilah: 'Ayat Songsang (Pendepanan Sebahagian Predikat)',
        huraian:
          'Hanya sebahagian daripada predikat — sama ada frasa kerja, frasa adjektif, atau frasa sendi nama — yang dibawa ke hadapan subjek.',
        contoh:
          'Pendepanan FK: Sedang membaca buku / pelajar itu. · Pendepanan FA: Amat cemerlang / pencapaiannya dalam ujian. · Pendepanan FS: Di dewan kuliah / mahasiswa berkumpul.',
      },
      {
        istilah: 'Ayat Pasif KGND Pertama & Kedua',
        huraian:
          'Kata ganti nama diri pertama (saya, aku, kami, kita) dan kedua (awak, anda, kamu, engkau) hadir SEBELUM kata kerja pasif tanpa imbuhan meN- atau di-. Tiada kata lain boleh menyisip di antara KGND dengan kata kerja.',
        contoh: 'Gramatis: Tugas itu telah saya selesaikan. · Salah: *Tugas itu saya telah selesaikan. / *Tugas itu disiapkan oleh saya.',
      },
      {
        istilah: 'Ayat Pasif KGND Ketiga, Ber-, Ter-, Ke-...-an & "Kena"',
        huraian:
          'KGND ketiga (dia, beliau, mereka, nama khas) menggunakan imbuhan pasif di-... (oleh). Binaan lain termasuk imbuhan ber- (Surat itu belum berbalas), ter- (Pintu itu terbuka), ke-...-an (Dia kehujanan), dan kata bantu pasif "kena" (Pencuri itu kena tangkap).',
        contoh: 'Rancangan pengajaran itu disediakan oleh guru pelatih.',
      },
    ],
    perangkapPeperiksaan: [
      'Kesalahan paling kerap: menyisipkan kata bantu (telah, sedang, mesti, akan) antara KGND 1/2 dengan kata kerja dasar (*Buku itu awak mesti baca → mesti: Buku itu mesti awak baca).',
      'Menggunakan imbuhan "di-... oleh" dengan KGND pertama/kedua (*ditulis oleh kami → sepatutnya kami tulis).',
    ],
  },
  {
    id: 'ayat-majmuk',
    number: '06',
    title: 'Ayat Majmuk',
    subtitle: 'Gabungan, pancangan (relatif, komplemen, keterangan), dan campuran',
    ringkasan:
      'Ayat yang terhasil daripada cantuman dua atau lebih ayat tunggal melalui proses penggabungan, pemancangan, atau percampuran.',
    konsepUtama: [
      {
        istilah: 'Ayat Majmuk Gabungan',
        huraian:
          'Menggabungkan dua atau lebih klausa bebas yang setara kedudukannya dengan kata hubung gabungan seperti dan, atau, tetapi, lalu, serta, sambil.',
        contoh: 'Ahmad membaca nota sintaksis manakala adiknya membuat latihan morfologi.',
      },
      {
        istilah: 'Ayat Majmuk Pancangan Relatif',
        huraian:
          'Menggunakan kata hubung relatif "yang" untuk memancangkan klausa kecil sebagai penerang kepada frasa nama dalam klausa utama.',
        contoh: 'Pelajar yang tekun mengulang kaji itu lulus dengan cemerlang.',
      },
      {
        istilah: 'Ayat Majmuk Pancangan Komplemen',
        huraian:
          'Klausa kecil dipancangkan sebagai pelengkap kepada kata kerja atau frasa nama menggunakan kata hubung komplemen "bahawa" dan "untuk".',
        contoh: 'Pensyarah menegaskan bahawa penguasaan sintaksis sangat penting.',
      },
      {
        istilah: 'Ayat Majmuk Pancangan Keterangan (9 Jenis)',
        huraian:
          'Klausa kecil berfungsi sebagai keterangan kepada kata kerja induk: musabab (kerana, sebab), akibat (hingga, sehingga), syarat (jika, jikalau, sekiranya), waktu (ketika, apabila, semasa), pertentangan (walaupun, meskipun), harapan (agar, supaya), cara (dengan), tujuan (untuk, demi, bagi), dan perbandingan (seperti, bagai, seolah-olah).',
        contoh: 'Keterangan Syarat: Sekiranya anda berlatih setiap hari, penguasaan sintaksis akan meningkat.',
      },
      {
        istilah: 'Ayat Majmuk Campuran',
        huraian:
          'Mengandungi lebih daripada satu jenis ayat majmuk — lazimnya gabungan antara ayat majmuk gabungan dengan ayat majmuk pancangan.',
        contoh:
          'Siswa pendidik yang rajin itu sentiasa bertanya kepada pensyarah dan mencatat setiap penjelasan yang diberikan.',
      },
    ],
    perangkapPeperiksaan: [
      'Membezakan "untuk" sebagai komplemen subjek/objek dengan "untuk" sebagai keterangan tujuan.',
      'Mengenal pasti ayat majmuk campuran dengan mengesan sekurang-kurangnya DUA jenis kata hubung berbeza (contoh: "yang" [pancangan relatif] + "dan" [gabungan]).',
    ],
  },
  {
    id: 'kegramatisan',
    number: '07',
    title: 'Analisis Kegramatisan Sintaksis',
    subtitle: 'Mengesan dan membetulkan ayat tergantung, kesalahan pasif, kata hubung, dan kelewahan',
    ringkasan:
      'Kemahiran aras penilaian (C5) untuk menilai ketepatan struktur sintaksis sesuatu ayat berdasarkan hukum Tatabahasa Dewan dan mengemukakan pembetulan yang gramatis.',
    konsepUtama: [
      {
        istilah: 'Ayat Tergantung (Tiada Subjek atau Tiada Predikat)',
        huraian:
          'Berlaku apabila subjek ayat didahului kata sendi nama (di, dalam, kepada, bagi, untuk) atau apabila ayat hanya mengandungi klausa tak bebas tanpa klausa utama.',
        contoh:
          'Salah: *Di dalam mesyuarat itu membincangkan masalah disiplin. · Betul: Mesyuarat itu membincangkan masalah disiplin. / Di dalam mesyuarat itu, mereka membincangkan masalah disiplin.',
      },
      {
        istilah: 'Kesalahan Ayat Pasif',
        huraian:
          'Melibatkan pertukaran struktur pasif KGND 1/2 dengan KGND 3 atau sisipan kata bantu di antara KGND 1/2 dengan kata kerja.',
        contoh:
          'Salah: *Laporan kajian itu kami akan bentangkan esok. · Betul: Laporan kajian itu akan kami bentangkan esok.',
      },
      {
        istilah: 'Kesalahan Kata Hubung',
        huraian:
          'Penggunaan kata tanya "bila" sebagai kata hubung waktu (sepatutnya "apabila"), penggunaan "di mana" atau "yang mana" sebagai kata hubung relatif (pengaruh bahasa Inggeris), atau pasangan kata hubung tidak tepat.',
        contoh:
          'Salah: *Dewan di mana majlis itu diadakan sangat luas. · Betul: Dewan tempat majlis itu diadakan sangat luas.',
      },
      {
        istilah: 'Kelewahan Bahasa',
        huraian:
          'Penggunaan unsur yang berlebih-lebihan atau bertindih maknanya seperti penggandaan selepas kata bilangan jamak, penggunaan dua kata penguat serentak, atau gabungan kata sendi/kata hubung sinonim.',
        contoh:
          'Salah: *semua pelajar-pelajar, *saling bantu-membantu, *demi untuk, *amat besar sekali. · Betul: semua pelajar, saling membantu / bantu-membantu, demi / untuk, amat besar / besar sekali.',
      },
    ],
    perangkapPeperiksaan: [
      'Jangan membaiki ayat dengan hanya menukar maknanya — kekalkan maksud asal penulis sambil memulihkan struktur Subjek + Predikat yang gramatis.',
      'Sentiasa nyatakan PUNCA KESALAHAN dengan istilah sintaksis yang tepat (contoh: "ketiadaan subjek akibat kehadiran kata sendi nama di pangkal ayat", bukan sekadar "ayat bunyi pelik").',
    ],
  },
];

export const CURATED_QUESTIONS: DrillQuestion[] = [
  {
    id: 'q-frasa-1',
    topicId: 'frasa',
    topicTitle: '1. Binaan Frasa',
    format: 'objektif',
    prompt:
      'Antara frasa nama berikut, yang manakah menepati kekecualian Hukum D-M yang diiktiraf dalam Tatabahasa Dewan Edisi Ketiga?',
    options: [
      { key: 'A', text: 'Ali Restoran dan Kafe' },
      { key: 'B', text: 'Timbalan Pengarah Pendidikan' },
      { key: 'C', text: 'Klinik Pergigian Damai' },
      { key: 'D', text: 'Goreng Pisang Panas' },
    ],
    maxMarks: 2,
    source: 'kurasi',
  },
  {
    id: 'q-struktur-1',
    topicId: 'struktur-ragam',
    topicTitle: '5. Struktur & Ragam Ayat',
    format: 'objektif',
    prompt:
      'Pilih ayat pasif yang paling gramatis bagi pelaku kata ganti nama diri pertama dan kedua.',
    options: [
      { key: 'A', text: 'Kertas kerja penyelidikan itu telah disiapkan oleh kami semalam.' },
      { key: 'B', text: 'Tugasan sintaksis tersebut anda perlu hantar sebelum hari Jumaat.' },
      { key: 'C', text: 'Cadangan penambahbaikan kurikulum itu akan saya kemukakan dalam mesyuarat.' },
      { key: 'D', text: 'Soalan peperiksaan tahun lepas belum dijawab oleh awak lagi.' },
    ],
    maxMarks: 2,
    source: 'kurasi',
  },
  {
    id: 'q-dasar-1',
    topicId: 'ayat-dasar',
    topicTitle: '3. Ayat Dasar & Ayat Tunggal',
    format: 'struktur',
    stimulusSentence: 'Di dalam bilik darjah yang luas itu, murid-murid sedang melukis.',
    prompt:
      'Nilaikan sama ada ayat di atas boleh dikategorikan sebagai ayat dasar atau ayat tunggal. Berikan DUA hujah sintaksis berdasarkan ciri ayat dasar dan pola ayat dasar dalam Tatabahasa Dewan.',
    maxMarks: 6,
    arahanTambahan: 'Nyatakan kategori ayat, susunan ayat, dan justifikasi pola yang terlibat.',
    source: 'kurasi',
  },
  {
    id: 'q-majmuk-1',
    topicId: 'ayat-majmuk',
    topicTitle: '6. Ayat Majmuk',
    format: 'analisis',
    stimulusSentence:
      'Pelajar yang tekun mengulang kaji nota itu telah berjaya dalam peperiksaan walaupun dia menghadapi pelbagai cabaran.',
    prompt:
      'Cerakinkan ayat majmuk di atas kepada klausa-klausanya, kenal pasti jenis ayat majmuk tersebut, dan nyatakan fungsi setiap klausa tak bebas yang terlibat.',
    maxMarks: 8,
    arahanTambahan:
      'Nyatakan Klausa Utama, setiap Klausa Kecil (beserta kata hubung dan jenis pancangannya), serta kesimpulan jenis ayat majmuk.',
    source: 'kurasi',
  },
  {
    id: 'q-kegramatisan-1',
    topicId: 'kegramatisan',
    topicTitle: '7. Analisis Kegramatisan Sintaksis',
    format: 'struktur',
    stimulusSentence:
      'Menurut kajian yang dijalankan menunjukkan bahawa semua guru-guru pelatih perlu menguasai aspek sintaksis.',
    prompt:
      'Kenal pasti DUA kesalahan sintaksis dalam ayat di atas, jelaskan punca ketidakgramatisan setiap satunya menggunakan istilah Tatabahasa Dewan, dan tulis semula ayat tersebut supaya gramatis.',
    maxMarks: 6,
    source: 'kurasi',
  },
];

export const CURATED_TREES: TreeAnalysisResult[] = [
  {
    id: 'tree-1',
    title: 'Pola FN + FK Transitif (Susunan Biasa)',
    topicLabel: 'Topik 3 · Ayat Dasar & Binaan Frasa',
    ayat: 'Guru Bahasa Melayu itu sedang mengajar sintaksis.',
    polaAyat: 'Pola 2: Frasa Nama (FN) + Frasa Kerja (FK)',
    jenisAyat: 'Ayat Penyata',
    ragamAyat: 'Ayat Aktif Transitif',
    susunanAyat: 'Susunan Biasa (Subjek + Predikat)',
    statusGramatis: 'GRAMATIS',
    notaSintaksis:
      'Ayat ini menepati ciri ayat dasar (ayat tunggal, penyata, aktif, susunan biasa). Subjek FN mematuhi Hukum D-M ("Guru" sebagai inti diterangkan oleh "Bahasa Melayu") diikuti penentu belakang "itu". Predikat FK mengandungi kata bantu aspek "sedang", kata kerja transitif "mengajar", dan objek FN "sintaksis".',
    kurunganBerlabel:
      '[A [S [FN [INTI Guru] [PENERANG Bahasa Melayu] [PEN itu]]] [P [FK [KB sedang] [KK mengajar] [FN [INTI sintaksis]]]]]',
    cerakinanJadual: [
      { bahagian: 'Subjek', frasa: 'Guru Bahasa Melayu itu', kategori: 'FN', huraian: 'Inti (Guru) + Penerang Nama (Bahasa Melayu) + Penentu Belakang (itu)' },
      { bahagian: 'Predikat', frasa: 'sedang mengajar sintaksis', kategori: 'FK', huraian: 'Kata Bantu Aspek (sedang) + KK Transitif (mengajar) + Objek FN (sintaksis)' },
    ],
    tree: {
      id: 'n-root',
      label: 'A (Ayat)',
      role: 'Ayat Dasar · Pola FN + FK',
      category: 'A',
      ruleNote: 'Ayat induk terbahagi kepada dua konstituen utama: Subjek (S) dan Predikat (P).',
      children: [
        {
          id: 'n-s',
          label: 'S (Subjek)',
          role: 'Konstituen Subjek',
          category: 'S',
          ruleNote: 'Subjek ayat bahasa Melayu sentiasa diisi oleh Frasa Nama (FN).',
          children: [
            {
              id: 'n-fn-s',
              label: 'FN',
              role: 'Frasa Nama',
              category: 'FN',
              ruleNote: 'Mematuhi Hukum D-M: Inti mendahului Penerang, diikuti Penentu Belakang.',
              children: [
                { id: 'n-inti1', label: 'Inti (KN)', role: 'Kata Nama Am', category: 'INTI', words: 'Guru', ruleNote: 'Unsur diterangkan (D) bagi frasa nama subjek.' },
                { id: 'n-pen1', label: 'Penerang (FN)', role: 'Penerang Jenis', category: 'PENERANG', words: 'Bahasa Melayu', ruleNote: 'Unsur menerangkan (M) yang mengkhususkan jenis guru.' },
                { id: 'n-det1', label: 'Penentu', role: 'Kata Penentu Belakang', category: 'PEN', words: 'itu', ruleNote: 'Kata tunjuk "itu" sentiasa hadir di hujung binaan FN.' },
              ],
            },
          ],
        },
        {
          id: 'n-p',
          label: 'P (Predikat)',
          role: 'Konstituen Predikat',
          category: 'P',
          ruleNote: 'Predikat diisi oleh Frasa Kerja Transitif.',
          children: [
            {
              id: 'n-fk-p',
              label: 'FK',
              role: 'Frasa Kerja Transitif',
              category: 'FK',
              ruleNote: 'Mengandungi kata bantu, kata kerja berawalan meN-, dan objek FN.',
              children: [
                { id: 'n-kb', label: 'KB', role: 'Kata Bantu Aspek', category: 'KB', words: 'sedang', ruleNote: 'Menunjukkan perbuatan sedang berlaku.' },
                { id: 'n-kk', label: 'KK Transitif', role: 'Kata Kerja Transitif', category: 'KK', words: 'mengajar', ruleNote: 'Memerlukan objek secara langsung dan boleh dipasifkan.' },
                {
                  id: 'n-obj',
                  label: 'FN (Objek)',
                  role: 'Objek Tepat',
                  category: 'FN',
                  words: 'sintaksis',
                  ruleNote: 'Frasa nama yang menjadi sasaran langsung kata kerja transitif.',
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: 'tree-2',
    title: 'Ayat Songsang (Pendepanan Frasa Sendi Nama)',
    topicLabel: 'Topik 5 · Struktur & Ragam Ayat',
    ayat: 'Di perpustakaan universiti pelajar cemerlang itu mengulang kaji.',
    polaAyat: 'Terbitan daripada FN + FK (dengan keterangan tempat)',
    jenisAyat: 'Ayat Penyata',
    ragamAyat: 'Ayat Aktif Tak Transitif',
    susunanAyat: 'Susunan Songsang (Pendepanan Sebahagian Predikat — FS)',
    statusGramatis: 'GRAMATIS',
    notaSintaksis:
      'Frasa sendi nama "di perpustakaan universiti" yang asalnya berfungsi sebagai unsur keterangan dalam predikat telah dikedepankan ke pangkal ayat untuk penegasan tempat (pendepanan sebahagian predikat).',
    kurunganBerlabel:
      '[A [Keterangan-FS [KSN Di] [FN [INTI perpustakaan] [PENERANG universiti]]] [S [FN [INTI pelajar] [PENERANG-KA cemerlang] [PEN itu]]] [P [FK [KK mengulang kaji]]]]',
    cerakinanJadual: [
      { bahagian: 'Predikat (Dikedepankan)', frasa: 'Di perpustakaan universiti', kategori: 'FS', huraian: 'Kata Sendi Nama (Di) + FN (perpustakaan universiti)' },
      { bahagian: 'Subjek', frasa: 'pelajar cemerlang itu', kategori: 'FN', huraian: 'Inti (pelajar) + Penerang Adjektif (cemerlang) + Penentu (itu)' },
      { bahagian: 'Predikat (Baki)', frasa: 'mengulang kaji', kategori: 'FK', huraian: 'Kata Kerja Tak Transitif (mengulang kaji)' },
    ],
    tree: {
      id: 't2-root',
      label: 'A (Ayat Songsang)',
      role: 'Pendepanan Sebahagian Predikat',
      category: 'A',
      ruleNote: 'Unsur keterangan FS daripada predikat dibawa ke hadapan subjek.',
      children: [
        {
          id: 't2-p1',
          label: 'P1 (Dikedepankan)',
          role: 'Keterangan Tempat',
          category: 'P',
          ruleNote: 'Sebahagian daripada predikat yang mengalami proses pendepanan.',
          children: [
            {
              id: 't2-fs',
              label: 'FS',
              role: 'Frasa Sendi Nama',
              category: 'FS',
              ruleNote: 'Terdiri daripada KSN "Di" diikuti FN "perpustakaan universiti".',
              children: [
                { id: 't2-ksn', label: 'KSN', role: 'Kata Sendi Nama', category: 'KSN', words: 'Di', ruleNote: 'Menunjukkan tempat khusus.' },
                { id: 't2-fn1', label: 'FN', role: 'Frasa Nama', category: 'FN', words: 'perpustakaan universiti', ruleNote: 'Mematuhi Hukum D-M (Inti: perpustakaan, Penerang: universiti).' },
              ],
            },
          ],
        },
        {
          id: 't2-s',
          label: 'S (Subjek)',
          role: 'Konstituen Subjek',
          category: 'S',
          ruleNote: 'Subjek kekal hadir selepas unsur yang dikedepankan.',
          children: [
            {
              id: 't2-fn2',
              label: 'FN',
              role: 'Frasa Nama',
              category: 'FN',
              ruleNote: 'Binaan FN dengan penerang adjektif dan penentu belakang.',
              children: [
                { id: 't2-inti', label: 'Inti (KN)', role: 'Kata Nama', category: 'INTI', words: 'pelajar', ruleNote: 'Kata nama inti subjek.' },
                { id: 't2-pen', label: 'Penerang (KA)', role: 'Penerang Adjektif', category: 'PENERANG', words: 'cemerlang', ruleNote: 'Menerangkan sifat inti subjek.' },
                { id: 't2-det', label: 'Penentu', role: 'Kata Penentu', category: 'PEN', words: 'itu', ruleNote: 'Penentu belakang.' },
              ],
            },
          ],
        },
        {
          id: 't2-p2',
          label: 'P2 (Baki Predikat)',
          role: 'Frasa Kerja',
          category: 'P',
          ruleNote: 'Baki konstituen predikat selepas subjek.',
          children: [
            { id: 't2-fk', label: 'FK', role: 'Kata Kerja', category: 'FK', words: 'mengulang kaji', ruleNote: 'Kata kerja majmuk sebagai teras predikat.' },
          ],
        },
      ],
    },
  },
  {
    id: 'tree-3',
    title: 'Ayat Pasif KGND Pertama',
    topicLabel: 'Topik 5 · Ragam Ayat Pasif',
    ayat: 'Buku rujukan baharu itu telah saya beli.',
    polaAyat: 'Terbitan Pasif daripada FN + FK Transitif',
    jenisAyat: 'Ayat Penyata',
    ragamAyat: 'Ayat Pasif (KGND Pertama)',
    susunanAyat: 'Susunan Biasa (Subjek Terbitan + Predikat Pasif)',
    statusGramatis: 'GRAMATIS',
    notaSintaksis:
      'Dalam ayat pasif pelaku KGND pertama, objek asal ("buku rujukan baharu itu") menjadi subjek terbitan. Kata bantu aspek "telah" mesti hadir SEBELUM "saya beli" (tidak boleh menyisip di tengah-tengah frasa kerja pasif).',
    kurunganBerlabel:
      '[A [S [FN [INTI Buku] [PENERANG rujukan baharu] [PEN itu]]] [P [FK [KB telah] [KGND1 saya] [KK beli]]]]',
    cerakinanJadual: [
      { bahagian: 'Subjek Terbitan', frasa: 'Buku rujukan baharu itu', kategori: 'FN', huraian: 'Asalnya objek dalam ayat aktif' },
      { bahagian: 'Predikat Pasif', frasa: 'telah saya beli', kategori: 'FK (Pasif)', huraian: 'Kata bantu (telah) + KGND1 (saya) + KK Dasar tanpa imbuhan (beli)' },
    ],
    tree: {
      id: 't3-root',
      label: 'A (Ayat Pasif)',
      role: 'Ragam Pasif KGND Pertama',
      category: 'A',
      ruleNote: 'Subjek terbitan mendahului frasa kerja pasif tanpa imbuhan di-.',
      children: [
        {
          id: 't3-s',
          label: 'S (Subjek)',
          role: 'Subjek Terbitan',
          category: 'S',
          ruleNote: 'Berasal daripada objek dalam struktur aktif ("Saya telah membeli buku rujukan baharu itu").',
          children: [
            {
              id: 't3-fn',
              label: 'FN',
              role: 'Frasa Nama',
              category: 'FN',
              ruleNote: 'Inti "Buku" diterangkan oleh "rujukan" dan "baharu".',
              children: [
                { id: 't3-i', label: 'Inti', role: 'Kata Nama', category: 'INTI', words: 'Buku', ruleNote: 'Inti frasa nama.' },
                { id: 't3-p', label: 'Penerang', role: 'Penerang Majmuk', category: 'PENERANG', words: 'rujukan baharu', ruleNote: 'Menerangkan jenis dan sifat buku.' },
                { id: 't3-d', label: 'Penentu', role: 'Penentu Belakang', category: 'PEN', words: 'itu', ruleNote: 'Menentukan rujukan khusus.' },
              ],
            },
          ],
        },
        {
          id: 't3-p2',
          label: 'P (Predikat)',
          role: 'Frasa Kerja Pasif',
          category: 'P',
          ruleNote: 'Kata bantu wajib berada di hadapan gabungan KGND1 + KK dasar.',
          children: [
            {
              id: 't3-fk',
              label: 'FK (Pasif)',
              role: 'Binaan Pasif KGND 1',
              category: 'FK',
              ruleNote: 'Gabungan "saya beli" berfungsi sebagai satu kesatuan kata yang tidak boleh dipisahkan.',
              children: [
                { id: 't3-kb', label: 'KB', role: 'Kata Bantu Aspek', category: 'KB', words: 'telah', ruleNote: 'Hadir sebelum pelaku KGND pertama.' },
                { id: 't3-kgnd', label: 'KGND 1', role: 'Pelaku Pertama', category: 'FN', words: 'saya', ruleNote: 'Kata ganti nama diri pertama mendahului kata kerja dasar.' },
                { id: 't3-kk', label: 'KK Dasar', role: 'Kata Kerja Tanpa Awalan', category: 'KK', words: 'beli', ruleNote: 'Awalan meN- digugurkan dalam ragam pasif KGND 1/2.' },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: 'tree-4',
    title: 'Ayat Majmuk Pancangan Relatif',
    topicLabel: 'Topik 6 · Ayat Majmuk & Binaan Klausa',
    ayat: 'Pelajar yang rajin itu memenangi hadiah.',
    polaAyat: 'Ayat Majmuk Pancangan Relatif (Berteraskan FN + FK)',
    jenisAyat: 'Ayat Penyata',
    ragamAyat: 'Ayat Aktif Transitif',
    susunanAyat: 'Susunan Biasa',
    statusGramatis: 'GRAMATIS',
    notaSintaksis:
      'Klausa kecil "yang rajin" dipancangkan ke dalam FN subjek melalui kata hubung relatif "yang" bagi menerangkan inti "Pelajar". Klausa utama ialah "Pelajar itu memenangi hadiah".',
    kurunganBerlabel:
      '[A [S [FN [INTI Pelajar] [KLAUSA-REL [KH yang] [FA rajin]] [PEN itu]]] [P [FK [KK memenangi] [FN hadiah]]]]',
    cerakinanJadual: [
      { bahagian: 'Klausa Utama', frasa: 'Pelajar itu memenangi hadiah', kategori: 'Klausa Bebas', huraian: 'Boleh berdiri sendiri sebagai ayat lengkap' },
      { bahagian: 'Klausa Relatif', frasa: 'yang rajin', kategori: 'Klausa Tak Bebas', huraian: 'Dipancangkan dengan "yang" sebagai penerang kepada FN subjek' },
      { bahagian: 'Predikat', frasa: 'memenangi hadiah', kategori: 'FK', huraian: 'KK Transitif (memenangi) + Objek FN (hadiah)' },
    ],
    tree: {
      id: 't4-root',
      label: 'A (Ayat Majmuk)',
      role: 'Ayat Majmuk Pancangan Relatif',
      category: 'A',
      ruleNote: 'Mengandungi satu klausa bebas dan satu klausa relatif terpancang pada subjek.',
      children: [
        {
          id: 't4-s',
          label: 'S (Subjek)',
          role: 'Frasa Nama Terpancang',
          category: 'S',
          ruleNote: 'FN subjek mengandungi klausa relatif sebagai penerang.',
          children: [
            {
              id: 't4-fn',
              label: 'FN',
              role: 'Frasa Nama',
              category: 'FN',
              ruleNote: 'Inti "Pelajar" diperluas dengan klausa relatif.',
              children: [
                { id: 't4-inti', label: 'Inti', role: 'Kata Nama', category: 'INTI', words: 'Pelajar', ruleNote: 'Inti bagi binaan FN subjek.' },
                {
                  id: 't4-krel',
                  label: 'Klausa Relatif',
                  role: 'Klausa Tak Bebas',
                  category: 'KLAUSA',
                  ruleNote: 'Klausa kecil yang menerangkan "Pelajar".',
                  children: [
                    { id: 't4-kh', label: 'KH Relatif', role: 'Kata Hubung Relatif', category: 'KH', words: 'yang', ruleNote: 'Penanda pemancangan relatif.' },
                    { id: 't4-fa', label: 'FA', role: 'Frasa Adjektif', category: 'FA', words: 'rajin', ruleNote: 'Predikat bagi klausa relatif.' },
                  ],
                },
                { id: 't4-pen', label: 'Penentu', role: 'Penentu Belakang', category: 'PEN', words: 'itu', ruleNote: 'Penentu bagi keseluruhan FN subjek.' },
              ],
            },
          ],
        },
        {
          id: 't4-p',
          label: 'P (Predikat)',
          role: 'Frasa Kerja Transitif',
          category: 'P',
          ruleNote: 'Predikat bagi klausa utama.',
          children: [
            {
              id: 't4-fk',
              label: 'FK',
              role: 'Frasa Kerja',
              category: 'FK',
              ruleNote: 'Kata kerja transitif berapitan meN-...-i + objek.',
              children: [
                { id: 't4-kk', label: 'KK Transitif', role: 'Kata Kerja', category: 'KK', words: 'memenangi', ruleNote: 'Kata kerja transitif.' },
                { id: 't4-obj', label: 'FN (Objek)', role: 'Objek', category: 'FN', words: 'hadiah', ruleNote: 'Objek tepat.' },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: 'tree-5',
    title: 'Ayat Majmuk Pancangan Komplemen',
    topicLabel: 'Topik 6 · Ayat Majmuk Komplemen',
    ayat: 'Pensyarah menjelaskan bahawa sintaksis amat penting.',
    polaAyat: 'Ayat Majmuk Pancangan Komplemen Objek',
    jenisAyat: 'Ayat Penyata',
    ragamAyat: 'Ayat Aktif Transitif',
    susunanAyat: 'Susunan Biasa',
    statusGramatis: 'GRAMATIS',
    notaSintaksis:
      'Klausa komplemen "bahawa sintaksis amat penting" melengkapkan kata kerja transitif "menjelaskan". Tanpa klausa komplemen ini, binaan "Pensyarah menjelaskan" tidak sempurna.',
    kurunganBerlabel:
      '[A [S [FN Pensyarah]] [P [FK [KK menjelaskan] [KLAUSA-KOMP [KH bahawa] [S sintaksis] [P [FA amat penting]]]]]]',
    cerakinanJadual: [
      { bahagian: 'Subjek Utama', frasa: 'Pensyarah', kategori: 'FN', huraian: 'Kata nama am tunggal' },
      { bahagian: 'Kata Kerja Utama', frasa: 'menjelaskan', kategori: 'KK Transitif', huraian: 'Memerlukan komplemen sebagai pelengkap makna' },
      { bahagian: 'Klausa Komplemen', frasa: 'bahawa sintaksis amat penting', kategori: 'Klausa Tak Bebas', huraian: 'Dipancangkan oleh KH komplemen "bahawa"' },
    ],
    tree: {
      id: 't5-root',
      label: 'A (Ayat Majmuk)',
      role: 'Ayat Majmuk Pancangan Komplemen',
      category: 'A',
      ruleNote: 'Klausa kecil melengkapkan kata kerja transitif dalam klausa utama.',
      children: [
        {
          id: 't5-s',
          label: 'S (Subjek)',
          role: 'Frasa Nama',
          category: 'S',
          ruleNote: 'Subjek klausa induk.',
          children: [
            { id: 't5-fn', label: 'FN', role: 'Kata Nama', category: 'FN', words: 'Pensyarah', ruleNote: 'Kata nama tunggal.' },
          ],
        },
        {
          id: 't5-p',
          label: 'P (Predikat)',
          role: 'Frasa Kerja + Komplemen',
          category: 'P',
          ruleNote: 'Kata kerja transitif diikuti klausa komplemen.',
          children: [
            { id: 't5-kk', label: 'KK Transitif', role: 'Kata Kerja', category: 'KK', words: 'menjelaskan', ruleNote: 'KK induk.' },
            {
              id: 't5-komp',
              label: 'Klausa Komplemen',
              role: 'Pelengkap Kata Kerja',
              category: 'KLAUSA',
              ruleNote: 'Berfungsi mengisi slot objek/komplemen bagi "menjelaskan".',
              children: [
                { id: 't5-kh', label: 'KH Komplemen', role: 'Kata Hubung Komplemen', category: 'KH', words: 'bahawa', ruleNote: 'Penanda klausa komplemen.' },
                { id: 't5-ks', label: 'S (Klausa)', role: 'Frasa Nama', category: 'FN', words: 'sintaksis', ruleNote: 'Subjek dalam klausa komplemen.' },
                { id: 't5-kp', label: 'P (Klausa)', role: 'Frasa Adjektif', category: 'FA', words: 'amat penting', ruleNote: 'Kata penguat bebas "amat" + kata adjektif "penting".' },
              ],
            },
          ],
        },
      ],
    },
  },
];

export const CURATED_GRAMMAR_CASES: GrammarCase[] = [
  {
    id: 'gc-1',
    category: 'ayat-tergantung',
    categoryLabel: 'Ayat Tergantung',
    faultySentence: 'Di dalam pekeliling baharu itu menerangkan tatacara peperiksaan akhir IPG.',
    contextNote: 'Kesalahan lazim dalam penulisan wacana rasmi apabila kata sendi nama diletakkan di hadapan subjek.',
    source: 'kurasi',
  },
  {
    id: 'gc-2',
    category: 'pasif',
    categoryLabel: 'Kesalahan Ayat Pasif',
    faultySentence: 'Latihan pengukuhan sintaksis itu kamu perlu selesaikan pada petang ini juga.',
    contextNote: 'Melibatkan binaan ayat pasif kata ganti nama diri kedua dengan kehadiran kata bantu ragam.',
    source: 'kurasi',
  },
  {
    id: 'gc-3',
    category: 'kata-hubung',
    categoryLabel: 'Kesalahan Kata Hubung',
    faultySentence: 'Bila hujan turun dengan lebat, kawasan dewan di mana majlis diadakan dinaiki air.',
    contextNote: 'Mengandungi dua kesalahan penggunaan kata hubung akibat kekeliruan kata tanya dan pengaruh struktur asing.',
    source: 'kurasi',
  },
  {
    id: 'gc-4',
    category: 'kelewahan',
    categoryLabel: 'Kelewahan Bahasa',
    faultySentence: 'Semua guru-guru pelatih saling bantu-membantu demi untuk menjayakan program literasi itu.',
    contextNote: 'Mengandungi unsur bertindih dari segi makna jamak, kesalingan, dan kata sendi nama.',
    source: 'kurasi',
  },
];
