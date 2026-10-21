'use client';

import { useTerpasang } from '@/lib/store';
import { jadwalKirim } from '@/lib/kirim';
import { awalHariWIB, bagianWIB, tanggalPendek, tanggalPanjang, HARI_MS } from '@/lib/format';
import { site } from '@/lib/data';

const NAMA = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

// Tujuh hari ke depan (mulai hari ini, WIB): kapan tanaman hidup dikirim, kapan hanya pot & media, kapan libur.
export default function JadwalKirim() {
  const terpasang = useTerpasang();
  const kini = terpasang ? Date.now() : null;
  const j = kini ? jadwalKirim(kini, true) : null;
  const hari = kini
    ? Array.from({ length: 7 }, (_, i) => {
        const tgl = awalHariWIB(kini) + i * HARI_MS;
        return { tgl, hm: bagianWIB(tgl).hariMinggu, i };
      })
    : [1, 2, 3, 4, 5, 6, 0].map((hm, i) => ({ tgl: null, hm, i }));
  return (
    <div>
      <ol className="grid grid-cols-7 gap-1 sm:gap-1.5" aria-label="Jadwal kirim tujuh hari ke depan">
        {hari.map(({ tgl, hm, i }) => {
          const tanaman = site.hariKirimTanaman.includes(hm);
          const lain = site.hariKirimLain.includes(hm);
          const kirimBerikut = j && tgl === j.tanggal;
          const sekarang = kini && i === 0;
          return (
            <li
              key={`${hm}-${i}`}
              className={`relative flex min-h-[5.75rem] flex-col justify-between rounded-xl p-1.5 pt-3 text-center sm:p-2.5 sm:pt-3.5 sm:text-start ${
                tanaman ? 'bg-daun text-white' : lain ? 'bg-pupus-muda text-tinta' : 'bg-kapur-2 text-tinta-2'
              } ${kirimBerikut ? 'ring-[3px] ring-cahaya ring-offset-2 ring-offset-kertas' : ''}`}
              aria-current={sekarang ? 'date' : undefined}
            >
              <span className="block text-[0.72rem] font-semibold leading-tight sm:text-[0.85rem]">
                <span className="sm:hidden">{NAMA[hm].slice(0, 3)}</span>
                <span className="hidden sm:inline">{NAMA[hm]}</span>
                {tgl !== null && <span className="block text-[0.68rem] font-normal tabular-nums opacity-90 sm:text-[0.75rem]">{tanggalPendek(tgl)}</span>}
              </span>
              <span className="mt-1 block text-[0.65rem] leading-tight sm:text-[0.75rem]">
                <span className="sm:hidden">{tanaman ? 'Kirim' : lain ? 'Pot' : 'Libur'}</span>
                <span className="hidden sm:inline">{tanaman ? 'Tanaman' : lain ? 'Pot & media' : 'Libur'}</span>
              </span>
              {sekarang && (
                <span className="rapat absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-tinta px-1.5 py-0.5 text-[0.55rem] text-white sm:left-2 sm:translate-x-0">
                  Hari ini
                </span>
              )}
            </li>
          );
        })}
      </ol>
      <p className="mt-3 text-[0.9rem] text-tinta-2">
        {j ? (
          j.hariIni ? (
            <>Bayar sebelum {String(site.batasKemasJam).padStart(2, '0')}.00 WIB hari ini, tanamanmu dikemas dan dikirim hari ini juga.</>
          ) : (
            <>
              Tanaman yang dibayar sekarang dikirim <strong className="font-semibold text-tinta">{tanggalPanjang(j.tanggal)}</strong>, hari yang
              berbingkai kuning.
            </>
          )
        ) : (
          <>Pesanan yang dibayar sebelum pukul 12.00 WIB pada hari kirim dikemas dan dikirim hari itu juga.</>
        )}
      </p>
    </div>
  );
}
