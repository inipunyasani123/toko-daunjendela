import Link from 'next/link';
import JendelaHero from '@/components/JendelaHero';
import PilihCahaya from '@/components/PilihCahaya';
import RentangCahaya from '@/components/RentangCahaya';
import BentoRuang from '@/components/BentoRuang';
import KartuProduk from '@/components/KartuProduk';
import PadananPot from '@/components/PadananPot';
import MingguIni from '@/components/MingguIni';
import JadwalKirim from '@/components/JadwalKirim';
import DiagramKemasan from '@/components/DiagramKemasan';
import { cariProduk, tanaman, zonaOngkir, site } from '@/lib/data';

export const metadata = {
  alternates: { canonical: '/' },
};

const PEMULA = ['lidah-mertua', 'sirih-gading', 'peperomia', 'lili-paris'];

const TIDAK_DIJANJIKAN = [
  {
    judul: 'Udara jadi bersih',
    isi: 'Efek tanaman pada udara di rumah biasa sangat kecil dibanding membuka jendela. Kami menjual tanaman karena menyenangkan dirawat, bukan sebagai pembersih udara.',
  },
  {
    judul: 'Persis seperti di foto',
    isi: 'Foto di toko ini contoh tanaman sejenis. Yang kamu terima diambil dari kebun sesuai ukuran, jadi jumlah daun dan arah tumbuhnya bisa lain.',
  },
  {
    judul: 'Tidak ada daun yang menguning',
    isi: 'Pindah dari kebun yang sejuk ke rumahmu butuh penyesuaian. Satu atau dua daun tua yang menguning di minggu pertama itu wajar.',
  },
];

