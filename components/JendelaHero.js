import Image from 'next/image';
import Link from 'next/link';
import { cariProduk } from '@/lib/data';
import { hargaTermurah, teksSiram } from '@/lib/katalog';
import { rupiah } from '@/lib/format';

// Adegan pahlawan: dinding kapur dengan bayangan daun, jendela lengkung berpalang yang memperlihatkan kebun,
// dan tiga tanaman sungguhan (foto CC0 yang dipotong) berdiri di ambangnya.
const DI_AMBANG = [
  { slug: 'sirih-gading', kiri: '9%', lebar: '31%', tinggi: '27%', z: 2 },
  { slug: 'lidah-mertua', kiri: '37%', lebar: '25%', tinggi: '43%', z: 1 },
  { slug: 'peperomia', kiri: '64%', lebar: '22%', tinggi: '26%', z: 2 },
];

export default function JendelaHero() {
  const utama = cariProduk('lidah-mertua');
  return (
    <div className="relative mx-auto aspect-[5/6] w-full max-w-[34rem]">
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden rounded-[1.75rem] bg-[#ebeadf]">
        <div className="absolute inset-0 bg-[url(/images/latar/bayang-daun.webp)] bg-cover bg-left-top opacity-80 mix-blend-multiply" />
        <div className="bayang-kisi absolute inset-0 opacity-70" />
      </div>
      <div
        aria-hidden="true"
        className="lengkung absolute bottom-[31%] left-[15%] right-[15%] top-[6%] overflow-hidden border-[9px] border-[#fbfaf4] bg-[#d9e6d4] shadow-[0_18px_34px_-22px_rgb(21_50_42/0.55)]"
      >
        <Image
          src="/images/latar/jendela-luar-buram.webp"
          alt=""
          fill
          priority
          fetchPriority="high"
          sizes="(min-width: 1024px) 26vw, 64vw"
          className="object-cover"
        />
        <span className="absolute inset-y-0 left-1/2 w-[7px] -translate-x-1/2 bg-[#fbfaf4]" />
        <span className="absolute inset-x-0 top-[46%] h-[7px] bg-[#fbfaf4]" />
        <span className="absolute inset-0 bg-[radial-gradient(90%_70%_at_30%_20%,rgb(255_253_235/0.45),transparent_60%)]" />
      </div>
      <div aria-hidden="true" className="absolute bottom-[27.5%] left-[7%] right-[7%] h-[4%] rounded-[0.45rem] bg-[#fbfaf4] shadow-[0_12px_18px_-10px_rgb(21_50_42/0.5)]" />
      {DI_AMBANG.map((t) => {
        const p = cariProduk(t.slug);
        return (
          <div key={t.slug} className="absolute bottom-[30.6%]" style={{ left: t.kiri, width: t.lebar, height: t.tinggi, zIndex: t.z }}>
            <Image src={p.foto.src} alt={p.foto.alt} fill sizes="(min-width: 1024px) 12vw, 30vw" className="object-contain object-bottom drop-shadow-[0_6px_6px_rgb(21_50_42/0.18)]" />
          </div>
        );
      })}
      <Link
        href={`/produk/${utama.slug}`}
        className="group absolute bottom-[5%] left-[7%] right-[7%] flex items-center gap-3 rounded-2xl border border-garis bg-kertas/95 p-3 pe-4 shadow-[0_10px_24px_-16px_rgb(21_50_42/0.5)] sm:left-[12%] sm:right-[12%]"
      >
        <span className="label-tancap shrink-0 max-sm:hidden" style={{ '--tag-bg': '#f7e7ad' }}>
          Di ambang
        </span>
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block truncate font-display text-[1.05rem] font-semibold group-hover:underline">{utama.nama}</span>
          <span className="block text-[0.8rem] text-tinta-2 sm:truncate">
            Redup sampai terik · siram {teksSiram(utama).toLowerCase()}
          </span>
        </span>
        <span className="shrink-0 text-end text-[0.85rem] leading-tight">
          <span className="block text-tinta-2">mulai</span>
          <span className="font-semibold tabular-nums">{rupiah(hargaTermurah(utama))}</span>
        </span>
      </Link>
    </div>
  );
}
