import Link from 'next/link';
import { faq, site } from '@/lib/data';
import { ogHalaman, ldFaq, JsonLd } from '@/lib/seo';

const deskripsi = 'Jawaban soal memilih tanaman, keamanan untuk hewan, pengiriman tanaman hidup, garansi tiba hidup, pot, dan media tanam di toko demo Daun Jendela.';

export const metadata = {
  title: 'Bantuan dan pertanyaan umum',
  description: deskripsi,
  alternates: { canonical: '/bantuan' },
  ...ogHalaman({ path: '/bantuan', judul: 'Bantuan dan pertanyaan umum', deskripsi }),
};

export default function HalamanBantuan() {
  return (
    <>
      <div className="wadah pb-10 pt-10 sm:pt-14">
        <h1 className="text-[2.6rem] sm:text-6xl">Bantuan</h1>
        <p className="mt-3 max-w-2xl text-tinta-2">Kebijakan di halaman ini milik toko fiktif, dibuat untuk contoh. Isinya kami tulis seperti untuk toko sungguhan.</p>
        <nav aria-label="Topik bantuan" className="mt-6">
          <ul className="flex flex-wrap gap-2">
            {faq.map((g) => (
              <li key={g.id}>
                <a href={`#${g.id}`} className="inline-flex min-h-10 items-center rounded-full border border-garis bg-kertas px-4 py-2 text-[0.92rem] hover:border-daun">
                  {g.grup}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="wadah grid gap-12 pb-20 lg:grid-cols-12">
        <div className="grid gap-12 lg:col-span-8">
          {faq.map((g) => (
            <section key={g.id} id={g.id} aria-labelledby={`judul-${g.id}`} className="scroll-mt-24">
              <h2 id={`judul-${g.id}`} className="border-t-2 border-tinta pt-4 text-[1.9rem] sm:text-[2.3rem]">
                {g.grup}
              </h2>
              <div className="mt-4">
                {g.isi.map((t, i) => (
                  <details key={t.t} className="group border-b border-garis" open={i === 0}>
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-4 text-[1.05rem] font-semibold [&::-webkit-details-marker]:hidden">
                      <span>{t.t}</span>
                      <span aria-hidden="true" className="mt-0.5 text-xl leading-none text-daun transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="max-w-2xl pb-5 text-tinta-2">{t.j}</p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>
        <aside className="lg:col-span-4">
          <div className="grid gap-5 lg:sticky lg:top-24">
            <section aria-labelledby="judul-pintas" className="rounded-[1.25rem] border border-garis bg-embun p-5">
              <h2 id="judul-pintas" className="font-sans text-lg font-semibold tracking-normal">
                Mungkin yang kamu cari
              </h2>
              <ul className="mt-3 grid gap-2.5">
                <li><Link href="/cari-tanaman" className="tautan">Tanaman yang cocok untuk ruanganku</Link></li>
                <li><Link href="/katalog?hewan=1" className="tautan">Tanaman yang aman untuk kucing</Link></li>
                <li><Link href="/pengiriman" className="tautan">Jadwal dan ongkir tanaman hidup</Link></li>
                <li><Link href="/lacak" className="tautan">Lacak pesanan</Link></li>
              </ul>
            </section>
            <section aria-labelledby="judul-layanan" className="rounded-[1.25rem] border border-garis bg-kertas p-5">
              <h2 id="judul-layanan" className="font-sans text-lg font-semibold tracking-normal">
                Masih ada pertanyaan?
              </h2>
              <p className="mt-1 text-[0.92rem] text-tinta-2">
                {site.nama} toko fiktif, jadi tidak ada nomor yang bisa dihubungi. Formulir kontak demo menyimpan pesanmu di browser ini saja.
              </p>
              <Link href="/kontak" className="tautan mt-3 inline-block font-medium">
                Buka halaman kontak
              </Link>
            </section>
          </div>
        </aside>
      </div>
      <JsonLd data={ldFaq(faq.filter((g) => g.id !== 'demo'))} />
    </>
  );
}
