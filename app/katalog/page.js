import { Suspense } from 'react';
import Katalog, { GridStatis } from '@/components/Katalog';
import { tanaman, produk } from '@/lib/data';
import { ogHalaman } from '@/lib/seo';

const deskripsi = `${tanaman.length} tanaman hias, pot, media tanam, dan alat. Saring menurut cahaya, udara, tingkat rawat, dan keamanan untuk kucing dan anjing.`;

export const metadata = {
  title: 'Katalog tanaman, pot, dan media',
  description: deskripsi,
  alternates: { canonical: '/katalog' },
  ...ogHalaman({ path: '/katalog', judul: 'Katalog tanaman, pot, dan media', deskripsi }),
};

export default function HalamanKatalog() {
  return (
    <>
      <div className="wadah pb-7 pt-10 sm:pt-14">
        <h1 className="text-[2.7rem] sm:text-6xl">Katalog</h1>
        <p className="mt-3 max-w-2xl text-tinta-2">
          {tanaman.length} tanaman dan {produk.length - tanaman.length} pot, media, dan alat dari kebun kami. Pilih cahaya di tempatmu dulu: itu
          saringan yang paling menentukan.
        </p>
      </div>
      <Suspense fallback={<GridStatis />}>
        <Katalog />
      </Suspense>
    </>
  );
}
