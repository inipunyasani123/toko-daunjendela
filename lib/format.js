// Format angka, berat, dan waktu. Semua waktu ditampilkan dalam WIB (Asia/Jakarta).

const angka = new Intl.NumberFormat('id-ID');

export function rupiah(n) {
  return `Rp${angka.format(Math.round(n || 0))}`;
}

export function gram(g) {
  if (g >= 1000) {
    return `${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 1 }).format(g / 1000)} kg`;
  }
  return `${angka.format(g)} g`;
}

export function kg(n) {
  return `${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 1 }).format(n)} kg`;
}

export function desimal(n, digit = 1) {
  return new Intl.NumberFormat('id-ID', { maximumFractionDigits: digit }).format(n);
}

export const ZONA_WAKTU = 'Asia/Jakarta';
export const HARI_MS = 86400000;
const JAM7 = 7 * 3600 * 1000;

const fmtTanggalJam = new Intl.DateTimeFormat('id-ID', {
  timeZone: ZONA_WAKTU,
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});
const fmtTanggal = new Intl.DateTimeFormat('id-ID', { timeZone: ZONA_WAKTU, weekday: 'long', day: 'numeric', month: 'long' });
const fmtTanggalPendek = new Intl.DateTimeFormat('id-ID', { timeZone: ZONA_WAKTU, day: 'numeric', month: 'short' });
const fmtTanggalSaja = new Intl.DateTimeFormat('id-ID', { timeZone: ZONA_WAKTU, day: 'numeric', month: 'long' });
const fmtHariPendek = new Intl.DateTimeFormat('id-ID', { timeZone: ZONA_WAKTU, weekday: 'short' });
const fmtHari = new Intl.DateTimeFormat('id-ID', { timeZone: ZONA_WAKTU, weekday: 'long' });
const fmtBulan = new Intl.DateTimeFormat('id-ID', { timeZone: ZONA_WAKTU, month: 'long', year: 'numeric' });
const fmtKunci = new Intl.DateTimeFormat('en-CA', { timeZone: ZONA_WAKTU, year: 'numeric', month: '2-digit', day: '2-digit' });

// "15 Okt 2026, 14.05 WIB"
export function waktuWIB(ms) {
  if (!ms) return '';
  return `${fmtTanggalJam.format(new Date(ms))} WIB`;
}

// "Senin, 19 Oktober"
export function tanggalPanjang(ms) {
  return fmtTanggal.format(new Date(ms));
}

// "19 Okt"
export function tanggalPendek(ms) {
  return fmtTanggalPendek.format(new Date(ms));
}

// "19 Oktober"
export function tanggalSaja(ms) {
  return fmtTanggalSaja.format(new Date(ms));
}

export function hariPendek(ms) {
  return fmtHariPendek.format(new Date(ms));
}

export function namaHari(ms) {
  return fmtHari.format(new Date(ms));
}

export function bulanTahun(ms) {
  return fmtBulan.format(new Date(ms));
}

// Kunci tanggal kalender WIB, mis. "2026-10-19".
export function kunciHariWIB(ms) {
  return fmtKunci.format(new Date(ms));
}

// Komponen tanggal WIB (tahun, bulan 1-12, hari, hari dalam minggu 0-6, jam, menit).
export function bagianWIB(ms) {
  const d = new Date(ms + JAM7);
  return {
    tahun: d.getUTCFullYear(),
    bulan: d.getUTCMonth() + 1,
    hari: d.getUTCDate(),
    hariMinggu: d.getUTCDay(),
    jam: d.getUTCHours(),
    menit: d.getUTCMinutes(),
  };
}

// Awal hari (00.00 WIB) untuk waktu tertentu, dalam milidetik UTC.
export function awalHariWIB(ms) {
  const { tahun, bulan, hari } = bagianWIB(ms);
  return Date.UTC(tahun, bulan - 1, hari) - JAM7;
}

export function tambahHari(ms, n) {
  return ms + n * HARI_MS;
}

// Selisih hari kalender WIB antara dua waktu (b - a).
export function selisihHari(a, b) {
  return Math.round((awalHariWIB(b) - awalHariWIB(a)) / HARI_MS);
}

export function sensorHP(hp) {
  const bersih = String(hp || '').replace(/\D/g, '');
  if (bersih.length < 6) return bersih;
  return `${bersih.slice(0, 4)}••••${bersih.slice(-4)}`;
}

// Musim di Indonesia (perkiraan umum Jawa): hujan Nov–Mar, peralihan Apr & Okt, kemarau Mei–Sep.
export function musim(ms) {
  const { bulan } = bagianWIB(ms);
  if ([11, 12, 1, 2, 3].includes(bulan)) return { id: 'hujan', nama: 'musim hujan' };
  if ([4, 10].includes(bulan)) return { id: 'peralihan', nama: 'masa peralihan' };
  return { id: 'kemarau', nama: 'musim kemarau' };
}
