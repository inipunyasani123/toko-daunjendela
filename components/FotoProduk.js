import Image from 'next/image';

// Panggung foto produk: dinding bercahaya jendela + bayangan lantai. Foto tanaman sudah dipotong dari latar
// aslinya, jadi semua produk tampil di "ruangan" yang sama.
export function GambarProduk({ p, sizes = '(min-width: 1024px) 25vw, 50vw', prioritas = false, judul }) {
  if (p.foto?.penuh) {
    return (
      <Image
        src={p.foto.src}
        alt={judul ?? p.foto.alt}
        fill
        sizes={sizes}
        priority={prioritas}
        fetchPriority={prioritas ? 'high' : undefined}
        className="object-cover"
      />
    );
  }
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
  return null;
}

export default function FotoProduk({ p, className = '', varian = '', ...rest }) {
  const atas = p.foto?.tata === 'atas';
  return (
    <div className={`panggung ${varian} relative overflow-hidden ${atas ? 'after:hidden' : ''} ${className}`}>
      <GambarProduk p={p} {...rest} />
    </div>
  );
}
