'use client';

// Ilustrasi produk tanpa foto: pot, kantong media (kemasan merek fiktif), semprotan, dan tusuk bambu.
// Satu gaya: bentuk berlapis, gradasi lembut dari kiri atas (cahaya jendela), bayangan di sisi kanan.
import { useId } from 'react';
import { cariRacikan, bahan } from '@/lib/data';

const WARNA_POT = {
  terakota: { a: '#d27a4f', b: '#b15a35', c: '#8d4326', bibir: '#c86c42', bintik: '#8d4326' },
  semen: { a: '#c3c4bc', b: '#a2a49b', c: '#7f8279', bibir: '#b5b7ae', bintik: '#6e716a' },
  keramik: { a: '#fbfaf5', b: '#e7e4da', c: '#c9c5b8', bibir: '#f4f2ea', bintik: '#b9b4a6' },
  gantung: { a: '#f2efe6', b: '#dcd8cb', c: '#bdb8a8', bibir: '#e9e6dc', bintik: '#a9a392' },
  nursery: { a: '#3c3f3c', b: '#2a2c2a', c: '#161716', bibir: '#353835', bintik: '#111' },
};

const BINTIK = [
  [62, 128], [78, 150], [95, 122], [108, 160], [121, 135], [136, 151], [70, 172], [101, 182], [128, 176], [86, 140], [114, 118], [140, 128],
];

