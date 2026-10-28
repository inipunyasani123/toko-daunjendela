// Semua isi toko demo Daun Jendela ada di sini. Daun Jendela adalah toko fiktif.
// Harga, stok, tarif ongkir, jadwal, dan kebijakan di bawah ini contoh untuk demo.
// Data perawatan dan keamanan hewan ditulis hati-hati: keamanan hewan mengikuti daftar tanaman
// ASPCA (Animal Poison Control Center), dan tidak ada klaim kesehatan atau "pembersih udara".

export const site = {
  nama: 'Daun Jendela',
  slug: 'daunjendela',
  url: 'https://toko-daunjendela.pintuweb.id',
  judul: 'Daun Jendela — Tanaman hias sesuai cahaya rumahmu',
  tagline: 'Tanaman hias yang dipilih dari cahaya jendelamu',
  deskripsi:
    'Toko tanaman hias demo: cari tanaman menurut cahaya, kelembapan, dan waktu luangmu, lengkap dengan pot, media tanam, dan kalender rawat.',
  asal: 'Parongpong, Bandung Barat',
  provinsiAsal: 'Jawa Barat',
  ketinggian: '±1.100 mdpl',
  kodePesanan: 'DJ',
  jamLayanan: 'Senin–Sabtu, 08.00–16.00 WIB',
  // Tanaman hidup hanya dikirim Senin–Rabu (1–3) supaya tidak menginap di gudang kurir saat akhir pekan.
  hariKirimTanaman: [1, 2, 3],
  // Pot, media, dan alat dikirim Senin–Sabtu.
  hariKirimLain: [1, 2, 3, 4, 5, 6],
  batasKemasJam: 12,
  batasBayarJam: 24,
};

export const nav = [
  { href: '/katalog', label: 'Katalog' },
  { href: '/cari-tanaman', label: 'Cari yang betah' },
  { href: '/kalender-rawat', label: 'Kalender rawat' },
  { href: '/pengiriman', label: 'Pengiriman' },
  { href: '/bantuan', label: 'Bantuan' },
];

// Skala cahaya 1–5. Dipakai di penemu tanaman, saringan katalog, dan pita cahaya.
export const cahaya = [
  { n: 1, nama: 'Redup', ket: 'Jauh dari jendela, atau hanya lampu ruangan', bayangan: 'Hampir tidak ada bayangan' },
  { n: 2, nama: 'Agak redup', ket: 'Dua sampai tiga meter dari jendela', bayangan: 'Bayangan pudar dan lebar' },
  { n: 3, nama: 'Terang tak langsung', ket: 'Dekat jendela, sinar matahari tidak mengenai daun', bayangan: 'Bayangan samar, tepinya lembut' },
  { n: 4, nama: 'Matahari pagi', ket: 'Kena sinar pagi atau sore satu sampai tiga jam', bayangan: 'Bayangan tegas saat pagi' },
  { n: 5, nama: 'Matahari langsung', ket: 'Kena sinar langsung lebih dari tiga jam', bayangan: 'Bayangan tajam dan gelap' },
];

export const udara = [
  { id: 'kering', nama: 'Kering', ket: 'Ruang ber-AC hampir seharian' },
  { id: 'sedang', nama: 'Biasa', ket: 'Ruang berjendela tanpa AC' },
  { id: 'lembap', nama: 'Lembap', ket: 'Kamar mandi berjendela, dekat dapur, atau teras berembun' },
];

export const tingkatRawat = [
  { n: 1, nama: 'Santai', ket: 'Memaafkan kalau kamu lupa menyiram seminggu' },
  { n: 2, nama: 'Sedang', ket: 'Perlu dicek seminggu sekali dan sesekali dirapikan' },
  { n: 3, nama: 'Telaten', ket: 'Suka media yang selalu lembap dan udara yang basah' },
];

export const tempat = [
  { id: 'meja', nama: 'Meja atau rak' },
  { id: 'lantai', nama: 'Lantai' },
  { id: 'gantung', nama: 'Digantung' },
];

// Belanja per ruangan: tiap ruangan adalah prasetel saringan.
export const ruang = [
  {
    id: 'kamar-ac',
    nama: 'Kamar ber\u2011AC',
    ket: 'Udara kering, terang dari jendela bertirai',
    syarat: { cahaya: [2, 3], udaraKering: true },
    foto: { src: '/images/ruang/kamar.webp', w: 900, h: 1100, alt: 'Jendela kamar bertirai putih dengan tanaman kecil di ambangnya' },
  },
  {
    id: 'kamar-mandi',
    nama: 'Kamar mandi berjendela',
    ket: 'Lembap dan agak redup, surga pakis dan kalatea',
    syarat: { cahaya: [2, 3], lembap: true },
    foto: { src: '/images/ruang/kamar-mandi.webp', w: 900, h: 1100, alt: 'Kamar mandi dengan bak rendam dan tanaman di dekat jendela' },
  },
  {
    id: 'meja-kerja',
    nama: 'Meja kerja',
    ket: 'Tanaman kecil yang tidak rewel',
    syarat: { cahaya: [2, 3], tempat: 'meja', rawatMaks: 2 },
    foto: { src: '/images/ruang/meja-kerja.webp', w: 900, h: 1100, alt: 'Meja kayu dengan laptop, cangkir, dan tanaman kecil' },
  },
  {
    id: 'ruang-tamu',
    nama: 'Ruang tamu terang',
    ket: 'Tanaman lantai yang tumbuh besar',
    syarat: { cahaya: [3, 4], tempat: 'lantai' },
    foto: { src: '/images/ruang/ruang-tamu.webp', w: 900, h: 1100, alt: 'Pakis dalam pot putih di samping kursi di ruang tamu yang terang' },
  },
  {
    id: 'teras',
    nama: 'Teras dan balkon',
    ket: 'Kena matahari pagi atau lebih',
    syarat: { cahaya: [4, 5] },
    foto: { src: '/images/ruang/teras.webp', w: 900, h: 1100, alt: 'Pintu lengkung biru yang terbuka ke teras berpot tanaman' },
  },
  {
    id: 'sudut-redup',
    nama: 'Sudut redup',
    ket: 'Jauh dari jendela, cukup dengan lampu',
    syarat: { cahaya: [1, 1] },
    foto: { src: '/images/ruang/sudut.webp', w: 900, h: 1100, alt: 'Tanaman berdaun lebar dalam pot putih di sudut berdinding hijau tosca' },
  },
];

// Racikan media tanam. `isi` dalam persen volume.
export const racikan = [
  {
    id: 'gembur',
    nama: 'Racikan Gembur',
    ringkas: 'Serba guna untuk tanaman daun',
    isi: [
      { bahan: 'sekam-bakar', persen: 35 },
      { bahan: 'cocopeat', persen: 25 },
      { bahan: 'kompos', persen: 25 },
      { bahan: 'pasir-malang', persen: 15 },
    ],
    sifat: 'Menahan air secukupnya dan tetap berongga, jadi akar tidak sesak.',
  },
  {
    id: 'kasar',
    nama: 'Racikan Kasar',
    ringkas: 'Untuk monstera, sri rejeki, dan zamia',
    isi: [
      { bahan: 'cocochip', persen: 35 },
      { bahan: 'sekam-bakar', persen: 25 },
      { bahan: 'pasir-malang', persen: 20 },
      { bahan: 'kompos', persen: 20 },
    ],
    sifat: 'Butirannya besar sehingga air cepat lewat. Akar tebal suka media yang banyak udaranya.',
  },
  {
    id: 'pasir',
    nama: 'Racikan Pasir',
    ringkas: 'Untuk sukulen dan lidah mertua',
    isi: [
      { bahan: 'pasir-malang', persen: 50 },
      { bahan: 'sekam-bakar', persen: 25 },
      { bahan: 'kompos', persen: 15 },
      { bahan: 'cocopeat', persen: 10 },
    ],
    sifat: 'Kering dalam beberapa hari. Cocok untuk tanaman yang menyimpan air di daun atau umbinya.',
  },
  {
    id: 'lembap',
    nama: 'Racikan Lembap',
    ringkas: 'Untuk kalatea, pakis, dan kadaka',
    isi: [
      { bahan: 'cocopeat', persen: 40 },
      { bahan: 'kompos', persen: 25 },
      { bahan: 'sekam-bakar', persen: 25 },
      { bahan: 'pasir-malang', persen: 10 },
    ],
    sifat: 'Menahan lembap lebih lama tanpa jadi becek, untuk tanaman yang tidak suka media kering.',
  },
  {
    id: 'anggrek',
    nama: 'Racikan Anggrek',
    ringkas: 'Untuk anggrek bulan',
    isi: [
      { bahan: 'cocochip', persen: 60 },
      { bahan: 'arang', persen: 30 },
      { bahan: 'moss', persen: 10 },
    ],
    sifat: 'Tanpa tanah sama sekali. Akar anggrek bulan perlu udara dan cepat busuk di media padat.',
  },
];

