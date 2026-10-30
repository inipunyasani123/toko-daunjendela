import { cahaya } from '@/lib/data';
import { teksCahaya } from '@/lib/katalog';

// Warna lima tingkat cahaya, dari jendela (kiri, terang) ke sudut ruangan (kanan, redup).
export const WARNA_CAHAYA = { 5: '#f2c94c', 4: '#efd889', 3: '#dfe2bf', 2: '#b8c8b1', 1: '#8fa597' };
const URUT = [5, 4, 3, 2, 1];

// Pita cahaya: rentang cahaya yang disukai tanaman, digambar sebagai lima ruas.
export default function PitaCahaya({ p, varian = 'kecil', className = '' }) {
  const [a, b] = p.cahaya;
  const masuk = (n) => n >= a && n <= b;
  if (varian === 'kecil') {
    return (
      <span className={`inline-flex items-center gap-[3px] ${className}`}>
        {URUT.map((n) => (
          <span
            key={n}
            aria-hidden="true"
            className="block h-[7px] w-[15px] rounded-[2px]"
            style={masuk(n) ? { background: WARNA_CAHAYA[n], boxShadow: 'inset 0 0 0 1px rgb(21 50 42 / .35)' } : { background: 'rgb(21 50 42 / .08)' }}
          />
        ))}
        <span className="sr-only">Cahaya: {teksCahaya(p).toLowerCase()}.</span>
      </span>
    );
  }
  return (
    <figure className={`m-0 ${className}`}>
      <div className="relative">
        <div className="grid grid-cols-5 gap-1" aria-hidden="true">
          {URUT.map((n) => (
            <span
              key={n}
              className="block h-9 rounded-md"
              style={masuk(n) ? { background: WARNA_CAHAYA[n], boxShadow: 'inset 0 0 0 1.5px rgb(21 50 42 / .4)' } : { background: 'rgb(21 50 42 / .06)' }}
            />
          ))}
        </div>
        <ol className="mt-2 grid grid-cols-5 gap-1 text-center text-[0.75rem] leading-tight" aria-hidden="true">
          {URUT.map((n) => (
            <li key={n} className={masuk(n) ? 'font-semibold text-tinta' : 'text-tinta-3'}>
              {cahaya[n - 1].nama}
            </li>
          ))}
        </ol>
      </div>
      <figcaption className="sr-only">Cahaya yang disukai: {teksCahaya(p).toLowerCase()}.</figcaption>
    </figure>
  );
}
