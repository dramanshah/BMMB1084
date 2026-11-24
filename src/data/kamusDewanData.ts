import type { KamusEntry } from '../types/sintaksis';

export const CURATED_KAMUS_ENTRIES: KamusEntry[] = [
  {
    id: 'kd-1',
    kata: 'sintaksis',
    ejaanBaku: 'sintaksis',
    sebutan: 'sin.tak.sis',
    golonganKata: 'Kata Nama Am (Istilah Linguistik)',
    category: 'istilah',
    takrifan: [
      'Pengetahuan (cabang ilmu linguistik) tentang susunan kata dalam ayat; ilmu nahu.',
      'Kajian mengenai hukum atau rumus tatabahasa yang mendasari kaedah penggabungan dan penyusunan perkataan atau kelompok perkataan untuk membentuk ayat.',
    ],
    bentukTerbitan: ['mensintaksiskan', 'kesintaksisan', 'sintaktik (kata adjektif)'],
    perananSintaksis:
      'Merujuk kepada bidang utama HPK 2 BMMB1084 yang merangkumi binaan frasa, klausa, ayat dasar, jenis ayat, ragam ayat, ayat majmuk, dan analisis kegramatisan.',
    contohAyat: 'Penguasaan sintaksis membolehkan siswa pendidik membina ayat yang gramatis.',
    catatanPerbandingan:
      'Berbeza daripada morfologi yang mengkaji pembentukan kata (morfem dan pengimbuhan), sintaksis meneliti hubungan konstituen pada peringkat frasa, klausa, dan ayat.',
    source: 'kurasi',
  },
  {
    id: 'kd-2',
    kata: 'pelengkap',
    ejaanBaku: 'pelengkap',
    sebutan: 'pe.leng.kap',
    golonganKata: 'Kata Nama Am (Istilah Tatabahasa)',
    category: 'istilah',
    takrifan: [
      'Sesuatu yang melengkapkan atau menyempurnakan sesuatu binaan atau hal.',
      'Dalam ilmu sintaksis, unsur (frasa nama, frasa adjektif, atau frasa sendi nama) yang hadir selepas kata kerja tak transitif untuk menyempurnakan maksud ayat dan tidak boleh dipasifkan.',
    ],
    bentukTerbitan: ['lengkap', 'melengkapkan', 'kelengkapan', 'perlengkapan'],
    perananSintaksis:
      'Wajib hadir selepas kata kerja tak transitif berpelengkap seperti menjadi, tinggal, beransur, dan berselimutkan. Tidak boleh digugurkan tanpa merosakkan kegramatisan ayat.',
    contohAyat: 'Keadaan kesihatan pesakit itu beransur pulih sejak semalam.',
    catatanPerbandingan:
      'Jangan kelirukan pelengkap dengan objek. Objek hanya hadir selepas kata kerja transitif (berawalan meN-) dan boleh dijadikan subjek dalam ayat pasif, sedangkan pelengkap tidak boleh dipasifkan.',
    source: 'kurasi',
  },
  {
    id: 'kd-3',
    kata: 'klausa',
    ejaanBaku: 'klausa',
    sebutan: 'klau.sa',
    golonganKata: 'Kata Nama Am (Istilah Linguistik)',
    category: 'istilah',
    takrifan: [
      'Rangkaian perkataan yang mengandungi subjek dan predikat, dan menjadi konstituen atau bahagian kepada sesuatu ayat.',
    ],
    bentukTerbitan: ['klausa bebas (utama)', 'klausa tak bebas (kecil)'],
    perananSintaksis:
      'Unit tatabahasa di atas peringkat frasa dan di bawah peringkat ayat. Klausa bebas berpotensi menjadi ayat lengkap, manakala klausa tak bebas memerlukan kata hubung pancangan untuk bergabung dengan klausa utama.',
    contohAyat: 'Pelajar itu tersenyum apabila namanya diumumkan oleh pensyarah.',
    catatanPerbandingan:
      'Frasa tidak mempunyai binaan Subjek + Predikat, manakala klausa wajib mempunyai kedua-dua konstituen subjek dan predikat (kecuali apabila subjek digugurkan dalam pemancangan tertentu).',
    source: 'kurasi',
  },
  {
    id: 'kd-4',
    kata: 'dari / daripada',
    ejaanBaku: 'dari · daripada',
    sebutan: 'da.ri · da.ri.pa.da',
    golonganKata: 'Kata Tugas (Kata Sendi Nama)',
    category: 'kata-tugas',
    takrifan: [
      'dari: kata sendi nama yang menyatakan tempat permulaan, arah, atau masa/waktu.',
      'daripada: kata sendi nama yang menyatakan punca (orang, haiwan, benda mujarad), sumber asal kejadian benda, serta perbandingan atau perbezaan.',
    ],
    bentukTerbitan: ['sedari', 'darihal', 'daripadanya'],
    perananSintaksis:
      'Membentuk Frasa Sendi Nama (FS) yang berfungsi sebagai predikat dalam Pola 4 (FN + FS) atau unsur keterangan dalam Predikat Frasa Kerja.',
    contohAyat: 'Surat rasmi daripada pihak fakulti itu diterima dari pejabat pentadbiran pagi tadi.',
    catatanPerbandingan:
      'Ingat akronim ATM untuk "dari" (Arah, Tempat, Masa). Gunakan "daripada" untuk orang, organisasi, punca maklumat, bahan asal, dan perbandingan.',
    source: 'kurasi',
  },
  {
    id: 'kd-5',
    kata: 'ialah / adalah',
    ejaanBaku: 'ialah · adalah',
    sebutan: 'i.a.lah · a.da.lah',
    golonganKata: 'Kata Tugas (Kata Pemeri)',
    category: 'kata-tugas',
    takrifan: [
      'ialah: kata pemeri yang menghubungkan subjek dengan predikat frasa nama secara persamaan (ekuatif).',
      'adalah: kata pemeri yang menghuraikan subjek dengan predikat frasa adjektif atau frasa sendi nama.',
    ],
    bentukTerbitan: ['tiada imbuhan (kata tugas tertutup)'],
    perananSintaksis:
      'Hadir di antara Subjek (FN) dan Predikat. Tidak boleh hadir di hadapan frasa kerja (*adalah dimaklumkan, *ialah membincangkan adalah tidak gramatis dalam binaan biasa).',
    contohAyat: 'Matlamat utama kursus BMMB1084 adalah untuk memantapkan penguasaan tatabahasa.',
    catatanPerbandingan:
      'Gunakan "ialah" sebelum Frasa Nama (FN + ialah + FN); gunakan "adalah" sebelum Frasa Adjektif atau Frasa Sendi Nama (FN + adalah + FA/FS).',
    source: 'kurasi',
  },
  {
    id: 'kd-6',
    kata: 'bila / apabila',
    ejaanBaku: 'bila · apabila',
    sebutan: 'bi.la · a.pa.bi.la',
    golonganKata: 'Kata Tanya vs Kata Hubung Pancangan Keterangan',
    category: 'kata-tugas',
    takrifan: [
      'bila: kata tanya yang digunakan untuk menanyakan masa atau waktu (bilakah).',
      'apabila: kata hubung pancangan keterangan waktu yang bermaksud ketika atau sewaktu.',
    ],
    bentukTerbitan: ['bilakah', 'bila-bila', 'apabila'],
    perananSintaksis:
      '"Bila" membentuk ayat tanya terbuka; "apabila" memancangkan klausa keterangan waktu dalam ayat majmuk.',
    contohAyat: 'Apabila peperiksaan bermula, semua calon hendaklah senyap.',
    catatanPerbandingan:
      'Kesalahan lazim peperiksaan: menggunakan "bila" sebagai kata hubung (*Bila hujan turun, kami berteduh). Pembetulan wajib: "Apabila hujan turun...".',
    source: 'kurasi',
  },
  {
    id: 'kd-7',
    kata: 'memperoleh',
    ejaanBaku: 'memperoleh (bukan memperolehi)',
    sebutan: 'mem.per.o.leh',
    golonganKata: 'Kata Kerja Transitif (Apitan mempeR-...)',
    category: 'imbuhan',
    takrifan: [
      'Mendapat sesuatu dengan usaha; mencapai atau memenangi sesuatu.',
    ],
    bentukTerbitan: ['oleh', 'beroleh', 'memperoleh', 'diperoleh', 'perolehan', 'pemerolehan'],
    perananSintaksis:
      'Kata kerja transitif yang wajib diikuti oleh objek Frasa Nama. Bentuk pasifnya ialah "diperoleh" (KGND 3) atau "saya peroleh" (KGND 1).',
    contohAyat: 'Guru pelatih itu memperoleh markah cemerlang dalam kertas sintaksis.',
    catatanPerbandingan:
      'Menurut Kamus Dewan Edisi Keempat dan Tatabahasa Dewan, bentuk *memperolehi dan *diperolehi adalah tidak baku kerana imbuhan meN- + per- sudah mencukupi bagi kata dasar "oleh".',
    source: 'kurasi',
  },
  {
    id: 'kd-8',
    kata: 'menghadiahkan / menghadiahi',
    ejaanBaku: 'menghadiahkan · menghadiahi',
    sebutan: 'meng.ha.di.ah.kan · meng.ha.di.a.hi',
    golonganKata: 'Kata Kerja Transitif (Apitan meN-...-kan vs meN-...-i)',
    category: 'imbuhan',
    takrifan: [
      'menghadiahkan: memberikan sesuatu sebagai hadiah (objek tepat ialah benda yang diberikan).',
      'menghadiahi: memberi seseorang hadiah (objek tepat ialah penerima yang bernyawa).',
    ],
    bentukTerbitan: ['hadiah', 'berhadiah', 'menghadiahkan', 'menghadiahi', 'dihadiahkan', 'dihadiahi'],
    perananSintaksis:
      'Apitan meN-...-kan menandakan kausatif/benefaktif dengan objek benda langsung, manakala meN-...-i menandakan lokatif/penerima sebagai objek tepat.',
    contohAyat: 'Pihak kolej menghadiahi pemenang itu sebuah kamus. / Pihak kolej menghadiahkan sebuah kamus kepada pemenang itu.',
    catatanPerbandingan:
      'Kesalahan lazim: *menghadiahkan pemenang itu sebuah buku (salah objek tepat). Pastikan objek tepat selepas -kan ialah barang, dan selepas -i ialah penerima.',
    source: 'kurasi',
  },
];