export const bahan = {
  'sekam-bakar': { nama: 'Sekam bakar', warna: '#2b2622', ket: 'Kulit padi yang dibakar setengah matang. Ringan dan membuat media berongga.' },
  cocopeat: { nama: 'Cocopeat', warna: '#8a5a3b', ket: 'Serbuk sabut kelapa. Menahan air seperti spons.' },
  cocochip: { nama: 'Cocochip', warna: '#a5703f', ket: 'Potongan sabut kelapa. Kasar dan lambat lapuk.' },
  kompos: { nama: 'Kompos daun', warna: '#4a3a2a', ket: 'Daun dan sisa tanaman yang sudah terurai. Sumber hara alami.' },
  'pasir-malang': { nama: 'Pasir malang', warna: '#8e8a83', ket: 'Pasir vulkanik berpori. Membuat air cepat turun.' },
  arang: { nama: 'Arang kayu', warna: '#1b1b1d', ket: 'Pecahan arang. Kering dan tidak lapuk.' },
  moss: { nama: 'Moss', warna: '#9aa36c', ket: 'Lumut kering budidaya. Menjaga lembap di sekitar akar.' },
};

// Pot pasangan. `harga` per diameter (cm). Pot nursery ikut gratis bersama tanaman.
export const potJenis = [
  {
    id: 'nursery',
    nama: 'Pot plastik nursery',
    pendek: 'Pot nursery',
    bahan: 'Plastik hitam',
    pori: 'Tidak berpori',
    berat: 'Sangat ringan',
    sifat: 'Pot bawaan kebun. Media lebih lama kering, jadi siram lebih jarang.',
    gratis: true,
  },
  {
    id: 'terakota',
    nama: 'Pot terakota',
    pendek: 'Terakota',
    bahan: 'Tanah liat bakar',
    pori: 'Berpori',
    berat: 'Sedang',
    sifat: 'Dindingnya ikut menguapkan air, jadi media cepat kering. Cocok untuk yang suka kebanyakan menyiram.',
    produk: 'pot-terakota-lereng',
  },
  {
    id: 'semen',
    nama: 'Pot semen',
    pendek: 'Semen',
    bahan: 'Semen cetak',
    pori: 'Sedikit berpori',
    berat: 'Berat',
    sifat: 'Berat dan stabil, tidak mudah terguling oleh tanaman tinggi atau angin teras.',
    produk: 'pot-semen-teras',
  },
  {
    id: 'keramik',
    nama: 'Pot keramik glasir',
    pendek: 'Keramik',
    bahan: 'Keramik berglasir',
    pori: 'Tidak berpori',
    berat: 'Sedang',
    sifat: 'Menahan lembap paling lama. Cocok untuk tanaman yang tidak suka media kering.',
    produk: 'pot-keramik-embun',
  },
  {
    id: 'gantung',
    nama: 'Pot gantung bertali',
    pendek: 'Gantung',
    bahan: 'Plastik tebal dan tali rami',
    pori: 'Tidak berpori',
    berat: 'Ringan',
    sifat: 'Ringan untuk digantung. Ada tatakan di dalam supaya air siraman tidak menetes.',
    produk: 'pot-gantung-rami',
  },
];

// Jenis produk di katalog.
export const jenis = [
  { id: 'tanaman', nama: 'Tanaman' },
  { id: 'pot', nama: 'Pot' },
  { id: 'media', nama: 'Media tanam' },
  { id: 'alat', nama: 'Alat' },
];

export const kelompok = [
  { id: 'daun', nama: 'Tanaman daun' },
  { id: 'gantung', nama: 'Gantung & merambat' },
  { id: 'sukulen', nama: 'Sukulen' },
  { id: 'pakis', nama: 'Pakis' },
  { id: 'bunga', nama: 'Berbunga' },
];

// Foto tanaman: foto CC0 yang subjeknya dipotong dari latar aslinya (lihat public/images/SUMBER.md).
// tata: 'atas' = difoto dari atas tanpa pot (tanpa bayangan lantai), 'tinggi' = pucuknya terpotong di foto asli.
const UKURAN_FOTO = {
  'sirih-gading': [1100, 1050], 'lidah-mertua': [638, 1100], zamia: [647, 1100, 'tinggi'], monstera: [905, 1034],
  'sri-rejeki': [799, 1100], 'karet-kebo': [789, 1100], 'lili-paris': [664, 1100], peperomia: [487, 771],
  'kalatea-zebra': [1071, 1100, 'atas'], kadaka: [849, 1100, 'atas'], 'ekor-keledai': [850, 1100], ekeveria: [1051, 1100],
  hanjuang: [1100, 1029], 'anggrek-bulan': [582, 1100],
};
const fotoT = (slug, alt) => {
  const [w, h, tata] = UKURAN_FOTO[slug];
  return { src: `/images/tanaman/${slug}.webp`, w, h, alt, potong: true, ...(tata ? { tata } : {}) };
};

// Foto produk selain tanaman (pot, media, alat): CC0/PD, rinciannya di public/images/SUMBER.md.
// potong: subjek dipotong dari latar; penuh: foto memenuhi panggung (media tanam).
const fotoObjek = (nama, w, h, alt, penuh = false) => ({
  src: `/images/produk/${nama}.webp`,
  w,
  h,
  alt,
  potong: !penuh,
  ...(penuh ? { penuh: true, tata: 'atas' } : {}),
});
export const fotoPot = {
  nursery: { ...fotoObjek('pot-nursery', 900, 900, 'Bibit tumbuh di kantong pot plastik hitam berisi tanah di kebun semai', true) },
  terakota: fotoObjek('pot-terakota', 960, 1000, 'Pot tanah liat terakota berisi tanaman sukulen'),
  semen: fotoObjek('pot-semen', 1000, 964, 'Pot semen cetak berwarna abu alami'),
  keramik: fotoObjek('pot-keramik', 768, 1000, 'Pot keramik putih bertatakan dengan tanaman berdaun belang'),
  gantung: fotoObjek('pot-gantung', 1000, 799, 'Pot gantung plastik biru bertali dengan tanaman menjuntai'),
};
const fotoMedia = {
  gembur: fotoObjek('media-gembur', 1000, 1000, 'Segenggam media tanam gelap yang gembur di telapak tangan', true),
  kasar: fotoObjek('media-kasar', 1000, 1000, 'Hamparan sekam padi berwarna cokelat keemasan', true),
  pasir: fotoObjek('media-pasir', 1000, 1000, 'Butiran mineral putih berpori bercampur media gelap', true),
  lembap: fotoObjek('media-lembap', 1000, 1000, 'Dua tangan menimang media tanam lembap yang gembur', true),
  anggrek: fotoObjek('media-anggrek', 1000, 1000, 'Serpihan kayu kasar yang menyerupai media anggrek', true),
};

