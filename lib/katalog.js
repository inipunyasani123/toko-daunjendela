// Logika katalog: ukuran, padanan pot, harga, stok (data dasar + perubahan admin), saringan, dan urutan.
import { produk, potJenis, cariProduk, cariPotJenis, cariRuang, cahaya as skalaCahaya, tingkatRawat, kelompok as daftarKelompok, cariRacikan } from './data';

export function ukuranProduk(p, ukuranId) {
  return p.ukuran.find((u) => u.id === ukuranId) || p.ukuran[0];
}

export function indeksUkuran(p, ukuranId) {
  return Math.max(0, p.ukuran.findIndex((u) => u.id === ukuranId));
}

// ---------- Pot pasangan ----------

export function produkPot(potId) {
  const j = cariPotJenis(potId);
  return j?.produk ? cariProduk(j.produk) : null;
}

export function ukuranPot(potId, diameter) {
  const pp = produkPot(potId);
  return pp ? pp.ukuran.find((u) => u.pot === diameter) || null : null;
}

// null = pot ini tidak tersedia untuk diameter itu
export function hargaPot(potId, diameter) {
  if (!potId || potId === 'nursery') return 0;
  const u = ukuranPot(potId, diameter);
  return u ? u.harga : null;
}

export function beratPot(potId, diameter) {
  if (!potId || potId === 'nursery') return 0;
  return ukuranPot(potId, diameter)?.berat || 0;
}

export function stokPot(potId, diameter, inventaris) {
  if (!potId || potId === 'nursery') return Infinity;
  const pp = produkPot(potId);
  const u = ukuranPot(potId, diameter);
  if (!pp || !u) return 0;
  if (!produkAktif(pp, inventaris)) return 0;
  return stokVarian(pp, u.id, inventaris);
}

// Kecocokan pot untuk tanaman: 'saran' | 'hindari' | 'boleh'.
export function cocokPot(p, potId) {
  if (p.potHindari?.includes(potId)) return 'hindari';
  if (p.potSaran?.includes(potId)) return 'saran';
  return 'boleh';
}

const ALASAN_HINDARI = {
  terakota: 'Terakota membuat media cepat kering, padahal tanaman ini suka media yang lembap.',
  keramik: 'Keramik glasir menahan lembap terlalu lama untuk tanaman yang suka kering.',
  semen: 'Pot semen terlalu berat dan dingin untuk media anggrek yang perlu banyak udara.',
  gantung: 'Tanaman ini tumbuh tinggi dan berat, tidak aman digantung.',
};

export function alasanPot(p, potId) {
  const c = cocokPot(p, potId);
  if (c === 'hindari') return ALASAN_HINDARI[potId] || 'Kurang cocok untuk tanaman ini.';
  if (c === 'saran') return 'Disarankan untuk tanaman ini.';
  return '';
}

// Pilihan pot untuk satu ukuran tanaman. Pot gantung hanya untuk tanaman yang bisa digantung.
export function pilihanPot(p, ukuranId) {
  if (p.jenis !== 'tanaman') return [];
  const u = ukuranProduk(p, ukuranId);
  return potJenis
    .filter((j) => j.id !== 'gantung' || p.tempat.includes('gantung'))
    .map((j) => {
      const harga = hargaPot(j.id, u.pot);
      return { ...j, harga, tersedia: harga !== null, cocok: cocokPot(p, j.id), alasan: alasanPot(p, j.id) };
    });
}

// ---------- Harga, label, stok ----------

export function hargaVarian(p, ukuranId, potId) {
  const u = ukuranProduk(p, ukuranId);
  const tambahan = p.jenis === 'tanaman' ? hargaPot(potId, u.pot) || 0 : 0;
  return u.harga + tambahan;
}

export function beratVarian(p, ukuranId, potId) {
  const u = ukuranProduk(p, ukuranId);
  return u.berat + (p.jenis === 'tanaman' ? beratPot(potId, u.pot) : 0);
}

