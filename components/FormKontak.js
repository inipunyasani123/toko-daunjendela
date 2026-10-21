'use client';

import { useRef, useState } from 'react';
import { simpanPesanKontak, usePesanKontak, useTerpasang } from '@/lib/store';
import { waktuWIB } from '@/lib/format';

const TOPIK = ['Memilih tanaman', 'Pesanan dan pengiriman', 'Tanaman tiba rusak', 'Pembelian untuk kantor atau acara', 'Lainnya'];

function periksa(f) {
  const e = {};
  if (f.nama.trim().length < 2) e.nama = 'Tulis namamu.';
  const k = f.kontak.trim();
  if (!k) e.kontak = 'Tulis email atau nomor WhatsApp untuk balasan.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(k) && !/^(\+62|62|0)8\d{7,11}$/.test(k.replace(/[\s.-]/g, ''))) e.kontak = 'Email atau nomor HP belum benar. Contoh: nama@email.com atau 0812 3456 7890.';
  if (!f.topik) e.topik = 'Pilih topik.';
  if (f.pesan.trim().length < 10) e.pesan = 'Ceritakan sedikit lebih panjang, minimal 10 huruf.';
  return e;
}

export default function FormKontak() {
  const terpasang = useTerpasang();
  const daftar = usePesanKontak();
  const [f, setF] = useState({ nama: '', kontak: '', topik: '', kode: '', pesan: '' });
  const [dicoba, setDicoba] = useState(false);
  const [terkirim, setTerkirim] = useState(null);
  const hasilRef = useRef(null);
  const galat = periksa(f);
  const tampil = (k) => (dicoba ? galat[k] : '');
  const ubah = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));
  const aria = (k) => ({ 'aria-invalid': tampil(k) ? 'true' : undefined, 'aria-describedby': tampil(k) ? `${k}-galat` : undefined });

  const kirim = (e) => {
    e.preventDefault();
    setDicoba(true);
    const g = periksa(f);
    const pertama = ['nama', 'kontak', 'topik', 'pesan'].find((k) => g[k]);
    if (pertama) {
      requestAnimationFrame(() => document.getElementById(`kontak-${pertama}`)?.focus());
      return;
    }
    const baru = simpanPesanKontak({ nama: f.nama.trim(), kontak: f.kontak.trim(), topik: f.topik, kode: f.kode.trim(), pesan: f.pesan.trim() });
    setTerkirim(baru);
    setF({ nama: '', kontak: '', topik: '', kode: '', pesan: '' });
    setDicoba(false);
    requestAnimationFrame(() => hasilRef.current?.focus());
  };

  const Galat = ({ k }) =>
    tampil(k) ? (
      <p id={`${k}-galat`} className="mt-1.5 text-[0.88rem] font-medium text-awas">
        {galat[k]}
      </p>
    ) : null;

  return (
    <div>
      <div ref={hasilRef} tabIndex={-1} className="outline-none" aria-live="polite">
        {terkirim && (
          <div className="mb-6 rounded-[1.25rem] border border-daun bg-pupus-muda p-4">
            <p className="font-semibold">Pesan {terkirim.id} tersimpan.</p>
            <p className="mt-1 text-[0.92rem] text-tinta-2">
              Karena ini toko demo, pesanmu tidak dikirim ke siapa pun dan hanya tersimpan di browser ini. Di toko sungguhan, balasan datang lewat kontak
              yang kamu tulis.
            </p>
          </div>
        )}
      </div>
      <form noValidate onSubmit={kirim} className="grid gap-5 rounded-[1.5rem] border border-garis bg-kertas p-5 sm:grid-cols-2 sm:p-6">
        <div>
          <label htmlFor="kontak-nama" className="font-medium">
            Nama
          </label>
          <input id="kontak-nama" className="isian mt-1.5" autoComplete="name" value={f.nama} onChange={ubah('nama')} {...aria('nama')} />
          <Galat k="nama" />
        </div>
        <div>
          <label htmlFor="kontak-kontak" className="font-medium">
            Email atau nomor WhatsApp
          </label>
          <input id="kontak-kontak" className="isian mt-1.5" autoComplete="email" value={f.kontak} onChange={ubah('kontak')} {...aria('kontak')} />
          <Galat k="kontak" />
        </div>
        <div>
          <label htmlFor="kontak-topik" className="font-medium">
            Topik
          </label>
          <select id="kontak-topik" className="isian mt-1.5" value={f.topik} onChange={ubah('topik')} {...aria('topik')}>
            <option value="">Pilih topik</option>
            {TOPIK.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <Galat k="topik" />
        </div>
        <div>
          <label htmlFor="kontak-kode" className="font-medium">
            Kode pesanan <span className="font-normal text-tinta-2">(kalau ada)</span>
          </label>
          <input id="kontak-kode" className="isian mt-1.5" placeholder="DJ-2610-0061" value={f.kode} onChange={ubah('kode')} autoComplete="off" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="kontak-pesan" className="font-medium">
            Pesan
          </label>
          <textarea id="kontak-pesan" rows={5} className="isian mt-1.5" value={f.pesan} onChange={ubah('pesan')} {...aria('pesan')} />
          <Galat k="pesan" />
        </div>
        <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
          <button type="submit" className="tombol tombol-utama">
            Simpan pesan
          </button>
          <p className="text-[0.85rem] text-tinta-2">Mode demo: pesan tidak dikirim ke mana pun.</p>
        </div>
      </form>
      {terpasang && daftar.length > 0 && (
        <section aria-labelledby="judul-pesan-tersimpan" className="mt-8">
          <h2 id="judul-pesan-tersimpan" className="font-sans text-lg font-semibold tracking-normal">
            Pesan tersimpan di browser ini
          </h2>
          <ul className="mt-3 grid gap-2">
            {daftar.slice(0, 3).map((m) => (
              <li key={m.id} className="rounded-xl border border-garis bg-kertas p-3 text-[0.9rem]">
                <p className="font-semibold">
                  {m.id} · {m.topik}
                </p>
                <p className="text-tinta-2">{waktuWIB(m.waktu)}</p>
                <p className="mt-1 line-clamp-2">{m.pesan}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