// Tanaman. cahaya: [min, maks] skala 1–5. lembap: kebutuhan kelembapan ('rendah' | 'sedang' | 'tinggi').
// siram: rentang hari antar-siram di dalam rumah. rawat: 1–3. hewan: true = tidak beracun bagi kucing & anjing (ASPCA).
// ukuran[].pot = diameter pot (cm); kardus = p × l × t (cm) untuk berat volumetrik; berat = gram termasuk media.
export const produk = [
  {
    slug: 'sirih-gading',
    jenis: 'tanaman',
    kelompok: 'gantung',
    nama: 'Sirih Gading',
    latin: 'Epipremnum aureum',
    famili: 'Araceae',
    ringkas: 'Sulur berdaun hati yang tetap rimbun walau kamu lupa menyiram seminggu.',
    deskripsi:
      'Sulurnya bisa dibiarkan menjuntai dari rak atau dirambatkan ke tiang sabut. Di tempat yang lebih terang, belang kuning di daunnya makin jelas. Kalau sulur memanjang tapi daunnya mengecil, itu tanda tanaman minta pindah lebih dekat ke jendela.',
    cahaya: [2, 4],
    lembap: 'sedang',
    siram: { hari: [7, 10], tanda: 'Siram saat 3 cm media teratas kering.' },
    rawat: 1,
    hewan: false,
    catatanHewan: 'Getahnya mengandung kristal kalsium oksalat yang membuat mulut perih bila dikunyah.',
    tempat: ['gantung', 'meja'],
    suhu: '18–32 °C',
    media: 'gembur',
    potSaran: ['keramik', 'gantung'],
    potHindari: [],
    rutinitas: { putar: 14, lap: 21 },
    tiba: 'Satu atau dua daun tua bisa menguning di minggu pertama. Itu penyesuaian dari udara kebun yang sejuk, bukan sakit.',
    ukuran: [
      { id: 'kecil', label: 'Kecil', pot: 12, tinggi: 'Sulur 20–30 cm', harga: 35000, berat: 700, kardus: [18, 18, 26] },
      { id: 'sedang', label: 'Sedang', pot: 15, tinggi: 'Sulur 40–60 cm', harga: 69000, berat: 1300, kardus: [23, 23, 37] },
      { id: 'besar', label: 'Besar', pot: 21, tinggi: 'Sulur 80–100 cm', harga: 129000, berat: 2600, kardus: [29, 29, 46] },
    ],
    stok: [14, 8, 3],
    urut: 1,
    foto: fotoT('sirih-gading', 'Sirih gading berdaun hati kuning-hijau di dalam pot batok kelapa'),
  },
  {
    slug: 'lidah-mertua',
    jenis: 'tanaman',
    kelompok: 'daun',
    nama: 'Lidah Mertua',
    latin: 'Dracaena trifasciata',
    famili: 'Asparagaceae',
    ringkas: 'Daun tegak bergaris yang tahan di sudut redup maupun di teras yang terik.',
    deskripsi:
      'Tanaman paling pemaaf di kebun kami. Ia menyimpan air di daunnya yang tebal, jadi lebih sering mati karena kebanyakan disiram daripada kekeringan. Dulu namanya Sansevieria trifasciata; para ahli kini memasukkannya ke marga Dracaena.',
    cahaya: [1, 5],
    lembap: 'rendah',
    siram: { hari: [14, 21], tanda: 'Siram hanya kalau media sudah kering sampai dasar pot.' },
    rawat: 1,
    hewan: false,
    catatanHewan: 'Mengandung saponin yang bisa membuat kucing dan anjing mual atau muntah bila dikunyah.',
    tempat: ['lantai', 'meja'],
    suhu: '15–35 °C',
    media: 'pasir',
    potSaran: ['terakota', 'semen'],
    potHindari: [],
    rutinitas: { putar: 30, lap: 30 },
    tiba: 'Daun yang terlipat sedikit saat dikemas akan tegak lagi dalam beberapa hari.',
    ukuran: [
      { id: 'kecil', label: 'Kecil', pot: 12, tinggi: 'Tinggi 25–30 cm', harga: 45000, berat: 900, kardus: [18, 18, 35] },
      { id: 'sedang', label: 'Sedang', pot: 17, tinggi: 'Tinggi 40–50 cm', harga: 89000, berat: 2200, kardus: [24, 24, 53] },
      { id: 'besar', label: 'Besar', pot: 21, tinggi: 'Tinggi 60–70 cm', harga: 159000, berat: 3800, kardus: [29, 29, 72] },
    ],
    stok: [11, 6, 2],
    urut: 2,
    foto: fotoT('lidah-mertua', 'Lidah mertua berdaun tegak bergaris kuning di pot putih'),
  },
  {
    slug: 'zamia',
    jenis: 'tanaman',
    kelompok: 'daun',
    nama: 'Zamia',
    latin: 'Zamioculcas zamiifolia',
    famili: 'Araceae',
    ringkas: 'Daun mengilap seperti dilapisi lilin, betah di ruangan yang jauh dari jendela.',
    deskripsi:
      'Di bawah media, zamia punya umbi yang menyimpan air, jadi ia sanggup dua sampai tiga minggu tanpa disiram. Tunas baru muncul pelan, satu tangkai sekali waktu, dan awalnya berwarna hijau muda sebelum menggelap.',
    cahaya: [1, 3],
    lembap: 'rendah',
    siram: { hari: [14, 21], tanda: 'Siram kalau media kering sampai setengah pot.' },
    rawat: 1,
    hewan: false,
    catatanHewan: 'Semua bagiannya mengandung kristal kalsium oksalat. Jauhkan dari hewan yang suka menggigit daun.',
    tempat: ['meja', 'lantai'],
    suhu: '18–32 °C',
    media: 'kasar',
    potSaran: ['terakota', 'semen'],
    potHindari: [],
    rutinitas: { putar: 21, lap: 21 },
    tiba: 'Zamia lambat bereaksi. Kalau satu tangkai menguning sebulan setelah tiba, potong saja dari pangkalnya.',
    ukuran: [
      { id: 'sedang', label: 'Sedang', pot: 15, tinggi: 'Tinggi 30–40 cm', harga: 79000, berat: 1600, kardus: [23, 23, 44] },
      { id: 'besar', label: 'Besar', pot: 21, tinggi: 'Tinggi 50–60 cm', harga: 149000, berat: 3400, kardus: [29, 29, 63] },
    ],
    stok: [7, 4],
    urut: 3,
    foto: fotoT('zamia', 'Zamia dengan tangkai daun mengilap di dalam pot putih'),
  },
  {
    slug: 'monstera',
    jenis: 'tanaman',
    kelompok: 'daun',
    nama: 'Monstera',
    latin: 'Monstera deliciosa',
    famili: 'Araceae',
    ringkas: 'Daun lebar berlubang yang jadi pusat perhatian ruang tamu.',
    deskripsi:
      'Lubang dan sobekan khasnya baru muncul di daun yang tumbuh dari tanaman dewasa dengan cahaya cukup. Ukuran besar kami kirim lengkap dengan tiang sabut, supaya batangnya bisa dirambatkan ke atas, bukan melebar ke samping.',
    cahaya: [3, 4],
    lembap: 'sedang',
    siram: { hari: [7, 10], tanda: 'Siram saat 5 cm media teratas kering.' },
    rawat: 2,
    hewan: false,
    catatanHewan: 'Daun dan batangnya mengandung kristal kalsium oksalat yang mengiritasi mulut bila dikunyah.',
    tempat: ['lantai'],
    suhu: '18–30 °C',
    media: 'kasar',
    potSaran: ['semen', 'terakota'],
    potHindari: [],
    rutinitas: { putar: 14, lap: 14 },
    tiba: 'Akar udara yang patah saat dikemas tidak apa-apa. Arahkan akar udara baru ke tiang sabut atau ke media.',
    ukuran: [
      { id: 'sedang', label: 'Sedang', pot: 21, tinggi: 'Tinggi 50–60 cm, 4–6 daun', harga: 169000, berat: 3600, kardus: [37, 37, 60] },
      { id: 'besar', label: 'Besar', pot: 25, tinggi: 'Tinggi 80–100 cm, dengan tiang sabut', harga: 299000, berat: 6200, kardus: [44, 44, 92] },
    ],
    stok: [5, 2],
    urut: 4,
    foto: fotoT('monstera', 'Monstera berdaun lebar berlubang di dalam pot merah bata'),
  },
  {
    slug: 'sri-rejeki',
    jenis: 'tanaman',
    kelompok: 'daun',
    nama: 'Sri Rejeki Perak',
    latin: 'Aglaonema (hibrida)',
    famili: 'Araceae',
    ringkas: 'Daun hijau bercorak perak yang tetap cerah di ruangan agak redup.',
    deskripsi:
      'Sri rejeki sudah lama jadi penghuni teras dan ruang tamu di Indonesia. Varietas hijau-perak ini termasuk yang paling tahan cahaya rendah, berbeda dengan kerabatnya yang merah muda yang perlu tempat lebih terang supaya warnanya tidak pudar.',
    cahaya: [1, 3],
    lembap: 'sedang',
    siram: { hari: [7, 10], tanda: 'Siram saat 3 cm media teratas kering.' },
    rawat: 1,
    hewan: false,
    catatanHewan: 'Mengandung kristal kalsium oksalat. Mengunyah daunnya membuat mulut perih dan bisa memicu muntah.',
    tempat: ['meja', 'lantai'],
    suhu: '18–30 °C',
    media: 'kasar',
    potSaran: ['keramik', 'semen'],
    potHindari: [],
    rutinitas: { putar: 14, lap: 21 },
    tiba: 'Jangan langsung dijemur. Biarkan di tempat teduh dua hari sebelum dipindah ke posisi tetapnya.',
    ukuran: [
      { id: 'kecil', label: 'Kecil', pot: 15, tinggi: 'Tinggi 25–30 cm', harga: 59000, berat: 1300, kardus: [23, 23, 35] },
      { id: 'sedang', label: 'Sedang', pot: 21, tinggi: 'Tinggi 40–50 cm', harga: 119000, berat: 2900, kardus: [29, 29, 53] },
    ],
    stok: [9, 4],
    urut: 5,
    foto: fotoT('sri-rejeki', 'Sri rejeki berdaun hijau bertulang perak di pot abu-abu tua'),
  },
  {
    slug: 'karet-kebo',
    jenis: 'tanaman',
    kelompok: 'daun',
    nama: 'Karet Kebo',
    latin: 'Ficus elastica',
    famili: 'Moraceae',
    ringkas: 'Pohon berdaun tebal mengilap untuk sudut terang yang butuh tanaman tinggi.',
    deskripsi:
      'Karet kebo tumbuh tegak dan bisa menyentuh plafon kalau dibiarkan bertahun-tahun. Daunnya tebal sehingga cukup tahan udara ber-AC. Debu cepat terlihat di permukaannya yang mengilap, jadi lap sesekali dengan kain lembap.',
    cahaya: [3, 5],
    lembap: 'sedang',
    siram: { hari: [10, 14], tanda: 'Siram saat media kering sampai sedalam ruas jari.' },
    rawat: 1,
    hewan: false,
    catatanHewan: 'Getah putihnya bisa mengiritasi kulit dan perut kucing atau anjing.',
    tempat: ['lantai'],
    suhu: '16–32 °C',
    media: 'gembur',
    potSaran: ['semen', 'terakota'],
    potHindari: ['gantung'],
    rutinitas: { putar: 14, lap: 14 },
    tiba: 'Daun paling bawah bisa rontok setelah perjalanan. Selama pucuknya tetap tumbuh, tanaman sehat.',
    ukuran: [
      { id: 'sedang', label: 'Sedang', pot: 21, tinggi: 'Tinggi 60–70 cm', harga: 139000, berat: 3500, kardus: [33, 33, 74] },
      { id: 'besar', label: 'Besar', pot: 25, tinggi: 'Tinggi 100–120 cm', harga: 249000, berat: 6000, kardus: [41, 41, 115] },
    ],
    stok: [4, 2],
    urut: 6,
    foto: fotoT('karet-kebo', 'Karet kebo berdaun lebar mengilap di dalam pot terakota'),
  },
  {
    slug: 'lili-paris',
    jenis: 'tanaman',
    kelompok: 'gantung',
    nama: 'Lili Paris',
    latin: 'Chlorophytum comosum',
    famili: 'Asparagaceae',
    ringkas: 'Daun melengkung bergaris putih yang beranak di ujung tangkainya.',
    deskripsi:
      'Tanaman yang paling sering ditawarkan tetangga sebagai anakan. Di tempat yang cukup terang, ia mengeluarkan tangkai panjang dengan anakan kecil yang bisa dipotong dan ditanam lagi. Ujung daun yang kecokelatan sering kali tanda media terlalu kering atau air siraman yang banyak kaporitnya.',
    cahaya: [2, 4],
    lembap: 'sedang',
    siram: { hari: [5, 7], tanda: 'Siram saat permukaan media mulai kering.' },
    rawat: 1,
    hewan: true,
    catatanHewan: 'Tidak beracun bagi kucing dan anjing menurut ASPCA. Kucing kadang suka mengunyah daunnya dan bisa muntah kalau terlalu banyak.',
    tempat: ['gantung', 'meja'],
    suhu: '15–30 °C',
    media: 'gembur',
    potSaran: ['gantung', 'keramik'],
    potHindari: [],
    rutinitas: { putar: 14 },
    tiba: 'Daun yang terlipat di kardus akan pulih. Potong ujung yang patah dengan gunting bersih.',
    ukuran: [
      { id: 'kecil', label: 'Kecil', pot: 12, tinggi: 'Lebar 20–25 cm', harga: 35000, berat: 650, kardus: [20, 20, 26] },
      { id: 'sedang', label: 'Sedang', pot: 17, tinggi: 'Lebar 35–45 cm', harga: 65000, berat: 1500, kardus: [28, 28, 35] },
    ],
    stok: [12, 6],
    urut: 7,
    foto: fotoT('lili-paris', 'Lili paris berdaun garis putih di pot putih bulat'),
  },
  {
    slug: 'peperomia',
    jenis: 'tanaman',
    kelompok: 'daun',
    nama: 'Peperomia Daun Tebal',
    latin: 'Peperomia obtusifolia',
    famili: 'Piperaceae',
    ringkas: 'Daun bulat tebal seperti karet, pas untuk meja kerja yang sempit.',
    deskripsi:
      'Peperomia menyimpan air di daun dan batangnya, jadi media boleh kering di antara siraman. Tumbuhnya pelan dan rapi, tidak cepat kebesaran untuk meja. Ia satu suku dengan sirih dan lada, walau tidak merambat.',
    cahaya: [2, 4],
    lembap: 'sedang',
    siram: { hari: [10, 14], tanda: 'Siram saat media kering sampai setengah pot.' },
    rawat: 1,
    hewan: true,
    catatanHewan: 'Tidak beracun bagi kucing dan anjing menurut ASPCA.',
    tempat: ['meja'],
    suhu: '18–30 °C',
    media: 'gembur',
    potSaran: ['keramik', 'terakota'],
    potHindari: [],
    rutinitas: { putar: 14 },
    tiba: 'Kalau daunnya terasa sedikit lemas saat tiba, siram sekali lalu biarkan di tempat teduh. Biasanya kencang lagi dalam dua hari.',
    ukuran: [
      { id: 'kecil', label: 'Kecil', pot: 12, tinggi: 'Tinggi 15–20 cm', harga: 39000, berat: 600, kardus: [18, 18, 24] },
      { id: 'sedang', label: 'Sedang', pot: 15, tinggi: 'Tinggi 25–30 cm', harga: 69000, berat: 1100, kardus: [23, 23, 33] },
    ],
    stok: [10, 5],
    urut: 8,
    foto: fotoT('peperomia', 'Peperomia berdaun bulat tebal di pot keramik biru'),
  },
  {
    slug: 'kalatea-zebra',
    jenis: 'tanaman',
    kelompok: 'daun',
    nama: 'Kalatea Zebra',
    latin: 'Goeppertia zebrina',
    famili: 'Marantaceae',
    ringkas: 'Daun bergaris yang terlipat naik di malam hari, untuk perawat yang telaten.',
    deskripsi:
      'Daunnya bergerak mengikuti terang dan gelap: terbuka di siang hari, sedikit menutup di malam hari. Kalatea suka media yang lembap merata dan udara basah. Di ruang ber-AC, tepi daunnya mudah mengering kecuali ditemani pelembap udara atau nampan kerikil basah.',
    cahaya: [2, 3],
    lembap: 'tinggi',
    siram: { hari: [4, 6], tanda: 'Jaga media tetap lembap, jangan sampai kering total. Air endapan semalam lebih baik daripada air keran langsung.' },
    rawat: 3,
    hewan: true,
    catatanHewan: 'Tidak beracun bagi kucing dan anjing menurut ASPCA.',
    tempat: ['meja', 'lantai'],
    suhu: '18–29 °C',
    media: 'lembap',
    potSaran: ['keramik', 'nursery'],
    potHindari: ['terakota'],
    rutinitas: { putar: 14, semprot: 3 },
    tiba: 'Daun bisa menggulung karena kaget pindah tempat. Taruh di tempat teduh yang lembap, jangan dipupuk dulu sebulan.',
    ukuran: [
      { id: 'kecil', label: 'Kecil', pot: 15, tinggi: 'Tinggi 25–30 cm', harga: 79000, berat: 1200, kardus: [24, 24, 35] },
      { id: 'sedang', label: 'Sedang', pot: 21, tinggi: 'Tinggi 40–50 cm', harga: 149000, berat: 2700, kardus: [31, 31, 51] },
    ],
    stok: [6, 3],
    urut: 9,
    foto: fotoT('kalatea-zebra', 'Kalatea zebra dilihat dari atas, daun hijau dengan garis tulang daun terang'),
  },
  {
    slug: 'kadaka',
    jenis: 'tanaman',
    kelompok: 'pakis',
    nama: 'Kadaka',
    latin: 'Asplenium nidus',
    famili: 'Aspleniaceae',
    ringkas: 'Pakis sarang burung dengan daun lebar bergelombang yang tumbuh melingkar.',
    deskripsi:
      'Di hutan, kadaka menempel di batang pohon dan menampung daun gugur di tengah rosetnya. Di rumah, ia betah di kamar mandi berjendela atau sudut yang teduh. Siram ke media di pinggir pot, jangan ke tengah roset, supaya pucuk barunya tidak busuk.',
    cahaya: [1, 3],
    lembap: 'tinggi',
    siram: { hari: [5, 7], tanda: 'Siram ke media saat permukaannya mulai kering. Hindari menggenangi tengah roset.' },
    rawat: 2,
    hewan: true,
    catatanHewan: 'Tidak beracun bagi kucing dan anjing menurut ASPCA.',
    tempat: ['meja', 'lantai', 'gantung'],
    suhu: '18–30 °C',
    media: 'lembap',
    potSaran: ['keramik', 'nursery'],
    potHindari: ['terakota'],
    rutinitas: { putar: 21, semprot: 4 },
    tiba: 'Daun baru yang masih menggulung sangat rapuh. Jangan disentuh sampai terbuka sendiri.',
    ukuran: [
      { id: 'kecil', label: 'Kecil', pot: 15, tinggi: 'Lebar 30–35 cm', harga: 65000, berat: 1200, kardus: [28, 28, 33] },
      { id: 'sedang', label: 'Sedang', pot: 21, tinggi: 'Lebar 50–60 cm', harga: 129000, berat: 2600, kardus: [37, 37, 46] },
    ],
    stok: [7, 3],
    urut: 10,
    foto: fotoT('kadaka', 'Kadaka atau pakis sarang burung dilihat dari atas, daunnya tumbuh melingkar'),
  },
  {
    slug: 'ekor-keledai',
    jenis: 'tanaman',
    kelompok: 'sukulen',
    nama: 'Ekor Keledai',
    latin: 'Sedum morganianum',
    famili: 'Crassulaceae',
    ringkas: 'Sukulen gantung dengan untaian daun gemuk yang menjuntai seperti kepang.',
    deskripsi:
      'Untaiannya bisa memanjang sampai setengah meter di tempat yang terang. Daunnya mudah lepas kalau tersenggol, jadi gantung di tempat yang jarang dilewati. Daun yang jatuh bisa ditaruh di atas media kering dan akan berakar sendiri.',
    cahaya: [4, 5],
    lembap: 'rendah',
    siram: { hari: [10, 14], tanda: 'Siram saat media kering total. Daun yang mengerut tanda haus.' },
    rawat: 2,
    hewan: true,
    catatanHewan: 'Tidak beracun bagi kucing dan anjing menurut ASPCA.',
    tempat: ['gantung'],
    suhu: '15–32 °C',
    media: 'pasir',
    potSaran: ['terakota', 'gantung'],
    potHindari: ['keramik'],
    rutinitas: { putar: 21 },
    tiba: 'Beberapa daun pasti rontok di perjalanan walau sudah dibungkus. Kumpulkan dan tanam lagi di pot kecil.',
    ukuran: [
      { id: 'sedang', label: 'Sedang', pot: 15, tinggi: 'Juntai 20–30 cm', harga: 75000, berat: 1000, kardus: [26, 26, 37] },
      { id: 'besar', label: 'Besar', pot: 21, tinggi: 'Juntai 40–50 cm', harga: 139000, berat: 2200, kardus: [31, 31, 53] },
    ],
    stok: [5, 2],
    urut: 11,
    foto: fotoT('ekor-keledai', 'Sukulen ekor keledai menjuntai dari pot terakota gantung'),
  },
  {
    slug: 'ekeveria',
    jenis: 'tanaman',
    kelompok: 'sukulen',
    nama: 'Ekeveria Mawar Batu',
    latin: 'Echeveria (hibrida)',
    famili: 'Crassulaceae',
    ringkas: 'Sukulen berbentuk mawar untuk ambang jendela yang kena matahari.',
    deskripsi:
      'Ekeveria butuh cahaya terang dan sinar langsung beberapa jam. Kalau kurang cahaya, rosetnya memanjang dan renggang. Daunnya dilapisi serbuk lilin tipis yang memberi warna kebiruan, jadi pegang dari bawah dan jangan dilap.',
    cahaya: [4, 5],
    lembap: 'rendah',
    siram: { hari: [10, 14], tanda: 'Siram saat media kering total, langsung ke media, bukan ke tengah roset.' },
    rawat: 1,
    hewan: true,
    catatanHewan: 'Ekeveria tidak beracun bagi kucing dan anjing menurut ASPCA.',
    tempat: ['meja'],
    suhu: '15–32 °C',
    media: 'pasir',
    potSaran: ['terakota', 'nursery'],
    potHindari: ['keramik'],
    rutinitas: { putar: 7 },
    tiba: 'Jangan langsung dijemur siang. Kenalkan pada matahari pagi dulu selama seminggu supaya daunnya tidak terbakar.',
    ukuran: [
      { id: 'kecil', label: 'Kecil', pot: 12, tinggi: 'Roset 8–10 cm', harga: 29000, berat: 450, kardus: [17, 17, 17] },
      { id: 'sedang', label: 'Sedang', pot: 15, tinggi: 'Roset 12–15 cm', harga: 49000, berat: 800, kardus: [20, 20, 20] },
    ],
    stok: [16, 7],
    urut: 12,
    foto: fotoT('ekeveria', 'Ekeveria berbentuk roset mawar hijau kebiruan di pot nursery hitam'),
  },
  {
    slug: 'hanjuang',
    jenis: 'tanaman',
    kelompok: 'daun',
    nama: 'Hanjuang Merah',
    latin: 'Cordyline fruticosa',
    famili: 'Asparagaceae',
    ringkas: 'Daun merah marun yang warnanya paling menyala di teras yang kena matahari.',
    deskripsi:
      'Hanjuang sudah lama ditanam di pekarangan dan pagar rumah di Jawa. Daun mudanya merah cerah lalu menggelap jadi marun. Warnanya hanya keluar penuh di tempat yang kena matahari pagi atau lebih, jadi teras dan balkon adalah rumah terbaiknya. Di dalam ruangan, daun barunya cenderung hijau kecokelatan.',
    cahaya: [4, 5],
    lembap: 'sedang',
    siram: { hari: [4, 7], tanda: 'Siram saat permukaan media kering. Di teras yang terik, cek tiap dua hari.' },
    rawat: 1,
    hewan: false,
    catatanHewan: 'Mengandung saponin yang bisa membuat kucing dan anjing muntah bila daunnya dikunyah.',
    tempat: ['lantai', 'meja'],
    suhu: '18–35 °C',
    media: 'gembur',
    potSaran: ['semen', 'terakota'],
    potHindari: [],
    rutinitas: { putar: 14 },
    tiba: 'Satu dua daun paling bawah bisa mengering setelah perjalanan. Potong saja, daun baru akan muncul dari pucuk.',
    ukuran: [
      { id: 'sedang', label: 'Sedang', pot: 17, tinggi: 'Tinggi 40–50 cm', harga: 55000, berat: 1800, kardus: [28, 28, 51] },
      { id: 'besar', label: 'Besar', pot: 21, tinggi: 'Tinggi 70–80 cm', harga: 99000, berat: 3200, kardus: [33, 33, 78] },
    ],
    stok: [8, 4],
    urut: 13,
    foto: fotoT('hanjuang', 'Hanjuang berdaun merah marun di dalam pot anyaman'),
  },
  {
    slug: 'anggrek-bulan',
    jenis: 'tanaman',
    kelompok: 'bunga',
    nama: 'Anggrek Bulan Putih',
    latin: 'Phalaenopsis (hibrida)',
    famili: 'Orchidaceae',
    ringkas: 'Bunga putih yang mekar berminggu-minggu di meja yang terang tanpa sinar langsung.',
    deskripsi:
      'Kerabatnya, Phalaenopsis amabilis, adalah salah satu bunga nasional Indonesia. Anggrek yang kami jual hasil perbanyakan kultur jaringan, bukan diambil dari alam. Bunganya bisa bertahan satu sampai tiga bulan. Setelah rontok, tangkainya bisa dipotong di atas ruas kedua untuk memancing tangkai baru.',
    cahaya: [3, 3],
    lembap: 'sedang',
    siram: { hari: [7, 10], tanda: 'Siram saat akar di dalam pot berubah warna dari hijau ke keperakan.' },
    rawat: 2,
    hewan: true,
    catatanHewan: 'Anggrek bulan tidak beracun bagi kucing dan anjing menurut ASPCA.',
    tempat: ['meja'],
    suhu: '20–30 °C',
    media: 'anggrek',
    potSaran: ['nursery', 'keramik'],
    potHindari: ['semen'],
    rutinitas: { putar: 14, semprot: 3 },
    tiba: 'Satu atau dua kuncup yang belum mekar bisa layu karena perjalanan. Bunga yang sudah mekar biasanya bertahan.',
    ukuran: [
      { id: 'satu', label: 'Satu tangkai', pot: 12, tinggi: 'Tinggi 45–55 cm dengan tangkai bunga', harga: 125000, berat: 900, kardus: [22, 22, 57] },
      { id: 'dua', label: 'Dua tangkai', pot: 15, tinggi: 'Tinggi 50–60 cm, dua tangkai bunga', harga: 219000, berat: 1300, kardus: [26, 26, 63] },
    ],
    stok: [5, 2],
    urut: 14,
    foto: fotoT('anggrek-bulan', 'Anggrek bulan putih dengan dua tangkai bunga di pot nursery berisi kulit kayu'),
  },

  // Pot
  {
    slug: 'pot-terakota-lereng',
    jenis: 'pot',
    pot: 'terakota',
    nama: 'Pot Terakota Lereng',
    ringkas: 'Pot tanah liat bakar dengan lubang dan tatakan, cocok untuk sukulen dan lidah mertua.',
    deskripsi:
      'Dibakar di tungku perajin gerabah, warnanya cokelat bata yang sedikit belang. Dindingnya berpori sehingga media lebih cepat kering. Lumut atau kerak putih yang muncul setelah beberapa bulan wajar dan bisa disikat.',
    ukuran: [
      { id: '12', label: 'Ø 12 cm', pot: 12, harga: 18000, berat: 450, kardus: [16, 16, 14] },
      { id: '15', label: 'Ø 15 cm', pot: 15, harga: 25000, berat: 750, kardus: [19, 19, 16] },
      { id: '17', label: 'Ø 17 cm', pot: 17, harga: 32000, berat: 1000, kardus: [21, 21, 18] },
      { id: '21', label: 'Ø 21 cm', pot: 21, harga: 48000, berat: 1600, kardus: [25, 25, 22] },
      { id: '25', label: 'Ø 25 cm', pot: 25, harga: 69000, berat: 2600, kardus: [29, 29, 26] },
    ],
    stok: [24, 18, 14, 9, 5],
    urut: 20,
    foto: fotoPot.terakota,
  },
  {
    slug: 'pot-semen-teras',
    jenis: 'pot',
    pot: 'semen',
    nama: 'Pot Semen Teras',
    ringkas: 'Pot semen cetak yang berat dan stabil untuk tanaman tinggi.',
    deskripsi:
      'Dicetak tangan dan dibiarkan berwarna abu alami. Beratnya membuat pot tidak mudah terguling oleh monstera atau karet kebo yang tinggi. Bagian dalam dilapisi cat kedap supaya semen tidak menyerap air siraman terlalu banyak.',
    ukuran: [
      { id: '17', label: 'Ø 17 cm', pot: 17, harga: 45000, berat: 2200, kardus: [22, 22, 20] },
      { id: '21', label: 'Ø 21 cm', pot: 21, harga: 65000, berat: 3600, kardus: [26, 26, 24] },
      { id: '25', label: 'Ø 25 cm', pot: 25, harga: 95000, berat: 5400, kardus: [30, 30, 28] },
    ],
    stok: [10, 7, 4],
    urut: 21,
    foto: fotoPot.semen,
  },
  {
    slug: 'pot-keramik-embun',
    jenis: 'pot',
    pot: 'keramik',
    nama: 'Pot Keramik Embun',
    ringkas: 'Pot keramik glasir putih susu yang menahan lembap, cocok untuk kalatea dan pakis.',
    deskripsi:
      'Glasirnya putih susu dengan bintik halus, berlubang di dasar dan dilengkapi tatakan. Karena tidak berpori, media di dalamnya lebih lama lembap, jadi kurangi frekuensi siram kalau sebelumnya memakai pot terakota.',
    ukuran: [
      { id: '12', label: 'Ø 12 cm', pot: 12, harga: 39000, berat: 600, kardus: [16, 16, 15] },
      { id: '15', label: 'Ø 15 cm', pot: 15, harga: 49000, berat: 900, kardus: [19, 19, 17] },
      { id: '17', label: 'Ø 17 cm', pot: 17, harga: 65000, berat: 1300, kardus: [21, 21, 19] },
      { id: '21', label: 'Ø 21 cm', pot: 21, harga: 89000, berat: 2100, kardus: [25, 25, 23] },
    ],
    stok: [15, 12, 8, 5],
    urut: 22,
    foto: fotoPot.keramik,
  },
  {
    slug: 'pot-gantung-rami',
    jenis: 'pot',
    pot: 'gantung',
    nama: 'Pot Gantung Rami',
    ringkas: 'Pot gantung ringan bertali rami dengan tatakan di dalam.',
    deskripsi:
      'Badan pot dari plastik tebal yang tidak mudah pecah, digantung dengan tiga utas tali rami sepanjang 60 cm dan satu cincin besi. Tatakan di dalam pot menampung sisa air supaya lantai di bawahnya tetap kering.',
    ukuran: [
      { id: '15', label: 'Ø 15 cm', pot: 15, harga: 35000, berat: 350, kardus: [20, 20, 18] },
      { id: '17', label: 'Ø 17 cm', pot: 17, harga: 42000, berat: 420, kardus: [22, 22, 20] },
      { id: '21', label: 'Ø 21 cm', pot: 21, harga: 55000, berat: 600, kardus: [26, 26, 22] },
    ],
    stok: [12, 9, 6],
    urut: 23,
    foto: fotoPot.gantung,
  },

  // Media tanam
  ...racikan.map((r, i) => ({
    slug: `media-${r.id}`,
    jenis: 'media',
    racikan: r.id,
    nama: r.nama,
    ringkas: `${r.ringkas}. ${r.sifat.split('. ')[0].replace(/\.$/, '')}.`,
    deskripsi: `${r.sifat} Diracik dan diayak di kebun, lalu dikemas dalam kantong kertas berlapis yang bisa ditutup lagi.`,
    ukuran:
      r.id === 'anggrek'
        ? [
            { id: '2l', label: '2 liter', harga: 22000, berat: 450, kardus: [20, 12, 26] },
            { id: '5l', label: '5 liter', harga: 45000, berat: 1100, kardus: [26, 15, 34] },
          ]
        : [
            { id: '2l', label: '2 liter', harga: 15000, berat: 900, kardus: [20, 12, 26] },
            { id: '5l', label: '5 liter', harga: 32000, berat: 2200, kardus: [26, 15, 34] },
            { id: '10l', label: '10 liter', harga: 55000, berat: 4300, kardus: [32, 18, 42] },
          ],
    stok: r.id === 'anggrek' ? [14, 6] : [[30, 20, 10], [25, 16, 8], [22, 12, 6], [18, 10, 5]][i],
    urut: 30 + i,
    foto: fotoMedia[r.id],
  })),

  // Alat
  {
    slug: 'penyiram-leher-angsa',
    jenis: 'alat',
    nama: 'Penyiram Leher Angsa',
    ringkas: 'Penyiram 1 liter bercorot panjang untuk menyiram langsung ke media.',
    deskripsi:
      'Corotnya panjang dan ramping, jadi air bisa diarahkan ke media di bawah daun tanpa membasahi tengah roset atau mengalir ke lantai. Pegangannya muat empat jari.',
    ukuran: [{ id: 'satu', label: '1 liter', harga: 49000, berat: 350, kardus: [32, 12, 22] }],
    stok: [9],
    urut: 40,
    foto: { src: '/images/alat/penyiram.webp', w: 1100, h: 244, alt: 'Penyiram tanaman tembaga bercorot panjang', potong: true },
  },
  {
    slug: 'semprotan-embun',
    jenis: 'alat',
    nama: 'Semprotan Embun',
    ringkas: 'Botol semprot kabut halus 500 ml untuk kalatea, pakis, dan anggrek.',
    deskripsi:
      'Kepala semprotnya menghasilkan kabut halus, bukan pancaran air, sehingga daun basah merata tanpa menetes. Semprot pagi hari supaya daun sempat kering sebelum malam.',
    ukuran: [{ id: 'satu', label: '500 ml', harga: 29000, berat: 150, kardus: [10, 10, 26] }],
    stok: [14],
    urut: 41,
    foto: fotoObjek('semprotan', 193, 900, 'Botol semprot bening berkepala kabut halus'),
  },
  {
    slug: 'tusuk-cek-media',
    jenis: 'alat',
    nama: 'Tusuk Cek Media',
    ringkas: 'Lima bilah bambu untuk memeriksa apakah media masih basah sebelum menyiram.',
    deskripsi:
      'Cara paling murah untuk berhenti menebak. Tancapkan bilah sedalam 5 cm, diamkan semenit, lalu cabut. Kalau bambunya gelap dan ada media yang menempel, tunda menyiram. Kalau bersih dan terang, saatnya menyiram.',
    ukuran: [{ id: 'isi-5', label: 'Isi 5 bilah', harga: 9000, berat: 40, kardus: [24, 4, 2] }],
    stok: [40],
    urut: 42,
    foto: fotoObjek('tusuk-bambu', 173, 900, 'Seikat bilah bambu tipis diikat pita hijau'),
  },
];

