'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { GambarProduk } from './FotoProduk';
import { Pot } from './FotoPot';
import { TandaHewan, TandaRawat } from './Tanda';
import { cariProduk, cariPotJenis, site } from '@/lib/data';
import { hargaVarian, stokVarian, ukuranAwal, produkAktif, pilihanPot, ukuranProduk, teksCahaya } from '@/lib/katalog';
import { jadwalKirim } from '@/lib/kirim';
import { rupiah, gram, tanggalPanjang } from '@/lib/format';
import { useInventaris, useKeranjang, useTerpasang, tambahKeKeranjang, sisaUntuk } from '@/lib/store';

// Tinggi (cm) teratas dari teks ukuran, mis. "Tinggi 40–50 cm" -> 50. Dipakai penggaris di galeri.
function tinggiMaks(teks) {
  const m = String(teks || '').match(/(\d+)\s*cm/);
  const semua = [...String(teks || '').matchAll(/(\d+)/g)].map((x) => Number(x[1]));
  return m ? Math.max(...semua.filter((n) => n <= 200)) : null;
}

function Penggaris({ cm }) {
  if (!cm) return null;
  const langkah = cm <= 30 ? 5 : cm <= 60 ? 10 : 20;
  const garis = [];
  for (let v = 0; v <= cm; v += langkah) garis.push(v);
  return (
    <div aria-hidden="true" className="absolute bottom-[6.5%] left-[4%] top-[8%] w-10">
      <div className="absolute inset-y-0 left-3 w-[3px] rounded-full bg-tinta/70" />
      {garis.map((v) => (
        <div key={v} className="absolute left-3 flex items-center" style={{ bottom: `${(v / cm) * 100}%`, transform: 'translateY(50%)' }}>
          <span className="h-[2px] w-3 bg-tinta/70" />
          <span className="ms-1 text-[0.68rem] font-semibold tabular-nums text-tinta">{v}</span>
        </div>
      ))}
    </div>
  );
}

