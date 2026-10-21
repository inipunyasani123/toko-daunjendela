// Fungsi murni untuk pesanan: kode, status, ringkasan penjualan, antrean kirim, dan pesanan contoh.
import { site, statusPesanan, cariProduk } from './data';
import { hargaVarian, beratVarian, labelVarian, ukuranProduk } from './katalog';
import { hitungOngkir, jadwalKirim, perkiraanTiba } from './kirim';
import { bagianWIB, awalHariWIB, kunciHariWIB, HARI_MS } from './format';

export function indeksStatus(id) {
  return statusPesanan.findIndex((s) => s.id === id);
}

export function labelStatus(id) {
  return statusPesanan.find((s) => s.id === id)?.label || id;
}

export function buatKode(nomor, ms) {
  const { tahun, bulan } = bagianWIB(ms);
  return `${site.kodePesanan}-${String(tahun).slice(-2)}${String(bulan).padStart(2, '0')}-${String(nomor).padStart(4, '0')}`;
}

export function normalKode(kode) {
  return String(kode || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
}

export function waktuStatus(pesanan, statusId) {
  return pesanan.riwayat.find((r) => r.status === statusId)?.waktu || null;
}

// Pindah status. Maju beberapa langkah sekaligus: langkah yang dilewati ikut dicatat dengan waktu yang sama.
// Mundur: catatan sesudahnya dihapus.
export function terapkanStatus(pesanan, statusBaru, waktu) {
  const target = indeksStatus(statusBaru);
  if (target < 0) return pesanan;
  const riwayat = [];
  for (let i = 0; i <= target; i++) {
    const id = statusPesanan[i].id;
    const lama = pesanan.riwayat.find((r) => r.status === id);
    riwayat.push(lama || { status: id, waktu });
  }
  let resi = pesanan.resi;
  if (target >= indeksStatus('dikirim') && !resi) resi = `CONTOH-${normalKode(pesanan.kode).slice(-8)}${pesanan.kirim.layanan === 'kilat' ? 'K' : 'R'}`;
  if (target < indeksStatus('dikirim')) resi = null;
  return { ...pesanan, status: statusBaru, riwayat, resi };
}

export function hitungItem(slug, ukuranId, potId, qty) {
  const p = cariProduk(slug);
  const u = ukuranProduk(p, ukuranId);
  return {
    slug,
    nama: p.nama,
    jenis: p.jenis,
    ukuran: u.id,
    pot: p.jenis === 'tanaman' ? potId || 'nursery' : null,
    label: labelVarian(p, u.id, potId),
    harga: hargaVarian(p, u.id, potId),
    berat: beratVarian(p, u.id, potId),
    kardus: u.kardus,
    qty,
  };
}

export function rakitPesanan({ kode, dibuat, pembeli, items, layanan, metode, hadiah = null, contoh = false }) {
  const subtotal = items.reduce((n, it) => n + it.harga * it.qty, 0);
  const o = hitungOngkir({ items, provinsi: pembeli.provinsi, layanan });
  return {
    kode,
    dibuat,
    status: 'menunggu',
    riwayat: [{ status: 'menunggu', waktu: dibuat }],
    pembeli,
    items,
    kirim: {
      layanan: o.layanan,
      zona: o.zona?.id || null,
      zonaNama: o.zona ? `${o.zona.nama} · ${o.zona.cakupan}` : '',
      estimasi: o.estimasi,
      hariTempuh: o.hariTempuh,
      perKg: o.perKg,
      kgTagih: o.kgTagih,
      gramTagih: o.gramTagih,
      gramTanaman: o.gramTanaman,
      gramLainProduk: o.gramLainProduk,
      gramKemasanLain: o.gramKemasanLain,
      ongkir: o.ongkir,
      adaTanaman: o.adaTanaman,
    },
    hadiah: hadiah && hadiah.aktif ? { pesan: String(hadiah.pesan || '').slice(0, 140), dari: String(hadiah.dari || '').slice(0, 40) } : null,
    bayar: { metode },
    subtotal,
    total: subtotal + o.ongkir,
    resi: null,
    contoh,
  };
}

// Tanggal kirim terjadwal (00.00 WIB) untuk pesanan yang sudah dibayar.
export function tanggalKirimPesanan(o) {
  const dibayar = waktuStatus(o, 'dibayar');
  if (!dibayar) return null;
  return jadwalKirim(dibayar, o.kirim.adaTanaman).tanggal;
}

export function perkiraanTibaPesanan(o) {
  const kirim = waktuStatus(o, 'dikirim');
  const dasar = kirim ? awalHariWIB(kirim) : tanggalKirimPesanan(o);
  if (!dasar || !o.kirim.hariTempuh) return null;
  return perkiraanTiba(dasar, o.kirim.hariTempuh);
}

// Penjualan dihitung dari pesanan yang sudah dibayar, per hari kalender WIB.
export function ringkasPenjualan(daftar, sekarang) {
  const iDibayar = indeksStatus('dibayar');
  const hariIni = awalHariWIB(sekarang);
  const hari = [];
  for (let i = 6; i >= 0; i--) {
    const awal = hariIni - i * HARI_MS;
    hari.push({ kunci: kunciHariWIB(awal + 3600000), awal, total: 0, jumlah: 0 });
  }
  const peta = Object.fromEntries(hari.map((h) => [h.kunci, h]));
  let menunggu = 0;
  for (const p of daftar) {
    if (indeksStatus(p.status) < iDibayar) {
      menunggu += 1;
      continue;
    }
    const h = peta[kunciHariWIB(waktuStatus(p, 'dibayar') || p.dibuat)];
    if (h) {
      h.total += p.total;
      h.jumlah += 1;
    }
  }
  const akhir = hari[hari.length - 1];
  return {
    hari,
    hariIni: { total: akhir.total, jumlah: akhir.jumlah },
    tujuhHari: { total: hari.reduce((n, h) => n + h.total, 0), jumlah: hari.reduce((n, h) => n + h.jumlah, 0) },
    menunggu,
  };
}

// Pesanan yang sudah dibayar tapi belum dikirim, dikelompokkan per tanggal kirim.
export function antreanKirim(daftar) {
  const grup = new Map();
  for (const o of daftar) {
    if (!['dibayar', 'disiapkan'].includes(o.status)) continue;
    const t = tanggalKirimPesanan(o);
    if (!t) continue;
    if (!grup.has(t)) grup.set(t, []);
    grup.get(t).push(o);
  }
  return [...grup.entries()].sort((a, b) => a[0] - b[0]).map(([tanggal, isi]) => ({ tanggal, isi }));
}

export function cocokkanHP(pesanan, empatDigit) {
  const hp = String(pesanan.pembeli.hp || '').replace(/\D/g, '');
  return hp.slice(-4) === String(empatDigit || '').replace(/\D/g, '');
}

// ---------- Pesanan contoh ----------
// Dibuat relatif terhadap waktu kunjungan pertama. Tiap langkah hanya dicatat kalau waktunya sudah lewat,
// dan tanggal kirim mengikuti jadwal toko (tanaman hanya Senin–Rabu).
export const NOMOR_AWAL_CONTOH = 57;

export function pesananContoh(sekarang) {
  const hariLalu = (n, jam, menit) => awalHariWIB(sekarang) - n * HARI_MS + (jam * 60 + menit) * 60000;
  const menitLalu = (m) => sekarang - m * 60000;
  const rencana = [
    {
      dibuat: hariLalu(12, 10, 12),
      bayar: 28,
      pembeli: { nama: 'Laras Widyaningrum', hp: '081200000157', provinsi: 'Jawa Barat', kota: 'Kota Bekasi', alamat: 'Jl. Kenari No. 12 (alamat contoh)', kodePos: '17141' },
      items: [hitungItem('sirih-gading', 'sedang', 'keramik', 1), hitungItem('lili-paris', 'kecil', 'nursery', 2)],
      layanan: 'reguler', metode: 'transfer', sampai: true,
    },
    {
      dibuat: hariLalu(6, 20, 15),
      bayar: 6,
      pembeli: { nama: 'Yoga Prasetya', hp: '081300000258', provinsi: 'Jawa Tengah', kota: 'Kota Semarang', alamat: 'Jl. Seroja Utara No. 7 (alamat contoh)', kodePos: '50241' },
      items: [hitungItem('monstera', 'besar', 'semen', 1), hitungItem('media-kasar', '5l', null, 1)],
      layanan: 'reguler', metode: 'qris', sampai: true,
    },
    {
      dibuat: hariLalu(3, 9, 5),
      bayar: 25,
      pembeli: { nama: 'Ni Komang Ayu', hp: '085700000359', provinsi: 'Bali', kota: 'Kota Denpasar', alamat: 'Jl. Tunjung Biru No. 4 (alamat contoh)', kodePos: '80119' },
      items: [hitungItem('kalatea-zebra', 'kecil', 'keramik', 1), hitungItem('kadaka', 'kecil', 'nursery', 1), hitungItem('semprotan-embun', 'satu', null, 1)],
      layanan: 'kilat', metode: 'ewallet', hadiah: { aktif: true, pesan: 'Selamat menempati rumah baru. Semoga betah, seperti kalatea ini.', dari: 'Teman sekantor' },
    },
    {
      dibuat: menitLalu(240),
      bayar: 18,
      pembeli: { nama: 'Bintang Mahardika', hp: '087800000460', provinsi: 'DI Yogyakarta', kota: 'Kabupaten Sleman', alamat: 'Jl. Kaliurang Km 7, Gg. Pandan No. 3 (alamat contoh)', kodePos: '55581' },
      items: [hitungItem('ekeveria', 'kecil', 'terakota', 3), hitungItem('tusuk-cek-media', 'isi-5', null, 1)],
      layanan: 'reguler', metode: 'qris',
    },
    {
      dibuat: menitLalu(25),
      pembeli: { nama: 'Andi Pratiwi', hp: '082100000561', provinsi: 'Sulawesi Selatan', kota: 'Kota Makassar', alamat: 'Jl. Cendrawasih No. 21 (alamat contoh)', kodePos: '90131' },
      items: [hitungItem('pot-terakota-lereng', '15', null, 2), hitungItem('media-pasir', '2l', null, 1)],
      layanan: 'reguler', metode: 'transfer',
    },
  ];
  return rencana.map((r, i) => {
    let p = rakitPesanan({
      kode: buatKode(NOMOR_AWAL_CONTOH + i, r.dibuat),
      dibuat: r.dibuat,
      pembeli: r.pembeli,
      items: r.items,
      layanan: r.layanan,
      metode: r.metode,
      hadiah: r.hadiah,
      contoh: true,
    });
    if (r.bayar === undefined) return p;
    const dibayar = r.dibuat + r.bayar * 60000;
    if (dibayar > sekarang) return p;
    p = terapkanStatus(p, 'dibayar', dibayar);
    const kirim = jadwalKirim(dibayar, p.kirim.adaTanaman).tanggal;
    const siap = Math.max(dibayar + 30 * 60000, kirim + (8 * 60 + 40) * 60000);
    const berangkat = kirim + (14 * 60 + 10) * 60000;
    if (siap <= sekarang) p = terapkanStatus(p, 'disiapkan', siap);
    if (berangkat <= sekarang) p = terapkanStatus(p, 'dikirim', berangkat);
    if (r.sampai && p.kirim.hariTempuh) {
      const [tiba] = perkiraanTiba(kirim, p.kirim.hariTempuh);
      const waktuTiba = tiba + (11 * 60 + 25) * 60000;
      if (waktuTiba <= sekarang && p.status === 'dikirim') p = terapkanStatus(p, 'diterima', waktuTiba);
    }
    return p;
  });
}
