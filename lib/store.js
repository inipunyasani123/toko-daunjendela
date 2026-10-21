'use client';

// Penyimpanan di browser (localStorage) untuk keranjang, pesanan, stok, kalender rawat, dan pesan kontak.
// Tidak ada server: semua data demo hidup di browser pengunjung.
import { useCallback, useSyncExternalStore } from 'react';
import { cariProduk } from './data';
import { stokVarian, produkPot, ukuranPot, ukuranProduk, produkAktif } from './katalog';
import { buatKode, normalKode, pesananContoh, rakitPesanan, terapkanStatus, NOMOR_AWAL_CONTOH } from './pesanan';

export const KUNCI = {
  keranjang: 'daunjendela.cart.v1',
  pesanan: 'daunjendela.orders.v1',
  inventaris: 'daunjendela.inventory.v1',
  nomor: 'daunjendela.seq.v1',
  contoh: 'daunjendela.seeded.v1',
  kalender: 'daunjendela.calendar.v1',
  kontak: 'daunjendela.messages.v1',
};

const KOSONG_LIST = Object.freeze([]);
const KOSONG_OBJ = Object.freeze({});

const cadangan = new Map(); // dipakai bila localStorage tidak bisa diakses
const cache = new Map();
const pendengar = new Map();

function ambilMentah(kunci) {
  try {
    const v = window.localStorage.getItem(kunci);
    if (v !== null) return v;
  } catch {
    /* mode privat atau penyimpanan diblokir */
  }
  return cadangan.has(kunci) ? cadangan.get(kunci) : null;
}

function simpanMentah(kunci, mentah) {
  cadangan.set(kunci, mentah);
  try {
    if (mentah === null) window.localStorage.removeItem(kunci);
    else window.localStorage.setItem(kunci, mentah);
  } catch {
    /* tetap jalan dari cadangan memori */
  }
}

function baca(kunci, awal) {
  const mentah = typeof window === 'undefined' ? null : ambilMentah(kunci);
  const c = cache.get(kunci);
  if (c && c.mentah === mentah) return c.nilai;
  let nilai = awal;
  if (mentah) {
    try {
      nilai = JSON.parse(mentah);
    } catch {
      nilai = awal;
    }
  }
  cache.set(kunci, { mentah, nilai });
  return nilai;
}

function kabari(kunci) {
  const set = pendengar.get(kunci);
  if (set) for (const fn of [...set]) fn();
}

function tulis(kunci, nilai) {
  simpanMentah(kunci, nilai === null ? null : JSON.stringify(nilai));
  cache.delete(kunci);
  kabari(kunci);
}

function langganan(kunci, fn) {
  let set = pendengar.get(kunci);
  if (!set) {
    set = new Set();
    pendengar.set(kunci, set);
  }
  set.add(fn);
  const dariTabLain = (e) => {
    if (e.key === kunci || e.key === null) {
      cache.delete(kunci);
      fn();
    }
  };
  window.addEventListener('storage', dariTabLain);
  return () => {
    set.delete(fn);
    window.removeEventListener('storage', dariTabLain);
  };
}

function useSimpanan(kunci, awal) {
  const sub = useCallback((fn) => langganan(kunci, fn), [kunci]);
  const get = useCallback(() => baca(kunci, awal), [kunci, awal]);
  return useSyncExternalStore(sub, get, () => awal);
}

const tanpaLangganan = () => () => {};

// true setelah halaman terpasang di browser (data localStorage sudah terbaca).
export function useTerpasang() {
  return useSyncExternalStore(tanpaLangganan, () => true, () => false);
}

export const useKeranjang = () => useSimpanan(KUNCI.keranjang, KOSONG_LIST);
export const usePesanan = () => useSimpanan(KUNCI.pesanan, KOSONG_LIST);
export const useInventaris = () => useSimpanan(KUNCI.inventaris, KOSONG_OBJ);
export const useKalender = () => useSimpanan(KUNCI.kalender, KOSONG_OBJ);
export const usePesanKontak = () => useSimpanan(KUNCI.kontak, KOSONG_LIST);

