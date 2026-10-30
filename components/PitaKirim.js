'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { pastikanContoh, useTerpasang } from '@/lib/store';
import { jadwalKirim } from '@/lib/kirim';
import { tanggalPanjang } from '@/lib/format';
import { site } from '@/lib/data';

// Pita di atas header: jadwal kirim tanaman hidup, dihitung dari waktu sekarang (WIB).
// Sekalian mengisi pesanan contoh saat kunjungan pertama (tanggal relatif hari ini).
export default function PitaKirim() {
  const terpasang = useTerpasang();
  useEffect(() => {
    pastikanContoh();
  }, []);
  const j = terpasang ? jadwalKirim(Date.now(), true) : null;
  return (
    <aside data-pita aria-label="Jadwal kirim tanaman" className="gelap krepyak bg-daun-tua text-[#e4ece4] print:hidden">
      <p className="wadah flex min-h-9 flex-wrap items-center justify-center gap-x-2 py-1.5 text-center text-[0.8rem] leading-snug">
        <span>Tanaman hidup dikirim Senin–Rabu.</span>
        <span className="font-medium text-white">
          {j
            ? j.hariIni
              ? `Bayar sebelum ${String(site.batasKemasJam).padStart(2, '0')}.00 WIB, dikirim hari ini.`
              : `Dibayar sekarang, dikirim ${tanggalPanjang(j.tanggal)}.`
            : 'Supaya tidak menginap di gudang kurir.'}
        </span>
        <Link href="/pengiriman#jadwal" className="inline-block py-1 underline decoration-[#e4ece4]/60 underline-offset-[3px] hover:decoration-white">
          Kenapa?
        </Link>
      </p>
    </aside>
  );
}