// Contoh tarif ongkir dari kebun di Jawa Barat. Bukan tarif kurir sungguhan.
// tanaman: 'semua' (Reguler & Kilat), 'kilat' (hanya Kilat), atau null (tanaman hidup belum dikirim).
export const zonaOngkir = [
  {
    id: 'z1',
    nama: 'Zona 1',
    cakupan: 'Jawa Barat, Jakarta, Banten',
    provinsi: ['Jawa Barat', 'DKI Jakarta', 'Banten'],
    layanan: { reguler: { perKg: 5000, estimasi: '1–2 hari', hari: [1, 2] }, kilat: { perKg: 9000, estimasi: '1 hari', hari: [1, 1] } },
    tanaman: 'semua',
  },
  {
    id: 'z2',
    nama: 'Zona 2',
    cakupan: 'Jawa Tengah, Yogyakarta, Jawa Timur, Lampung',
    provinsi: ['Jawa Tengah', 'DI Yogyakarta', 'Jawa Timur', 'Lampung'],
    layanan: { reguler: { perKg: 7000, estimasi: '2–3 hari', hari: [2, 3] }, kilat: { perKg: 12000, estimasi: '1–2 hari', hari: [1, 2] } },
    tanaman: 'semua',
  },
  {
    id: 'z3',
    nama: 'Zona 3',
    cakupan: 'Sumatra, Kalimantan, Bali, NTB',
    provinsi: [
      'Aceh', 'Sumatera Utara', 'Sumatera Barat', 'Riau', 'Kepulauan Riau', 'Jambi', 'Sumatera Selatan',
      'Kepulauan Bangka Belitung', 'Bengkulu', 'Bali', 'Nusa Tenggara Barat', 'Kalimantan Barat',
      'Kalimantan Tengah', 'Kalimantan Selatan', 'Kalimantan Timur', 'Kalimantan Utara',
    ],
    layanan: { reguler: { perKg: 12000, estimasi: '3–5 hari', hari: [3, 5] }, kilat: { perKg: 19000, estimasi: '2–3 hari', hari: [2, 3] } },
    tanaman: 'kilat',
  },
  {
    id: 'z4',
    nama: 'Zona 4',
    cakupan: 'Sulawesi, NTT, Maluku, Papua',
    provinsi: [
      'Sulawesi Utara', 'Gorontalo', 'Sulawesi Tengah', 'Sulawesi Barat', 'Sulawesi Selatan', 'Sulawesi Tenggara',
      'Nusa Tenggara Timur', 'Maluku', 'Maluku Utara', 'Papua', 'Papua Barat', 'Papua Barat Daya', 'Papua Tengah',
      'Papua Pegunungan', 'Papua Selatan',
    ],
    layanan: { reguler: { perKg: 21000, estimasi: '4–7 hari', hari: [4, 7] }, kilat: null },
    tanaman: null,
  },
];

