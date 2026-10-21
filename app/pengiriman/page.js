import Link from 'next/link';
import JadwalKirim from '@/components/JadwalKirim';
import DiagramKemasan from '@/components/DiagramKemasan';
import { zonaOngkir, cariProduk, PEMBAGI_VOLUME, site, faq } from '@/lib/data';
import { beratVolumetrik } from '@/lib/kirim';
import { rupiah, gram, kg } from '@/lib/format';
import { ogHalaman } from '@/lib/seo';

const deskripsi = 'Tanaman hidup dikirim Senin–Rabu, dikemas berlapis, dengan ongkir dari berat volumetrik kardus. Zona tujuan, garansi tiba hidup, dan cara membuka kardus.';

export const metadata = {
  title: 'Pengiriman tanaman hidup',
  description: deskripsi,
  alternates: { canonical: '/pengiriman' },
  ...ogHalaman({ path: '/pengiriman', judul: 'Pengiriman tanaman hidup', deskripsi }),
};

const HARI_PERTAMA = [
  { hari: 'Hari tiba', isi: 'Buka kardus dari atas, keluarkan pelan sambil memegang pot, bukan batangnya. Lepas ikatan dan kertas penutup media.' },
  { hari: 'Hari 1–2', isi: 'Letakkan di tempat teduh yang terang. Siram hanya kalau media kering. Daun yang sedikit layu biasanya kencang lagi.' },
  { hari: 'Minggu 1', isi: 'Pindahkan ke posisi tetapnya. Satu dua daun tua yang menguning itu wajar, potong saja dari pangkalnya.' },
  { hari: 'Minggu 4', isi: 'Kalau sudah keluar daun atau tunas baru, tanaman sudah betah. Mulai pupuk encer setengah dosis.' },
];

