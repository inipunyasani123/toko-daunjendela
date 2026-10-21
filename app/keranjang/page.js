import Keranjang from '@/components/Keranjang';
import { ogHalaman } from '@/lib/seo';

const deskripsi = 'Isi keranjang belanja di toko demo Daun Jendela. Keranjang tersimpan di browser kamu, stok tanaman dan pot dicek lagi saat checkout.';

export const metadata = {
  title: 'Keranjang',
  description: deskripsi,
  ...ogHalaman({ path: '/keranjang', judul: 'Keranjang', deskripsi }),
  alternates: { canonical: '/keranjang' },
  robots: { index: false, follow: true },
};

export default function HalamanKeranjang() {
  return (
    <>
      <div className="wadah pb-8 pt-10 sm:pt-14">
        <h1 className="text-[2.6rem] sm:text-6xl">Keranjang</h1>
        <p className="mt-3 max-w-2xl text-tinta-2">Keranjang tersimpan di browser ini saja. Stok tanaman dan pot pasangannya dicek lagi saat pesanan dibuat.</p>
      </div>
      <Keranjang />
    </>
  );
}
