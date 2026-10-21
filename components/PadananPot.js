import Link from 'next/link';
import { Pot } from './Ilustrasi';
import StrataMedia from './StrataMedia';
import { potJenis, racikan } from '@/lib/data';
import { tanamanUntukPot, tanamanUntukRacikan } from '@/lib/katalog';

// Padanan pot & media di beranda: sifat tiap pot (pori, berat) dan racikan media dengan komposisinya.
export default function PadananPot() {
  const pots = potJenis.filter((p) => ['terakota', 'keramik', 'semen'].includes(p.id));
  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <ul className="grid gap-3 sm:grid-cols-3 lg:col-span-7">
        {pots.map((p) => {
          const cocok = tanamanUntukPot(p.id).slice(0, 3);
          return (
            <li key={p.id} className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-x-4 rounded-[1.25rem] border border-garis bg-kertas p-4 sm:flex sm:flex-col">
              <div className="panggung relative row-span-4 mx-auto aspect-square w-full max-w-[11rem] self-start overflow-hidden rounded-xl">
                <Pot jenis={p.id} className="absolute inset-[10%] h-[80%] w-[80%]" />
              </div>
              <h3 className="text-[1.25rem] sm:mt-3">{p.pendek}</h3>
              <dl className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 text-[0.82rem]">
                <dt className="text-tinta-2">Pori</dt>
                <dd>{p.pori}</dd>
                <dt className="text-tinta-2">Berat</dt>
                <dd>{p.berat}</dd>
              </dl>
              <p className="mt-2 text-[0.85rem] text-tinta-2 max-sm:hidden">{p.sifat}</p>
              {cocok.length > 0 && (
                <p className="mt-auto pt-3 text-[0.82rem]">
                  <span className="text-tinta-2">Cocok untuk </span>
                  {cocok.map((t, i) => (
                    <span key={t.slug}>
                      {i > 0 && (i === cocok.length - 1 ? ' dan ' : ', ')}
                      <Link href={`/produk/${t.slug}`} className="tautan">
                        {t.nama.toLowerCase()}
                      </Link>
                    </span>
                  ))}
                </p>
              )}
            </li>
          );
        })}
      </ul>
      <div className="rounded-[1.25rem] border border-garis bg-kertas p-5 sm:p-6 lg:col-span-5">
        <h3 className="text-[1.45rem]">Racikan media, bukan tanah kebun</h3>
        <p className="mt-1.5 text-[0.9rem] text-tinta-2">
          Tiap tanaman dikirim di racikan yang cocok dengan akarnya. Bahan yang sama juga kami jual per kantong untuk ganti pot nanti.
        </p>
        <ul className="mt-5 grid gap-5">
          {racikan.slice(0, 4).map((r) => (
            <li key={r.id}>
              <p className="flex flex-wrap items-baseline justify-between gap-x-3">
                <Link href={`/produk/media-${r.id}`} className="font-semibold hover:underline">
                  {r.nama}
                </Link>
                <span className="text-[0.8rem] text-tinta-2">{tanamanUntukRacikan(r.id).length} tanaman memakainya</span>
              </p>
              <StrataMedia id={r.id} ringkas className="mt-2" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
