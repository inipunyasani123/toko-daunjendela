// Ikon garis satu gaya (24×24, garis 1,7). Semua dekoratif: teks di sebelahnya yang membawa makna.
const dasar = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, focusable: 'false' };

export function IkonSiram(p) {
  return (
    <svg {...dasar} {...p}>
      <path d="M12 3.5c3 3.9 5.4 7 5.4 10a5.4 5.4 0 0 1-10.8 0c0-3 2.4-6.1 5.4-10Z" />
      <path d="M9.6 14.6a2.6 2.6 0 0 0 2.4 2.4" />
    </svg>
  );
}

export function IkonSemprot(p) {
  return (
    <svg {...dasar} {...p}>
      <path d="M8 9h5v11a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1Z" />
      <path d="M9 9V6.5h3V9M12 6.5h2.5l1.5 1.5" />
      <path d="M18 5.5h.01M20 8h.01M18.5 10.5h.01M21 4h.01" strokeWidth="2.2" />
    </svg>
  );
}

export function IkonPutar(p) {
  return (
    <svg {...dasar} {...p}>
      <path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3" />
      <path d="M19.8 4.5v3.6h-3.6" />
    </svg>
  );
}

export function IkonLap(p) {
  return (
    <svg {...dasar} {...p}>
      <path d="M4.5 19.5c3.2-.4 6.3-2.6 8.7-6.1 1.8-2.6 2.8-5.7 2.8-8.9-6.2.6-11.1 5.5-11.5 15Z" />
      <path d="M4.5 19.5 10 14" />
      <path d="M15.5 17.5h4M17 20.5h3.5" />
    </svg>
  );
}

export function IkonPupuk(p) {
  return (
    <svg {...dasar} {...p}>
      <path d="M12 20V11" />
      <path d="M12 12.5c-4.2 0-6.4-2.6-6.4-6.6 4 0 6.4 2.3 6.4 6.6ZM12 14.5c3.7 0 5.8-2.3 5.8-5.9-3.6 0-5.8 2.1-5.8 5.9Z" />
      <path d="M8 20h8" />
    </svg>
  );
}

export function IkonKardus(p) {
  return (
    <svg {...dasar} {...p}>
      <path d="M3.5 8 12 4l8.5 4v8.5L12 20.5l-8.5-4Z" />
      <path d="M3.5 8 12 12l8.5-4M12 12v8.5" />
      <path d="m7.8 6 8.4 4" />
    </svg>
  );
}

export function IkonMatahari(p) {
  return (
    <svg {...dasar} {...p}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7" />
    </svg>
  );
}

export function IkonUdara(p) {
  return (
    <svg {...dasar} {...p}>
      <path d="M3.5 9h11a2.7 2.7 0 1 0-2.6-3.4" />
      <path d="M3.5 13.5h15a2.8 2.8 0 1 1-2.6 3.6" />
      <path d="M3.5 18h6" />
    </svg>
  );
}

export function IkonSuhu(p) {
  return (
    <svg {...dasar} {...p}>
      <path d="M10 14.2V5a2 2 0 0 1 4 0v9.2a4 4 0 1 1-4 0Z" />
      <path d="M12 11v5" />
    </svg>
  );
}

export function IkonTapak(p) {
  return (
    <svg {...dasar} {...p}>
      <path d="M8.5 13.8c1.4-1.7 5.6-1.7 7 0 1.5 1.8 2.7 3.6 1.7 5-1.1 1.5-3.2.5-5.2.5s-4.1 1-5.2-.5c-1-1.4.2-3.2 1.7-5Z" />
      <ellipse cx="6.2" cy="10" rx="1.6" ry="2.1" />
      <ellipse cx="9.8" cy="6.6" rx="1.6" ry="2.1" />
      <ellipse cx="14.2" cy="6.6" rx="1.6" ry="2.1" />
      <ellipse cx="17.8" cy="10" rx="1.6" ry="2.1" />
    </svg>
  );
}

export function IkonPeringatan(p) {
  return (
    <svg {...dasar} {...p}>
      <path d="M12 4 21 19.5H3Z" />
      <path d="M12 10v4.2M12 17h.01" strokeWidth="2" />
    </svg>
  );
}

export function IkonTas(p) {
  return (
    <svg {...dasar} {...p}>
      <path d="M5 8.5h14l-1.1 11.2a1.5 1.5 0 0 1-1.5 1.3H7.6a1.5 1.5 0 0 1-1.5-1.3Z" />
      <path d="M8.8 8.5V7a3.2 3.2 0 0 1 6.4 0v1.5" />
    </svg>
  );
}

export function IkonKalender(p) {
  return (
    <svg {...dasar} {...p}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
      <path d="M8 13.5h2M12 13.5h2M16 13.5h.5M8 17h2M12 17h2" />
    </svg>
  );
}

export function IkonPanah(p) {
  return (
    <svg {...dasar} {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function IkonCentang(p) {
  return (
    <svg {...dasar} {...p}>
      <path d="m5 12.5 4.2 4.2L19 7" />
    </svg>
  );
}

export const IKON_TUGAS = {
  tiba: IkonKardus,
  siram: IkonSiram,
  semprot: IkonSemprot,
  putar: IkonPutar,
  lap: IkonLap,
  pupuk: IkonPupuk,
};
