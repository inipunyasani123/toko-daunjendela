// Penemu tanaman: menilai kecocokan tiap tanaman dengan kondisi ruangan pengunjung.
// Hasilnya tiga tingkat (sangat cocok, cocok dengan catatan, kurang cocok) plus alasan yang bisa dibaca,
// bukan persentase palsu.
import { tanaman, cahaya as skala, tempat as daftarTempat } from './data';

export const pertanyaan = [
  {
    id: 'cahaya',
    judul: 'Seterang apa tempatnya?',
    bantu: 'Tes bayangan pada siang hari: angkat telapak tangan 30 cm di atas tempat tanaman akan diletakkan.',
    pilihan: [5, 4, 3, 2, 1].map((n) => ({ nilai: String(n), label: skala[n - 1].nama, ket: `${skala[n - 1].ket}. ${skala[n - 1].bayangan}.` })),
  },
  {
    id: 'udara',
    judul: 'Bagaimana udaranya?',
    bantu: 'AC membuat udara kering. Kamar mandi berjendela dan teras berembun lebih lembap.',
    pilihan: [
      { nilai: 'kering', label: 'Kering', ket: 'Ber-AC hampir seharian' },
      { nilai: 'sedang', label: 'Biasa', ket: 'Berjendela, tanpa AC' },
      { nilai: 'lembap', label: 'Lembap', ket: 'Kamar mandi, dekat dapur, teras berembun' },
    ],
  },
  {
    id: 'waktu',
    judul: 'Seberapa sempat kamu merawat?',
    bantu: 'Jujur saja. Tanaman yang cocok dengan ritmemu lebih mungkin bertahan.',
    pilihan: [
      { nilai: 'jarang', label: 'Sering lupa', ket: 'Sering bepergian atau sibuk, siram dua minggu sekali pun sudah bagus' },
      { nilai: 'sedang', label: 'Seminggu sekali', ket: 'Ada waktu rutin di akhir pekan' },
      { nilai: 'rajin', label: 'Senang merawat', ket: 'Tidak keberatan mengecek tiap beberapa hari' },
    ],
  },
  {
    id: 'hewan',
    judul: 'Ada kucing atau anjing yang suka menggigit daun?',
    bantu: 'Kalau ya, kami hanya menyarankan tanaman yang tidak beracun menurut daftar ASPCA.',
    pilihan: [
      { nilai: 'ya', label: 'Ada', ket: 'Tampilkan yang aman untuk hewan saja' },
      { nilai: 'tidak', label: 'Tidak ada', ket: 'Atau tanamannya bisa diletakkan di luar jangkauan' },
    ],
  },
  {
    id: 'tempat',
    judul: 'Mau diletakkan di mana?',
    bantu: 'Ini hanya mengubah urutan, bukan menyaring.',
    pilihan: [
      { nilai: 'meja', label: 'Meja atau rak', ket: 'Tanaman kecil sampai sedang' },
      { nilai: 'lantai', label: 'Lantai', ket: 'Tanaman yang tumbuh tinggi' },
      { nilai: 'gantung', label: 'Digantung', ket: 'Sulur yang menjuntai' },
      { nilai: 'bebas', label: 'Belum tahu', ket: 'Tampilkan semuanya' },
    ],
  },
];

const VALID = Object.fromEntries(pertanyaan.map((q) => [q.id, q.pilihan.map((p) => p.nilai)]));

export function bacaJawaban(sp) {
  const j = {};
  for (const q of pertanyaan) {
    const v = sp.get(q.id);
    if (v && VALID[q.id].includes(v)) j[q.id] = v;
  }
  return j;
}

export function keQuery(j) {
  const p = new URLSearchParams();
  for (const q of pertanyaan) if (j[q.id]) p.set(q.id, j[q.id]);
  const s = p.toString();
  return s ? `?${s}` : '';
}

function namaTempat(id) {
  return daftarTempat.find((t) => t.id === id)?.nama.toLowerCase() || id;
}

