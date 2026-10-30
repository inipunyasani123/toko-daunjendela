import Link from 'next/link';
import { cahaya, tanaman } from '@/lib/data';
import { WARNA_CAHAYA } from './PitaCahaya';

// Pintu masuk penemu tanaman: lima tingkat cahaya, dari jendela (terang) ke sudut (redup).
export default function PilihCahaya({ judulId = 'judul-pilih-cahaya' }) {
  const jumlah = (n) => tanaman.filter((p) => n >= p.cahaya[0] && n <= p.cahaya[1]).length;
  return (
    <section aria-labelledby={judulId} className="mt-8">
      <h2 id={judulId} className="font-sans text-[1rem] font-semibold tracking-normal">
        Seterang apa tempatnya?
      </h2>
      <ul className="mt-3 grid grid-cols-5 gap-1.5 sm:gap-2">
        {[5, 4, 3, 2, 1].map((n) => (
          <li key={n}>
            <Link
              href={`/cari-tanaman?cahaya=${n}`}
              className="group flex h-full flex-col items-start gap-1.5 rounded-xl border border-garis bg-kertas p-1.5 hover:border-daun sm:gap-2 sm:p-2.5"
            >
              <span aria-hidden="true" className="h-7 w-full shrink-0 rounded-lg sm:h-10" style={{ background: WARNA_CAHAYA[n], boxShadow: 'inset 0 0 0 1px rgb(21 50 42 / .18)' }} />
              <span className="min-w-0 leading-tight">
                <span className="block text-[0.75rem] font-semibold leading-tight group-hover:underline sm:text-[0.92rem]">{cahaya[n - 1].nama}</span>
                <span className="mt-0.5 hidden text-[0.78rem] text-tinta-2 sm:block">{jumlah(n)} tanaman betah</span>
                <span className="sr-only sm:hidden">, {jumlah(n)} tanaman</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-2.5 text-[0.85rem] text-tinta-2">
        Bingung? Angkat telapak tangan 30 cm di atas tempatnya pada siang hari. Bayangan tajam berarti terang langsung, bayangan samar berarti
        terang tak langsung.
      </p>
    </section>
  );
}
