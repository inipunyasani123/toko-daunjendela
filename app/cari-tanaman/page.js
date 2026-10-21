import { Suspense } from 'react';
import Penemu from '@/components/Penemu';
import { ogHalaman } from '@/lib/seo';

const deskripsi = 'Jawab lima pertanyaan soal cahaya, udara, waktu luang, hewan peliharaan, dan tempat. Kami sarankan tanaman yang betah, lengkap dengan alasannya.';

export const metadata = {
  title: 'Cari tanaman yang betah di rumahmu',
  description: deskripsi,
  alternates: { canonical: '/cari-tanaman' },
  ...ogHalaman({ path: '/cari-tanaman', judul: 'Cari tanaman yang betah di rumahmu', deskripsi }),
};

export default function HalamanCari() {
  return (
    <>
      <div className="wadah pb-8 pt-10 sm:pt-14">
        <h1 className="max-w-3xl text-[2.6rem] leading-[1.04] sm:text-6xl">Cari tanaman yang betah di rumahmu</h1>
        <p className="mt-4 max-w-2xl text-tinta-2">
          Lima pertanyaan, tanpa daftar akun. Hasilnya bukan persentase kecocokan yang dikarang, tapi alasan yang bisa kamu periksa sendiri: kenapa
          sebuah tanaman cocok, dan apa yang perlu kamu perhatikan.
        </p>
      </div>
      <Suspense fallback={<div className="wadah h-96" />}>
        <Penemu />
      </Suspense>
    </>
  );
}