// Pot tampak depan sedikit dari atas. `tanah` menampilkan permukaan media.
export function Pot({ jenis = 'terakota', className = '', judul, tanah = true }) {
  const id = useId().replace(/:/g, '');
  const w = WARNA_POT[jenis] || WARNA_POT.terakota;
  const gantung = jenis === 'gantung';
  const nursery = jenis === 'nursery';
  const badan =
    jenis === 'keramik'
      ? 'M48 92 C48 150 62 186 100 188 C138 186 152 150 152 92 Z'
      : jenis === 'semen'
        ? 'M50 94 L56 186 Q100 192 144 186 L150 94 Z'
        : gantung
          ? 'M46 96 C50 146 70 170 100 171 C130 170 150 146 154 96 Z'
          : 'M46 92 L60 184 Q100 191 140 184 L154 92 Z';
  return (
    <svg viewBox="0 0 200 210" preserveAspectRatio="xMidYMax meet" className={className} role={judul ? 'img' : undefined} aria-label={judul} aria-hidden={judul ? undefined : true} focusable="false">
      <defs>
        <linearGradient id={`b${id}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={w.a} />
          <stop offset="0.55" stopColor={w.b} />
          <stop offset="1" stopColor={w.c} />
        </linearGradient>
        <linearGradient id={`t${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#4a3828" />
          <stop offset="1" stopColor="#2c2119" />
        </linearGradient>
        <radialGradient id={`k${id}`} cx="0.3" cy="0.25" r="0.6">
          <stop offset="0" stopColor="#fff" stopOpacity={jenis === 'keramik' ? 0.85 : 0.28} />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {gantung && (
        <g stroke="#b3925f" strokeWidth="2.2" fill="none" strokeLinecap="round">
          <path d="M100 14 L50 98" />
          <path d="M100 14 L100 100" />
          <path d="M100 14 L150 98" />
          <circle cx="100" cy="10" r="6" stroke="#6f6a5c" strokeWidth="2.4" />
          <path d="M60 81 q4 4 8 0 M96 76 q4 4 8 0 M132 81 q4 4 8 0" stroke="#9c7c4e" />
        </g>
      )}
      {!gantung && jenis !== 'keramik' && <ellipse cx="100" cy="190" rx="62" ry="9" fill={jenis === 'terakota' ? '#9b4b2c' : 'rgb(20 30 25 / .18)'} />}
      <path d={badan} fill={`url(#b${id})`} />
      {nursery &&
        [70, 85, 100, 115, 130].map((x) => (
          <path key={x} d={`M${x} 100 L${x + (x - 100) * 0.12} 182`} stroke="#000" strokeOpacity=".35" strokeWidth="2" />
        ))}
      {!nursery && jenis !== 'keramik' && BINTIK.map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.3" fill={w.bintik} opacity=".45" />)}
      <path d={badan} fill={`url(#k${id})`} />
      {jenis === 'keramik' && <path d="M66 104 C64 132 70 156 84 170" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity=".7" fill="none" />}
      {/* bibir pot */}
      <ellipse cx="100" cy="93" rx={jenis === 'semen' ? 51 : 55} ry="13" fill={w.bibir} />
      {jenis === 'terakota' && <path d="M45 92 L48 108 Q100 118 152 108 L155 92" fill="#c06639" opacity=".9" />}
      <ellipse cx="100" cy="93" rx={jenis === 'semen' ? 45 : 48} ry="9.5" fill={tanah ? `url(#t${id})` : w.c} />
      {tanah && (
        <g fill="#7a6248" opacity=".75">
          <circle cx="82" cy="92" r="1.6" />
          <circle cx="108" cy="95" r="1.4" />
          <circle cx="121" cy="91" r="1.2" />
          <circle cx="94" cy="96" r="1.1" />
        </g>
      )}
    </svg>
  );
}

// Kantong kertas berlapis untuk racikan media, dengan label merek fiktif dan bilah komposisi.
export function KantongMedia({ racikan: rid, className = '', judul }) {
  const id = useId().replace(/:/g, '');
  const r = cariRacikan(rid);
  if (!r) return null;
  let x = 66;
  return (
    <svg viewBox="0 0 200 240" preserveAspectRatio="xMidYMax meet" className={className} role={judul ? 'img' : undefined} aria-label={judul} aria-hidden={judul ? undefined : true} focusable="false">
      <defs>
        <linearGradient id={`k${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#d9b98a" />
          <stop offset="0.6" stopColor="#c8a271" />
          <stop offset="1" stopColor="#a98559" />
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="226" rx="62" ry="8" fill="rgb(20 30 25 / .16)" />
      <path d="M44 52 L156 52 L162 222 Q100 230 38 222 Z" fill={`url(#k${id})`} />
      <path d="M44 52 L156 52 L150 30 L50 30 Z" fill="#b9935f" />
      <path d="M50 30 L150 30 L150 22 L50 22 Z" fill="#a37f4e" />
      <path d="M58 40 h84" stroke="#8c6a3e" strokeWidth="1.5" strokeDasharray="4 3" />
      <path d="M44 52 L38 222" stroke="#fff" strokeOpacity=".25" strokeWidth="3" />
      {/* label */}
      <rect x="56" y="72" width="88" height="118" rx="5" fill="#f6f3ea" />
      <g transform="translate(91 82) scale(.55)" fill="none" stroke="#15322a" strokeWidth="2.4">
        <path d="M4 34V15.5C4 8.6 9.4 3 16 3s12 5.6 12 12.5V34Z" />
        <path d="M16 3.6V34M4.6 18.5h22.8" strokeWidth="1.8" />
      </g>
      <text x="100" y="118" textAnchor="middle" fontSize="8.5" fill="#15322a" style={{ fontFamily: 'var(--font-sans)', letterSpacing: '.12em', fontWeight: 600 }}>
        DAUN JENDELA
      </text>
      <text x="100" y="136" textAnchor="middle" fontSize="13.5" fill="#15322a" style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>
        {r.nama.replace('Racikan ', '')}
      </text>
      <text x="100" y="148" textAnchor="middle" fontSize="7" fill="#3b5046" style={{ fontFamily: 'var(--font-sans)' }}>
        media tanam racikan
      </text>
      {r.isi.map((it) => {
        const lebar = (it.persen / 100) * 68;
        const el = <rect key={it.bahan} x={x} y="160" width={lebar} height="9" fill={bahan[it.bahan].warna} />;
        x += lebar;
        return el;
      })}
      <rect x="66" y="160" width="68" height="9" fill="none" stroke="#15322a" strokeOpacity=".3" />
      <text x="100" y="182" textAnchor="middle" fontSize="6.5" fill="#3b5046" style={{ fontFamily: 'var(--font-sans)' }}>
        {r.isi.length} bahan · diayak di kebun
      </text>
    </svg>
  );
}

export function Semprotan({ className = '', judul }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 200 240" preserveAspectRatio="xMidYMax meet" className={className} role={judul ? 'img' : undefined} aria-label={judul} aria-hidden={judul ? undefined : true} focusable="false">
      <defs>
        <linearGradient id={`s${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#cfe0d5" stopOpacity=".95" />
          <stop offset="0.6" stopColor="#9fbfae" stopOpacity=".9" />
          <stop offset="1" stopColor="#7ea08f" stopOpacity=".95" />
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="228" rx="44" ry="7" fill="rgb(20 30 25 / .16)" />
      <path d="M70 108 Q70 96 82 94 L118 94 Q130 96 130 108 L132 216 Q100 226 68 216 Z" fill={`url(#s${id})`} />
      <path d="M72 150 L128 150 L130 214 Q100 223 70 214 Z" fill="#6f9cb6" opacity=".35" />
      <path d="M80 104 L78 206" stroke="#fff" strokeOpacity=".6" strokeWidth="5" strokeLinecap="round" />
      <rect x="86" y="80" width="28" height="16" rx="3" fill="#2f3d36" />
      <path d="M84 54 L130 54 Q140 54 142 62 L144 72 L120 72 L116 82 L86 82 Z" fill="#3b4b43" />
      <path d="M142 62 L154 62 L154 68 L144 70 Z" fill="#2f3d36" />
      <path d="M100 82 Q96 96 106 108 L112 104 Q104 94 108 82 Z" fill="#2f3d36" />
      <g fill="#6f9cb6" opacity=".8">
        <circle cx="164" cy="60" r="2" />
        <circle cx="172" cy="52" r="1.6" />
        <circle cx="174" cy="66" r="1.8" />
        <circle cx="182" cy="58" r="1.3" />
      </g>
    </svg>
  );
}

export function TusukBambu({ className = '', judul }) {
  return (
    <svg viewBox="0 0 200 240" preserveAspectRatio="xMidYMax meet" className={className} role={judul ? 'img' : undefined} aria-label={judul} aria-hidden={judul ? undefined : true} focusable="false">
      <ellipse cx="100" cy="222" rx="70" ry="7" fill="rgb(20 30 25 / .14)" />
      {[-24, -12, 0, 12, 24].map((sudut, i) => (
        <g key={sudut} transform={`rotate(${sudut} 100 214)`}>
          <rect x="95" y="34" width="10" height="182" rx="2" fill={i % 2 ? '#d8bb84' : '#cfae72'} />
          <path d="M95 214 L100 222 L105 214 Z" fill="#b8955a" />
          <path d="M95 120 h10 M95 70 h10" stroke="#a9874f" strokeWidth="1.5" />
          <rect x="95" y="160" width="10" height="54" fill="#5b4632" opacity={i === 2 ? 0.55 : 0} />
        </g>
      ))}
    </svg>
  );
}