export default function DetailProduk({ slug }) {
  const p = cariProduk(slug);
  const tanaman = p.jenis === 'tanaman';
  const terpasang = useTerpasang();
  const invAsli = useInventaris();
  const inv = terpasang ? invAsli : undefined;
  const keranjang = useKeranjang();
  const [u, setU] = useState(() => ukuranAwal(p));
  const [pot, setPot] = useState(tanaman ? 'nursery' : null);
  const [qty, setQty] = useState(1);
  const [tampil, setTampil] = useState('utuh');
  const [pesan, setPesan] = useState(null);
  const [lengket, setLengket] = useState(false);
  const tombolRef = useRef(null);
  const sudah = useRef(false);

  useEffect(() => {
    if (!terpasang || sudah.current) return;
    sudah.current = true;
    if (stokVarian(p, u, invAsli) <= 0) setU(ukuranAwal(p, invAsli));
    const dariUrl = new URLSearchParams(window.location.search).get('pot');
    if (tanaman && dariUrl && cariPotJenis(dariUrl)) setPot(dariUrl);
  }, [terpasang, invAsli, p, u, tanaman]);

  useEffect(() => {
    const el = tombolRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setLengket(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const aktif = produkAktif(p, inv);
  const ukuran = ukuranProduk(p, u);
  const pilihan = pilihanPot(p, u);
  const potDipilih = pilihan.find((x) => x.id === pot);
  const potSah = tanaman && potDipilih && potDipilih.tersedia ? pot : tanaman ? 'nursery' : null;
  const harga = hargaVarian(p, u, potSah);
  const stok = stokVarian(p, u, inv);
  const bisa = terpasang ? sisaUntuk({ slug: p.slug, ukuran: u, pot: potSah }, keranjang, invAsli) : stok;
  const qtyAman = Math.min(Math.max(1, qty), Math.max(1, bisa));
  const diKeranjang = terpasang ? keranjang.filter((it) => it.slug === p.slug && it.ukuran === u).reduce((n, it) => n + it.qty, 0) : 0;
  const kirim = terpasang ? jadwalKirim(Date.now(), tanaman) : null;
  const cm = tanaman ? tinggiMaks(ukuran.tinggi) : null;

  const pilihUkuran = (id) => {
    setU(id);
    setQty(1);
    setPesan(null);
  };

  const tambah = () => {
    if (!aktif || bisa <= 0) return;
    const r = tambahKeKeranjang({ slug: p.slug, ukuran: u, pot: potSah, qty: qtyAman });
    if (r.ok) {
      const potNama = tanaman ? ` + ${cariPotJenis(potSah).pendek.toLowerCase()}` : '';
      setPesan({ ok: true, teks: `${r.ditambahkan} × ${p.nama} (${ukuran.label}${potNama}) masuk keranjang.` });
      setQty(1);
    } else setPesan({ ok: false, teks: 'Stok pilihan ini sudah habis atau semuanya sudah ada di keranjangmu.' });
  };

  const galeri = tanaman
    ? [
        { id: 'utuh', label: 'Tanaman utuh' },
        ...(p.foto?.tata !== 'atas' ? [{ id: 'ukuran', label: `Perkiraan tinggi, ${ukuran.tinggi.toLowerCase()}` }] : []),
        { id: 'dekat', label: 'Daun dari dekat' },
      ]
    : [{ id: 'utuh', label: p.nama }];

  const statusStok = stok <= 0 ? 'Habis untuk ukuran ini' : stok <= 3 ? `Sisa ${stok} di kebun` : `Stok ${stok} di kebun`;

  return (
    <div className="relative">
      <div className="wadah grid gap-x-12 gap-y-8 lg:grid-cols-12">
        {/* Galeri */}
        <div className="lg:col-span-6">
          <div className="lg:sticky lg:top-24">
            <div className="relative">
              <div className={`panggung lengkung relative aspect-[4/5] overflow-hidden ${p.foto?.tata === 'atas' ? 'after:hidden' : ''}`}>
                {tampil === 'dekat' && p.foto ? (
                  <Image src={p.foto.src} alt={`${p.foto.alt}, diperbesar`} fill sizes="(min-width: 1024px) 50vw, 100vw" className="scale-[1.9] object-contain object-[50%_30%]" />
                ) : (
                  <GambarProduk p={p} sizes="(min-width: 1024px) 40vw, 78vw" prioritas judul={tanaman ? undefined : `Foto ${p.nama}`} />
                )}
                {tampil === 'ukuran' && <Penggaris cm={cm} />}
              </div>
              {tanaman && (
                <p className="rapat absolute left-4 top-[16%] rounded-full bg-kertas/90 px-2.5 py-1 text-[0.64rem] text-tinta-2">
                  {tampil === 'ukuran' ? `${ukuran.label} · ${ukuran.tinggi}` : 'Foto contoh tanaman sejenis'}
                </p>
              )}
            </div>
            {galeri.length > 1 && (
              <ul className="mt-3 flex gap-2" aria-label="Tampilan gambar">
                {galeri.map((g) => (
                  <li key={g.id}>
                    <button
                      type="button"
                      onClick={() => setTampil(g.id)}
                      aria-pressed={tampil === g.id}
                      className={`relative block h-20 w-16 overflow-hidden rounded-lg border-2 sm:h-24 sm:w-20 ${tampil === g.id ? 'border-daun' : 'border-transparent hover:border-garis-tua'}`}
                    >
                      <span className="panggung absolute inset-0 after:hidden">
                        {g.id === 'dekat' ? (
                          <Image src={p.foto.src} alt="" fill sizes="80px" className="scale-[1.9] object-contain object-[50%_30%]" />
                        ) : (
                          <GambarProduk p={p} sizes="80px" judul="" />
                        )}
                        {g.id === 'ukuran' && <span aria-hidden="true" className="absolute bottom-[8%] left-[10%] top-[10%] w-[3px] rounded-full bg-tinta/70" />}
                      </span>
                      <span className="sr-only">{g.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Info beli */}
        <div className="lg:col-span-6">
          {p.latin && (
            <p className="latin text-[1.1rem] text-daun">
              {p.latin} <span className="font-sans text-[0.85rem] not-italic text-tinta-2">· {p.famili}</span>
            </p>
          )}
          <h1 className="mt-1 text-[2.45rem] leading-[1.04] sm:text-[3.2rem]">{p.nama}</h1>
          <p className="mt-3 text-[1.05rem] text-tinta-2">{p.ringkas}</p>
          {tanaman && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              <TandaRawat n={p.rawat} />
              {p.hewan && <TandaHewan />}
              <span className="label-tancap" style={{ '--tag-bg': '#e3e9df' }}>
                {teksCahaya(p)}
              </span>
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-end gap-x-4 gap-y-1 border-y border-garis py-4">
            <p className="text-[2rem] font-semibold leading-none tracking-tight tabular-nums">{rupiah(harga)}</p>
            <p className="pb-0.5 text-[0.9rem] text-tinta-2">
              {ukuran.label}
              {tanaman && ` · pot Ø ${ukuran.pot} cm · ${cariPotJenis(potSah).pendek.toLowerCase()}`}
            </p>
          </div>

          {!aktif && (
            <p className="mt-5 rounded-xl border border-awas bg-[#fdf5f2] p-3 text-awas" role="status">
              Produk ini sedang tidak dijual. Penjual menonaktifkannya dari dasbor demo.
            </p>
          )}

          <fieldset className="mt-6">
            <legend className="font-semibold">Ukuran</legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {p.ukuran.map((x) => {
                const s = stokVarian(p, x.id, inv);
                const habis = s <= 0;
                return (
                  <label key={x.id} className="pilih flex items-start justify-between gap-3 p-3">
                    <input type="radio" name={`ukuran-${p.slug}`} value={x.id} checked={u === x.id} disabled={habis} onChange={() => pilihUkuran(x.id)} className="sr-only" />
                    <span className="min-w-0">
                      <span className="block font-semibold">{x.label}</span>
                      <span className="block text-[0.85rem] text-tinta-2">
                        {tanaman ? `${x.tinggi} · pot Ø ${x.pot} cm` : `Berat ±${gram(x.berat)}`}
                      </span>
                    </span>
                    <span className="shrink-0 text-end">
                      <span className="block text-[0.92rem] font-semibold tabular-nums">{rupiah(x.harga)}</span>
                      <span className={`block text-[0.75rem] ${habis || s <= 3 ? 'font-semibold text-awas' : 'text-tinta-2'}`}>{habis ? 'Habis' : s <= 3 ? `Sisa ${s}` : `Stok ${s}`}</span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          {tanaman && (
            <fieldset className="mt-6">
              <legend className="font-semibold">
                Padanan pot <span className="font-normal text-tinta-2">· ditanam ulang di kebun sebelum dikirim</span>
              </legend>
              <div className="mt-3 grid gap-2">
                {pilihan.map((x) => (
                  <label key={x.id} className="pilih flex items-center gap-3 p-2.5 pe-3">
                    <input type="radio" name={`pot-${p.slug}`} value={x.id} checked={potSah === x.id} disabled={!x.tersedia} onChange={() => setPot(x.id)} className="sr-only" />
                    <span className="panggung relative block h-14 w-14 shrink-0 overflow-hidden rounded-lg after:hidden">
                      <Pot jenis={x.id} className="absolute inset-[8%] h-[84%] w-[84%]" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="font-semibold">{x.nama}</span>
                        {x.cocok === 'saran' && (
                          <span className="label-tancap" style={{ '--tag-bg': '#dde9cc' }}>
                            Disarankan
                          </span>
                        )}
                        {x.cocok === 'hindari' && (
                          <span className="label-tancap" style={{ '--tag-bg': '#f3dccf' }}>
                            Kurang cocok
                          </span>
                        )}
                      </span>
                      <span className="mt-0.5 block text-[0.82rem] leading-snug text-tinta-2">
                        {!x.tersedia ? `Belum ada ukuran Ø ${ukuran.pot} cm.` : x.cocok === 'hindari' ? x.alasan : x.sifat}
                      </span>
                    </span>
                    <span className="shrink-0 text-[0.9rem] font-semibold tabular-nums">{x.tersedia ? (x.harga ? `+${rupiah(x.harga)}` : 'Gratis') : '–'}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          <div className="mt-6">
            <p className={`text-[0.95rem] font-medium ${stok <= 3 ? 'text-awas' : 'text-aman'}`}>
              {statusStok}
              {diKeranjang > 0 && <span className="font-normal text-tinta-2"> · {diKeranjang} sudah di keranjangmu</span>}
            </p>
            <div className="mt-3 flex flex-wrap items-stretch gap-3">
              <div className="flex items-stretch rounded-full border-[1.5px] border-garis-isian bg-kertas" role="group" aria-label="Jumlah">
                <button type="button" className="w-11 text-xl disabled:text-tinta-3" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qtyAman <= 1 || bisa <= 0} aria-label="Kurangi jumlah">
                  −
                </button>
                <label htmlFor={`qty-${p.slug}`} className="sr-only">
                  Jumlah
                </label>
                <input
                  id={`qty-${p.slug}`}
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={Math.max(1, bisa)}
                  value={qtyAman}
                  onChange={(e) => setQty(Number(e.target.value) || 1)}
                  disabled={bisa <= 0 || !aktif}
                  className="w-10 bg-transparent text-center font-semibold [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <button type="button" className="w-11 text-xl disabled:text-tinta-3" onClick={() => setQty((q) => Math.min(bisa, q + 1))} disabled={qtyAman >= bisa} aria-label="Tambah jumlah">
                  +
                </button>
              </div>
              <button ref={tombolRef} type="button" className="tombol tombol-utama flex-1 px-6" onClick={tambah} disabled={!aktif || bisa <= 0}>
                {!aktif ? 'Tidak dijual' : stok <= 0 ? 'Habis' : bisa <= 0 ? 'Semua stok ada di keranjang' : 'Masukkan keranjang'}
              </button>
            </div>
            <div role="status" aria-live="polite" className="min-h-[1.5rem]">
              {pesan && (
                <p className={`mt-3 rounded-xl p-3 text-[0.95rem] ${pesan.ok ? 'bg-pupus-muda text-tinta' : 'bg-[#fdf5f2] text-awas'}`}>
                  {pesan.teks}{' '}
                  {pesan.ok && (
                    <Link href="/keranjang" className="tautan font-semibold">
                      Lihat keranjang
                    </Link>
                  )}
                </p>
              )}
            </div>
            <p className="mt-1 text-[0.88rem] text-tinta-2">
              {tanaman ? 'Tanaman hidup dikirim Senin–Rabu. ' : 'Dikirim Senin–Sabtu. '}
              {kirim && (kirim.hariIni ? `Bayar sebelum ${String(site.batasKemasJam).padStart(2, '0')}.00 WIB, dikirim hari ini.` : `Dibayar sekarang, dikirim ${tanggalPanjang(kirim.tanggal)}.`)}{' '}
              <Link href="/pengiriman" className="tautan">
                Cara mengemas
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Bilah beli lengket untuk ponsel */}
      <div
        className={`sticky bottom-0 z-30 mt-10 border-t border-garis bg-kertas/95 py-3 shadow-[0_-8px_20px_-12px_rgb(21_50_42/0.35)] transition-opacity lg:hidden ${
          lengket ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!lengket}
      >
        <div className="wadah flex items-center gap-3">
          <span className="panggung relative block h-12 w-10 shrink-0 overflow-hidden rounded-md after:hidden">
            <GambarProduk p={p} sizes="48px" judul="" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[0.85rem] text-tinta-2">
              {ukuran.label}
              {tanaman && ` · ${cariPotJenis(potSah).pendek.toLowerCase()}`}
            </p>
            <p className="font-semibold tabular-nums">{rupiah(harga)}</p>
          </div>
          <button type="button" className="tombol tombol-utama px-5" onClick={tambah} disabled={!aktif || bisa <= 0} tabIndex={lengket ? 0 : -1}>
            {bisa <= 0 ? 'Habis' : 'Masukkan keranjang'}
          </button>
        </div>
      </div>
    </div>
  );
}
