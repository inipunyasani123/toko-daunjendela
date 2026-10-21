import './globals.css';
import { Besley, Instrument_Sans } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PitaKirim from '@/components/PitaKirim';
import { site } from '@/lib/data';
import { ldToko, JsonLd, OG_DEFAULT_ALT } from '@/lib/seo';

// Besley tegak 600 untuk judul (di-preload karena H1 = LCP); miring 400 hanya untuk nama Latin, tanpa preload.
const besley = Besley({ subsets: ['latin'], weight: '600', variable: '--font-besley', display: 'swap' });
const besleyMiring = Besley({ subsets: ['latin'], weight: '400', style: 'italic', variable: '--font-besley-miring', display: 'swap', preload: false });
const instrument = Instrument_Sans({ subsets: ['latin'], variable: '--font-instrument', display: 'swap' });

export const metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.judul, template: `%s — ${site.nama}` },
  description: site.deskripsi,
  applicationName: site.nama,
  keywords: ['tanaman hias', 'toko tanaman online', 'tanaman indoor', 'tanaman aman untuk kucing', 'pot terakota', 'media tanam', 'demo toko online'],
  authors: [{ name: 'PintuWeb', url: 'https://www.pintuweb.id' }],
  creator: 'PintuWeb',
  publisher: 'PintuWeb',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: site.url,
    siteName: site.nama,
    title: site.judul,
    description: site.deskripsi,
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: OG_DEFAULT_ALT }],
  },
  twitter: { card: 'summary_large_image', title: site.judul, description: site.deskripsi, images: ['/og.jpg'] },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
};

export const viewport = {
  themeColor: '#123326',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${besley.variable} ${besleyMiring.variable} ${instrument.variable}`}>
      <body className="antialiased">
        <a href="#isi" className="sr-only-fokus fixed left-3 top-3 z-50 rounded-full bg-tinta px-4 py-2 text-white">
          Langsung ke isi
        </a>
        <PitaKirim />
        <Header />
        <main id="isi">{children}</main>
        <Footer />
        <JsonLd data={ldToko()} />
        <aside aria-label="Tentang situs demo ini" style={{ display: 'block', margin: 0, padding: '12px 16px', background: '#0f1b33', color: '#dfe6f3', font: '400 13px/1.5 system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', textAlign: 'center' }}>
          Situs demo buatan PintuWeb — nama dan isinya rekaan.{' '}
          <a href="https://www.pintuweb.id/kontak?demo=daunjendela" style={{ color: '#ffffff', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: '3px' }}>Buat yang seperti ini →</a>
        </aside>
      </body>
    </html>
  );
}