export function nilaiTanaman(p, j) {
  let nilai = 0;
  const alasan = [];
  const catatan = [];
  let tolak = '';

  if (j.cahaya) {
    const c = Number(j.cahaya);
    const [a, b] = p.cahaya;
    if (c >= a && c <= b) {
      nilai += 3;
      alasan.push(`Betah di cahaya ${skala[c - 1].nama.toLowerCase()}.`);
    } else if (c === a - 1) {
      catatan.push('Butuh sedikit lebih terang. Letakkan lebih dekat ke jendela.');
    } else if (c === b + 1) {
      catatan.push('Lebih suka sedikit teduh. Jauhkan dari sinar langsung siang hari.');
    } else {
      tolak = c < a ? `Butuh cahaya minimal ${skala[a - 1].nama.toLowerCase()}.` : `Daunnya bisa terbakar di cahaya ${skala[c - 1].nama.toLowerCase()}.`;
    }
  }

  if (j.hewan === 'ya') {
    if (!p.hewan) tolak = tolak || 'Beracun bila dikunyah kucing atau anjing.';
    else {
      nilai += 1;
      alasan.push('Tidak beracun bagi kucing dan anjing.');
    }
  }

  if (j.udara) {
    if (j.udara === 'kering' && p.lembap === 'tinggi') {
      nilai -= 2;
      catatan.push('Tepi daun mudah kering di ruang ber-AC. Bantu dengan nampan kerikil basah di bawah pot.');
    } else if (j.udara === 'kering' && p.lembap === 'rendah') {
      nilai += 1;
      alasan.push('Tahan udara kering.');
    } else if (j.udara === 'lembap' && p.lembap === 'tinggi') {
      nilai += 2;
      alasan.push('Suka udara lembap seperti di tempatmu.');
    } else if (j.udara === 'lembap' && p.lembap === 'rendah') {
      nilai -= 1;
      catatan.push('Di udara lembap, biarkan media benar-benar kering di antara siraman.');
    } else if (j.udara === 'sedang' && p.lembap === 'tinggi') {
      nilai -= 1;
      catatan.push('Semprot daunnya tiap beberapa hari supaya tepinya tidak kering.');
    }
  }

  if (j.waktu) {
    if (j.waktu === 'jarang') {
      if (p.rawat === 1) {
        nilai += 2;
        alasan.push('Tahan ditinggal dan lupa disiram.');
      } else if (p.rawat === 2) {
        nilai -= 1;
        catatan.push('Perlu dicek seminggu sekali.');
      } else {
        nilai -= 3;
        catatan.push(`Perlu disiram ${p.siram.hari[0]}–${p.siram.hari[1]} hari sekali dan tidak suka media kering.`);
      }
    } else if (j.waktu === 'sedang') {
      if (p.rawat <= 2) nilai += 1;
      else {
        nilai -= 1;
        catatan.push('Lebih senang dicek dua kali seminggu.');
      }
    } else if (j.waktu === 'rajin') {
      if (p.rawat === 3) {
        nilai += 1;
        alasan.push('Cocok untuk yang senang merawat.');
      } else if (p.lembap === 'rendah') {
        catatan.push('Hati-hati jangan terlalu sering disiram. Tanaman ini lebih sering mati karena kebanyakan air.');
      }
    }
  }

  if (j.tempat && j.tempat !== 'bebas') {
    if (p.tempat.includes(j.tempat)) {
      nilai += 1;
      alasan.push(`Pas ${j.tempat === 'gantung' ? 'digantung' : `di ${namaTempat(j.tempat)}`}.`);
    } else {
      nilai -= 1;
      catatan.push(`Lebih cocok ${p.tempat.includes('gantung') && p.tempat.length === 1 ? 'digantung' : `di ${p.tempat.map(namaTempat).join(' atau ')}`}.`);
    }
  }

  let tingkat = 'kurang';
  if (!tolak) tingkat = nilai >= 5 ? 'sangat' : nilai >= 2 ? 'cocok' : 'kurang';
  return { p, nilai, tingkat, alasan, catatan, tolak };
}

const URUT_TINGKAT = { sangat: 0, cocok: 1, kurang: 2 };

export function cariTanaman(j, daftar = tanaman) {
  return daftar
    .map((p) => nilaiTanaman(p, j))
    .sort((a, b) => URUT_TINGKAT[a.tingkat] - URUT_TINGKAT[b.tingkat] || b.nilai - a.nilai || a.p.rawat - b.p.rawat || a.p.urut - b.p.urut);
}

export function jumlahDijawab(j) {
  return pertanyaan.filter((q) => j[q.id]).length;
}
