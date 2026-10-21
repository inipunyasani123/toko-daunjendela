'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Logo from './Logo';
import { IkonTas } from './Ikon';
import { nav } from '@/lib/data';
import { useKeranjang, useTerpasang } from '@/lib/store';

export default function Header() {
  const path = usePathname();
  const [buka, setBuka] = useState(false);
  const keranjang = useKeranjang();
  const terpasang = useTerpasang();
  const jumlah = terpasang ? keranjang.reduce((n, it) => n + it.qty, 0) : 0;

  useEffect(() => {
    setBuka(false);
  }, [path]);

  const aktif = (href) => path === href || path.startsWith(`${href}/`) || (href === '/katalog' && path.startsWith('/produk/'));

  return (
    <header data-situs className="sticky top-0 z-40 border-b border-garis bg-kapur/95 backdrop-blur-[2px]">
      <div className="wadah flex h-16 items-center gap-2 sm:h-[4.25rem] sm:gap-3">
        <Link href="/" className="min-w-0 shrink rounded-md text-tinta" aria-label="Daun Jendela, ke beranda">
          <Logo />
        </Link>

        <nav aria-label="Navigasi utama" className="ms-auto hidden lg:block">
          <ul className="flex items-center gap-0.5">
            {nav.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  aria-current={aktif(n.href) ? 'page' : undefined}
                  className="rounded-full px-3.5 py-2 text-[0.95rem] font-medium text-tinta-2 hover:bg-kapur-2 hover:text-tinta aria-[current=page]:bg-embun aria-[current=page]:text-tinta"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link
          href="/keranjang"
          className="ms-auto flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-1.5 rounded-full px-2 py-2 font-medium hover:bg-kapur-2 sm:gap-2 sm:px-3 lg:ms-2"
          aria-current={path === '/keranjang' ? 'page' : undefined}
        >
          <IkonTas className="h-6 w-6 shrink-0" />
          <span className="sr-only sm:not-sr-only">Keranjang</span>{' '}
          <span
            className={`inline-flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full px-1.5 text-[0.75rem] font-semibold tabular-nums ${
              jumlah ? 'bg-daun text-white' : 'bg-kapur-2 text-tinta-2'
            }`}
          >
            {jumlah}
          </span>
          <span className="sr-only"> barang</span>
        </Link>

        <button
          type="button"
          className="flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-2 rounded-full px-2 py-2 font-medium hover:bg-kapur-2 sm:px-3 lg:hidden"
          aria-expanded={buka}
          aria-controls="menu-ponsel"
          onClick={() => setBuka((b) => !b)}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden="true" focusable="false">
            {buka ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            ) : (
              <path d="M4 8h16M4 16h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            )}
          </svg>
          <span className="max-[389px]:sr-only">Menu</span>
        </button>
      </div>

      <nav id="menu-ponsel" aria-label="Navigasi utama (ponsel)" hidden={!buka} className="border-t border-garis lg:hidden">
        <ul className="wadah grid py-2">
          {[...nav, { href: '/tentang', label: 'Tentang kebun' }, { href: '/lacak', label: 'Lacak pesanan' }].map((n) => (
            <li key={n.href}>
              <Link
                href={n.href}
                aria-current={aktif(n.href) ? 'page' : undefined}
                className="flex min-h-12 items-center justify-between border-b border-garis/70 py-3 font-display text-xl font-semibold aria-[current=page]:text-daun"
              >
                {n.label}
                <span aria-hidden="true" className="text-tinta-3">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