export const layananKirim = [
  { id: 'reguler', nama: 'Reguler', ket: 'Lebih hemat' },
  { id: 'kilat', nama: 'Kilat', ket: 'Lebih cepat, lebih singkat di kardus' },
];

// Berat volumetrik kurir: p × l × t (cm) ÷ 6.000 = kg.
export const PEMBAGI_VOLUME = 6000;

export const metodeBayar = [
  {
    id: 'transfer',
    nama: 'Transfer bank',
    ket: 'Nomor rekening contoh muncul setelah pesanan dibuat.',
    instruksi: 'Transfer ke rekening contoh 000-0000-000 a.n. Daun Jendela Demo. Nomor ini tidak aktif, jadi jangan benar-benar mentransfer.',
  },
  {
    id: 'qris',
    nama: 'QRIS',
    ket: 'Kode QR contoh muncul setelah pesanan dibuat.',
    instruksi: 'Di toko sungguhan, kode QR muncul di sini untuk dipindai dari aplikasi bank atau dompet digital. Di demo ini tidak ada kode yang bisa dipindai.',
  },
  {
    id: 'ewallet',
    nama: 'Dompet digital',
    ket: 'Tautan bayar contoh, tidak menarik saldo apa pun.',
    instruksi: 'Di toko sungguhan, tombol bayar membuka aplikasi dompet digital. Di demo ini tidak ada saldo yang ditarik.',
  },
];

