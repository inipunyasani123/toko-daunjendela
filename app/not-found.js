import Link from 'next/link';
import { Pot } from '@/components/Ilustrasi';

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
          <Pot jenis="terakota" className="absolute inset-x-[16%] bottom-[5%] h-[52%] w-[68%]" />
          <svg viewBox="0 0 100 100" className="absolute bottom-[33%] left-[37%] h-[20%] w-[26%]" aria-hidden="true">
            <path d="M50 96 C50 70 48 50 52 30" fill="none" stroke="#2c7556" strokeWidth="4" strokeLinecap="round" />
            <path d="M51 46 C36 40 26 28 24 12 C40 16 50 28 51 46 Z" fill="#8fb36f" />
            <path d="M52 32 C62 20 76 16 88 18 C82 30 68 36 52 32 Z" fill="#8fb36f" />
          </svg>
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
