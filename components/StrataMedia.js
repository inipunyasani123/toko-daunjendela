import { bahan, cariRacikan } from '@/lib/data';

// Bilah komposisi racikan media (persen volume), dengan legenda bahan.
export default function StrataMedia({ id, ringkas = false, className = '' }) {
  const r = cariRacikan(id);
  if (!r) return null;
  return (
    <figure className={`m-0 ${className}`}>
      <div className="flex h-4 overflow-hidden rounded-full ring-1 ring-tinta/15" aria-hidden="true">
        {r.isi.map((it) => (
          <span key={it.bahan} className="block h-full" style={{ width: `${it.persen}%`, background: bahan[it.bahan].warna }} />
        ))}
      </div>
      <figcaption className={ringkas ? 'mt-2' : 'mt-3'}>
        <ul className={`flex flex-wrap gap-x-3.5 gap-y-1 text-[0.8rem] ${ringkas ? 'text-tinta-2' : 'text-tinta'}`}>
          {r.isi.map((it) => (
            <li key={it.bahan} className="inline-flex items-center gap-1.5">
              <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full ring-1 ring-tinta/20" style={{ background: bahan[it.bahan].warna }} />
              {bahan[it.bahan].nama} <span className="tabular-nums text-tinta-2">{it.persen}%</span>
            </li>
          ))}
        </ul>
      </figcaption>
    </figure>
  );
}
