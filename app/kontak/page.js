import Link from 'next/link';
import FormKontak from '@/components/FormKontak';
import { site } from '@/lib/data';
import { ogHalaman } from '@/lib/seo';

const deskripsi = 'Kirim pertanyaan soal memilih tanaman, pesanan, atau tanaman yang tiba rusak. Formulir demo: pesan hanya tersimpan di browser kamu.';

export const metadata = {
  title: 'Kontak',
  description: deskripsi,
  alternates: { canonical: '/kontak' },
  ...ogHalaman({ path: '/kontak', judul: 'Kontak', deskripsi }),
};

export default function HalamanKontak() {
  return (
    <div className="wadah grid gap-10 pb-20 pt-10 sm:pt-14 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <h1 className="text-[2.6rem] sm:text-6xl">Kontak</h1>
        <p className="mt-4 text-tinta-2">
          Pertanyaan yang paling sering kami terima soal tanaman yang cocok untuk ruangan tertentu. Kalau kamu menulis seterang apa ruangannya dan
          jendelanya menghadap ke mana, jawabannya bisa lebih tepat.
        </p>
        <dl className="mt-8 grid gap-5 border-t border-garis pt-6">
          <div>
            <dt className="font-semibold">Jam layanan (contoh)</dt>
            <dd className="text-tinta-2">{site.jamLayanan}</dd>
          </div>
          <div>
            <dt className="font-semibold">Tanaman tiba rusak</dt>
            <dd className="text-tinta-2">
              Sertakan kode pesanan dan video buka kardus dalam 24 jam setelah paket diterima.{' '}
              <Link href="/pengiriman" className="tautan">
                Ketentuan garansi
              </Link>
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Nomor telepon dan alamat</dt>
            <dd className="text-tinta-2">
              Tidak ada. {site.nama} toko fiktif, jadi kami tidak mencantumkan nomor atau alamat yang bisa dikira milik orang sungguhan.
            </dd>
          </div>
        </dl>
      </div>
      <div className="lg:col-span-7">
        <FormKontak />
      </div>
    </div>
  );
}
