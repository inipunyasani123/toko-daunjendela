'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { GambarProduk } from './FotoProduk';
import { provinsi as daftarProvinsi, layananKirim, metodeBayar } from '@/lib/data';
import { hitungOngkir, zonaUntuk, layananBoleh, jadwalKirim, perkiraanTiba } from '@/lib/kirim';
import { hitungItem } from '@/lib/pesanan';
import { rupiah, gram, kg, tanggalPanjang, tanggalPendek } from '@/lib/format';
import { useKeranjang, useInventaris, useTerpasang, buatPesanan } from '@/lib/store';
import { rakitIsiKeranjang, masalahItem } from './Keranjang';

const URUTAN = ['nama', 'hp', 'provinsi', 'kota', 'alamat', 'kodePos', 'metode'];
const LABEL = { nama: 'Nama penerima', hp: 'Nomor HP', provinsi: 'Provinsi', kota: 'Kota atau kabupaten', alamat: 'Alamat lengkap', kodePos: 'Kode pos', metode: 'Cara bayar' };

function periksa(f) {
  const e = {};
  if (f.nama.trim().length < 3) e.nama = 'Tulis nama penerima, minimal 3 huruf.';
  const hp = f.hp.replace(/[\s.-]/g, '');
  if (!hp) e.hp = 'Tulis nomor HP yang bisa dihubungi kurir.';
  else if (!/^(\+62|62|0)8\d{7,11}$/.test(hp)) e.hp = 'Nomor HP belum benar. Contoh: 0812 3456 7890.';
  if (!f.provinsi) e.provinsi = 'Pilih provinsi tujuan.';
  if (f.kota.trim().length < 3) e.kota = 'Tulis kota atau kabupaten tujuan.';
  if (f.alamat.trim().length < 10) e.alamat = 'Tulis alamat lengkap: jalan, nomor rumah, RT/RW, kelurahan.';
  if (!/^\d{5}$/.test(f.kodePos.trim())) e.kodePos = 'Kode pos terdiri dari 5 angka.';
  if (!f.metode) e.metode = 'Pilih salah satu cara bayar.';
  return e;
}

function Kolom({ id, label, petunjuk, galat, children }) {
  return (
    <div>
      <label htmlFor={id} className="font-medium">
        {label}
      </label>
      {petunjuk && (
        <p id={`${id}-petunjuk`} className="text-[0.85rem] text-tinta-2">
          {petunjuk}
        </p>
      )}
      <div className="mt-1.5">{children}</div>
      {galat && (
        <p id={`${id}-galat`} className="mt-1.5 flex gap-1.5 text-[0.88rem] font-medium text-awas">
          <span aria-hidden="true">!</span>
          {galat}
        </p>
      )}
    </div>
  );
}

