import KalenderRawat from '@/components/KalenderRawat';
import { ogHalaman } from '@/lib/seo';

const deskripsi = 'Jadwal siram, semprot, putar pot, lap daun, dan pupuk untuk empat minggu pertama, dihitung dari tanggal tanaman tiba. Bisa disimpan ke kalender ponsel.';

export const metadata = {
  title: 'Kalender rawat tanaman',
  description: deskripsi,
  alternates: { canonical: '/kalender-rawat' },
  ...ogHalaman({ path: '/kalender-rawat', judul: 'Kalender rawat tanaman', deskripsi }),
};

export default function HalamanKalender() {
  return (
    <>
      <div className="wadah pb-8 pt-10 sm:pt-14">
        <h1 className="text-[2.6rem] sm:text-6xl">Kalender rawat</h1>
        <p className="mt-3 max-w-2xl text-tinta-2">
          Pilih tanamanmu dan tanggal tibanya. Jadwal siram selalu berupa ajakan untuk mengecek media dulu, karena keringnya media di tiap rumah
          berbeda. Pilihanmu tersimpan di browser ini saja.
        </p>
      </div>
      <KalenderRawat />
    </>
  );
}
