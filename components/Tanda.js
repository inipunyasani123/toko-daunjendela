import { IkonTapak } from './Ikon';
import { namaRawat } from '@/lib/katalog';

// Label tancap untuk keamanan hewan dan tingkat rawat.
export function TandaHewan({ className = '' }) {
  return (
    <span className={`label-tancap ${className}`} style={{ '--tag-bg': '#dde9cc', '--tag-fg': '#15322a' }}>
      <IkonTapak className="h-3.5 w-3.5" />
      Aman untuk hewan
    </span>
  );
}

const WARNA_RAWAT = {
  1: { bg: '#dde9cc', fg: '#15322a' },
  2: { bg: '#f7e7ad', fg: '#15322a' },
  3: { bg: '#f3dccf', fg: '#15322a' },
};

export function TandaRawat({ n, className = '', awalan = 'Rawat' }) {
  const w = WARNA_RAWAT[n] || WARNA_RAWAT[1];
  return (
    <span className={`label-tancap ${className}`} style={{ '--tag-bg': w.bg, '--tag-fg': w.fg }}>
      {awalan ? `${awalan} ` : ''}
      {namaRawat(n).toLowerCase()}
    </span>
  );
}
