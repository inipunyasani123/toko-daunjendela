import Image from 'next/image';
import { fotoPot } from '@/lib/data';

// Foto pot untuk pilihan padanan, kartu penjelasan, dan halaman 404. Pot nursery berupa foto kantong pot di kebun
// semai (memenuhi bingkai); pot lain dipotong dari latar aslinya. `className` menentukan posisi dan ukuran bingkai.
export function Pot({ jenis = 'terakota', className = '', judul }) {
  const f = fotoPot[jenis] || fotoPot.terakota;
  const penuh = f.penuh;
  return (
    <span className={`block ${penuh ? 'overflow-hidden rounded-md' : ''} ${className}`.trim()}>
      <Image
        src={f.src}
        alt={judul ?? ''}
        fill
        sizes="(min-width: 1024px) 12vw, 30vw"
        className={penuh ? 'object-cover' : 'object-contain object-bottom'}
      />
    </span>
  );
}
