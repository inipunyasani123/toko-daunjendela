import Checkout from '@/components/Checkout';
import { ogHalaman } from '@/lib/seo';

const deskripsi = 'Isi alamat, pilih layanan kirim, dan buat pesanan di toko demo Daun Jendela. Ongkir dihitung dari zona tujuan dan ukuran kardus tanaman.';

export const metadata = {
  title: 'Checkout',
  description: deskripsi,
  ...ogHalaman({ path: '/checkout', judul: 'Checkout', deskripsi }),
  alternates: { canonical: '/checkout' },
  robots: { index: false, follow: true },
};

export default function HalamanCheckout() {
  return (
    <>
      <div className="wadah pb-8 pt-10 sm:pt-14">
        <h1 className="text-[2.6rem] sm:text-6xl">Checkout</h1>
        <p className="mt-3 max-w-2xl text-tinta-2">Alamat, pengiriman, lalu cara bayar. Jadwal kirim dan perkiraan tiba langsung terlihat sebelum kamu membayar.</p>
      </div>
      <Checkout />
    </>
  );
}
