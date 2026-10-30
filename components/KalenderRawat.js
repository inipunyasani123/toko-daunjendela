'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { GambarProduk } from './FotoProduk';
import { IKON_TUGAS, IkonKalender } from './Ikon';
import { unduhICS } from './KalenderMini';
import { tanaman, cariProduk } from '@/lib/data';
import { susunJadwal, TUGAS, intervalSiram } from '@/lib/rawat';
import { awalHariWIB, kunciHariWIB, bagianWIB, tanggalPendek, tanggalPanjang, hariPendek, HARI_MS, musim } from '@/lib/format';
import { useKalender, usePesanan, useTerpasang, simpanKalender } from '@/lib/store';

const HARI = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

// "2026-10-19" (WIB) <-> ms 00.00 WIB
function keMs(kunci) {
  const [y, m, d] = kunci.split('-').map(Number);
  return Date.UTC(y, m - 1, d) - 7 * 3600000;
}

export default function KalenderRawat() {
  const terpasang = useTerpasang();
  const tersimpan = useKalender();
  const pesanan = usePesanan();
  const [pilih, setPilih] = useState([]);
  const [tiba, setTiba] = useState('');
  const awalDiisi = useRef(false);

  useEffect(() => {
    if (!terpasang || awalDiisi.current) return;
    awalDiisi.current = true;
    const dariUrl = new URLSearchParams(window.location.search).get('tanaman');
    const sah = (s) => s && cariProduk(s)?.jenis === 'tanaman';
    if (sah(dariUrl)) {
      setPilih([dariUrl]);
      setTiba(kunciHariWIB(Date.now()));
    } else if (tersimpan?.slugs?.length) {
      setPilih(tersimpan.slugs.filter(sah));
      setTiba(tersimpan.tiba || kunciHariWIB(Date.now()));
    } else {
      setPilih(['sirih-gading', 'kalatea-zebra']);
      setTiba(kunciHariWIB(Date.now()));
    }
  }, [terpasang, tersimpan]);

  useEffect(() => {
    if (!awalDiisi.current || !tiba) return;
    simpanKalender({ slugs: pilih, tiba });
  }, [pilih, tiba]);

  const dariPesanan = useMemo(() => {
    const set = new Map();
    for (const o of pesanan) {
      for (const it of o.items) if (cariProduk(it.slug)?.jenis === 'tanaman' && !set.has(it.slug)) set.set(it.slug, o);
    }
    return [...set.entries()];
  }, [pesanan]);

  if (!terpasang || !tiba) {
    return (
      <div className="wadah pb-20">
        <p className="text-tinta-2" role="status">
          Menyiapkan kalender…
        </p>
      </div>
    );
  }

  const mulai = keMs(tiba);
  const kini = Date.now();
  const hariKe = Math.round((awalHariWIB(kini) - mulai) / HARI_MS);
  // Grid dimulai Senin pada minggu tanggal tiba, empat minggu.
  const geser = (bagianWIB(mulai).hariMinggu + 6) % 7;
  const awalGrid = mulai - geser * HARI_MS;
  const { jadwal } = susunJadwal(pilih, mulai, 28 + 7, 'tiba');
  const minggu = Array.from({ length: 5 }, (_, w) => Array.from({ length: 7 }, (_, d) => awalGrid + (w * 7 + d) * HARI_MS)).filter((m) => m[0] <= mulai + 27 * HARI_MS);
  const agenda = Array.from({ length: 28 }, (_, i) => mulai + i * HARI_MS).filter((d) => (jadwal[kunciHariWIB(d + 3600000)] || []).length);
  const balik = (slug) => setPilih((x) => (x.includes(slug) ? x.filter((s) => s !== slug) : [...x, slug]));
  const m = musim(kini);

  return (
    <div className="wadah grid gap-10 pb-20 lg:grid-cols-12">
      <div className="tanpa-cetak grid content-start gap-6 lg:col-span-4">
        <div className="rounded-[1.25rem] border border-garis bg-kertas p-4 sm:p-5">
          <label htmlFor="tanggal-tiba" className="font-semibold">
            Tanggal tanaman tiba
          </label>
          <p className="text-[0.85rem] text-tinta-2">Hari ke-0. Pupuk baru dimulai setelah empat minggu.</p>
          <input id="tanggal-tiba" type="date" className="isian mt-2" value={tiba} onChange={(e) => e.target.value && setTiba(e.target.value)} />
          <p className="mt-2 text-[0.85rem] text-tinta-2">
            {hariKe === 0 ? 'Tiba hari ini.' : hariKe > 0 ? `Sudah ${hariKe} hari sejak tiba.` : `Tiba ${-hariKe} hari lagi.`}
          </p>
        </div>

        {dariPesanan.length > 0 && (
          <div className="rounded-[1.25rem] border border-garis bg-embun p-4 sm:p-5">
            <p className="font-semibold">Dari pesanan di browser ini</p>
            <p className="text-[0.85rem] text-tinta-2">{dariPesanan.length} jenis tanaman di pesananmu dan pesanan contoh.</p>
            <button type="button" className="tombol tombol-garis mt-3 min-h-10 py-2 text-[0.92rem]" onClick={() => setPilih(dariPesanan.map(([s]) => s))}>
              Pakai tanaman dari pesanan
            </button>
          </div>
        )}

        <fieldset className="rounded-[1.25rem] border border-garis bg-kertas p-4 sm:p-5">
          <legend className="float-left w-full font-semibold">Tanaman ({pilih.length} dipilih)</legend>
          <ul className="clear-both grid gap-1 pt-2">
            {tanaman.map((p) => (
              <li key={p.slug}>
                <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-1 py-1 hover:bg-kapur-2">
                  <input type="checkbox" className="h-[1.25rem] w-[1.25rem] accent-[#1f5c43]" checked={pilih.includes(p.slug)} onChange={() => balik(p.slug)} />
                  <span className={`panggung relative block h-10 w-8 shrink-0 overflow-hidden rounded-md after:hidden`}>
                    <GambarProduk p={p} sizes="40px" judul="" />
                  </span>
                  <span className="min-w-0 flex-1 leading-tight">
                    <span className="block text-[0.92rem]">{p.nama}</span>
                    <span className="block text-[0.75rem] text-tinta-2">cek tiap {intervalSiram(p)} hari</span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
      </div>

      <section aria-labelledby="judul-jadwal" className="lg:col-span-8">
        <div className="flex flex-wrap items-end justify-between gap-3 border-t-2 border-tinta pt-4">
          <div>
            <h2 id="judul-jadwal" className="text-[2rem]">
              Empat minggu pertama
            </h2>
            <p className="text-[0.9rem] text-tinta-2">
              Mulai {tanggalPanjang(mulai)}. Sekarang {m.nama}: {m.id === 'kemarau' ? 'media lebih cepat kering.' : 'udara lebih lembap, selalu cek media dulu.'}
            </p>
          </div>
          <div className="tanpa-cetak flex flex-wrap gap-2">
            <button type="button" className="tombol tombol-utama min-h-10 py-2 text-[0.92rem]" disabled={!pilih.length} onClick={() => unduhICS(pilih, mulai)}>
              <IkonKalender className="h-4.5 w-4.5" />
              Simpan ke kalender (.ics)
            </button>
            <button type="button" className="tombol tombol-garis min-h-10 py-2 text-[0.92rem]" onClick={() => window.print()}>
              Cetak
            </button>
          </div>
        </div>

        {!pilih.length ? (
          <p className="mt-6 rounded-[1.25rem] border border-dashed border-garis-tua bg-kertas p-5 text-tinta-2">Pilih minimal satu tanaman untuk melihat jadwalnya.</p>
        ) : (
          <>
            <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-[0.82rem] text-tinta-2" aria-label="Arti ikon">
              {Object.entries(TUGAS).map(([id, t]) => {
                const Ikon = IKON_TUGAS[id];
                return (
                  <li key={id} className="inline-flex items-center gap-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full text-white" style={{ background: t.warna }}>
                      <Ikon className="h-3 w-3" />
                    </span>
                    {t.nama}
                  </li>
                );
              })}
            </ul>

            {/* Kisi kalender (layar lebar) */}
            <div className="mt-5 hidden md:block">
              <div className="grid grid-cols-7 gap-1.5 text-center text-[0.75rem] font-semibold uppercase tracking-wide text-tinta-2" aria-hidden="true">
                {HARI.map((h) => (
                  <span key={h}>{h}</span>
                ))}
              </div>
              <div className="mt-1.5 grid gap-1.5">
                {minggu.map((baris) => (
                  <div key={baris[0]} className="grid grid-cols-7 gap-1.5">
                    {baris.map((d) => {
                      const k = kunciHariWIB(d + 3600000);
                      const isi = d >= mulai && d < mulai + 28 * HARI_MS ? jadwal[k] || [] : null;
                      const hariIni = d === awalHariWIB(kini);
                      return (
                        <div
                          key={d}
                          className={`min-h-[6.5rem] rounded-xl p-2 ${isi === null ? 'bg-transparent' : hariIni ? 'bg-embun ring-2 ring-daun/50' : 'bg-kertas ring-1 ring-garis'}`}
                        >
                          <p className={`text-[0.8rem] tabular-nums ${isi === null ? 'text-tinta-3' : 'font-semibold'}`}>
                            {tanggalPendek(d)}
                            {hariIni && <span className="ms-1 font-normal text-daun">· hari ini</span>}
                          </p>
                          {isi && (
                            <ul className="mt-1 grid gap-1">
                              {isi.map((t, i) => {
                                const Ikon = IKON_TUGAS[t.tugas];
                                return (
                                  <li key={`${t.slug}-${t.tugas}-${i}`} className="flex items-start gap-1 text-[0.75rem] leading-tight">
                                    <span className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full text-white" style={{ background: TUGAS[t.tugas].warna }}>
                                      <Ikon className="h-2.5 w-2.5" />
                                    </span>
                                    <span className="min-w-0 break-words">
                                      <span className="sr-only">{TUGAS[t.tugas].nama}: </span>
                                      {t.nama}
                                    </span>
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Agenda (ponsel) */}
            <ol className="mt-5 grid gap-2 md:hidden">
              {agenda.map((d) => {
                const isi = jadwal[kunciHariWIB(d + 3600000)];
                const hariIni = d === awalHariWIB(kini);
                return (
                  <li key={d} className={`grid grid-cols-[4.2rem_minmax(0,1fr)] gap-3 rounded-xl p-3 ${hariIni ? 'bg-embun ring-2 ring-daun/50' : 'bg-kertas ring-1 ring-garis'}`}>
                    <p className="leading-tight">
                      <span className="block text-[0.75rem] font-semibold uppercase text-tinta-2">{hariIni ? 'Hari ini' : hariPendek(d)}</span>
                      <span className="block font-semibold tabular-nums">{tanggalPendek(d)}</span>
                    </p>
                    <ul className="grid gap-1.5">
                      {isi.map((t, i) => {
                        const Ikon = IKON_TUGAS[t.tugas];
                        return (
                          <li key={`${t.slug}-${t.tugas}-${i}`} className="flex items-center gap-2 text-[0.9rem]">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white" style={{ background: TUGAS[t.tugas].warna }}>
                              <Ikon className="h-3.5 w-3.5" />
                            </span>
                            <span>
                              <span className="font-medium">{TUGAS[t.tugas].nama}</span> · {t.nama}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                );
              })}
            </ol>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {pilih.map((slug) => {
                const p = cariProduk(slug);
                return (
                  <div key={slug} className="rounded-xl border border-garis bg-kertas p-4 text-[0.88rem]">
                    <p className="font-semibold">{p.nama}</p>
                    <p className="mt-1 text-tinta-2">{p.siram.tanda}</p>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
