import Image from 'next/image';
import Link from 'next/link';
import { cahaya, tanaman } from '@/lib/data';
import { teksCahaya } from '@/lib/katalog';
import { WARNA_CAHAYA } from './PitaCahaya';

const KOLOM = [5, 4, 3, 2, 1];

// Bagan rentang cahaya: tiap tanaman satu baris, ruas berwarna = tingkat cahaya tempat ia betah.
// Kolom kiri adalah ambang jendela, kolom kanan sudut ruangan.
export default function RentangCahaya() {
  const urut = [...tanaman].sort((a, b) => b.cahaya[1] - a.cahaya[1] || b.cahaya[0] - a.cahaya[0] || a.urut - b.urut);
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-garis bg-kertas">
      <div className="relative grid grid-cols-[8.6rem_minmax(0,1fr)] sm:grid-cols-[13.5rem_minmax(0,1fr)]">
        <div aria-hidden="true" className="flex items-end border-b border-garis px-3 pb-3 text-[0.72rem] text-tinta-2 sm:text-[0.8rem]">Jendela → sudut</div>
        <div className="relative grid grid-cols-5 border-b border-garis" aria-hidden="true">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#fdf3cf_0%,#f6f3e2_45%,#e7ece4_75%,#dde5df_100%)]" />
          <div className="bayang-kisi pointer-events-none absolute inset-y-0 left-0 w-2/5 opacity-80" />
          {KOLOM.map((n, i) => (
            <div key={n} className={`relative px-0.5 py-2.5 text-center sm:px-2 sm:py-3 ${i ? 'border-s border-garis/70' : ''}`}>
              <span className="mx-auto block h-2.5 w-2.5 rounded-full" style={{ background: WARNA_CAHAYA[n], boxShadow: 'inset 0 0 0 1px rgb(21 50 42 / .3)' }} />
              <span className="mt-1.5 block text-[0.62rem] font-semibold leading-tight sm:text-[0.8rem]">{cahaya[n - 1].nama}</span>
              <span className="mt-0.5 hidden text-[0.72rem] leading-tight text-tinta-2 md:block">{cahaya[n - 1].bayangan}</span>
            </div>
          ))}
        </div>
      </div>
      <ul>
        {urut.map((p) => {
          const [a, b] = p.cahaya;
          return (
            <li key={p.slug} className="border-b border-garis/70 last:border-0">
              <Link href={`/produk/${p.slug}`} className="group grid grid-cols-[8.6rem_minmax(0,1fr)] items-center hover:bg-kapur sm:grid-cols-[13.5rem_minmax(0,1fr)]">
                <span className="flex items-center gap-2 px-2 py-1 sm:gap-2.5 sm:px-3 sm:py-1.5">
                  <span className="relative block h-8 w-8 shrink-0 sm:h-9 sm:w-9">
                    <Image src={p.foto.src} alt="" fill sizes="40px" className="object-contain object-bottom" />
                  </span>
                  <span className="line-clamp-2 min-w-0 text-[0.8rem] font-medium leading-tight group-hover:underline sm:text-[0.92rem]">{p.nama}</span>
                  <span className="sr-only">: {teksCahaya(p).toLowerCase()}</span>
                </span>
                <span className="grid grid-cols-5 pe-2 sm:py-3" aria-hidden="true">
                  {KOLOM.map((n) => {
                    const masuk = n >= a && n <= b;
                    const ujungKiri = masuk && n === b;
                    const ujungKanan = masuk && n === a;
                    return (
                      <span
                        key={n}
                        className={`block h-3 ${masuk ? '' : 'opacity-0'} ${ujungKiri ? 'rounded-s-full' : ''} ${ujungKanan ? 'rounded-e-full' : ''}`}
                        style={masuk ? { background: WARNA_CAHAYA[n], boxShadow: 'inset 0 0 0 1px rgb(21 50 42 / .28)' } : undefined}
                      />
                    );
                  })}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
