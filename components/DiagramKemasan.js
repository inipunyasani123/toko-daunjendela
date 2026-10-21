import { langkahKemas } from '@/lib/data';

// Empat langkah kemas tanaman hidup, digambar dengan garis satu gaya.
const g = { fill: 'none', stroke: '#15322a', strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round' };

function Gambar({ id }) {
  if (id === 'media')
    return (
      <svg viewBox="0 0 80 80" aria-hidden="true" className="h-full w-full">
        <path d="M22 40 L27 70 Q40 73 53 70 L58 40 Z" fill="#d27a4f" stroke="#15322a" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M18 38 Q40 30 62 38 Q62 44 58 46 Q40 50 22 46 Q18 44 18 38 Z" fill="#f3efe2" {...{ stroke: '#15322a', strokeWidth: 2.2 }} />
        <path d="M21 47 Q40 52 59 47" {...g} strokeDasharray="3 3" />
        <path d="M40 34 C38 22 30 16 22 14 C24 24 30 31 40 34 Z M40 34 C42 20 50 12 60 11 C58 22 51 30 40 34 Z" fill="#8fb36f" stroke="#15322a" strokeWidth="2" />
      </svg>
    );
  if (id === 'ikat')
    return (
      <svg viewBox="0 0 80 80" aria-hidden="true" className="h-full w-full">
        <path d="M30 70 L32 50 L48 50 L50 70 Z" fill="#d27a4f" stroke="#15322a" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M46 70 L46 8" stroke="#c9a46a" strokeWidth="4" strokeLinecap="round" />
        <path d="M40 50 C40 36 42 24 44 12" {...g} />
        <path d="M42 30 C34 26 26 28 20 34 C28 38 36 36 42 30 Z" fill="#8fb36f" stroke="#15322a" strokeWidth="2" />
        <path d="M43 20 C50 14 58 14 64 18 C58 24 50 25 43 20 Z" fill="#8fb36f" stroke="#15322a" strokeWidth="2" />
        <path d="M41 38 l9 -3 M43 24 l7 -2" stroke="#9c331d" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  if (id === 'kardus')
    return (
      <svg viewBox="0 0 80 80" aria-hidden="true" className="h-full w-full">
        <path d="M12 28 L40 16 L68 28 L68 62 L40 74 L12 62 Z" fill="#d9bb8a" stroke="#15322a" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M12 28 L40 40 L68 28 M40 40 V74" {...g} />
        <circle cx="24" cy="46" r="2.6" fill="#15322a" />
        <circle cx="30" cy="54" r="2.6" fill="#15322a" />
        <circle cx="52" cy="48" r="2.6" fill="#15322a" />
        <circle cx="58" cy="56" r="2.6" fill="#15322a" />
        <path d="M26 22 L54 34" stroke="#b9935f" strokeWidth="3" />
      </svg>
    );
  return (
    <svg viewBox="0 0 80 80" aria-hidden="true" className="h-full w-full">
      <path d="M12 30 L40 18 L68 30 L68 64 L40 76 L12 64 Z" fill="#d9bb8a" stroke="#15322a" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M12 30 L40 42 L68 30 M40 42 V76" {...g} />
      <rect x="46" y="44" width="16" height="20" rx="2" fill="#f7e7ad" stroke="#15322a" strokeWidth="1.8" transform="skewY(-22) translate(0 21)" />
      <path d="M22 62 V46 M18 50 L22 45 L26 50" {...g} strokeWidth="2.6" />
      <path d="M32 6 C30 12 34 14 34 14" {...g} />
    </svg>
  );
}

export default function DiagramKemasan({ ringkas = false }) {
  return (
    <ol className={`grid gap-3 ${ringkas ? 'grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-2 lg:grid-cols-4'}`}>
      {langkahKemas.map((l, i) => (
        <li key={l.id} className="flex flex-col rounded-[1.1rem] border border-garis bg-kertas p-3.5 sm:p-4">
          <div className="flex items-center gap-3">
            <span className="block h-14 w-14 shrink-0 rounded-xl bg-kapur p-1">
              <Gambar id={l.id} />
            </span>
            <span className="rapat text-[0.7rem] text-tinta-2">Langkah {i + 1}</span>
          </div>
          <h3 className="mt-3 font-sans text-[1rem] font-semibold tracking-normal">{l.judul}</h3>
          <p className={`mt-1 text-[0.85rem] text-tinta-2 ${ringkas ? 'max-sm:hidden' : ''}`}>{l.isi}</p>
        </li>
      ))}
    </ol>
  );
}
