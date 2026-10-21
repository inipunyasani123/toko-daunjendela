'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { GambarProduk } from './FotoProduk';
import { cariProduk, tanaman as daftarTanaman } from '@/lib/data';
import { hargaVarian, beratVarian, labelVarian, stokVarian, produkAktif, hargaTermurah, ukuranProduk, ukuranPot, produkPot } from '@/lib/katalog';
import { jadwalKirim } from '@/lib/kirim';
import { rupiah, gram, tanggalPanjang } from '@/lib/format';
import { useKeranjang, useInventaris, useTerpasang, ubahJumlah, hapusItem, itemKunci, sisaUntuk } from '@/lib/store';

export function rakitIsiKeranjang(keranjang, inv) {
  return keranjang
    .map((it) => {
      const p = cariProduk(it.slug);
      if (!p) return null;
      const lain = keranjang.filter((x) => itemKunci(x) !== itemKunci(it));
      const maks = sisaUntuk(it, lain, inv);
      let potHabis = false;
      if (p.jenis === 'tanaman' && it.pot && it.pot !== 'nursery') {
        const pp = produkPot(it.pot);
        const up = ukuranPot(it.pot, ukuranProduk(p, it.ukuran).pot);
        potHabis = !pp || !up || stokVarian(pp, up.id, inv) <= 0 || !produkAktif(pp, inv);
      }
      return {
        ...it,
        kunci: itemKunci(it),
        p,
        maks,
        aktif: produkAktif(p, inv),
        stokProduk: stokVarian(p, it.ukuran, inv),
        potHabis,
        harga: hargaVarian(p, it.ukuran, it.pot),
        berat: beratVarian(p, it.ukuran, it.pot),
        label: labelVarian(p, it.ukuran, it.pot),
      };
    })
    .filter(Boolean);
}

export function masalahItem(it) {
  if (!it.aktif) return 'Produk ini sedang tidak dijual.';
  if (it.stokProduk <= 0) return 'Stok ukuran ini habis.';
  if (it.potHabis) return 'Pot pasangan untuk ukuran ini habis. Hapus lalu pilih pot lain.';
  if (it.maks <= 0) return 'Stok tidak cukup.';
  return '';
}

function Stepper({ it }) {
  return (
    <div className="flex items-stretch rounded-full border-[1.5px] border-garis-isian bg-kertas" role="group" aria-label={`Jumlah ${it.p.nama}`}>
      <button type="button" className="min-h-10 w-10 text-lg disabled:text-tinta-3" onClick={() => ubahJumlah(it.kunci, it.qty - 1)} disabled={it.qty <= 1} aria-label={`Kurangi ${it.p.nama}`}>
        −
      </button>
      <span className="flex w-9 items-center justify-center font-semibold tabular-nums" aria-live="polite">
        <span className="sr-only">Jumlah: </span>
        {it.qty}
      </span>
      <button type="button" className="min-h-10 w-10 text-lg disabled:text-tinta-3" onClick={() => ubahJumlah(it.kunci, it.qty + 1)} disabled={it.qty >= it.maks} aria-label={`Tambah ${it.p.nama}`}>
        +
      </button>
    </div>
  );
}

