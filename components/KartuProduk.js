import Link from 'next/link';
import FotoProduk from './FotoProduk';
import PitaCahaya from './PitaCahaya';
import { TandaHewan, TandaRawat } from './Tanda';
import { rentangHarga, totalStok, teksCahaya, teksSiram } from '@/lib/katalog';
import { rupiah } from '@/lib/format';

// Kartu produk untuk katalog dan daftar lain. `inventaris` opsional (dari browser) untuk menandai stok.
export default function KartuProduk({ produk: p, inventaris, judulTag = 'h3', sizes = '(min-width: 1024px) 18vw, (min-width: 768px) 25vw, 38vw', prioritas = false }) {
  const stok = inventaris ? totalStok(p, inventaris) : null;
  const { min, max } = rentangHarga(p);
  const Judul = judulTag;
  const tanaman = p.jenis === 'tanaman';
  return (
    <article className="group relative flex h-full flex-col">
      <div className="relative">
        <FotoProduk
          p={p}
          sizes={sizes}
          prioritas={prioritas}
          className="lengkung aspect-[4/5] transition-transform duration-500 ease-out group-hover:-translate-y-1 motion-reduce:transform-none"
        />
        {stok === 0 && <p className="rapat absolute right-3 top-[18%] rounded-full bg-tinta px-2.5 py-1 text-[0.75rem] text-white">Habis</p>}
        {stok !== null && stok > 0 && stok <= 3 && (
          <p className="rapat absolute right-3 top-[18%] rounded-full bg-kertas px-2.5 py-1 text-[0.75rem] text-awas shadow-sm">Sisa {stok}</p>
        )}
      </div>
      <div className="flex flex-1 flex-col pt-3">
        {p.latin && <p className="latin text-[0.9rem] leading-snug text-tinta-2">{p.latin}</p>}
        <Judul className="mt-0.5 font-display text-[1.18rem] font-semibold leading-snug sm:text-[1.25rem]">
          <Link
            href={`/produk/${p.slug}`}
            className="rounded-sm after:absolute after:inset-0 after:content-[''] hover:underline hover:decoration-1 hover:underline-offset-4"
          >
            {p.nama}
          </Link>
        </Judul>
        <p className="mt-1 font-semibold tabular-nums">
          {min === max ? (
            rupiah(min)
          ) : (
            <>
              <span className="text-[0.85rem] font-normal text-tinta-2">mulai </span>
              {rupiah(min)}
            </>
          )}
        </p>
        {tanaman ? (
          <>
            <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.8rem] text-tinta-2">
              <PitaCahaya p={p} />
              <span aria-hidden="true">{teksCahaya(p)}</span>
            </p>
            <p className="mt-1 text-[0.8rem] text-tinta-2">Siram {teksSiram(p).toLowerCase()}</p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              <TandaRawat n={p.rawat} />
              {p.hewan && <TandaHewan />}
            </div>
          </>
        ) : (
          <p className="mt-1.5 line-clamp-2 text-[0.88rem] text-tinta-2">{p.ringkas}</p>
        )}
      </div>
    </article>
  );
}
