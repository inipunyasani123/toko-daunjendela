'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { GambarProduk } from './FotoProduk';
import { WARNA_CAHAYA } from './PitaCahaya';
import { TandaHewan, TandaRawat } from './Tanda';
import { IkonCentang, IkonPeringatan } from './Ikon';
import { pertanyaan, bacaJawaban, keQuery, cariTanaman, jumlahDijawab } from '@/lib/penemu';
import { hargaTermurah, produkAktif } from '@/lib/katalog';
import { rupiah } from '@/lib/format';
import { useInventaris, useTerpasang } from '@/lib/store';

const GRUP = [
  { id: 'sangat', judul: 'Sangat cocok', ket: 'Cocok di semua hal yang kamu jawab.' },
  { id: 'cocok', judul: 'Cocok, dengan catatan', ket: 'Bisa betah kalau kamu memperhatikan catatannya.' },
];

function Hasil({ h }) {
  const p = h.p;
  return (
    <li className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-4 rounded-[1.25rem] border border-garis bg-kertas p-3 sm:grid-cols-[7rem_minmax(0,1fr)] sm:p-4">
      <Link href={`/produk/${p.slug}`} tabIndex={-1} aria-hidden="true" className={`panggung lengkung-sm relative block aspect-[4/5] overflow-hidden ${p.foto?.tata === 'atas' ? 'after:hidden' : ''}`}>
        <GambarProduk p={p} sizes="112px" judul="" />
      </Link>
      <div className="min-w-0">
        <p className="latin text-[0.85rem] text-tinta-2">{p.latin}</p>
        <h3 className="text-[1.25rem] leading-snug">
          <Link href={`/produk/${p.slug}`} className="hover:underline">
            {p.nama}
          </Link>
        </h3>
        <p className="mt-0.5 text-[0.9rem]">
          <span className="text-tinta-2">mulai </span>
          <span className="font-semibold tabular-nums">{rupiah(hargaTermurah(p))}</span>
        </p>
        {(h.alasan.length > 0 || h.catatan.length > 0 || h.tolak) && (
          <ul className="mt-2 grid gap-1 text-[0.86rem]">
            {h.tolak && (
              <li className="flex gap-2 text-awas">
                <IkonPeringatan className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{h.tolak}</span>
              </li>
            )}
            {h.alasan.map((a) => (
              <li key={a} className="flex gap-2">
                <IkonCentang className="mt-0.5 h-4 w-4 shrink-0 text-aman" />
                <span>{a}</span>
              </li>
            ))}
            {h.catatan.map((c) => (
              <li key={c} className="flex gap-2 text-tinta-2">
                <span aria-hidden="true" className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-cahaya ring-1 ring-tinta/30" />
                <span>
                  <span className="sr-only">Catatan: </span>
                  {c}
                </span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          <TandaRawat n={p.rawat} />
          {p.hewan && <TandaHewan />}
        </div>
      </div>
    </li>
  );
}

export default function Penemu() {
  const sp = useSearchParams();
  const path = usePathname();
  const [j, setJ] = useState(() => bacaJawaban(sp));
  const inventaris = useInventaris();
  const terpasang = useTerpasang();
  const kunci = sp.toString();
  useEffect(() => {
    setJ(bacaJawaban(new URLSearchParams(kunci)));
  }, [kunci]);

  const ubah = (id, nilai) => {
    const baru = { ...j, [id]: j[id] === nilai ? undefined : nilai };
    Object.keys(baru).forEach((k) => baru[k] === undefined && delete baru[k]);
    setJ(baru);
    window.history.replaceState(null, '', `${path}${keQuery(baru)}`);
  };

  const n = jumlahDijawab(j);
  const hasil = useMemo(() => cariTanaman(j).filter((h) => produkAktif(h.p, terpasang ? inventaris : undefined)), [j, inventaris, terpasang]);
  const kurang = hasil.filter((h) => h.tingkat === 'kurang');

  return (
    <div className="wadah grid gap-10 pb-20 lg:grid-cols-12">
      <form className="grid content-start gap-6 lg:col-span-5" onSubmit={(e) => e.preventDefault()} aria-label="Kondisi ruanganmu">
        {pertanyaan.map((q, i) => (
          <fieldset key={q.id} className="rounded-[1.25rem] border border-garis bg-kertas p-4 sm:p-5">
            <legend className="float-left w-full">
              <span className="rapat block text-[0.75rem] text-tinta-2">Pertanyaan {i + 1} dari {pertanyaan.length}</span>
              <span className="mt-1 block font-display text-[1.35rem] font-semibold leading-snug">{q.judul}</span>
            </legend>
            <p className="clear-both pt-1 text-[0.86rem] text-tinta-2">{q.bantu}</p>
            <div className={`mt-3 grid gap-2 ${q.id === 'cahaya' ? '' : 'sm:grid-cols-2'}`}>
              {q.pilihan.map((o) => (
                <label key={o.nilai} className="pilih flex items-start gap-3 p-3">
                  <input
                    type="radio"
                    name={q.id}
                    value={o.nilai}
                    checked={j[q.id] === o.nilai}
                    onChange={() => ubah(q.id, o.nilai)}
                    onClick={() => j[q.id] === o.nilai && ubah(q.id, o.nilai)}
                    className="mt-1 h-[1.25rem] w-[1.25rem] shrink-0 accent-[#1f5c43]"
                  />
                  {q.id === 'cahaya' && (
                    <span aria-hidden="true" className="mt-0.5 h-6 w-6 shrink-0 rounded-md ring-1 ring-tinta/20" style={{ background: WARNA_CAHAYA[Number(o.nilai)] }} />
                  )}
                  <span className="leading-snug">
                    <span className="block font-semibold">{o.label}</span>
                    <span className="block text-[0.82rem] text-tinta-2">{o.ket}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
        {n > 0 && (
          <button type="button" className="tautan justify-self-start font-medium" onClick={() => { setJ({}); window.history.replaceState(null, '', path); }}>
            Ulangi dari awal
          </button>
        )}
      </form>

      <section aria-labelledby="judul-hasil" className="lg:col-span-7">
        <div className="lg:sticky lg:top-24">
          <h2 id="judul-hasil" className="border-t-2 border-tinta pt-4 text-[2rem]">
            {n === 0 ? 'Saran akan muncul di sini' : 'Saran untuk tempatmu'}
          </h2>
          <p className="mt-1 text-[0.92rem] text-tinta-2" aria-live="polite">
            {n === 0
              ? 'Mulai dari pertanyaan cahaya. Satu jawaban saja sudah cukup untuk menyaring, makin banyak makin tepat.'
              : `${n} dari ${pertanyaan.length} pertanyaan dijawab. ${hasil.filter((h) => h.tingkat !== 'kurang').length} tanaman cocok.`}
          </p>
        </div>
        {n > 0 && (
          <div className="mt-6 grid gap-8">
            {GRUP.map((g) => {
              const isi = hasil.filter((h) => h.tingkat === g.id);
              if (!isi.length) return null;
              return (
                <div key={g.id}>
                  <h3 className="flex flex-wrap items-baseline gap-x-3 font-sans text-[1.05rem] font-semibold tracking-normal">
                    {g.judul} <span className="text-[0.85rem] font-normal text-tinta-2">{isi.length} tanaman · {g.ket}</span>
                  </h3>
                  <ul className="mt-3 grid gap-3">
                    {isi.map((h) => (
                      <Hasil key={h.p.slug} h={h} />
                    ))}
                  </ul>
                </div>
              );
            })}
            {hasil.every((h) => h.tingkat === 'kurang') && (
              <p className="rounded-[1.25rem] border border-dashed border-garis-tua bg-kertas p-5 text-tinta-2">
                Belum ada tanaman di kebun kami yang cocok dengan semua jawabanmu. Coba longgarkan satu jawaban, misalnya soal waktu luang, atau lihat
                catatan di daftar kurang cocok di bawah.
              </p>
            )}
            {kurang.length > 0 && (
              <details className="group rounded-[1.25rem] border border-garis bg-kapur-2/60 p-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold [&::-webkit-details-marker]:hidden">
                  Kurang cocok untuk tempatmu ({kurang.length})
                  <span aria-hidden="true" className="text-lg leading-none text-daun transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <ul className="mt-4 grid gap-3">
                  {kurang.map((h) => (
                    <Hasil key={h.p.slug} h={h} />
                  ))}
                </ul>
              </details>
            )}
          </div>
        )}
        {n === 0 && (
          <ul className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4" aria-label="Tanaman yang akan disaring">
            {hasil.slice(0, 8).map((h) => (
              <li key={h.p.slug} className={`panggung lengkung-sm relative aspect-[4/5] overflow-hidden ${h.p.foto?.tata === 'atas' ? 'after:hidden' : ''}`}>
                <GambarProduk p={h.p} sizes="120px" judul={h.p.nama} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
