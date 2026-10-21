import Link from 'next/link';
import Logo from './Logo';
import { site, faq } from '@/lib/data';

export default function Footer() {
  return (
    <footer data-situs className="gelap relative overflow-hidden bg-daun-tua text-[#dfe8e1]">
      <div aria-hidden="true" className="krepyak h-5 border-b border-white/10 bg-daun-gelap" />
      <div className="wadah relative grid grid-cols-2 gap-x-6 gap-y-10 py-14 md:grid-cols-12">
        <div className="col-span-2 md:col-span-5">
          <Link href="/" className="inline-flex rounded-md text-white" aria-label="Daun Jendela, ke beranda">
            <Logo ukuran="besar" />
          </Link>
          <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-[#c9d6cd]">
            Tanaman hias dari kebun kecil di {site.asal}, {site.ketinggian}. Kami memilihkan tanaman dari cahaya, udara, dan waktu luang di
            rumahmu, lalu mengemasnya supaya tetap segar sampai tujuan.
          </p>
          <p className="mt-5 max-w-sm border-s-2 border-cahaya ps-3 text-[0.9rem] text-[#e8efe9]">
            {site.nama} adalah toko fiktif untuk demo. Tidak ada transaksi sungguhan.
          </p>
        </div>

        <nav aria-label="Belanja" className="md:col-span-2">
          <h2 className="rapat font-sans text-[0.78rem] text-cahaya">Belanja</h2>
          <ul className="mt-4 grid gap-2.5 text-[0.95rem]">
            <li><Link className="hover:underline" href="/katalog">Semua tanaman</Link></li>
            <li><Link className="hover:underline" href="/katalog?jenis=pot">Pot</Link></li>
            <li><Link className="hover:underline" href="/katalog?jenis=media">Media tanam</Link></li>
            <li><Link className="hover:underline" href="/cari-tanaman">Cari yang betah</Link></li>
            <li><Link className="hover:underline" href="/kalender-rawat">Kalender rawat</Link></li>
          </ul>
        </nav>

        <nav aria-label="Bantuan" className="md:col-span-2">
          <h2 className="rapat font-sans text-[0.78rem] text-cahaya">Bantuan</h2>
          <ul className="mt-4 grid gap-2.5 text-[0.95rem]">
            <li><Link className="hover:underline" href="/pengiriman">Pengiriman tanaman</Link></li>
            {faq.filter((g) => ['memilih', 'garansi'].includes(g.id)).map((g) => (
              <li key={g.id}><Link className="hover:underline" href={`/bantuan#${g.id}`}>{g.grup}</Link></li>
            ))}
            <li><Link className="hover:underline" href="/lacak">Lacak pesanan</Link></li>
          </ul>
        </nav>

        <div className="col-span-2 md:col-span-3">
          <h2 className="rapat font-sans text-[0.78rem] text-cahaya">Kebun</h2>
          <ul className="mt-4 grid gap-2.5 text-[0.95rem]">
            <li><Link className="hover:underline" href="/tentang">Tentang kami</Link></li>
            <li><Link className="hover:underline" href="/kontak">Kontak</Link></li>
          </ul>
          <dl className="mt-5 grid gap-3 text-[0.92rem]">
            <div>
              <dt className="text-[#b9c9bf]">Jam layanan (contoh)</dt>
              <dd>{site.jamLayanan}</dd>
            </div>
          </dl>
          <Link href="/admin" className="mt-5 inline-flex items-center gap-2 text-[0.95rem] underline underline-offset-4 hover:decoration-2">
            Dasbor demo penjual
          </Link>
        </div>
      </div>
      <div className="wadah relative flex flex-wrap items-center justify-between gap-3 border-t border-white/15 py-5 text-[0.82rem] text-[#c3d1c7]">
        <p>Semua produk, harga, stok, jadwal, dan pesanan di situs ini contoh. Foto tanaman: CC0, dari Openverse.</p>
        <p>Tanpa klaim pembersih udara.</p>
      </div>
    </footer>
  );
}