export const statusPesanan = [
  { id: 'menunggu', label: 'Menunggu pembayaran', ket: 'Pesanan dibuat dan menunggu dibayar.' },
  { id: 'dibayar', label: 'Dibayar', ket: 'Pembayaran diterima. Pesanan masuk antrean kirim sesuai jadwal.' },
  { id: 'disiapkan', label: 'Disiapkan', ket: 'Akar dan daun dicek, media ditutup, lalu dikemas berlapis.' },
  { id: 'dikirim', label: 'Dikirim', ket: 'Paket sudah di tangan kurir.' },
  { id: 'diterima', label: 'Diterima', ket: 'Paket sampai. Saatnya membuka kardus dan memberi tanaman waktu beradaptasi.' },
];

export const provinsi = [
  'Aceh', 'Sumatera Utara', 'Sumatera Barat', 'Riau', 'Kepulauan Riau', 'Jambi', 'Sumatera Selatan',
  'Kepulauan Bangka Belitung', 'Bengkulu', 'Lampung', 'DKI Jakarta', 'Jawa Barat', 'Banten', 'Jawa Tengah',
  'DI Yogyakarta', 'Jawa Timur', 'Bali', 'Nusa Tenggara Barat', 'Nusa Tenggara Timur', 'Kalimantan Barat',
  'Kalimantan Tengah', 'Kalimantan Selatan', 'Kalimantan Timur', 'Kalimantan Utara', 'Sulawesi Utara',
  'Gorontalo', 'Sulawesi Tengah', 'Sulawesi Barat', 'Sulawesi Selatan', 'Sulawesi Tenggara', 'Maluku',
  'Maluku Utara', 'Papua', 'Papua Barat', 'Papua Barat Daya', 'Papua Tengah', 'Papua Pegunungan', 'Papua Selatan',
];

