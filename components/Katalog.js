'use client';

import Link from 'next/link';
import { useEffect, useId, useMemo, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import KartuProduk from './KartuProduk';
import { produk, jenis as daftarJenis, kelompok, cahaya, tingkatRawat, udara, tempat, ruang, cariRuang } from '@/lib/data';
import { saringProduk, rentangFilter, urutan, produkAktif } from '@/lib/katalog';
import { WARNA_CAHAYA } from './PitaCahaya';
import { useInventaris, useTerpasang } from '@/lib/store';

const JENIS_ID = daftarJenis.map((j) => j.id);

function bacaFilter(sp) {
  const daftar = (k) => (sp.get(k) || '').split(',').map((x) => x.trim()).filter(Boolean);
  const angka = (k, maks) => daftar(k).map(Number).filter((n) => Number.isInteger(n) && n >= 1 && n <= maks);
  const j = sp.get('jenis');
  return {
    jenis: JENIS_ID.includes(j) ? j : 'tanaman',
    q: sp.get('q') || '',
    kelompok: daftar('kelompok').filter((x) => kelompok.some((k) => k.id === x)),
    cahaya: angka('cahaya', 5),
    rawat: angka('rawat', 3),
    udara: udara.some((u) => u.id === sp.get('udara')) ? sp.get('udara') : '',
    hewan: sp.get('hewan') === '1',
    tempat: daftar('tempat').filter((x) => tempat.some((t) => t.id === x)),
    harga: rentangFilter.some((r) => r.id === sp.get('harga')) ? sp.get('harga') : '',
    ruang: cariRuang(sp.get('ruang')) ? sp.get('ruang') : '',
    urut: urutan.some((u) => u.id === sp.get('urut')) ? sp.get('urut') : 'kebun',
  };
}

function keQuery(f) {
  const p = new URLSearchParams();
  if (f.jenis !== 'tanaman') p.set('jenis', f.jenis);
  if (f.q.trim()) p.set('q', f.q);
  if (f.jenis === 'tanaman') {
    if (f.ruang) p.set('ruang', f.ruang);
    if (f.kelompok.length) p.set('kelompok', f.kelompok.join(','));
    if (f.cahaya.length) p.set('cahaya', f.cahaya.join(','));
    if (f.rawat.length) p.set('rawat', f.rawat.join(','));
    if (f.udara) p.set('udara', f.udara);
    if (f.hewan) p.set('hewan', '1');
    if (f.tempat.length) p.set('tempat', f.tempat.join(','));
  }
  if (f.harga) p.set('harga', f.harga);
  if (f.urut && f.urut !== 'kebun') p.set('urut', f.urut);
  const s = p.toString();
  return s ? `?${s}` : '';
}

const KOSONG = { q: '', kelompok: [], cahaya: [], rawat: [], udara: '', hewan: false, tempat: [], harga: '', ruang: '' };

export function GridStatis() {
  return (
    <div className="wadah pb-20">
      <ul className="grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
        {produk
          .filter((p) => p.jenis === 'tanaman')
          .map((p) => (
            <li key={p.slug}>
              <KartuProduk produk={p} judulTag="h2" />
            </li>
          ))}
      </ul>
    </div>
  );
}

function Centang({ label, checked, onChange, warna, jumlah }) {
  return (
    <label className="flex min-h-10 cursor-pointer items-center gap-3 rounded-lg px-1 py-1 hover:bg-kapur-2">
      <input type="checkbox" className="h-[1.1rem] w-[1.1rem] accent-[#1f5c43]" checked={checked} onChange={onChange} />
      {warna && <span aria-hidden="true" className="h-3.5 w-3.5 rounded-[3px] ring-1 ring-tinta/25" style={{ background: warna }} />}
      <span className="leading-tight">{label}</span>
      {jumlah !== undefined && <span className="ms-auto text-[0.78rem] tabular-nums text-tinta-3">{jumlah}</span>}
    </label>
  );
}

export default function Katalog() {
  const sp = useSearchParams();
  const path = usePathname();
  const inventaris = useInventaris();
  const terpasang = useTerpasang();
  const inv = terpasang ? inventaris : undefined;
  const [f, setF] = useState(() => bacaFilter(sp));
  const [panel, setPanel] = useState(false);
  const idPanel = useId();

  const kunciSp = sp.toString();
  useEffect(() => {
    setF(bacaFilter(new URLSearchParams(kunciSp)));
  }, [kunciSp]);

  const ubah = (patch) => {
    const baru = { ...f, ...patch };
    setF(baru);
    window.history.replaceState(null, '', `${path}${keQuery(baru)}`);
  };
  const balik = (k, v) => ubah({ [k]: f[k].includes(v) ? f[k].filter((x) => x !== v) : [...f[k], v] });

  const hasil = useMemo(() => saringProduk(produk, f, inv), [f, inv]);
  const perJenis = useMemo(
    () => Object.fromEntries(JENIS_ID.map((j) => [j, saringProduk(produk, { ...KOSONG, q: f.q, harga: f.harga, jenis: j }, inv).length])),
    [f.q, f.harga, inv],
  );
  const tanamanAktif = produk.filter((p) => p.jenis === 'tanaman' && produkAktif(p, inv));
  const tanaman = f.jenis === 'tanaman';
  const r = cariRuang(f.ruang);

  const chip = [
    ...(f.q.trim() ? [{ label: `“${f.q.trim()}”`, hapus: () => ubah({ q: '' }) }] : []),
    ...(tanaman && r ? [{ label: `Ruang: ${r.nama}`, hapus: () => ubah({ ruang: '' }) }] : []),
    ...(tanaman ? f.cahaya.map((n) => ({ label: cahaya[n - 1].nama, hapus: () => balik('cahaya', n) })) : []),
    ...(tanaman ? f.kelompok.map((id) => ({ label: kelompok.find((k) => k.id === id).nama, hapus: () => balik('kelompok', id) })) : []),
    ...(tanaman ? f.rawat.map((n) => ({ label: `Rawat ${tingkatRawat[n - 1].nama.toLowerCase()}`, hapus: () => balik('rawat', n) })) : []),
    ...(tanaman && f.udara ? [{ label: `Udara ${udara.find((u) => u.id === f.udara).nama.toLowerCase()}`, hapus: () => ubah({ udara: '' }) }] : []),
    ...(tanaman && f.hewan ? [{ label: 'Aman untuk hewan', hapus: () => ubah({ hewan: false }) }] : []),
    ...(tanaman ? f.tempat.map((id) => ({ label: tempat.find((t) => t.id === id).nama, hapus: () => balik('tempat', id) })) : []),
    ...(f.harga ? [{ label: rentangFilter.find((x) => x.id === f.harga).label, hapus: () => ubah({ harga: '' }) }] : []),
  ];
  const kosongkan = () => ubah(KOSONG);
  const jumlahHewan = tanamanAktif.filter((p) => p.hewan).length;

  return (
    <div className="pb-20">
      <div className="wadah">
        <nav aria-label="Jenis produk" className="-mx-1 overflow-x-auto pb-1">
          <ul className="flex min-w-max gap-1.5 px-1">
            {daftarJenis.map((j) => (
              <li key={j.id}>
                <button
                  type="button"
                  aria-pressed={f.jenis === j.id}
                  onClick={() => ubah({ jenis: j.id })}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-garis bg-kertas px-4 text-[0.95rem] font-medium hover:border-daun aria-pressed:border-daun aria-pressed:bg-daun aria-pressed:text-white"
                >
                  {j.nama}
                  <span className="tabular-nums opacity-80">{perJenis[j.id]}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="wadah mt-6 grid gap-8 lg:grid-cols-12">
        <div className="flex flex-wrap items-center gap-3 lg:hidden">
          <button type="button" className="tombol tombol-garis min-h-11 py-2" aria-expanded={panel} aria-controls={idPanel} onClick={() => setPanel((v) => !v)}>
            {panel ? 'Tutup saringan' : 'Saring'}
            {chip.length > 0 && <span className="rounded-full bg-daun px-2 py-0.5 text-[0.72rem] text-white">{chip.length}</span>}
          </button>
          <label className="ms-auto flex items-center gap-2 text-[0.9rem]">
            <span className="text-tinta-2">Urutkan</span>
            <select className="isian min-h-11 w-auto py-2" value={f.urut} onChange={(e) => ubah({ urut: e.target.value })}>
              {urutan.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <aside id={idPanel} aria-label="Saringan katalog" className={`${panel ? 'block' : 'hidden'} lg:sticky lg:top-24 lg:col-span-3 lg:block lg:max-h-[calc(100vh-7rem)] lg:self-start lg:overflow-y-auto lg:pe-2`}>
          <form role="search" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="cari-katalog" className="font-semibold">
              Cari
            </label>
            <input
              id="cari-katalog"
              type="search"
              className="isian mt-2"
              placeholder="mis. pakis, gantung, terakota"
              value={f.q}
              onChange={(e) => ubah({ q: e.target.value })}
              autoComplete="off"
            />
          </form>

          {tanaman && (
            <>
              <fieldset className="mt-6 border-t border-garis pt-4">
                <legend className="float-left w-full font-semibold">Cahaya di tempatmu</legend>
                <div className="clear-both grid gap-0.5 pt-2">
                  {[5, 4, 3, 2, 1].map((n) => (
                    <Centang
                      key={n}
                      label={cahaya[n - 1].nama}
                      warna={WARNA_CAHAYA[n]}
                      checked={f.cahaya.includes(n)}
                      onChange={() => balik('cahaya', n)}
                      jumlah={tanamanAktif.filter((p) => n >= p.cahaya[0] && n <= p.cahaya[1]).length}
                    />
                  ))}
                </div>
              </fieldset>

              <fieldset className="mt-5 border-t border-garis pt-4">
                <legend className="float-left w-full font-semibold">Hewan peliharaan</legend>
                <div className="clear-both pt-2">
                  <Centang label="Hanya yang aman untuk kucing dan anjing" checked={f.hewan} onChange={() => ubah({ hewan: !f.hewan })} jumlah={jumlahHewan} />
                </div>
              </fieldset>

              <fieldset className="mt-5 border-t border-garis pt-4">
                <legend className="float-left w-full font-semibold">Perawatan</legend>
                <div className="clear-both grid gap-0.5 pt-2">
                  {tingkatRawat.map((t) => (
                    <Centang key={t.n} label={t.nama} checked={f.rawat.includes(t.n)} onChange={() => balik('rawat', t.n)} jumlah={tanamanAktif.filter((p) => p.rawat === t.n).length} />
                  ))}
                </div>
              </fieldset>

              <fieldset className="mt-5 border-t border-garis pt-4">
                <legend className="float-left w-full font-semibold">Udara</legend>
                <div className="clear-both grid gap-0.5 pt-2">
                  {[{ id: '', nama: 'Semua', ket: '' }, ...udara].map((u) => (
                    <label key={u.id || 'semua'} className="flex min-h-10 cursor-pointer items-start gap-3 rounded-lg px-1 py-1.5 hover:bg-kapur-2">
                      <input type="radio" name="udara" className="mt-0.5 h-[1.1rem] w-[1.1rem] accent-[#1f5c43]" checked={f.udara === u.id} onChange={() => ubah({ udara: u.id })} />
                      <span className="leading-tight">
                        {u.nama}
                        {u.ket && <span className="block text-[0.8rem] text-tinta-2">{u.ket}</span>}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset className="mt-5 border-t border-garis pt-4">
                <legend className="float-left w-full font-semibold">Diletakkan di</legend>
                <div className="clear-both grid gap-0.5 pt-2">
                  {tempat.map((t) => (
                    <Centang key={t.id} label={t.nama} checked={f.tempat.includes(t.id)} onChange={() => balik('tempat', t.id)} />
                  ))}
                </div>
              </fieldset>

              <fieldset className="mt-5 border-t border-garis pt-4">
                <legend className="float-left w-full font-semibold">Jenis tanaman</legend>
                <div className="clear-both grid gap-0.5 pt-2">
                  {kelompok.map((k) => (
                    <Centang key={k.id} label={k.nama} checked={f.kelompok.includes(k.id)} onChange={() => balik('kelompok', k.id)} jumlah={tanamanAktif.filter((p) => p.kelompok === k.id).length} />
                  ))}
                </div>
              </fieldset>
            </>
          )}

          <fieldset className="mt-5 border-t border-garis pt-4">
            <legend className="float-left w-full font-semibold">Harga</legend>
            <div className="clear-both grid gap-0.5 pt-2">
              {[{ id: '', label: 'Semua harga' }, ...rentangFilter].map((x) => (
                <label key={x.id || 'semua'} className="flex min-h-10 cursor-pointer items-center gap-3 rounded-lg px-1 py-1 hover:bg-kapur-2">
                  <input type="radio" name="harga" className="h-[1.1rem] w-[1.1rem] accent-[#1f5c43]" checked={f.harga === x.id} onChange={() => ubah({ harga: x.id })} />
                  <span>{x.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {chip.length > 0 && (
            <button type="button" className="tautan mt-6 font-medium" onClick={kosongkan}>
              Hapus semua saringan
            </button>
          )}
        </aside>

        <div className="lg:col-span-9">
          {tanaman && r && (
            <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border border-garis bg-embun p-4">
              <p className="min-w-0 flex-1">
                <span className="font-semibold">Untuk {r.nama.toLowerCase()}:</span> <span className="text-tinta-2">{r.ket}.</span>
              </p>
              <button type="button" className="tautan text-[0.9rem]" onClick={() => ubah({ ruang: '' })}>
                Lepas saringan ruangan
              </button>
            </div>
          )}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3 border-t-2 border-tinta pt-4">
            <p aria-live="polite" className="font-medium">
              {chip.length === 0 ? `${hasil.length} produk` : `Menampilkan ${hasil.length} produk`}
            </p>
            <label className="ms-auto hidden items-center gap-2 text-[0.9rem] lg:flex">
              <span className="text-tinta-2">Urutkan</span>
              <select className="isian min-h-10 w-auto py-1.5" value={f.urut} onChange={(e) => ubah({ urut: e.target.value })}>
                {urutan.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.label}
                  </option>
                ))}
              </select>
            </label>
            {chip.length > 0 && (
              <ul className="flex w-full flex-wrap gap-2" aria-label="Saringan aktif">
                {chip.map((c) => (
                  <li key={c.label}>
                    <button type="button" onClick={c.hapus} className="inline-flex min-h-9 items-center gap-2 rounded-full bg-kapur-2 px-3 py-1.5 text-[0.88rem] hover:bg-lumut">
                      {c.label}
                      <span aria-hidden="true">×</span>
                      <span className="sr-only">, hapus saringan ini</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {hasil.length > 0 ? (
            <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 md:grid-cols-3">
              {hasil.map((p, i) => (
                <li key={p.slug}>
                  <KartuProduk produk={p} inventaris={inv} judulTag="h2" prioritas={i < 2} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-8 rounded-[1.25rem] border border-dashed border-garis-tua bg-kertas p-6 sm:p-8">
              <h2 className="text-2xl">Belum ada yang cocok</h2>
              <p className="mt-2 max-w-xl text-tinta-2">
                Tidak ada produk yang memenuhi semua saringanmu.
                {JENIS_ID.filter((j) => j !== f.jenis && perJenis[j] > 0 && f.q.trim()).map((j) => (
                  <span key={j}>
                    {' '}
                    Ada {perJenis[j]} hasil di{' '}
                    <button type="button" className="tautan" onClick={() => ubah({ jenis: j })}>
                      {daftarJenis.find((x) => x.id === j).nama.toLowerCase()}
                    </button>
                    .
                  </span>
                ))}{' '}
                Coba kurangi saringan cahaya atau udara, atau biarkan penemu tanaman menimbang semuanya untukmu.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button type="button" className="tombol tombol-utama" onClick={kosongkan}>
                  Hapus semua saringan
                </button>
                <Link href="/cari-tanaman" className="tombol tombol-garis">
                  Cari yang betah
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