export default function Checkout() {
  const router = useRouter();
  const terpasang = useTerpasang();
  const keranjang = useKeranjang();
  const inv = useInventaris();
  const [f, setF] = useState({ nama: '', hp: '', provinsi: '', kota: '', alamat: '', kodePos: '', metode: '' });
  const [disentuh, setDisentuh] = useState({});
  const [dicoba, setDicoba] = useState(false);
  const [layanan, setLayanan] = useState('reguler');
  const [hadiah, setHadiah] = useState({ aktif: false, pesan: '', dari: '' });
  const [proses, setProses] = useState(false);
  const [galatStok, setGalatStok] = useState('');
  const ringkasRef = useRef(null);

  const isi = rakitIsiKeranjang(keranjang, inv);

  if (!terpasang || proses) {
    return (
      <div className="wadah pb-24">
        <p className="text-tinta-2" role="status">
          {proses ? 'Membuat pesanan…' : 'Memuat checkout…'}
        </p>
      </div>
    );
  }

  if (!isi.length) {
    return (
      <div className="wadah pb-24">
        <div className="rounded-[1.5rem] border border-dashed border-garis-tua bg-kertas p-6 sm:p-10">
          <h2 className="text-3xl">Belum ada yang perlu dibayar</h2>
          <p className="mt-2 text-tinta-2">Keranjangmu kosong. Pilih tanaman dulu, lalu kembali ke sini.</p>
          <Link href="/katalog" className="tombol tombol-utama mt-5">
            Lihat katalog
          </Link>
        </div>
      </div>
    );
  }

  const galat = periksa(f);
  const tampilGalat = (k) => (dicoba || disentuh[k] ? galat[k] : '');
  const zona = zonaUntuk(f.provinsi);
  const items = isi.map((it) => ({ ...hitungItem(it.slug, it.ukuran, it.pot, it.qty) }));
  const adaTanaman = items.some((it) => it.jenis === 'tanaman');
  const boleh = layananBoleh(zona, adaTanaman);
  const layananAktif = boleh[layanan] ? layanan : boleh.reguler ? 'reguler' : 'kilat';
  const o = hitungOngkir({ items, provinsi: f.provinsi, layanan: layananAktif });
  const subtotal = isi.reduce((n, it) => n + it.harga * it.qty, 0);
  const total = subtotal + (o.tersedia ? o.ongkir : 0);
  const masalah = isi.filter((it) => masalahItem(it) || it.qty > it.maks);
  const kirim = jadwalKirim(Date.now(), adaTanaman);
  const tiba = o.tersedia && o.hariTempuh ? perkiraanTiba(kirim.tanggal, o.hariTempuh) : null;
  const terblokir = zona && !o.tersedia;

  const ubah = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));
  const sentuh = (k) => () => setDisentuh((x) => ({ ...x, [k]: true }));
  const aria = (k) => ({
    'aria-invalid': tampilGalat(k) ? 'true' : undefined,
    'aria-describedby': [tampilGalat(k) ? `${k}-galat` : '', ['hp', 'alamat'].includes(k) ? `${k}-petunjuk` : ''].filter(Boolean).join(' ') || undefined,
  });

  const kirimForm = (e) => {
    e.preventDefault();
    setDicoba(true);
    setGalatStok('');
    const g = periksa(f);
    const pertama = URUTAN.find((k) => g[k]);
    if (pertama) {
      requestAnimationFrame(() => (pertama === 'metode' ? document.querySelector('input[name="metode"]') : document.getElementById(pertama))?.focus());
      return;
    }
    if (terblokir) {
      setGalatStok(o.alasan);
      requestAnimationFrame(() => ringkasRef.current?.focus());
      return;
    }
    if (masalah.length) {
      setGalatStok('Ada barang yang stoknya berubah. Kembali ke keranjang untuk menyesuaikan.');
      requestAnimationFrame(() => ringkasRef.current?.focus());
      return;
    }
    setProses(true);
    const pembeli = { nama: f.nama.trim(), hp: f.hp.replace(/[\s.-]/g, ''), provinsi: f.provinsi, kota: f.kota.trim(), alamat: f.alamat.trim(), kodePos: f.kodePos.trim() };
    const kode = buatPesanan({ pembeli, items, layanan: layananAktif, metode: f.metode, hadiah });
    router.push(`/pesanan/${kode}`);
  };

  const daftarGalat = dicoba ? URUTAN.filter((k) => galat[k]) : [];

  return (
    <form noValidate onSubmit={kirimForm} className="wadah grid gap-10 pb-6 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <div role="alert">
          {daftarGalat.length > 0 && (
            <div className="mb-8 rounded-[1.25rem] border-2 border-awas bg-[#fdf5f2] p-4">
              <p className="font-semibold text-awas">Ada {daftarGalat.length} isian yang perlu dibetulkan:</p>
              <ul className="mt-2 grid gap-1 text-[0.92rem]">
                {daftarGalat.map((k) => (
                  <li key={k}>
                    <a href={k === 'metode' ? '#metode-transfer' : `#${k}`} className="text-awas underline underline-offset-2">
                      {LABEL[k]}: {galat[k]}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <section aria-labelledby="judul-alamat" className="border-t-2 border-tinta pt-5">
          <h2 id="judul-alamat" className="text-3xl">
            Alamat pengiriman
          </h2>
          <p className="mt-1 text-[0.92rem] text-tinta-2">Semua kolom wajib diisi. Data hanya disimpan di browser ini.</p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Kolom id="nama" label={LABEL.nama} galat={tampilGalat('nama')}>
              <input id="nama" className="isian" autoComplete="name" aria-required="true" value={f.nama} onChange={ubah('nama')} onBlur={sentuh('nama')} {...aria('nama')} />
            </Kolom>
            <Kolom id="hp" label={LABEL.hp} petunjuk="Untuk kurir. Empat angka terakhirnya dipakai untuk melacak pesanan." galat={tampilGalat('hp')}>
              <input id="hp" type="tel" inputMode="tel" className="isian" autoComplete="tel" aria-required="true" placeholder="0812 3456 7890" value={f.hp} onChange={ubah('hp')} onBlur={sentuh('hp')} {...aria('hp')} />
            </Kolom>
            <Kolom id="provinsi" label={LABEL.provinsi} galat={tampilGalat('provinsi')}>
              <select id="provinsi" className="isian" autoComplete="address-level1" aria-required="true" value={f.provinsi} onChange={ubah('provinsi')} onBlur={sentuh('provinsi')} {...aria('provinsi')}>
                <option value="">Pilih provinsi</option>
                {daftarProvinsi.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </Kolom>
            <Kolom id="kota" label={LABEL.kota} galat={tampilGalat('kota')}>
              <input id="kota" className="isian" autoComplete="address-level2" aria-required="true" value={f.kota} onChange={ubah('kota')} onBlur={sentuh('kota')} {...aria('kota')} />
            </Kolom>
            <div className="sm:col-span-2">
              <Kolom id="alamat" label={LABEL.alamat} petunjuk="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan." galat={tampilGalat('alamat')}>
                <textarea id="alamat" rows={3} className="isian" autoComplete="street-address" aria-required="true" value={f.alamat} onChange={ubah('alamat')} onBlur={sentuh('alamat')} {...aria('alamat')} />
              </Kolom>
            </div>
            <Kolom id="kodePos" label={LABEL.kodePos} galat={tampilGalat('kodePos')}>
              <input id="kodePos" inputMode="numeric" maxLength={5} className="isian" autoComplete="postal-code" aria-required="true" value={f.kodePos} onChange={ubah('kodePos')} onBlur={sentuh('kodePos')} {...aria('kodePos')} />
            </Kolom>
          </div>
        </section>

        <section aria-labelledby="judul-kirim" className="mt-10 border-t-2 border-tinta pt-5">
          <h2 id="judul-kirim" className="text-3xl">
            Pengiriman
          </h2>
          {zona ? (
            <p className="mt-1 text-[0.92rem] text-tinta-2">
              Tujuan {f.provinsi}: <span className="font-medium text-tinta">{zona.nama}</span> ({zona.cakupan}). Angka di bawah contoh tarif.
            </p>
          ) : (
            <p className="mt-1 text-[0.92rem] text-tinta-2">Pilih provinsi dulu. Ongkir dihitung otomatis dari zona tujuan dan ukuran kardus.</p>
          )}
          {terblokir && (
            <p className="mt-4 rounded-xl border-2 border-awas bg-[#fdf5f2] p-3.5 text-[0.92rem] font-medium text-awas" role="status">
              {o.alasan}{' '}
              <Link href="/keranjang" className="underline">
                Ubah keranjang
              </Link>
            </p>
          )}
          <fieldset className="mt-5" disabled={terblokir}>
            <legend className="font-medium">Layanan kurir</legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {layananKirim.map((l) => {
                const t = zona ? zona.layanan[l.id] : null;
                const tidak = zona && (!t || !boleh[l.id]);
                return (
                  <label key={l.id} className="pilih flex items-start gap-3 p-3.5">
                    <input
                      type="radio"
                      name="layanan"
                      value={l.id}
                      className="mt-1 h-[1.1rem] w-[1.1rem] accent-[#1f5c43]"
                      checked={layananAktif === l.id && !tidak}
                      disabled={Boolean(tidak)}
                      onChange={() => setLayanan(l.id)}
                    />
                    <span className="flex-1">
                      <span className="flex justify-between gap-2 font-medium text-tinta">
                        {l.nama}
                        {t && !tidak && <span className="tabular-nums">{rupiah(t.perKg * o.kgTagih)}</span>}
                      </span>
                      <span className="block text-[0.85rem] text-tinta-2">
                        {!zona
                          ? l.ket
                          : !t
                            ? 'Belum tersedia untuk zona ini'
                            : !boleh[l.id]
                              ? 'Tanaman hidup ke zona ini hanya lewat Kilat'
                              : `${rupiah(t.perKg)}/kg × ${o.kgTagih} kg · ${t.estimasi}`}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-4 rounded-xl bg-kapur-2/70 p-4 text-[0.88rem] text-tinta-2">
            <p className="font-semibold text-tinta">Berat yang ditagih: {o.kgTagih} kg</p>
            <ul className="mt-2 grid gap-1">
              {o.rincian.map((r) => (
                <li key={`${r.nama}-${r.label}`} className="flex justify-between gap-3">
                  <span>
                    {r.qty} × {r.nama} <span className="text-tinta-3">({r.volume > r.asli ? 'volumetrik' : 'berat asli'})</span>
                  </span>
                  <span className="tabular-nums">{kg((r.dipakai * r.qty) / 1000)}</span>
                </li>
              ))}
              {o.gramLainProduk > 0 && (
                <li className="flex justify-between gap-3">
                  <span>Pot, media, dan alat + kemasan</span>
                  <span className="tabular-nums">{gram(o.gramLainProduk + o.gramKemasanLain)}</span>
                </li>
              )}
            </ul>
            <p className="mt-2">
              Dibulatkan ke atas per kilogram.{' '}
              <Link href="/pengiriman" className="tautan">
                Kenapa volumetrik?
              </Link>
            </p>
          </div>

          <p className="mt-4 text-[0.92rem]">
            <span className="font-semibold">Jadwal: </span>
            {adaTanaman ? 'tanaman hidup dikirim Senin–Rabu. ' : ''}
            Kalau dibayar sekarang, dikirim {kirim.hariIni ? 'hari ini' : tanggalPanjang(kirim.tanggal)}
            {tiba ? `, perkiraan tiba ${tanggalPendek(tiba[0])}${tiba[1] !== tiba[0] ? `–${tanggalPendek(tiba[1])}` : ''}.` : '.'}
          </p>
        </section>

        <section aria-labelledby="judul-hadiah" className="mt-10 border-t-2 border-tinta pt-5">
          <h2 id="judul-hadiah" className="text-3xl">
            Untuk orang lain?
          </h2>
          <label className="pilih mt-4 flex cursor-pointer items-start gap-3 p-3.5">
            <input type="checkbox" className="mt-1 h-[1.1rem] w-[1.1rem] accent-[#1f5c43]" checked={hadiah.aktif} onChange={(e) => setHadiah((h) => ({ ...h, aktif: e.target.checked }))} />
            <span>
              <span className="font-medium">Kirim sebagai hadiah</span>
              <span className="block text-[0.85rem] text-tinta-2">Tanpa nota harga di dalam kardus, ditambah kartu ucapan tulisan tangan.</span>
            </span>
          </label>
          {hadiah.aktif && (
            <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_14rem]">
              <div>
                <label htmlFor="hadiah-pesan" className="font-medium">
                  Isi kartu ucapan
                </label>
                <textarea id="hadiah-pesan" rows={3} maxLength={140} className="isian mt-1.5" value={hadiah.pesan} onChange={(e) => setHadiah((h) => ({ ...h, pesan: e.target.value }))} aria-describedby="hadiah-sisa" />
                <p id="hadiah-sisa" className="mt-1 text-[0.8rem] text-tinta-2">
                  {140 - hadiah.pesan.length} karakter lagi
                </p>
              </div>
              <div>
                <label htmlFor="hadiah-dari" className="font-medium">
                  Dari
                </label>
                <input id="hadiah-dari" maxLength={40} className="isian mt-1.5" value={hadiah.dari} onChange={(e) => setHadiah((h) => ({ ...h, dari: e.target.value }))} />
              </div>
            </div>
          )}
        </section>

        <section aria-labelledby="judul-bayar" className="mt-10 border-t-2 border-tinta pt-5">
          <h2 id="judul-bayar" className="text-3xl">
            Pembayaran
          </h2>
          <p className="mt-2 rounded-xl border border-dashed border-daun p-3 text-[0.9rem]">
            <span className="font-semibold text-daun">Mode demo.</span> Tidak ada uang yang ditarik. Setelah pesanan dibuat, kamu bisa menekan tombol
            &ldquo;Simulasikan pembayaran&rdquo; untuk melihat alurnya.
          </p>
          <fieldset className="mt-4" aria-describedby={tampilGalat('metode') ? 'metode-galat' : undefined}>
            <legend className="font-medium">Cara bayar</legend>
            <div className="mt-2 grid gap-2">
              {metodeBayar.map((m) => (
                <label key={m.id} className={`pilih flex items-start gap-3 p-3.5 ${tampilGalat('metode') && f.metode !== m.id ? 'border-awas' : ''}`}>
                  <input
                    id={`metode-${m.id}`}
                    type="radio"
                    name="metode"
                    value={m.id}
                    className="mt-1 h-[1.1rem] w-[1.1rem] accent-[#1f5c43]"
                    checked={f.metode === m.id}
                    onChange={() => {
                      setF((x) => ({ ...x, metode: m.id }));
                      setDisentuh((x) => ({ ...x, metode: true }));
                    }}
                  />
                  <span>
                    <span className="block font-medium">{m.nama}</span>
                    <span className="block text-[0.85rem] text-tinta-2">{m.ket}</span>
                  </span>
                </label>
              ))}
            </div>
            {tampilGalat('metode') && (
              <p id="metode-galat" className="mt-1.5 flex gap-1.5 text-[0.88rem] font-medium text-awas">
                <span aria-hidden="true">!</span>
                {galat.metode}
              </p>
            )}
          </fieldset>
        </section>
      </div>

      <aside aria-labelledby="judul-pesanan" className="lg:col-span-5">
        <div ref={ringkasRef} tabIndex={-1} className="rounded-[1.5rem] border border-garis bg-kertas p-5 outline-none sm:p-6 lg:sticky lg:top-24">
          <h2 id="judul-pesanan" className="text-2xl">
            Pesananmu
          </h2>
          <ul className="mt-4 grid gap-3">
            {isi.map((it) => (
              <li key={it.kunci} className="flex items-center gap-3">
                <span className={`panggung relative block h-16 w-13 shrink-0 overflow-hidden rounded-lg ${it.p.foto?.tata === 'atas' ? 'after:hidden' : ''}`}>
                  <GambarProduk p={it.p} sizes="56px" judul="" />
                </span>
                <span className="min-w-0 flex-1 text-[0.92rem]">
                  <span className="block font-medium leading-snug">{it.p.nama}</span>
                  <span className="block text-tinta-2">
                    {it.qty} × {rupiah(it.harga)} · {it.label}
                  </span>
                </span>
                <span className="text-[0.92rem] font-medium tabular-nums">{rupiah(it.harga * it.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-5 grid gap-2 border-t border-garis pt-4 text-[0.95rem]">
            <div className="flex justify-between gap-4">
              <dt className="text-tinta-2">Subtotal</dt>
              <dd className="tabular-nums">{rupiah(subtotal)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-tinta-2">Ongkir {o.tersedia ? `${o.layanan === 'kilat' ? 'Kilat' : 'Reguler'}, ${o.kgTagih} kg` : ''}</dt>
              <dd className="tabular-nums">{o.tersedia ? rupiah(o.ongkir) : zona ? 'tidak tersedia' : 'pilih provinsi'}</dd>
            </div>
            {hadiah.aktif && (
              <div className="flex justify-between gap-4">
                <dt className="text-tinta-2">Kartu ucapan</dt>
                <dd>Gratis</dd>
              </div>
            )}
            <div className="mt-2 flex justify-between gap-4 border-t border-tinta pt-3 text-lg">
              <dt className="font-semibold">Total</dt>
              <dd className="font-semibold tabular-nums">{rupiah(total)}</dd>
            </div>
          </dl>
          {galatStok && (
            <p className="mt-4 text-[0.9rem] font-medium text-awas" role="alert">
              {galatStok}{' '}
              <Link href="/keranjang" className="underline">
                Buka keranjang
              </Link>
            </p>
          )}
          <button type="submit" className="tombol tombol-utama mt-5 hidden w-full lg:flex" disabled={terblokir}>
            Buat pesanan
          </button>
          <p className="mt-3 text-[0.82rem] text-tinta-2">Pesanan demo. Tidak ada tanaman yang benar-benar dikirim.</p>
        </div>
      </aside>

      <div className="sticky bottom-0 z-30 -mx-4 border-t border-garis bg-kertas/95 px-4 py-3 shadow-[0_-8px_20px_-12px_rgb(21_50_42/0.35)] sm:-mx-6 sm:px-6 lg:hidden">
        <div className="flex items-center gap-3">
          <p className="min-w-0 flex-1">
            <span className="block text-[0.82rem] text-tinta-2">Total{o.tersedia ? '' : ' (belum termasuk ongkir)'}</span>
            <span className="block font-semibold tabular-nums">{rupiah(total)}</span>
          </p>
          <button type="submit" className="tombol tombol-utama px-5" disabled={terblokir}>
            Buat pesanan
          </button>
        </div>
      </div>
    </form>
  );
}
