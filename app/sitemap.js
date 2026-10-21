import { produk, site } from '@/lib/data';

export default function sitemap() {
  const statis = [
    { path: '', prioritas: 1, ubah: 'weekly' },
    { path: '/katalog', prioritas: 0.9, ubah: 'weekly' },
    { path: '/cari-tanaman', prioritas: 0.8, ubah: 'monthly' },
    { path: '/kalender-rawat', prioritas: 0.6, ubah: 'monthly' },
    { path: '/pengiriman', prioritas: 0.6, ubah: 'monthly' },
    { path: '/bantuan', prioritas: 0.6, ubah: 'monthly' },
    { path: '/tentang', prioritas: 0.5, ubah: 'yearly' },
    { path: '/kontak', prioritas: 0.4, ubah: 'yearly' },
    { path: '/lacak', prioritas: 0.3, ubah: 'yearly' },
  ].map((h) => ({ url: `${site.url}${h.path}`, changeFrequency: h.ubah, priority: h.prioritas }));
  const halamanProduk = produk.map((p) => ({ url: `${site.url}/produk/${p.slug}`, changeFrequency: 'weekly', priority: p.jenis === 'tanaman' ? 0.8 : 0.6 }));
  return [...statis, ...halamanProduk];
}
