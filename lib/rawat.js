// Kalender rawat: jadwal siram, semprot, putar pot, lap daun, dan pupuk yang dihitung relatif dari
// tanggal mulai (WIB). Siram selalu ditulis "cek dulu" karena media di tiap rumah keringnya beda.
import { cariProduk } from './data';
import { awalHariWIB, kunciHariWIB, HARI_MS } from './format';

export const TUGAS = {
  tiba: { nama: 'Buka kardus', warna: '#7a5c2e', ket: 'Keluarkan dari kardus, taruh di tempat teduh yang terang, jangan dipupuk dulu.' },
  siram: { nama: 'Cek & siram', warna: '#2f6f9a', ket: 'Tusuk media sedalam 3–5 cm. Siram hanya kalau sudah kering.' },
  semprot: { nama: 'Semprot daun', warna: '#4f8f86', ket: 'Kabut halus di pagi hari supaya daun sempat kering sebelum malam.' },
  putar: { nama: 'Putar pot', warna: '#8a6d1f', ket: 'Putar seperempat lingkaran supaya tumbuhnya tidak miring ke jendela.' },
  lap: { nama: 'Lap daun', warna: '#5d6f64', ket: 'Lap dengan kain lembap supaya debu tidak menghalangi cahaya.' },
  pupuk: { nama: 'Pupuk encer', warna: '#1f5c43', ket: 'Pupuk cair setengah dosis anjuran kemasan, ke media yang sudah lembap.' },
};

export function intervalSiram(p) {
  const [a, b] = p.siram.hari;
  return Math.floor((a + b) / 2);
}

export function intervalPupuk(p) {
  return p.lembap === 'rendah' ? 42 : 28;
}

// Daftar kejadian berulang untuk satu tanaman: { tugas, mulai (hari ke-), tiap (hari) }.
// mode 'tiba': hari ke-0 adalah hari paket datang; pupuk baru dimulai setelah 4 minggu adaptasi.
export function aturanRawat(p, mode = 'tiba') {
  const r = p.rutinitas || {};
  const siram = intervalSiram(p);
  const aturan = [];
  if (mode === 'tiba') aturan.push({ tugas: 'tiba', mulai: 0, tiap: 0 });
  aturan.push({ tugas: 'siram', mulai: mode === 'tiba' ? 2 : 0, tiap: siram });
  if (r.semprot) aturan.push({ tugas: 'semprot', mulai: 1, tiap: r.semprot });
  if (r.putar) aturan.push({ tugas: 'putar', mulai: r.putar, tiap: r.putar });
  if (r.lap) aturan.push({ tugas: 'lap', mulai: r.lap, tiap: r.lap });
  aturan.push({ tugas: 'pupuk', mulai: mode === 'tiba' ? 28 : 7, tiap: intervalPupuk(p) });
  return aturan;
}

// Jadwal untuk beberapa tanaman: { [kunciHari]: [{ slug, nama, tugas }] }, mulai dari `mulai` (ms) selama `hari`.
export function susunJadwal(slugs, mulai, hari = 28, mode = 'tiba') {
  const awal = awalHariWIB(mulai);
  const jadwal = {};
  const tanggal = [];
  for (let i = 0; i < hari; i++) {
    const d = awal + i * HARI_MS;
    const k = kunciHariWIB(d + 3600000);
    tanggal.push({ i, ms: d, kunci: k });
    jadwal[k] = [];
  }
  for (const slug of slugs) {
    const p = cariProduk(slug);
    if (!p || p.jenis !== 'tanaman') continue;
    for (const a of aturanRawat(p, mode)) {
      if (a.tiap === 0) {
        if (a.mulai < hari) jadwal[tanggal[a.mulai].kunci].push({ slug, nama: p.nama, tugas: a.tugas });
        continue;
      }
      for (let i = a.mulai; i < hari; i += a.tiap) jadwal[tanggal[i].kunci].push({ slug, nama: p.nama, tugas: a.tugas });
    }
  }
  return { tanggal, jadwal };
}

// ---------- Ekspor iCalendar (.ics) ----------

function esc(t) {
  return String(t).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

// Lipat baris > 75 oktet sesuai RFC 5545.
function lipat(baris) {
  const enc = new TextEncoder();
  if (enc.encode(baris).length <= 75) return baris;
  const hasil = [];
  let kini = '';
  for (const ch of baris) {
    if (enc.encode(kini + ch).length > (hasil.length ? 74 : 75)) {
      hasil.push(kini);
      kini = ch;
    } else kini += ch;
  }
  hasil.push(kini);
  return hasil.join('\r\n ');
}

function tglUTC(ms) {
  const d = new Date(ms);
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}T${p(d.getUTCHours())}${p(d.getUTCMinutes())}00Z`;
}

// Acara berulang jam 07.00 WIB (00.00 UTC) selama ±3 bulan.
export function buatICS(slugs, mulai, mode = 'tiba') {
  const awal = awalHariWIB(mulai);
  const sekarang = tglUTC(Date.now());
  const baris = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Daun Jendela (toko demo)//Kalender rawat//ID',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Kalender rawat tanaman',
    'X-WR-TIMEZONE:Asia/Jakarta',
  ];
  for (const slug of slugs) {
    const p = cariProduk(slug);
    if (!p || p.jenis !== 'tanaman') continue;
    for (const a of aturanRawat(p, mode)) {
      const t = TUGAS[a.tugas];
      const mulaiAcara = awal + a.mulai * HARI_MS + 7 * 3600000; // 07.00 WIB
      const ulang = a.tiap ? Math.max(1, Math.floor(90 / a.tiap)) : 1;
      baris.push(
        'BEGIN:VEVENT',
        `UID:${slug}-${a.tugas}-${awal}@toko-daunjendela.pintuweb.id`,
        `DTSTAMP:${sekarang}`,
        `DTSTART:${tglUTC(mulaiAcara)}`,
        `DTEND:${tglUTC(mulaiAcara + 15 * 60000)}`,
        ...(a.tiap ? [`RRULE:FREQ=DAILY;INTERVAL=${a.tiap};COUNT=${ulang}`] : []),
        lipat(`SUMMARY:${esc(`${t.nama}: ${p.nama}`)}`),
        lipat(`DESCRIPTION:${esc(a.tugas === 'siram' ? `${p.siram.tanda} ${t.ket}` : t.ket)}`),
        'END:VEVENT',
      );
    }
  }
  baris.push('END:VCALENDAR');
  return baris.join('\r\n') + '\r\n';
}