export default function Beranda() {
  const pemula = PEMULA.map(cariProduk);
  const aman = tanaman.filter((p) => p.hewan).length;
  return (
    <>
      {/* Pahlawan */}
      <section aria-labelledby="judul-utama" className="relative overflow-hidden">
        <div className="wadah grid items-center gap-10 pb-14 pt-8 sm:pt-12 lg:grid-cols-12 lg:gap-8 lg:pb-20">
          <div className="lg:col-span-6">
            <h1 id="judul-utama" className="text-[2.6rem] leading-[1.02] sm:text-[3.6rem] lg:text-[4.1rem]">
              Tanaman yang betah di dekat jendelamu.
            </h1>
            <p className="mt-5 max-w-xl text-[1.05rem] text-tinta-2 sm:text-[1.12rem]">
              Ceritakan seterang apa ruanganmu, selembap apa udaranya, dan seberapa sempat kamu menyiram. Kami sarankan tanaman yang cocok,
              lengkap dengan pot, media, dan jadwal rawatnya.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link href="/cari-tanaman" className="tombol tombol-utama">
                Cari tanaman yang cocok
              </Link>
              <Link href="/katalog" className="tombol tombol-garis">
                Lihat {tanaman.length} tanaman
              </Link>
            </div>
            <PilihCahaya />
          </div>
          <div className="lg:col-span-6">
            <JendelaHero />
          </div>
        </div>
      </section>

      {/* Rentang cahaya */}
      <section aria-labelledby="judul-cahaya" className="border-t border-garis bg-kapur py-16 sm:py-20">
        <div className="wadah grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="judul-cahaya" className="text-[2.1rem] sm:text-[2.7rem]">
              Dari ambang jendela sampai sudut ruangan
            </h2>
            <p className="mt-4 max-w-md text-tinta-2">
              Cahaya adalah hal pertama yang menentukan tanaman betah atau tidak. Tiap baris di sini adalah satu tanaman, dan ruas berwarna
              menunjukkan seberapa terang tempat yang ia sukai.
            </p>
            <p className="mt-4 max-w-md text-tinta-2">
              Lidah mertua sanggup dari teras terik sampai sudut redup. Kalatea dan kadaka paling senang agak jauh dari jendela.
            </p>
            <Link href="/cari-tanaman" className="tautan mt-5 inline-block font-medium">
              Hitung juga udara dan waktu luangmu
            </Link>
          </div>
          <div className="lg:col-span-8">
            <RentangCahaya />
          </div>
        </div>
      </section>

      {/* Per ruangan */}
      <section aria-labelledby="judul-ruang" className="border-t border-garis bg-embun py-16 sm:py-20">
        <div className="wadah">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 id="judul-ruang" className="text-[2.1rem] sm:text-[2.7rem]">
                Belanja per ruangan
              </h2>
              <p className="mt-3 max-w-xl text-tinta-2">Tiap ruangan punya cahaya dan udara sendiri. Pilih ruangannya, katalog langsung tersaring.</p>
            </div>
            <Link href="/katalog" className="tautan font-medium">
              Semua tanaman
            </Link>
          </div>
          <div className="mt-8">
            <BentoRuang />
          </div>
        </div>
      </section>

      {/* Pemula */}
      <section aria-labelledby="judul-pemula" className="border-t border-garis py-16 sm:py-20">
        <div className="wadah">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 id="judul-pemula" className="text-[2.1rem] sm:text-[2.7rem]">
                Mulai dari yang memaafkan
              </h2>
              <p className="mt-3 max-w-xl text-tinta-2">
                Empat tanaman yang tetap segar walau kamu lupa menyiram seminggu. Ada {aman} tanaman di toko ini yang aman untuk kucing dan
                anjing, termasuk lili paris dan peperomia.
              </p>
            </div>
            <Link href="/katalog?rawat=1" className="tautan font-medium">
              Semua yang santai dirawat
            </Link>
          </div>
          <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 lg:grid-cols-4">
            {pemula.map((p) => (
              <li key={p.slug}>
                <KartuProduk produk={p} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Pot dan media */}
      <section aria-labelledby="judul-pot" className="border-t border-garis bg-kapur-2/60 py-16 sm:py-20">
        <div className="wadah">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 id="judul-pot" className="text-[2.1rem] sm:text-[2.7rem]">
                Pot dan media yang sepadan
              </h2>
              <p className="mt-3 max-w-xl text-tinta-2">
                Pot terakota mengeringkan media, keramik menahan lembap. Di halaman tiap tanaman ada saran pot yang cocok dan yang sebaiknya
                dihindari.
              </p>
            </div>
            <Link href="/katalog?jenis=pot" className="tautan font-medium">
              Lihat pot dan media
            </Link>
          </div>
          <div className="mt-8">
            <PadananPot />
          </div>
        </div>
      </section>

      {/* Kalender & pengiriman */}
      <section aria-labelledby="judul-rawat" className="border-t border-garis py-16 sm:py-20">
        <div className="wadah grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h2 id="judul-rawat" className="text-[2.1rem] sm:text-[2.7rem]">
              Kalender rawat, dihitung dari hari tiba
            </h2>
            <p className="mt-3 max-w-lg text-tinta-2">
              Contoh minggu ini untuk kalatea yang tiba tiga hari lalu, sirih gading dua minggu lalu, dan ekeveria hampir sebulan lalu. Pupuk
              baru dimulai setelah empat minggu adaptasi.
            </p>
            <div className="mt-6">
              <MingguIni />
            </div>
          </div>
          <div className="lg:col-span-6">
            <h2 id="judul-kirim" className="text-[2.1rem] sm:text-[2.7rem]">
              Dikirim Senin sampai Rabu
            </h2>
            <p className="mt-3 max-w-lg text-tinta-2">
              Tanaman di dalam kardus gelap hanya tahan beberapa hari. Karena itu tanaman tidak kami kirim menjelang akhir pekan, supaya tidak
              menginap di gudang kurir.
            </p>
            <div className="mt-6 rounded-[1.25rem] border border-garis bg-kertas p-4 sm:p-5">
              <JadwalKirim />
            </div>
            <p className="mt-4 text-[0.9rem] text-tinta-2">
              Tanaman hidup sampai ke {zonaOngkir.filter((z) => z.tanaman).map((z) => z.cakupan).join('; ')}. Ke{' '}
              {zonaOngkir.find((z) => !z.tanaman).cakupan} kami baru mengirim pot, media, dan alat.{' '}
              <Link href="/pengiriman" className="tautan">
                Cara kami mengemas
              </Link>
            </p>
          </div>
        </div>
        <div className="wadah mt-12">
          <DiagramKemasan ringkas />
        </div>
      </section>

      {/* Yang tidak dijanjikan */}
      <section aria-labelledby="judul-jujur" className="gelap border-t border-garis bg-daun-tua py-16 text-[#e3ebe5] sm:py-20">
        <div className="wadah grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="judul-jujur" className="text-[2.1rem] text-white sm:text-[2.7rem]">
              Yang tidak kami janjikan
            </h2>
            <p className="mt-3 text-[#c9d6cd]">
              Tiga hal yang sering dijanjikan toko tanaman, dan alasan kami tidak ikut menjanjikannya.
            </p>
          </div>
          <ul className="grid gap-6 sm:grid-cols-3 lg:col-span-8">
            {TIDAK_DIJANJIKAN.map((t) => (
              <li key={t.judul} className="border-t border-white/25 pt-4">
                <h3 className="text-[1.3rem] text-white">
                  <span aria-hidden="true" className="me-2 text-cahaya">×</span>
                  {t.judul}
                </h3>
                <p className="mt-2 text-[0.92rem] text-[#c9d6cd]">{t.isi}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