// ---------- Data contoh ----------

export function pastikanContoh() {
  if (typeof window === 'undefined') return;
  if (ambilMentah(KUNCI.contoh)) return;
  const sekarang = Date.now();
  const contoh = pesananContoh(sekarang);
  const lama = baca(KUNCI.pesanan, KOSONG_LIST).filter((p) => !p.contoh);
  tulis(KUNCI.pesanan, [...contoh, ...lama].sort((a, b) => b.dibuat - a.dibuat));
  const nomor = Number(baca(KUNCI.nomor, 0)) || 0;
  tulis(KUNCI.nomor, Math.max(nomor, NOMOR_AWAL_CONTOH + contoh.length - 1));
  tulis(KUNCI.contoh, { waktu: sekarang });
}

export function kembalikanDataContoh() {
  tulis(KUNCI.inventaris, null);
  tulis(KUNCI.pesanan, null);
  tulis(KUNCI.nomor, null);
  tulis(KUNCI.contoh, null);
  pastikanContoh();
}

// ---------- Keranjang ----------

export function itemKunci(it) {
  return `${it.slug}|${it.ukuran}|${it.pot || '-'}`;
}

// Pemakaian stok oleh isi keranjang: tanaman per ukuran, dan pot (berdiri sendiri maupun pasangan tanaman).
export function pemakaianStok(daftar) {
  const pakai = {};
  const tambah = (k, n) => (pakai[k] = (pakai[k] || 0) + n);
  for (const it of daftar) {
    tambah(`${it.slug}|${it.ukuran}`, it.qty);
    const p = cariProduk(it.slug);
    if (p?.jenis === 'tanaman' && it.pot && it.pot !== 'nursery') {
      const pp = produkPot(it.pot);
      const up = ukuranPot(it.pot, ukuranProduk(p, it.ukuran).pot);
      if (pp && up) tambah(`${pp.slug}|${up.id}`, it.qty);
    }
  }
  return pakai;
}

// Berapa lagi yang bisa dimasukkan untuk satu pilihan, dengan memperhitungkan isi keranjang.
export function sisaUntuk({ slug, ukuran, pot }, daftar, inventaris) {
  const p = cariProduk(slug);
  if (!p || !produkAktif(p, inventaris)) return 0;
  const pakai = pemakaianStok(daftar);
  let sisa = stokVarian(p, ukuran, inventaris) - (pakai[`${slug}|${ukuran}`] || 0);
  if (p.jenis === 'tanaman' && pot && pot !== 'nursery') {
    const pp = produkPot(pot);
    const up = ukuranPot(pot, ukuranProduk(p, ukuran).pot);
    if (!pp || !up || !produkAktif(pp, inventaris)) return 0;
    sisa = Math.min(sisa, stokVarian(pp, up.id, inventaris) - (pakai[`${pp.slug}|${up.id}`] || 0));
  }
  return Math.max(0, sisa);
}

export function tambahKeKeranjang({ slug, ukuran, pot = null, qty }) {
  const p = cariProduk(slug);
  if (!p) return { ok: false };
  const potFinal = p.jenis === 'tanaman' ? pot || 'nursery' : null;
  const daftar = [...baca(KUNCI.keranjang, KOSONG_LIST)];
  const sisa = sisaUntuk({ slug, ukuran, pot: potFinal }, daftar, baca(KUNCI.inventaris, KOSONG_OBJ));
  const masuk = Math.min(sisa, qty);
  if (masuk <= 0) return { ok: false, sisa };
  const kunci = itemKunci({ slug, ukuran, pot: potFinal });
  const i = daftar.findIndex((it) => itemKunci(it) === kunci);
  if (i >= 0) daftar[i] = { ...daftar[i], qty: daftar[i].qty + masuk };
  else daftar.push({ slug, ukuran, pot: potFinal, qty: masuk, ditambah: Date.now() });
  tulis(KUNCI.keranjang, daftar);
  return { ok: true, ditambahkan: masuk, terpotong: masuk < qty };
}

