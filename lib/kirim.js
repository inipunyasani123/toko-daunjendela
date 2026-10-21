// Jadwal kirim tanaman hidup dan ongkir (berat asli vs berat volumetrik). Contoh tarif, bukan tarif kurir sungguhan.
import { site, zonaOngkir, PEMBAGI_VOLUME } from './data';
import { bagianWIB, awalHariWIB, HARI_MS } from './format';

export function zonaUntuk(namaProvinsi) {
  return zonaOngkir.find((z) => z.provinsi.includes(namaProvinsi)) || null;
}

export function hariKirim(adaTanaman) {
  return adaTanaman ? site.hariKirimTanaman : site.hariKirimLain;
}

// Hari kirim untuk pesanan yang dibayar pada `ms`. Mengembalikan 00.00 WIB hari kirim.
// Dibayar pada hari kirim sebelum batas jam kemas = dikirim hari itu juga.
export function jadwalKirim(ms, adaTanaman = true) {
  const hari = hariKirim(adaTanaman);
  const { hariMinggu, jam } = bagianWIB(ms);
  const awal = awalHariWIB(ms);
  if (hari.includes(hariMinggu) && jam < site.batasKemasJam) return { tanggal: awal, hariIni: true };
  for (let i = 1; i <= 7; i++) {
    const d = awal + i * HARI_MS;
    if (hari.includes(bagianWIB(d).hariMinggu)) return { tanggal: d, hariIni: false };
  }
  return { tanggal: awal + HARI_MS, hariIni: false };
}

// Perkiraan tiba [awal, akhir] dari tanggal kirim dan estimasi hari layanan. Minggu dilewati.
export function perkiraanTiba(tanggalKirim, [a, b]) {
  const geser = (n) => {
    let d = tanggalKirim;
    let sisa = n;
    while (sisa > 0) {
      d += HARI_MS;
      if (bagianWIB(d).hariMinggu !== 0) sisa -= 1;
    }
    return d;
  };
  return [geser(a), geser(b)];
}

export function beratVolumetrik([p, l, t]) {
  return Math.round(((p * l * t) / PEMBAGI_VOLUME) * 1000);
}

// Pot, media, dan alat digabung dalam satu kardus: berat asli + kemasan 15% (minimal 200 g).
export function kemasanLain(gramProduk) {
  if (!gramProduk) return 0;
  return Math.max(200, Math.round(gramProduk * 0.15));
}

// items: [{ nama, jenis, berat (g per buah), kardus [p,l,t], qty }]
export function hitungOngkir({ items, provinsi, layanan = 'reguler' }) {
  const zona = zonaUntuk(provinsi);
  const tanaman = items.filter((it) => it.jenis === 'tanaman');
  const lain = items.filter((it) => it.jenis !== 'tanaman');
  const adaTanaman = tanaman.length > 0;

  const rincian = tanaman.map((it) => {
    const volume = beratVolumetrik(it.kardus);
    const dipakai = Math.max(it.berat, volume);
    return { nama: it.nama, label: it.label, qty: it.qty, asli: it.berat, volume, dipakai };
  });
  const gramTanaman = rincian.reduce((n, r) => n + r.dipakai * r.qty, 0);
  const gramLainProduk = lain.reduce((n, it) => n + it.berat * it.qty, 0);
  const gramLain = gramLainProduk + kemasanLain(gramLainProduk);
  const gramTagih = gramTanaman + gramLain;
  const kgTagih = items.length ? Math.max(1, Math.ceil(gramTagih / 1000)) : 0;

  let tersedia = Boolean(zona);
  let alasan = '';
  let layananDipakai = layanan;
  if (zona) {
    if (adaTanaman && zona.tanaman === null) {
      tersedia = false;
      alasan = `Tanaman hidup belum bisa dikirim ke ${zona.nama} (${zona.cakupan}) karena perjalanannya bisa lebih dari empat hari. Pot, media, dan alat tetap bisa.`;
    } else {
      if (adaTanaman && zona.tanaman === 'kilat') layananDipakai = 'kilat';
      if (!zona.layanan[layananDipakai]) layananDipakai = 'reguler';
    }
  }
  const tarif = zona && tersedia ? zona.layanan[layananDipakai] : null;
  return {
    zona,
    adaTanaman,
    tersedia: Boolean(tarif),
    alasan,
    layanan: layananDipakai,
    rincian,
    gramTanaman,
    gramLainProduk,
    gramKemasanLain: gramLain - gramLainProduk,
    gramTagih,
    kgTagih,
    perKg: tarif ? tarif.perKg : 0,
    estimasi: tarif ? tarif.estimasi : '',
    hariTempuh: tarif ? tarif.hari : null,
    ongkir: tarif ? kgTagih * tarif.perKg : 0,
  };
}

// Layanan apa saja yang boleh dipilih untuk zona & isi pesanan ini.
export function layananBoleh(zona, adaTanaman) {
  if (!zona) return { reguler: true, kilat: true };
  if (adaTanaman && zona.tanaman === null) return { reguler: false, kilat: false };
  return {
    reguler: Boolean(zona.layanan.reguler) && !(adaTanaman && zona.tanaman === 'kilat'),
    kilat: Boolean(zona.layanan.kilat),
  };
}
