'use client';

import Link from 'next/link';
import { useTerpasang } from '@/lib/store';
import { susunJadwal, buatICS, TUGAS } from '@/lib/rawat';
import { IKON_TUGAS, IkonKalender } from './Ikon';
import { hariPendek, tanggalPendek } from '@/lib/format';

export function unduhICS(slugs, mulai, nama = 'kalender-rawat') {
  const blob = new Blob([buatICS(slugs, mulai, 'tiba')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${nama}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

// Dua minggu pertama setelah tanaman tiba, dihitung dari hari ini (WIB).
export default function KalenderMini({ slug, nama }) {
  const terpasang = useTerpasang();
  if (!terpasang) return <div className="h-48 rounded-2xl bg-kapur-2/60" aria-hidden="true" />;
  const mulai = Date.now();
  const { tanggal, jadwal } = susunJadwal([slug], mulai, 14, 'tiba');
  return (
    <div>
      <ol className="grid grid-cols-7 gap-1" aria-label={`Jadwal rawat ${nama} dua minggu pertama`}>
        {tanggal.map((t) => {
          const isi = jadwal[t.kunci];
          return (
            <li key={t.kunci} className={`flex min-h-[4.6rem] flex-col items-center rounded-lg p-1 text-center ${t.i === 0 ? 'bg-embun ring-1 ring-daun/40' : 'bg-kapur'}`}>
              <span className="text-[0.62rem] font-semibold uppercase leading-tight text-tinta-2">{t.i === 0 ? 'Tiba' : hariPendek(t.ms)}</span>
              <span className="text-[0.7rem] tabular-nums leading-tight">{tanggalPendek(t.ms)}</span>
              <span className="mt-1 flex flex-wrap justify-center gap-0.5">
                {isi.map((x) => {
                  const Ikon = IKON_TUGAS[x.tugas];
                  return (
                    <span key={x.tugas} className="flex h-5 w-5 items-center justify-center rounded-full text-white" style={{ background: TUGAS[x.tugas].warna }}>
                      <Ikon className="h-3 w-3" />
                      <span className="sr-only">{TUGAS[x.tugas].nama}</span>
                    </span>
                  );
                })}
              </span>
            </li>
          );
        })}
      </ol>
      <p className="mt-2 text-[0.8rem] text-tinta-2">
        Dihitung seolah tanaman tiba hari ini. Pupuk baru dimulai minggu kelima, setelah tanaman beradaptasi.
      </p>
      <div className="mt-3 flex flex-wrap gap-3">
        <button type="button" className="tombol tombol-garis min-h-10 py-2 text-[0.92rem]" onClick={() => unduhICS([slug], mulai, `rawat-${slug}`)}>
          <IkonKalender className="h-4.5 w-4.5" />
          Simpan ke kalender ponsel (.ics)
        </button>
        <Link href={`/kalender-rawat?tanaman=${slug}`} className="tautan self-center text-[0.92rem] font-medium">
          Atur tanggal tiba dan tanaman lain
        </Link>
      </div>
    </div>
  );
}
