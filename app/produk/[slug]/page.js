import Link from 'next/link';
import { notFound } from 'next/navigation';
import DetailProduk from '@/components/DetailProduk';
import KartuProduk from '@/components/KartuProduk';
import PitaCahaya from '@/components/PitaCahaya';
import StrataMedia from '@/components/StrataMedia';
import KalenderMini from '@/components/KalenderMini';
import { IkonSiram, IkonUdara, IkonSuhu, IkonTapak, IkonPupuk, IkonPeringatan } from '@/components/Ikon';
import { produk, cariProduk, cariRacikan, bahan, zonaOngkir, site } from '@/lib/data';
import { ogHalaman, ldProduk, ldJejak, JsonLd } from '@/lib/seo';
import { produkTerkait, hargaTermurah, teksCahaya, teksSiram, teksLembap, namaRawat, tanamanUntukRacikan, tanamanUntukPot, alasanPot, namaKelompok } from '@/lib/katalog';
import { rupiah, gram } from '@/lib/format';
import { intervalPupuk } from '@/lib/rawat';

export const dynamicParams = false;

const NAMA_JENIS = { tanaman: 'Tanaman', pot: 'Pot', media: 'Media tanam', alat: 'Alat' };

// Deskripsi meta dari kalimat utuh menurut prioritas, berhenti sebelum lewat 155 karakter.
function deskripsiProduk(p) {
  const BATAS = 155;
  const pilihan =
    p.jenis === 'tanaman'
      ? [[`Cahaya ${teksCahaya(p).toLowerCase()}.`], [`Siram ${teksSiram(p).toLowerCase()}.`], [p.hewan ? 'Aman untuk kucing dan anjing.' : ''], [`Mulai ${rupiah(hargaTermurah(p))}.`]]
      : [[`Mulai ${rupiah(hargaTermurah(p))}.`], [`${p.ukuran.length} ukuran.`]];
  let teks = p.ringkas;
  for (const opsi of pilihan) {
    const muat = opsi.find((k) => k && `${teks} ${k}`.length <= BATAS);
    if (muat) teks = `${teks} ${muat}`;
  }
  return teks;
}

function judulProduk(p) {
  const dasar = p.jenis === 'tanaman' && p.latin && !p.latin.includes('(') ? `${p.nama} (${p.latin})` : p.nama;
  return `${dasar} — ${site.nama}`.length <= 60 ? dasar : p.nama;
}

export function generateStaticParams() {
  return produk.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = cariProduk(slug);
  if (!p) return {};
  const deskripsi = deskripsiProduk(p);
  const judul = judulProduk(p);
  return {
    title: judul,
    description: deskripsi,
    alternates: { canonical: `/produk/${p.slug}` },
    ...ogHalaman({ path: `/produk/${p.slug}`, judul, deskripsi }),
  };
}

function Sel({ ikon: Ikon, judul, children, lebar = false }) {
  return (
    <div className={`rounded-2xl bg-kertas p-4 ${lebar ? 'sm:col-span-2' : ''}`}>
      <h3 className="flex items-center gap-2 font-sans text-[0.95rem] font-semibold tracking-normal">
        {Ikon && <Ikon className="h-5 w-5 text-daun" />}
        {judul}
      </h3>
      <div className="mt-2 text-[0.92rem] text-tinta-2">{children}</div>
    </div>
  );
}

function KartuRawat({ p }) {
  return (
    <section aria-labelledby="judul-kartu-rawat" className="rounded-[1.5rem] border border-garis bg-embun p-4 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <h2 id="judul-kartu-rawat" className="text-[1.9rem] sm:text-[2.2rem]">
          Kartu rawat
        </h2>
        <p className="text-[0.85rem] text-tinta-2">Ikut tercetak di dalam kardus</p>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Sel judul="Cahaya" lebar>
          <PitaCahaya p={p} varian="besar" />
          <p className="mt-3">
            Betah di {teksCahaya(p).toLowerCase()}. {p.cahaya[1] === 5 ? 'Tahan sinar langsung.' : 'Jauhkan dari sinar matahari siang yang langsung mengenai daun.'}
          </p>
        </Sel>
        <Sel ikon={IkonSiram} judul={`Siram ${teksSiram(p).toLowerCase()}`}>
          {p.siram.tanda} Di musim hujan atau ruang tanpa AC, media biasanya lebih lama kering.
        </Sel>
        <Sel ikon={IkonUdara} judul={teksLembap(p)}>
          {p.lembap === 'tinggi'
            ? 'Semprot daun tiap beberapa hari atau taruh pot di atas nampan kerikil yang selalu basah.'
            : p.lembap === 'rendah'
              ? 'Tidak perlu disemprot. Udara ber-AC tidak masalah.'
              : 'Tidak rewel soal udara. Ruang ber-AC pun masih bisa.'}
        </Sel>
        <Sel ikon={IkonSuhu} judul={`Suhu nyaman ${p.suhu}`}>
          Jauhkan dari embusan langsung AC dan dari kaca jendela yang panas di siang hari.
        </Sel>
        <Sel ikon={IkonPupuk} judul={`Pupuk tiap ${intervalPupuk(p) / 7} minggu`}>
          Pupuk cair setengah dosis anjuran kemasan, mulai sebulan setelah tanaman tiba. Tidak perlu memupuk saat tanaman berhenti tumbuh.
        </Sel>
        <Sel ikon={p.hewan ? IkonTapak : IkonPeringatan} judul={p.hewan ? 'Aman untuk kucing dan anjing' : 'Jauhkan dari hewan peliharaan'} lebar>
          {p.catatanHewan} Kalau hewanmu menelan bagian tanaman apa pun lalu terlihat lemas atau muntah terus, hubungi dokter hewan.
        </Sel>
      </div>
      <p className="mt-4 text-[0.82rem] text-tinta-2">
        Tingkat rawat: <span className="font-semibold text-tinta">{namaRawat(p.rawat)}</span>. Keamanan hewan mengacu pada daftar tanaman ASPCA (Animal Poison
        Control Center).
      </p>
    </section>
  );
}

