'use client';

import Link from 'next/link';
import { useTerpasang } from '@/lib/store';
import { susunJadwal, TUGAS } from '@/lib/rawat';
import { IKON_TUGAS } from './Ikon';
import { awalHariWIB, hariPendek, tanggalPendek, kunciHariWIB, HARI_MS, musim } from '@/lib/format';
import { cariProduk } from '@/lib/data';

// Contoh kalender rawat seminggu ke depan untuk tiga tanaman yang "tiba" pada hari berbeda.
const CONTOH = [
  { slug: 'kalatea-zebra', tibaHariLalu: 3 },
  { slug: 'sirih-gading', tibaHariLalu: 12 },
  { slug: 'ekeveria', tibaHariLalu: 26 },
];

export default function MingguIni() {
  const terpasang = useTerpasang();
  if (!terpasang) {
    return <div className="h-[15rem] rounded-[1.25rem] border border-garis bg-kertas" aria-hidden="true" />;
  }
  const kini = Date.now();
  const hariIni = awalHariWIB(kini);
  const hari = Array.from({ length: 7 }, (_, i) => hariIni + i * HARI_MS);
  const tugas = Object.fromEntries(hari.map((d) => [kunciHariWIB(d + 3600000), []]));
  for (const c of CONTOH) {
    const { jadwal } = susunJadwal([c.slug], kini - c.tibaHariLalu * HARI_MS, c.tibaHariLalu + 8, 'tiba');
    for (const k of Object.keys(tugas)) if (jadwal[k]) tugas[k].push(...jadwal[k]);
  }
  const m = musim(kini);
  return (
    <div className="rounded-[1.25rem] border border-garis bg-kertas p-4 sm:p-5">
      <ol className="grid grid-cols-7 gap-1 sm:gap-2" aria-label="Tugas rawat tujuh hari ke depan">
        {hari.map((d, i) => {
          const k = kunciHariWIB(d + 3600000);
          const isi = tugas[k];
          return (
            <li key={k} className={`flex min-h-[8.5rem] flex-col rounded-xl p-1.5 sm:p-2.5 ${i === 0 ? 'bg-embun ring-1 ring-daun/40' : 'bg-kapur'}`}>
              <p className="text-center leading-tight sm:text-start">
                <span className="block text-[0.7rem] font-semibold uppercase tracking-wide text-tinta-2 sm:text-[0.75rem]">{i === 0 ? 'Hari ini' : hariPendek(d)}</span>
                <span className="block text-[0.78rem] tabular-nums sm:text-[0.9rem]">{tanggalPendek(d)}</span>
              </p>
              <ul className="mt-2 grid justify-items-center gap-1.5 sm:justify-items-start">
                {isi.map((t, j) => {
                  const Ikon = IKON_TUGAS[t.tugas];
                  return (
                    <li key={`${t.slug}-${t.tugas}-${j}`} className="flex items-center gap-1.5">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white" style={{ background: TUGAS[t.tugas].warna }}>
                        <Ikon className="h-4 w-4" />
                      </span>
                      <span className="sr-only">
                        {TUGAS[t.tugas].nama} {t.nama}
                      </span>
                      <span aria-hidden="true" className="hidden text-[0.75rem] leading-tight lg:block">
                        {cariProduk(t.slug).nama.split(' ')[0]}
                      </span>
                    </li>
                  );
                })}
                {!isi.length && <li className="text-[0.72rem] text-tinta-3">Libur</li>}
              </ul>
            </li>
          );
        })}
      </ol>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-garis pt-3">
        <ul className="flex flex-wrap gap-x-3 gap-y-1.5 text-[0.8rem] text-tinta-2" aria-label="Arti ikon">
          {['siram', 'semprot', 'putar', 'pupuk'].map((t) => {
            const Ikon = IKON_TUGAS[t];
            return (
              <li key={t} className="inline-flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full text-white" style={{ background: TUGAS[t].warna }}>
                  <Ikon className="h-3 w-3" />
                </span>
                {TUGAS[t].nama}
              </li>
            );
          })}
        </ul>
        <p className="text-[0.8rem] text-tinta-2">
          Sekarang {m.nama}. {m.id === 'kemarau' ? 'Media lebih cepat kering.' : 'Udara lebih lembap, selalu cek media dulu.'}
        </p>
      </div>
      <Link href="/kalender-rawat" className="tombol tombol-garis mt-4 w-full sm:w-auto">
        Buat kalender untuk tanamanmu
      </Link>
    </div>
  );
}
