import Image from 'next/image';
import { Pot, KantongMedia, Semprotan, TusukBambu } from './Ilustrasi';

// Panggung foto produk: dinding bercahaya jendela + bayangan lantai. Foto tanaman sudah dipotong dari latar
// aslinya, jadi semua produk tampil di "ruangan" yang sama.
export function GambarProduk({ p, sizes = '(min-width: 1024px) 25vw, 50vw', prioritas = false, judul }) {
  if (p.foto?.potong) {
    const tata = p.foto.tata;
    const kotak =
      tata === 'atas' ? 'inset-[7%]' : tata === 'tinggi' ? 'left-[8%] right-[8%] -top-[4%] bottom-[6%]' : 'left-[9%] right-[9%] top-[8%] bottom-[6.5%]';
    return (
      <span className={`absolute block ${kotak}`}>
        <Image
          src={p.foto.src}
          alt={judul ?? p.foto.alt}
          fill
          sizes={sizes}
          priority={prioritas}
          fetchPriority={prioritas ? 'high' : undefined}
          className={`object-contain ${tata === 'atas' ? 'object-center' : 'object-bottom'}`}
        />
      </span>
    );
  }
  const label = judul ?? `Ilustrasi ${p.nama}`;
  const kelas = 'absolute inset-x-[12%] bottom-[5%] top-[10%] h-[85%] w-[76%]';
  if (p.jenis === 'pot') return <Pot jenis={p.pot} tanah={false} judul={label || undefined} className={kelas} />;
  if (p.jenis === 'media') return <KantongMedia racikan={p.racikan} judul={label || undefined} className={kelas} />;
  if (p.slug === 'semprotan-embun') return <Semprotan judul={label || undefined} className={kelas} />;
  return <TusukBambu judul={label || undefined} className={kelas} />;
}

export default function FotoProduk({ p, className = '', varian = '', ...rest }) {
  const atas = p.foto?.tata === 'atas';
  return (
    <div className={`panggung ${varian} relative overflow-hidden ${atas ? 'after:hidden' : ''} ${className}`}>
      <GambarProduk p={p} {...rest} />
    </div>
  );
}
