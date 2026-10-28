import Link from 'next/link';
import { Pot } from '@/components/FotoPot';

export const metadata = {
  title: 'Halaman tidak ditemukan',
  robots: { index: false, follow: true },
  alternates: { canonical: null },
};

export default function TidakDitemukan() {
  return (
    <div className="wadah grid items-center gap-10 py-16 sm:py-24 lg:grid-cols-12">
      <div className="relative mx-auto aspect-[4/5] w-full max-w-xs lg:col-span-5">
        <div aria-hidden="true" className="panggung lengkung absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url(/images/latar/bayang-daun.webp)] bg-cover opacity-70 mix-blend-multiply" />
          <Pot jenis="terakota" className="absolute inset-x-[14%] bottom-[6%] h-[62%] w-[72%]" />
        </div>
      </div>
      <div className="lg:col-span-6 lg:col-start-7">
        <p className="rapat text-[0.75rem] text-daun">404 · belum tumbuh</p>
        <h1 className="mt-3 text-5xl sm:text-6xl">Pot ini baru berisi tunas</h1>
        <p className="mt-4 max-w-lg text-tinta-2">
          Alamat yang kamu buka tidak ada, atau tanamannya sudah pindah rak. Coba cari dari katalog, atau biarkan kami menyarankan yang cocok
          untuk ruanganmu.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/katalog" className="tombol tombol-utama">
            Lihat katalog
          </Link>
          <Link href="/cari-tanaman" className="tombol tombol-garis">
            Cari yang betah
          </Link>
          <Link href="/" className="tautan self-center font-medium">
            Ke beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
