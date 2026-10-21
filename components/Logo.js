// Tanda Daun Jendela: jendela lengkung berpalang dengan sehelai daun yang tumbuh dari ambangnya.
export function TandaJendela({ className = '', daun = '#8fb36f' }) {
  return (
    <svg viewBox="0 0 32 36" className={className} aria-hidden="true" focusable="false">
      <path d="M4 34V15.5C4 8.6 9.4 3 16 3s12 5.6 12 12.5V34Z" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M16 3.6V34M4.6 18.5h22.8" stroke="currentColor" strokeWidth="1.8" />
      <path d="M7.2 32.6c-.4-6.2 2.6-10.7 8-12.6.3 5.8-2.5 10.6-8 12.6Z" fill={daun} />
      <path d="M7.6 32.2c1.7-3.4 3.9-6.4 7.6-11.9" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity=".7" />
      <path d="M2 34h28" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export default function Logo({ className = '', ukuran = 'sedang' }) {
  const besar = ukuran === 'besar';
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <TandaJendela className={besar ? 'h-11 w-10' : 'h-8 w-7 sm:h-9 sm:w-8'} />
      <span className={`font-display font-semibold leading-none tracking-[-0.02em] ${besar ? 'text-[2.1rem]' : 'text-[1.35rem] sm:text-[1.5rem]'}`}>
        Daun Jendela
      </span>
    </span>
  );
}
