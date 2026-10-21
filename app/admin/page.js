import Admin from '@/components/Admin';
import { ogHalaman } from '@/lib/seo';

const deskripsi = 'Dasbor penjual toko demo Daun Jendela: pesanan, antrean kirim tanaman, stok per ukuran, dan ringkasan penjualan. Data tersimpan di browser.';

export const metadata = {
  title: 'Dasbor demo penjual',
  description: deskripsi,
  ...ogHalaman({ path: '/admin', judul: 'Dasbor demo penjual', deskripsi }),
  alternates: { canonical: '/admin' },
  robots: { index: false, follow: false },
};

export default function HalamanAdmin() {
  return (
    <>
      <div className="wadah pb-8 pt-10 sm:pt-14">
        <p className="rapat text-[0.75rem] text-daun">Untuk penjual · tanpa login karena ini demo</p>
        <h1 className="mt-2 max-w-4xl text-[2.2rem] leading-[1.08] sm:text-5xl">Dasbor demo, data tersimpan di browser ini</h1>
        <p className="mt-3 max-w-2xl text-tinta-2">
          Ubah status pesanan, lihat antrean kirim tanaman per hari kirim, atur stok tiap ukuran, dan lihat penjualan. Semua perubahan langsung terlihat di
          toko pada browser yang sama, dan bisa dikembalikan ke data contoh kapan saja.
        </p>
      </div>
      <Admin />
    </>
  );
}
