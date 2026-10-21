import Image from 'next/image';
import Link from 'next/link';
import { ruang } from '@/lib/data';
import { jumlahUntukRuang } from '@/lib/katalog';

// Bento "belanja per ruangan": tiap ubin adalah prasetel saringan katalog.
const SEL = {
  'kamar-mandi': 'col-span-2 lg:col-span-5 lg:row-span-2',
  teras: 'col-span-1 lg:col-span-4',
  'sudut-redup': 'col-span-1 lg:col-span-3',
  'meja-kerja': 'col-span-1 lg:col-span-3',
  'kamar-ac': 'col-span-1 lg:col-span-4',
  'ruang-tamu': 'col-span-2 lg:col-span-7',
};

function Ubin({ r, besar }) {
  const n = jumlahUntukRuang(r.id);
  return (
    <Link href={`/katalog?ruang=${r.id}`} className={`group relative flex w-full overflow-hidden rounded-[1.25rem] bg-daun-tua ${besar ? 'min-h-[16rem]' : 'min-h-[12.5rem]'} lg:min-h-0`}>
      <Image
        src={r.foto.src}
        alt={r.foto.alt}
        fill
        sizes={besar ? '(min-width: 1024px) 40vw, 100vw' : '(min-width: 1024px) 30vw, 50vw'}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transform-none"
      />
      <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgb(12_37_27/0)_30%,rgb(12_37_27/0.86)_100%)]" />
      <span className="relative mt-auto block p-4 text-white sm:p-5">
        <span className={`block font-display font-semibold leading-tight ${besar ? 'text-[1.7rem] sm:text-[2.1rem]' : 'text-[1.2rem] sm:text-[1.4rem]'}`}>{r.nama}</span>
        <span className="mt-1 block text-[0.85rem] leading-snug text-[#e3ebe5]">{r.ket}</span>
        <span className="rapat mt-2.5 inline-block rounded-full bg-white/15 px-2.5 py-1 text-[0.68rem] text-white">{n} tanaman cocok</span>
      </span>
    </Link>
  );
}

export default function BentoRuang() {
  const urut = ['kamar-mandi', 'teras', 'sudut-redup', 'meja-kerja', 'kamar-ac', 'ruang-tamu'];
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:auto-rows-[14rem] lg:grid-cols-12">
      {urut.map((id) => {
        const r = ruang.find((x) => x.id === id);
        return (
          <li key={id} className={`flex ${SEL[id]}`}>
            <Ubin r={r} besar={id === 'kamar-mandi'} />
          </li>
        );
      })}
      <li className="col-span-2 flex lg:col-span-5">
        <Link
          href="/cari-tanaman"
          className="group flex w-full flex-col justify-between gap-4 rounded-[1.25rem] border border-garis bg-embun p-5 hover:border-daun sm:p-6"
        >
          <span>
            <span className="block font-display text-[1.45rem] font-semibold leading-tight">Ruangannya tidak ada di sini?</span>
            <span className="mt-1.5 block max-w-sm text-[0.92rem] text-tinta-2">
              Jawab lima pertanyaan singkat soal cahaya, udara, waktu luang, hewan, dan tempat. Hasilnya disertai alasan, bukan angka kecocokan.
            </span>
          </span>
          <span className="tombol tombol-utama self-start group-hover:bg-daun-tua">Cari yang betah</span>
        </Link>
      </li>
    </ul>
  );
}