export default async function HalamanProduk({ params }) {
  const { slug } = await params;
  const p = cariProduk(slug);
  if (!p) notFound();
  const tanaman = p.jenis === 'tanaman';
  const r = tanaman ? cariRacikan(p.media) : p.jenis === 'media' ? cariRacikan(p.racikan) : null;
  const terkait = produkTerkait(p, 4);
  const jejak = [
    { nama: 'Katalog', path: '/katalog' },
    { nama: NAMA_JENIS[p.jenis], path: p.jenis === 'tanaman' ? '/katalog' : `/katalog?jenis=${p.jenis}` },
    { nama: p.nama, path: `/produk/${p.slug}` },
  ];
  const pemakai = p.jenis === 'pot' ? tanamanUntukPot(p.pot) : p.jenis === 'media' ? tanamanUntukRacikan(p.racikan) : [];
  return (
    <>
      <nav aria-label="Jejak halaman" className="wadah pb-5 pt-6 text-[0.9rem]">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-tinta-2">
          <li>
            <Link href="/katalog" className="hover:underline">
              Katalog
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={jejak[1].path} className="hover:underline">
              {tanaman ? namaKelompok(p.kelompok) : NAMA_JENIS[p.jenis]}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-tinta">
            {p.nama}
          </li>
        </ol>
      </nav>

      <DetailProduk slug={p.slug} />

      <div className="wadah mt-14 grid gap-10 lg:grid-cols-12">
        <div className="grid content-start gap-10 lg:col-span-7">
          <section aria-labelledby="judul-tentang">
            <h2 id="judul-tentang" className="text-[1.9rem] sm:text-[2.2rem]">
              {tanaman ? 'Tentang tanaman ini' : 'Tentang produk ini'}
            </h2>
            <p className="mt-3 text-[1.02rem] text-tinta-2">{p.deskripsi}</p>
          </section>

          {tanaman && <KartuRawat p={p} />}

          {p.jenis === 'pot' && (
            <section aria-labelledby="judul-ukuran-pot">
              <h2 id="judul-ukuran-pot" className="text-[1.9rem]">
                Ukuran dan berat
              </h2>
              <table className="mt-4 w-full border-collapse text-left text-[0.92rem]">
                <thead>
                  <tr className="border-b border-tinta">
                    <th scope="col" className="py-2 pe-3 font-semibold">Diameter</th>
                    <th scope="col" className="py-2 pe-3 text-end font-semibold">Berat</th>
                    <th scope="col" className="py-2 text-end font-semibold">Harga</th>
                  </tr>
                </thead>
                <tbody>
                  {p.ukuran.map((u) => (
                    <tr key={u.id} className="border-b border-garis">
                      <th scope="row" className="py-2.5 pe-3 font-medium">{u.label}</th>
                      <td className="py-2.5 pe-3 text-end tabular-nums">{gram(u.berat)}</td>
                      <td className="py-2.5 text-end tabular-nums">{rupiah(u.harga)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-3 text-[0.88rem] text-tinta-2">
                Ukuran pot mengikuti diameter bibir. Pot yang dipesan bersama tanaman langsung dipakai untuk menanamnya, jadi tidak perlu pindah pot sendiri.
              </p>
            </section>
          )}

          {r && (
            <section aria-labelledby="judul-media" className="rounded-[1.5rem] border border-garis bg-kertas p-4 sm:p-6">
              <h2 id="judul-media" className="text-[1.9rem]">
                {tanaman ? `Ditanam di ${r.nama}` : 'Isi racikan'}
              </h2>
              <p className="mt-2 text-tinta-2">{r.sifat}</p>
              <StrataMedia id={r.id} className="mt-4" />
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {r.isi.map((it) => (
                  <li key={it.bahan} className="flex gap-3">
                    <span aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 rounded-full ring-1 ring-tinta/20" style={{ background: bahan[it.bahan].warna }} />
                    <span className="text-[0.9rem]">
                      <span className="font-semibold">{bahan[it.bahan].nama}</span> <span className="text-tinta-2">{bahan[it.bahan].ket}</span>
                    </span>
                  </li>
                ))}
              </ul>
              {tanaman && (
                <p className="mt-4 text-[0.9rem]">
                  Untuk ganti pot nanti:{' '}
                  <Link href={`/produk/media-${r.id}`} className="tautan font-medium">
                    {r.nama} per kantong
                  </Link>
                </p>
              )}
            </section>
          )}

          {pemakai.length > 0 && (
            <section aria-labelledby="judul-pemakai">
              <h2 id="judul-pemakai" className="text-[1.9rem]">
                {p.jenis === 'pot' ? 'Cocok untuk' : 'Dipakai untuk'}
              </h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {pemakai.map((t) => (
                  <li key={t.slug}>
                    <Link href={`/produk/${t.slug}${p.jenis === 'pot' ? `?pot=${p.pot}` : ''}`} className="flex items-center justify-between gap-3 rounded-xl border border-garis bg-kertas px-4 py-3 hover:border-daun">
                      <span className="font-medium">{t.nama}</span>
                      <span className="latin text-[0.85rem] text-tinta-2">{t.latin}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="grid content-start gap-8 lg:col-span-5">
          {tanaman && (
            <section aria-labelledby="judul-dua-minggu" className="rounded-[1.5rem] border border-garis bg-kertas p-4 sm:p-6">
              <h2 id="judul-dua-minggu" className="text-[1.6rem]">
                Dua minggu pertama
              </h2>
              <p className="mt-1.5 text-[0.9rem] text-tinta-2">Siram selalu dicek dulu dengan jari atau tusuk bambu. Jadwal ini pengingat, bukan perintah.</p>
              <div className="mt-4">
                <KalenderMini slug={p.slug} nama={p.nama} />
              </div>
            </section>
          )}
          {tanaman && (
            <section aria-labelledby="judul-tiba" className="rounded-[1.5rem] border border-garis bg-kertas p-4 sm:p-6">
              <h2 id="judul-tiba" className="text-[1.6rem]">
                Saat kardus dibuka
              </h2>
              <p className="mt-2 text-[0.92rem] text-tinta-2">{p.tiba}</p>
              <p className="mt-3 text-[0.92rem] text-tinta-2">
                Dikirim ke{' '}
                {zonaOngkir
                  .filter((z) => z.tanaman)
                  .map((z) => `${z.cakupan}${z.tanaman === 'kilat' ? ' (Kilat saja)' : ''}`)
                  .join('; ')}
                . Belum ke {zonaOngkir.find((z) => !z.tanaman).cakupan}.{' '}
                <Link href="/pengiriman" className="tautan">
                  Detail pengiriman
                </Link>
              </p>
              {p.potHindari?.length > 0 && <p className="mt-3 text-[0.92rem] text-tinta-2">{alasanPot(p, p.potHindari[0])}</p>}
            </section>
          )}
          {!tanaman && (
            <section aria-labelledby="judul-kirim-lain" className="rounded-[1.5rem] border border-garis bg-kertas p-4 sm:p-6">
              <h2 id="judul-kirim-lain" className="text-[1.6rem]">
                Pengiriman
              </h2>
              <p className="mt-2 text-[0.92rem] text-tinta-2">
                Dikirim Senin–Sabtu ke seluruh zona, termasuk {zonaOngkir.find((z) => !z.tanaman).cakupan}. Ongkir dihitung dari berat asli ditambah kemasan.
                {p.jenis === 'pot' && p.pot !== 'gantung' ? ' Pot dibungkus kertas sarang lebah dua lapis.' : ''}
              </p>
            </section>
          )}
        </aside>
      </div>

      {terkait.length > 0 && (
        <section aria-labelledby="judul-terkait" className="mt-16 border-t border-garis bg-kapur-2/50 py-14">
          <div className="wadah">
            <h2 id="judul-terkait" className="text-[2rem] sm:text-[2.4rem]">
              {tanaman ? 'Betah di tempat yang sama' : 'Tanaman yang cocok'}
            </h2>
            <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 lg:grid-cols-4">
              {terkait.map((t) => (
                <li key={t.slug}>
                  <KartuProduk produk={t} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
      <JsonLd data={ldProduk(p)} />
      <JsonLd data={ldJejak(jejak)} />
    </>
  );
}