export default function Keranjang() {
  const terpasang = useTerpasang();
  const keranjang = useKeranjang();
  const inv = useInventaris();
  const isi = rakitIsiKeranjang(keranjang, inv);

  useEffect(() => {
    for (const it of isi) if (it.maks > 0 && it.qty > it.maks) ubahJumlah(it.kunci, it.maks);
  }, [isi]);

  if (!terpasang) {
    return (
      <div className="wadah pb-24">
        <p className="text-tinta-2" role="status">
          Memuat keranjang…
        </p>
      </div>
    );
  }

  if (!isi.length) {
    const saran = ['lidah-mertua', 'sirih-gading', 'peperomia'].map(cariProduk);
    return (
      <div className="wadah pb-24">
        <div className="rounded-[1.5rem] border border-dashed border-garis-tua bg-kertas p-6 sm:p-10">
          <h2 className="text-3xl">Keranjangmu masih kosong</h2>
          <p className="mt-2 max-w-md text-tinta-2">Belum tahu mulai dari mana? Jawab lima pertanyaan soal ruanganmu, atau mulai dari tanaman yang paling memaafkan.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/cari-tanaman" className="tombol tombol-utama">
              Cari yang betah
            </Link>
            <Link href="/katalog" className="tombol tombol-garis">
              Lihat {daftarTanaman.length} tanaman
            </Link>
          </div>
        </div>
        <h2 className="mt-14 text-2xl">Mulai dari yang memaafkan</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-3">
          {saran.map((p) => (
            <li key={p.slug}>
              <Link href={`/produk/${p.slug}`} className="group flex items-center gap-3 rounded-2xl border border-garis bg-kertas p-3 hover:border-daun">
                <span className="panggung relative block h-20 w-16 shrink-0 overflow-hidden rounded-lg after:hidden">
                  <GambarProduk p={p} sizes="64px" judul="" />
                </span>
                <span>
                  <span className="block font-semibold group-hover:underline">{p.nama}</span>
                  <span className="block text-[0.9rem] text-tinta-2">mulai {rupiah(hargaTermurah(p))}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const subtotal = isi.reduce((n, it) => n + it.harga * it.qty, 0);
  const berat = isi.reduce((n, it) => n + it.berat * it.qty, 0);
  const jumlah = isi.reduce((n, it) => n + it.qty, 0);
  const masalah = isi.filter((it) => masalahItem(it));
  const adaTanaman = isi.some((it) => it.p.jenis === 'tanaman');
  const kirim = jadwalKirim(Date.now(), adaTanaman);

  return (
    <div className="wadah grid gap-10 pb-6 lg:grid-cols-12">
      <section aria-labelledby="judul-isi" className="lg:col-span-8">
        <h2 id="judul-isi" className="sr-only">
          Isi keranjang
        </h2>
        <ul className="border-t-2 border-tinta">
          {isi.map((it) => {
            const salah = masalahItem(it);
            return (
              <li key={it.kunci} className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-4 border-b border-garis py-5 sm:grid-cols-[7rem_minmax(0,1fr)_auto]">
                <Link href={`/produk/${it.slug}`} className={`panggung lengkung-sm relative block aspect-[4/5] overflow-hidden ${it.p.foto?.tata === 'atas' ? 'after:hidden' : ''}`} tabIndex={-1} aria-hidden="true">
                  <GambarProduk p={it.p} sizes="112px" judul="" />
                </Link>
                <div className="min-w-0">
                  <h3 className="text-[1.3rem] leading-snug">
                    <Link href={`/produk/${it.slug}`} className="hover:underline">
                      {it.p.nama}
                    </Link>
                  </h3>
                  <p className="text-[0.92rem] text-tinta-2">{it.label}</p>
                  <p className="mt-1 text-[0.92rem]">
                    {rupiah(it.harga)} <span className="text-tinta-2">· {gram(it.berat)}</span>
                  </p>
                  {salah ? (
                    <p className="mt-2 text-[0.9rem] font-medium text-awas">{salah} Hapus dari keranjang untuk melanjutkan.</p>
                  ) : it.qty >= it.maks ? (
                    <p className="mt-2 text-[0.85rem] text-awas">Sudah maksimal sesuai stok.</p>
                  ) : null}
                  <div className="mt-3 flex flex-wrap items-center gap-4 sm:hidden">
                    {!salah && <Stepper it={it} />}
                    <button type="button" className="tautan text-[0.92rem]" onClick={() => hapusItem(it.kunci)}>
                      Hapus<span className="sr-only"> {it.p.nama}</span>
                    </button>
                  </div>
                </div>
                <div className="hidden flex-col items-end justify-between gap-3 sm:flex">
                  <p className="text-lg font-semibold tabular-nums">{rupiah(it.harga * it.qty)}</p>
                  {!salah && <Stepper it={it} />}
                  <button type="button" className="tautan text-[0.92rem]" onClick={() => hapusItem(it.kunci)}>
                    Hapus<span className="sr-only"> {it.p.nama}</span>
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
        <Link href="/katalog" className="tautan mt-5 inline-block font-medium">
          Lanjut belanja
        </Link>
      </section>

      <aside aria-labelledby="judul-ringkas" className="lg:col-span-4">
        <div className="rounded-[1.5rem] border border-garis bg-kertas p-5 sm:p-6 lg:sticky lg:top-24">
          <h2 id="judul-ringkas" className="text-2xl">
            Ringkasan
          </h2>
          <dl className="mt-4 grid gap-2 text-[0.95rem]">
            <div className="flex justify-between gap-4">
              <dt className="text-tinta-2">Subtotal ({jumlah} barang)</dt>
              <dd className="font-semibold tabular-nums">{rupiah(subtotal)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-tinta-2">Berat asli</dt>
              <dd className="tabular-nums">{gram(berat)}</dd>
            </div>
          </dl>
          <p className="mt-4 border-t border-garis pt-4 text-[0.88rem] text-tinta-2">
            {adaTanaman ? 'Ada tanaman hidup, jadi pesanan ikut jadwal kirim Senin–Rabu. ' : ''}
            Dibayar sekarang, dikirim {kirim.hariIni ? 'hari ini' : tanggalPanjang(kirim.tanggal)}. Ongkir dihitung di checkout dari zona tujuan dan ukuran
            kardus.
          </p>
          {masalah.length > 0 ? (
            <>
              <p className="mt-4 text-[0.9rem] font-medium text-awas" role="status">
                Ada {masalah.length} barang yang tidak bisa dipesan. Hapus dulu untuk melanjutkan.
              </p>
              <span className="tombol mt-4 w-full" aria-disabled="true">
                Lanjut ke checkout
              </span>
            </>
          ) : (
            <Link href="/checkout" className="tombol tombol-utama mt-5 w-full">
              Lanjut ke checkout
            </Link>
          )}
        </div>
      </aside>

      {masalah.length === 0 && (
        <div className="sticky bottom-0 z-30 -mx-4 border-t border-garis bg-kertas/95 px-4 py-3 shadow-[0_-8px_20px_-12px_rgb(21_50_42/0.35)] sm:-mx-6 sm:px-6 lg:hidden">
          <div className="flex items-center gap-3">
            <p className="min-w-0 flex-1">
              <span className="block text-[0.82rem] text-tinta-2">Subtotal {jumlah} barang</span>
              <span className="block font-semibold tabular-nums">{rupiah(subtotal)}</span>
            </p>
            <Link href="/checkout" className="tombol tombol-utama px-5">
              Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