export function ubahJumlah(kunci, qty) {
  tulis(
    KUNCI.keranjang,
    baca(KUNCI.keranjang, KOSONG_LIST).map((it) => (itemKunci(it) === kunci ? { ...it, qty: Math.max(1, qty) } : it)),
  );
}

export function hapusItem(kunci) {
  tulis(KUNCI.keranjang, baca(KUNCI.keranjang, KOSONG_LIST).filter((it) => itemKunci(it) !== kunci));
}

export function kosongkanKeranjang() {
  tulis(KUNCI.keranjang, []);
}

// ---------- Pesanan ----------

export function buatPesanan({ pembeli, items, layanan, metode, hadiah }) {
  const sekarang = Date.now();
  const nomor = (Number(baca(KUNCI.nomor, 0)) || NOMOR_AWAL_CONTOH - 1) + 1;
  const kode = buatKode(nomor, sekarang);
  const pesanan = rakitPesanan({ kode, dibuat: sekarang, pembeli, items, layanan, metode, hadiah });
  // Kurangi stok tanaman/produk dan pot pasangannya.
  const inv = structuredClone(baca(KUNCI.inventaris, KOSONG_OBJ));
  const kurangi = (p, ukuranId, n) => {
    const sisa = stokVarian(p, ukuranId, inv);
    inv[p.slug] = inv[p.slug] || {};
    inv[p.slug].stok = { ...(inv[p.slug].stok || {}), [ukuranId]: Math.max(0, sisa - n) };
  };
  for (const it of items) {
    const p = cariProduk(it.slug);
    kurangi(p, it.ukuran, it.qty);
    if (p.jenis === 'tanaman' && it.pot && it.pot !== 'nursery') {
      const pp = produkPot(it.pot);
      const up = ukuranPot(it.pot, ukuranProduk(p, it.ukuran).pot);
      if (pp && up) kurangi(pp, up.id, it.qty);
    }
  }
  tulis(KUNCI.inventaris, inv);
  tulis(KUNCI.pesanan, [pesanan, ...baca(KUNCI.pesanan, KOSONG_LIST)]);
  tulis(KUNCI.nomor, nomor);
  tulis(KUNCI.keranjang, []);
  return kode;
}

export function cariPesanan(daftar, kode) {
  const k = normalKode(kode);
  return daftar.find((p) => normalKode(p.kode) === k) || null;
}

export function ubahStatusPesanan(kode, status) {
  const sekarang = Date.now();
  tulis(
    KUNCI.pesanan,
    baca(KUNCI.pesanan, KOSONG_LIST).map((p) => (p.kode === kode ? terapkanStatus(p, status, sekarang) : p)),
  );
}

// ---------- Inventaris (admin) ----------

export function aturStok(slug, ukuranId, jumlah) {
  const inv = structuredClone(baca(KUNCI.inventaris, KOSONG_OBJ));
  inv[slug] = inv[slug] || {};
  inv[slug].stok = { ...(inv[slug].stok || {}), [ukuranId]: Math.max(0, Math.floor(Number(jumlah) || 0)) };
  tulis(KUNCI.inventaris, inv);
}

export function aturAktif(slug, aktif) {
  const inv = structuredClone(baca(KUNCI.inventaris, KOSONG_OBJ));
  inv[slug] = { ...(inv[slug] || {}), aktif };
  tulis(KUNCI.inventaris, inv);
}

// ---------- Kalender rawat ----------

// kalender = { slugs: [], mulai: ms, mode: 'tiba' | 'sekarang' }
export function simpanKalender(nilai) {
  tulis(KUNCI.kalender, nilai);
}

// ---------- Pesan kontak (demo) ----------

export function simpanPesanKontak(pesan) {
  const daftar = baca(KUNCI.kontak, KOSONG_LIST);
  const baru = { ...pesan, id: `PSN-${String(daftar.length + 1).padStart(3, '0')}`, waktu: Date.now() };
  tulis(KUNCI.kontak, [baru, ...daftar].slice(0, 20));
  return baru;
}