export function labelVarian(p, ukuranId, potId) {
  const u = ukuranProduk(p, ukuranId);
  if (p.jenis !== 'tanaman') return u.label;
  const pot = cariPotJenis(potId || 'nursery');
  return `${u.label} · Ø ${u.pot} cm · ${pot ? pot.pendek : 'Pot nursery'}`;
}

export function stokDasar(p, ukuranId) {
  const i = p.ukuran.findIndex((x) => x.id === ukuranId);
  if (i < 0) return 0;
  return p.stok[i] ?? 0;
}

// inventaris = { [slug]: { aktif?: boolean, stok?: { [ukuranId]: number } } }
export function stokVarian(p, ukuranId, inventaris) {
  const ubah = inventaris?.[p.slug]?.stok?.[ukuranId];
  return typeof ubah === 'number' ? ubah : stokDasar(p, ukuranId);
}

export function produkAktif(p, inventaris) {
  const a = inventaris?.[p.slug]?.aktif;
  return a === undefined ? true : a;
}

export function totalStok(p, inventaris) {
  return p.ukuran.reduce((n, u) => n + stokVarian(p, u.id, inventaris), 0);
}

export function rentangHarga(p) {
  const harga = p.ukuran.map((u) => u.harga);
  return { min: Math.min(...harga), max: Math.max(...harga) };
}

export function hargaTermurah(p) {
  return rentangHarga(p).min;
}

// Ukuran pertama yang masih ada stoknya (pilihan awal di halaman produk).
export function ukuranAwal(p, inventaris) {
  const ada = p.ukuran.find((u) => stokVarian(p, u.id, inventaris) > 0);
  return (ada || p.ukuran[0]).id;
}

// ---------- Teks bantu tanaman ----------

export function teksCahaya(p) {
  const [a, b] = p.cahaya;
  const A = skalaCahaya[a - 1].nama;
  const B = skalaCahaya[b - 1].nama;
  if (a === b) return A;
  return `${A} sampai ${B.toLowerCase()}`;
}

export function teksSiram(p) {
  const [a, b] = p.siram.hari;
  return a === b ? `Tiap ${a} hari` : `Tiap ${a}–${b} hari`;
}

export function namaRawat(n) {
  return tingkatRawat[n - 1]?.nama || '';
}

export function teksLembap(p) {
  return { rendah: 'Suka udara kering', sedang: 'Udara biasa', tinggi: 'Suka udara lembap' }[p.lembap];
}

export function namaKelompok(id) {
  return daftarKelompok.find((k) => k.id === id)?.nama || '';
}

// ---------- Ruangan ----------

export function cocokRuang(p, ruangId) {
  const r = cariRuang(ruangId);
  if (!r || p.jenis !== 'tanaman') return false;
  const s = r.syarat;
  const [a, b] = p.cahaya;
  if (s.cahaya && (b < s.cahaya[0] || a > s.cahaya[1])) return false;
  if (s.udaraKering && p.lembap === 'tinggi') return false;
  if (s.lembap && p.lembap === 'rendah') return false;
  if (s.tempat && !p.tempat.includes(s.tempat)) return false;
  if (s.rawatMaks && p.rawat > s.rawatMaks) return false;
  return true;
}

export function jumlahUntukRuang(ruangId) {
  return produk.filter((p) => cocokRuang(p, ruangId)).length;
}

// ---------- Terkait ----------

export function tanamanUntukRacikan(id) {
  return produk.filter((p) => p.jenis === 'tanaman' && p.media === id);
}

export function tanamanUntukPot(potId) {
  return produk.filter((p) => p.jenis === 'tanaman' && p.potSaran?.includes(potId));
}