// Langkah kemas tanaman hidup (dipakai di beranda dan halaman pengiriman).
export const langkahKemas = [
  { id: 'media', judul: 'Media ditutup', isi: 'Permukaan pot ditutup kertas lalu diikat plastik, supaya media tidak tumpah walau kardus miring.' },
  { id: 'ikat', judul: 'Batang ditopang', isi: 'Batang diikat longgar ke bilah bambu, daun lebar digulung dengan kertas koran.' },
  { id: 'kardus', judul: 'Kardus berlubang', isi: 'Pot dijepit sekat kardus di dasar, dan dinding kardus dilubangi supaya tanaman tetap bernapas.' },
  { id: 'label', judul: 'Diberi tanda', isi: 'Label "Tanaman hidup, jangan dibalik" di empat sisi, plus kartu rawat untuk hari pertama.' },
];

export const faq = [
  {
    grup: 'Memilih tanaman',
    id: 'memilih',
    isi: [
      {
        t: 'Bagaimana cara tahu seterang apa ruanganku?',
        j: 'Pakai tes bayangan pada siang hari. Angkat telapak tanganmu sekitar 30 cm di atas tempat tanaman akan diletakkan. Bayangan yang tajam dan gelap berarti cahaya langsung, bayangan samar dengan tepi lembut berarti terang tak langsung, dan kalau hampir tidak ada bayangan, tempat itu redup.',
      },
      {
        t: 'Tanaman apa yang aman untuk kucing dan anjing?',
        j: 'Di katalog, tanaman yang tidak beracun menurut daftar ASPCA diberi tanda "Aman untuk hewan". Aman bukan berarti boleh dimakan: hewan yang mengunyah banyak daun tetap bisa muntah. Kalau hewanmu menelan tanaman apa pun lalu terlihat lemas atau muntah terus, hubungi dokter hewan.',
      },
      {
        t: 'Apakah tanaman di sini bisa membersihkan udara?',
        j: 'Kami tidak menjanjikan itu. Penelitian yang sering dikutip dilakukan di ruang uji tertutup yang kecil. Di rumah biasa, butuh tanaman dalam jumlah sangat banyak untuk menyamai efek membuka jendela atau ventilasi yang baik. Kami menjual tanaman karena menyenangkan untuk dirawat dan dilihat.',
      },
      {
        t: 'Apakah tanaman yang datang persis seperti foto?',
        j: 'Tidak persis. Foto di toko ini contoh tanaman sejenis yang dipotret di tempat lain. Tanaman yang kamu terima diambil dari kebun sesuai ukuran yang kamu pilih, jadi jumlah daun, corak, dan arah tumbuhnya bisa berbeda. Pot di foto juga hanya penataan: tanaman dikirim dengan pot nursery kecuali kamu memilih pot lain.',
      },
    ],
  },
  {
    grup: 'Pengiriman tanaman hidup',
    id: 'pengiriman',
    isi: [
      {
        t: 'Kenapa tanaman hanya dikirim Senin sampai Rabu?',
        j: 'Supaya paket tidak menginap di gudang kurir saat akhir pekan. Tanaman di dalam kardus gelap hanya tahan beberapa hari. Pesanan yang dibayar sebelum pukul 12.00 WIB pada hari kirim dikemas dan dikirim hari itu juga. Pot, media, dan alat tetap dikirim Senin sampai Sabtu.',
      },
      {
        t: 'Ke mana saja tanaman hidup bisa dikirim?',
        j: 'Ke Jawa, Bali, NTB, Sumatra, dan Kalimantan. Untuk Sumatra, Kalimantan, Bali, dan NTB, tanaman hanya dikirim dengan layanan Kilat supaya tidak lebih dari tiga hari di jalan. Ke Sulawesi, NTT, Maluku, dan Papua kami belum mengirim tanaman hidup, tapi pot, media, dan alat tetap bisa.',
      },
      {
        t: 'Bagaimana ongkir dihitung?',
        j: 'Tanaman ringan tapi makan tempat, jadi kurir menghitung berat dari ukuran kardus: panjang × lebar × tinggi dibagi 6.000. Untuk tiap tanaman kami pakai angka yang lebih besar antara berat asli dan berat volumetrik. Pot, media, dan alat dihitung dari berat aslinya. Totalnya dibulatkan ke atas per kilogram, lalu dikalikan tarif zona tujuan.',
      },
      {
        t: 'Tanaman tiba layu. Apa yang harus dilakukan?',
        j: 'Sedikit layu setelah dua sampai empat hari di kardus itu wajar. Buka kardus, siram kalau media kering, lalu letakkan di tempat teduh yang terang selama dua hari sebelum dipindah ke posisi tetapnya. Jangan langsung dipupuk atau dipindah pot.',
      },
    ],
  },
  {
    grup: 'Garansi tiba hidup',
    id: 'garansi',
    isi: [
      {
        t: 'Kalau tanaman tiba patah atau rusak berat?',
        j: 'Rekam video saat membuka kardus tanpa jeda, lalu kirim video dan fotonya dalam 24 jam setelah paket diterima. Kami kirim pengganti pada jadwal kirim berikutnya atau mengembalikan dana untuk tanaman itu. Ongkir pengganti kami tanggung.',
      },
      {
        t: 'Apa yang tidak termasuk garansi?',
        j: 'Satu dua daun yang menguning atau rontok setelah tiba, karena itu bagian dari penyesuaian. Tanaman yang layu setelah dirawat lebih dari seminggu juga tidak termasuk, karena penyebabnya biasanya letak atau cara menyiram. Kirimi kami foto dan kami bantu mencari tahu.',
      },
    ],
  },
  {
    grup: 'Pot dan media',
    id: 'pot-media',
    isi: [
      {
        t: 'Pot mana yang sebaiknya kupilih?',
        j: 'Terakota membuat media cepat kering, cocok untuk sukulen, lidah mertua, dan kamu yang suka kebanyakan menyiram. Keramik glasir menahan lembap, cocok untuk kalatea dan pakis. Semen paling berat dan stabil untuk tanaman tinggi. Di halaman tiap tanaman ada saran pot yang cocok dan yang sebaiknya dihindari.',
      },
      {
        t: 'Perlu ganti media dan pot setelah tanaman datang?',
        j: 'Tidak perlu segera. Tanaman kami sudah ditanam di racikan yang cocok untuk jenisnya. Tunggu minimal sebulan sampai tanaman beradaptasi. Ganti pot kalau akar sudah keluar dari lubang dasar, biasanya setelah 12 sampai 18 bulan.',
      },
      {
        t: 'Kalau aku memilih pot di halaman tanaman, apakah langsung ditanam di pot itu?',
        j: 'Ya. Tanaman dipindah ke pot pilihanmu di kebun dengan racikan media yang sama, lalu dikemas bersama. Pot terakota dan keramik dibungkus tambahan supaya tidak retak di jalan.',
      },
    ],
  },
  {
    grup: 'Tentang toko demo ini',
    id: 'demo',
    isi: [
      {
        t: 'Apakah pembayaran di situs ini sungguhan?',
        j: 'Tidak. Daun Jendela adalah toko fiktif. Transfer bank, QRIS, dan dompet digital hanya contoh alur. Tidak ada uang yang ditarik, dan tombol "Simulasikan pembayaran" hanya mengubah status pesanan di browser kamu.',
      },
      {
        t: 'Di mana data pesanan dan kalender rawat disimpan?',
        j: 'Hanya di browser yang kamu pakai (localStorage). Tidak ada yang dikirim ke server. Menghapus data situs di browser akan menghapus keranjang, pesanan, pesan kontak, dan perubahan stok.',
      },
    ],
  },
];

export function cariProduk(slug) {
  return produk.find((p) => p.slug === slug);
}

export function cariPotJenis(id) {
  return potJenis.find((p) => p.id === id);
}

export function cariRacikan(id) {
  return racikan.find((r) => r.id === id);
}

export function cariRuang(id) {
  return ruang.find((r) => r.id === id);
}

export const tanaman = produk.filter((p) => p.jenis === 'tanaman');
