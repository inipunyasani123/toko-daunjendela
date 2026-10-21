// Metadata Open Graph lengkap per halaman (Next.js mengganti objek openGraph induk, tidak menggabungkannya),
// dan pembuat JSON-LD.
import { site } from './data';
import { rentangHarga, totalStok } from './katalog';

const OG_ALT = 'Daun Jendela: tanaman hias di ambang jendela dengan bayangan daun di dinding';

export function ogHalaman({ path = '', judul, deskripsi }) {
  const url = `${site.url}${path}`;
  const title = judul ? `${judul} — ${site.nama}` : site.judul;
  return {
    openGraph: {
      type: 'website',
      locale: 'id_ID',
      url,
      siteName: site.nama,
      title,
      description: deskripsi,
      images: [{ url: '/og.jpg', width: 1200, height: 630, alt: OG_ALT }],
    },
    twitter: { card: 'summary_large_image', title, description: deskripsi, images: ['/og.jpg'] },
  };
}

export const OG_DEFAULT_ALT = OG_ALT;

export function ldToko() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'OnlineStore',
        '@id': `${site.url}/#toko`,
        name: site.nama,
        url: site.url,
        description: site.deskripsi,
        logo: `${site.url}/icon.svg`,
        image: `${site.url}/og.jpg`,
        slogan: site.tagline,
        areaServed: { '@type': 'Country', name: 'Indonesia' },
        currenciesAccepted: 'IDR',
      },
      {
        '@type': 'WebSite',
        '@id': `${site.url}/#situs`,
        name: site.nama,
        url: site.url,
        inLanguage: 'id-ID',
        publisher: { '@id': `${site.url}/#toko` },
      },
    ],
  };
}

export function ldProduk(p) {
  const { min, max } = rentangHarga(p);
  const ada = totalStok(p) > 0;
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.nama,
    description: p.ringkas,
    ...(p.latin ? { alternateName: p.latin } : {}),
    sku: `DJ-${p.slug}`,
    url: `${site.url}/produk/${p.slug}`,
    ...(p.foto ? { image: `${site.url}${p.foto.src}` } : {}),
    brand: { '@type': 'Brand', name: site.nama },
    category: { tanaman: 'Tanaman hias', pot: 'Pot tanaman', media: 'Media tanam', alat: 'Alat berkebun' }[p.jenis],
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'IDR',
      lowPrice: min,
      highPrice: max,
      offerCount: p.ukuran.length,
      availability: ada ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: { '@id': `${site.url}/#toko` },
    },
  };
}

export function ldJejak(langkah) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: langkah.map((l, i) => ({ '@type': 'ListItem', position: i + 1, name: l.nama, item: `${site.url}${l.path}` })),
  };
}

export function ldFaq(faq) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.flatMap((g) => g.isi).map((t) => ({ '@type': 'Question', name: t.t, acceptedAnswer: { '@type': 'Answer', text: t.j } })),
  };
}

export function JsonLd({ data }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}