export default function HalamanPengiriman() {
  const contoh = cariProduk('lidah-mertua');
  const u = contoh.ukuran[1];
  const vol = beratVolumetrik(u.kardus);
  const garansi = faq.find((g) => g.id === 'garansi');
  return (
    <>
      <div className="wadah pb-10 pt-10 sm:pt-14">
        <h1 className="max-w-3xl text-[2.6rem] leading-[1.04] sm:text-6xl">Pengiriman tanaman hidup</h1>
        <p className="mt-4 max-w-2xl text-tinta-2">
          Tanaman yang dikirim masih bernapas. Jadwal, kemasan, dan zona di halaman ini kami atur supaya tanamanmu menghabiskan waktu sesingkat
          mungkin di dalam kardus gelap. Semua tarif di sini contoh, bukan tarif kurir sungguhan.
        </p>
      </div>

      <section id="jadwal" aria-labelledby="judul-jadwal" className="scroll-mt-24 border-t border-garis py-14">
        <div className="wadah grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="judul-jadwal" className="text-[2rem] sm:text-[2.5rem]">
              Senin, Selasa, Rabu
            </h2>
            <p className="mt-3 text-tinta-2">
              Paket yang berangkat Kamis atau Jumat berisiko menginap di gudang kurir selama akhir pekan. Karena itu tanaman hidup hanya kami kirim
              tiga hari pertama dalam seminggu. Pesanan yang dibayar sebelum {String(site.batasKemasJam).padStart(2, '0')}.00 WIB pada hari kirim
              berangkat hari itu juga.
            </p>
            <p className="mt-3 text-tinta-2">Pot, media, dan alat tetap dikirim Senin sampai Sabtu. Pesanan campuran ikut jadwal tanaman.</p>
          </div>
          <div className="rounded-[1.25rem] border border-garis bg-kertas p-4 sm:p-5 lg:col-span-7">
            <JadwalKirim />
          </div>
        </div>
      </section>

      <section aria-labelledby="judul-kemas" className="border-t border-garis bg-embun py-14">
        <div className="wadah">
          <h2 id="judul-kemas" className="text-[2rem] sm:text-[2.5rem]">
            Cara kami mengemas
          </h2>
          <p className="mt-3 max-w-2xl text-tinta-2">
            Tanaman dicek akar dan daunnya sehari sebelum berangkat. Pot terakota dan keramik dibungkus kertas sarang lebah tambahan.
          </p>
          <div className="mt-8">
            <DiagramKemasan />
          </div>
        </div>
      </section>

      <section aria-labelledby="judul-zona" className="border-t border-garis py-14">
        <div className="wadah grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 id="judul-zona" className="text-[2rem] sm:text-[2.5rem]">
              Zona dan tarif contoh
            </h2>
            <p className="mt-3 text-tinta-2">Dari kebun di {site.asal}, {site.provinsiAsal}. Tarif per kilogram yang ditagih.</p>
            <div className="mt-5 overflow-x-auto rounded-[1.25rem] border border-garis bg-kertas" tabIndex={0} role="region" aria-label="Tabel zona dan tarif, bisa digeser">
              <table className="w-full min-w-[36rem] border-collapse text-left text-[0.92rem]">
                <thead>
                  <tr className="border-b border-tinta">
                    <th scope="col" className="px-4 py-3 font-semibold">Zona</th>
                    <th scope="col" className="px-4 py-3 text-end font-semibold">Reguler</th>
                    <th scope="col" className="px-4 py-3 text-end font-semibold">Kilat</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Tanaman hidup</th>
                  </tr>
                </thead>
                <tbody>
                  {zonaOngkir.map((z) => (
                    <tr key={z.id} className="border-b border-garis last:border-0">
                      <th scope="row" className="px-4 py-3 font-normal">
                        <span className="block font-semibold">{z.nama}</span>
                        <span className="block text-[0.85rem] text-tinta-2">{z.cakupan}</span>
                      </th>
                      <td className="px-4 py-3 text-end tabular-nums">
                        {rupiah(z.layanan.reguler.perKg)}
                        <span className="block text-[0.8rem] text-tinta-2">{z.layanan.reguler.estimasi}</span>
                      </td>
                      <td className="px-4 py-3 text-end tabular-nums">
                        {z.layanan.kilat ? (
                          <>
                            {rupiah(z.layanan.kilat.perKg)}
                            <span className="block text-[0.8rem] text-tinta-2">{z.layanan.kilat.estimasi}</span>
                          </>
                        ) : (
                          <span className="text-tinta-2">belum ada</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {z.tanaman === 'semua' ? 'Reguler & Kilat' : z.tanaman === 'kilat' ? 'Kilat saja' : <span className="font-medium text-awas">Belum dikirim</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="lg:col-span-5">
            <h2 className="text-[2rem] sm:text-[2.5rem]">Kenapa ongkirnya dari ukuran kardus</h2>
            <p className="mt-3 text-tinta-2">
              Tanaman ringan tapi makan tempat di mobil kurir. Kurir menghitung berat volumetrik: panjang × lebar × tinggi kardus dibagi{' '}
              {new Intl.NumberFormat('id-ID').format(PEMBAGI_VOLUME)}. Kami memakai angka yang lebih besar antara berat asli dan berat volumetrik.
            </p>
            <div className="mt-5 rounded-[1.25rem] border border-garis bg-kertas p-4 sm:p-5">
              <p className="font-semibold">
                Contoh: {contoh.nama} {u.label.toLowerCase()}
              </p>
              <dl className="mt-3 grid gap-1.5 text-[0.92rem]">
                <div className="flex justify-between gap-4">
                  <dt className="text-tinta-2">Kardus</dt>
                  <dd className="tabular-nums">{u.kardus.join(' × ')} cm</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-tinta-2">Berat volumetrik</dt>
                  <dd className="tabular-nums">{kg(vol / 1000)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-tinta-2">Berat asli dengan media</dt>
                  <dd className="tabular-nums">{gram(u.berat)}</dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-garis pt-2 font-semibold">
                  <dt>Yang ditagih</dt>
                  <dd className="tabular-nums">{Math.ceil(Math.max(vol, u.berat) / 1000)} kg</dd>
                </div>
              </dl>
              <p className="mt-3 text-[0.85rem] text-tinta-2">Tanaman besar seperti monstera bisa punya ongkir yang mendekati harga tanamannya. Kami tampilkan rinciannya di checkout sebelum kamu membayar.</p>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="judul-buka" className="border-t border-garis bg-kapur-2/50 py-14">
        <div className="wadah grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h2 id="judul-buka" className="text-[2rem] sm:text-[2.5rem]">
              Setelah kardus dibuka
            </h2>
            <ol className="mt-6 border-t border-tinta">
              {HARI_PERTAMA.map((h) => (
                <li key={h.hari} className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-4 border-b border-garis py-4">
                  <p className="rapat pt-0.5 text-[0.75rem] text-daun">{h.hari}</p>
                  <p className="text-tinta-2">{h.isi}</p>
                </li>
              ))}
            </ol>
            <Link href="/kalender-rawat" className="tautan mt-5 inline-block font-medium">
              Buat kalender rawat dari tanggal tiba
            </Link>
          </div>
          <div className="lg:col-span-6">
            <h2 className="text-[2rem] sm:text-[2.5rem]">{garansi.grup}</h2>
            <div className="mt-6 grid gap-4">
              {garansi.isi.map((t) => (
                <div key={t.t} className="rounded-[1.25rem] border border-garis bg-kertas p-4 sm:p-5">
                  <h3 className="font-sans text-[1.02rem] font-semibold tracking-normal">{t.t}</h3>
                  <p className="mt-1.5 text-tinta-2">{t.j}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
