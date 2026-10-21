import Image from 'next/image';
import Link from 'next/link';
import { site, tanaman } from '@/lib/data';
import { ogHalaman } from '@/lib/seo';

const deskripsi = 'Kebun kecil fiktif di Parongpong, Bandung Barat. Cara kami memilih, mengadaptasi, dan mengemas tanaman, serta hal-hal yang sengaja tidak kami jual.';

export const metadata = {
  title: 'Tentang kebun Daun Jendela',
  description: deskripsi,
  alternates: { canonical: '/tentang' },
  ...ogHalaman({ path: '/tentang', judul: 'Tentang kebun Daun Jendela', deskripsi }),
};

const CARA = [
  {
    judul: 'Dua minggu di rumah teduh',
    isi: 'Tanaman dari kebun terbuka kami pindahkan dulu ke rumah teduh beratap paranet. Di sana daunnya terbiasa dengan cahaya yang mirip dalam rumah sebelum dijual.',
  },
  {
    judul: 'Akar dicek sebelum berangkat',
    isi: 'Sehari sebelum dikirim, tanaman diangkat dari pot untuk dicek akarnya. Yang akarnya busuk atau ada kutu tidak ikut dikirim.',
  },
  {
    judul: 'Media diracik sendiri',
    isi: 'Sekam bakar, cocopeat, pasir malang, dan kompos daun kami ayak dan campur sendiri, dengan resep berbeda untuk tiap jenis akar.',
  },
];

const TIDAK_DIJUAL = [
  'Tanaman cabutan dari hutan, termasuk anggrek spesies yang diambil dari alam.',
  'Pakis cacah untuk media, karena bahannya dari batang pakis pohon liar yang perdagangannya diawasi.',
  'Tanaman yang daunnya dicat, disemprot pewarna, atau ditempeli hiasan.',
  'Janji bahwa tanaman bisa membersihkan udara rumahmu.',
];

export default function HalamanTentang() {
  return (
    <>
      <div className="wadah grid gap-10 pb-14 pt-10 sm:pt-14 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <h1 className="text-[2.6rem] leading-[1.04] sm:text-6xl">Kebun kecil di lereng utara Bandung</h1>
          <p className="mt-5 text-[1.05rem] text-tinta-2">
            {site.nama} adalah kebun fiktif di {site.asal}, {site.ketinggian}. Udaranya sejuk dan lembap, cocok untuk membesarkan tanaman daun pelan-pelan.
            Kami hanya menanam {tanaman.length} jenis, supaya tiap jenis bisa kami kenal betul: cahaya yang ia suka, media yang cocok untuk akarnya, dan cara
            mengemasnya.
          </p>
          <p className="mt-4 text-tinta-2">
            Namanya diambil dari bagian jendela yang bisa dibuka. Hampir semua tanaman kami akhirnya tinggal di dekat jendela seseorang, jadi dari situ pula
            kami mulai bertanya: jendelamu menghadap ke mana, dan seterang apa ruangannya?
          </p>
          <p className="mt-6 border-s-2 border-cahaya ps-3 text-[0.92rem] text-tinta-2">
            Ini toko demo buatan PintuWeb. Kebunnya tidak ada, dan foto kebun di halaman ini adalah foto CC0 dari tempat lain.
          </p>
        </div>
        <div className="grid grid-cols-5 gap-3 lg:col-span-6">
          <figure className="relative col-span-5 m-0 aspect-[4/3] overflow-hidden rounded-[1.5rem]">
            <Image src="/images/kebun/rumah-kaca.webp" alt="Deretan tanaman di bawah atap rumah tanam" fill priority sizes="(min-width: 1024px) 46vw, 100vw" className="object-cover" />
          </figure>
          <figure className="relative col-span-3 m-0 aspect-[4/5] overflow-hidden rounded-[1.5rem]">
            <Image src="/images/kebun/bibit-pot.webp" alt="Bibit tanaman daun di dalam pot-pot kecil" fill sizes="(min-width: 1024px) 28vw, 60vw" className="object-cover" />
          </figure>
          <figure className="lengkung relative col-span-2 m-0 aspect-[4/5] overflow-hidden">
            <Image src="/images/kebun/semai.webp" alt="Barisan semaian muda dalam polybag" fill sizes="(min-width: 1024px) 18vw, 40vw" className="object-cover" />
          </figure>
        </div>
      </div>

      <section aria-labelledby="judul-cara" className="border-t border-garis bg-embun py-14 sm:py-16">
        <div className="wadah">
          <h2 id="judul-cara" className="text-[2rem] sm:text-[2.6rem]">
            Cara kami menyiapkan tanaman
          </h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {CARA.map((c, i) => (
              <li key={c.judul} className="rounded-[1.25rem] border border-garis bg-kertas p-5">
                <p className="font-display text-[2.4rem] font-semibold leading-none text-daun" aria-hidden="true">
                  {i + 1}
                </p>
                <h3 className="mt-3 text-[1.35rem]">{c.judul}</h3>
                <p className="mt-2 text-tinta-2">{c.isi}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="judul-tidak" className="border-t border-garis py-14 sm:py-16">
        <div className="wadah grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="judul-tidak" className="text-[2rem] sm:text-[2.6rem]">
              Yang sengaja tidak kami jual
            </h2>
            <p className="mt-3 text-tinta-2">Daftar pendek ini sama pentingnya dengan katalog.</p>
          </div>
          <ul className="grid gap-3 lg:col-span-7">
            {TIDAK_DIJUAL.map((t) => (
              <li key={t} className="flex gap-3 border-t border-garis pt-3 text-[1.02rem]">
                <span aria-hidden="true" className="font-display text-xl leading-none text-awas">
                  ×
                </span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="wadah mt-12 flex flex-wrap gap-3">
          <Link href="/katalog" className="tombol tombol-utama">
            Lihat {tanaman.length} tanaman kami
          </Link>
          <Link href="/kontak" className="tombol tombol-garis">
            Kirim pertanyaan
          </Link>
        </div>
      </section>
    </>
  );
}