export function produkTerkait(p, n = 4) {
  if (p.jenis === 'tanaman') {
    const [a, b] = p.cahaya;
    const tumpang = (x) => x.slug !== p.slug && x.jenis === 'tanaman' && !(x.cahaya[1] < a || x.cahaya[0] > b);
    const skor = (x) => (x.kelompok === p.kelompok ? 2 : 0) + (x.hewan === p.hewan ? 1 : 0) + (Math.abs(x.rawat - p.rawat) <= 1 ? 1 : 0);
    return produk.filter(tumpang).sort((x, y) => skor(y) - skor(x) || x.urut - y.urut).slice(0, n);
  }
  if (p.jenis === 'pot') return tanamanUntukPot(p.pot).slice(0, n);
  if (p.jenis === 'media') return tanamanUntukRacikan(p.racikan).slice(0, n);
  return produk.filter((x) => x.jenis === 'tanaman' && x.rawat === 3).concat(produk.filter((x) => x.jenis === 'tanaman')).filter((x, i, arr) => arr.indexOf(x) === i).slice(0, n);
}

export function racikanProduk(p) {
  return p.jenis === 'media' ? cariRacikan(p.racikan) : p.jenis === 'tanaman' ? cariRacikan(p.media) : null;
}

// ---------- Saringan ----------

export const rentangFilter = [
  { id: 'bawah-50', label: 'Di bawah Rp50.000', min: 0, max: 49999 },
  { id: '50-150', label: 'Rp50.000–Rp150.000', min: 50000, max: 150000 },
  { id: 'atas-150', label: 'Di atas Rp150.000', min: 150001, max: Infinity },
];

export const urutan = [
  { id: 'kebun', label: 'Pilihan kebun' },
  { id: 'santai', label: 'Paling santai dirawat' },
  { id: 'termurah', label: 'Harga terendah' },
  { id: 'termahal', label: 'Harga tertinggi' },
  { id: 'nama', label: 'Nama A–Z' },
];

function normal(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

// filter = { q, jenis, kelompok: [], cahaya: [], rawat: [], udara, hewan, tempat: [], harga, ruang, urut }
export function saringProduk(daftar, f, inventaris) {
  const kata = normal(f.q).split(/\s+/).filter(Boolean);
  const rentang = rentangFilter.find((r) => r.id === f.harga);
  let hasil = daftar.filter((p) => {
    if (!produkAktif(p, inventaris)) return false;
    if (f.jenis && p.jenis !== f.jenis) return false;
    if (p.jenis === 'tanaman') {
      if (f.kelompok?.length && !f.kelompok.includes(p.kelompok)) return false;
      if (f.cahaya?.length && !f.cahaya.some((c) => c >= p.cahaya[0] && c <= p.cahaya[1])) return false;
      if (f.rawat?.length && !f.rawat.includes(p.rawat)) return false;
      if (f.udara === 'kering' && p.lembap === 'tinggi') return false;
      if (f.udara === 'lembap' && p.lembap === 'rendah') return false;
      if (f.hewan && !p.hewan) return false;
      if (f.tempat?.length && !f.tempat.some((t) => p.tempat.includes(t))) return false;
      if (f.ruang && !cocokRuang(p, f.ruang)) return false;
    }
    if (rentang) {
      const { min, max } = rentangHarga(p);
      if (max < rentang.min || min > rentang.max) return false;
    }
    if (kata.length) {
      const teks = normal([p.nama, p.latin, p.ringkas, namaKelompok(p.kelompok), p.jenis === 'pot' ? 'pot' : '', p.jenis === 'media' ? 'media tanam' : ''].join(' '));
      if (!kata.every((k) => teks.includes(k))) return false;
    }
    return true;
  });
  const urut = f.urut || 'kebun';
  hasil = [...hasil].sort((a, b) => {
    if (urut === 'termurah') return hargaTermurah(a) - hargaTermurah(b);
    if (urut === 'termahal') return rentangHarga(b).max - rentangHarga(a).max;
    if (urut === 'santai') return (a.rawat || 9) - (b.rawat || 9) || a.urut - b.urut;
    if (urut === 'nama') return a.nama.localeCompare(b.nama, 'id');
    return a.urut - b.urut;
  });
  return hasil;
}

export { cariProduk };
