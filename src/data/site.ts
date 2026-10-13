export type Lang = 'es' | 'en';
export type L10n = Record<Lang, string>;

export const site = {
  name: 'Ariel Dante Llensa',
  phone: '263 455-1183',
  whatsapp: '5492634551183',
  email: 'arieldantellensa@gmail.com',
  linkedin: 'https://www.linkedin.com/in/llensaariel',
  instagram: 'dantee.ariel',
  city: 'San Martín, Mendoza',
  gaId: undefined as string | undefined,
};

export const igUrl = (user: string) => `https://www.instagram.com/${user}/`;
export const waUrl = (text: string) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;

export interface Job {
  place: string;
  where: L10n;
  role: L10n;
  dates: L10n;
  items: L10n[];
}

// Trayectoria del CV, de la más reciente a la más antigua. Cada trabajo es un tiempo del menú.
export const jobs: Job[] = [
  {
    place: 'Centauro Restaurante',
    where: { es: 'Ciudad de Mendoza', en: 'Mendoza City' },
    role: { es: 'Cocinero', en: 'Cook' },
    dates: { es: 'Mar 2026 — hoy', en: 'Mar 2026 — now' },
    items: [
      { es: 'plaza fría y entradas', en: 'cold station and starters' },
      { es: 'despacho de calientes', en: 'hot dish dispatch' },
      { es: 'producción diaria y turno', en: 'daily prep and shift planning' },
    ],
  },
  {
    place: 'Bodegas de alta gama',
    where: { es: 'Los Toneles · Abrasados · Kuro (La Ronda)', en: 'Los Toneles · Abrasados · Kuro (La Ronda)' },
    role: { es: 'Cocinero eventual', en: 'Event cook' },
    dates: { es: '2025 — Ene 2026', en: '2025 — Jan 2026' },
    items: [
      { es: 'servicios y eventos de bodega', en: 'winery services and events' },
      { es: 'rotación por todas las plazas', en: 'rotation through every station' },
      { es: 'stock e insumos', en: 'stock and supplies' },
    ],
  },
  {
    place: 'Roll and Grill',
    where: { es: 'San Martín, Mendoza', en: 'San Martín, Mendoza' },
    role: { es: 'Jefe de cocina', en: 'Head chef' },
    dates: { es: 'Dic 2024 — Ene 2026', en: 'Dec 2024 — Jan 2026' },
    items: [
      { es: 'plaza caliente y sushi', en: 'hot station and sushi' },
      { es: 'servicio continuo de alta rotación', en: 'continuous high-volume service' },
      { es: 'control de calidad en el pase', en: 'quality control at the pass' },
    ],
  },
];

export const ui = {
  es: {
    htmlLang: 'es-AR',
    ogLocale: 'es_AR',
    title: 'Ariel Dante Llensa | Cocinero en Mendoza',
    description:
      'Cocinero profesional en Mendoza con más de 7 años de experiencia: jefe de cocina, bodegas de alta gama, emplatado y liderazgo de equipos. Disponible full time.',
    skip: 'Saltar al contenido',
    nav: { about: 'Perfil', dishes: 'Platos', path: 'Trayectoria', contact: 'Contacto' },
    langSwitch: 'English',
    eyebrow: 'Cocinero · Mendoza',
    lede: 'Técnica, ritmo y emplatado.',
    scroll: 'Desplazar',
    waText: 'Hola Ariel, vi tu portfolio y quería hablar con vos sobre una propuesta de trabajo.',
    featureFig: 'Sellado a soplete',
    aboutKicker: 'I',
    aboutTitle: 'Perfil',
    aboutLead:
      'Cocinero profesional, formado en el IGA Mendoza, con foco en la gestión de cocina, el liderazgo de equipos y, sobre todo, el emplatado.',
    aboutBody: [
      'Trabajé en aperturas de restaurantes y en eventos de alta demanda, y roté por todas las plazas: fríos, calientes y despacho. Me adapto rápido a distintos ritmos y equipos.',
      'Soy organizado y proactivo, y trabajo bien bajo presión sin bajar el estándar: cada plato que sale del pase tiene que verse y saber como corresponde.',
    ],
    stats: ['7+ años en cocina', '5 cocinas profesionales', '3 restaurantes de bodega'],
    available: 'Disponible full time',
    dishesKicker: 'II',
    dishesTitle: 'Platos',
    dishesIntro: 'Una selección de trabajo propio en servicio.',
    seeOnIg: 'Ver en Instagram',
    close: 'Cerrar',
    menuKicker: 'III',
    menuTitle: 'Menú de trayectoria',
    menuIntro: 'Tres cocinas, servidas en orden.',
    courses: ['Primer tiempo', 'Segundo tiempo', 'Tercer tiempo'],
    eduLabel: 'Formación',
    eduSchool: 'IGA Mendoza, Instituto Gastronómico',
    eduTitle: 'Diplomatura Universitaria en Gastronomía y Alta Cocina',
    skillsKicker: 'IV',
    skillsTitle: 'Mise en place',
    skills: [
      { name: 'Emplatado', desc: 'Presentación precisa, pinza y detalle hasta el último brote.' },
      { name: 'Gestión de cocina', desc: 'Producción diaria, organización de turno, stock y reposición.' },
      { name: 'Liderazgo', desc: 'Jefatura de cocina y coordinación de brigada en servicio.' },
      { name: 'Todas las plazas', desc: 'Fríos, entradas, calientes, sushi y despacho.' },
      { name: 'Alta demanda', desc: 'Aperturas, eventos y servicio continuo sin perder calidad.' },
      { name: 'Alta cocina', desc: 'Técnicas profesionales y estándares de bodegas de alta gama.' },
    ],
    contactKicker: 'V',
    contactLabel: 'Contacto',
    contactTitle: 'Conversemos',
    contactBody: 'Busco sumarme a una brigada que apueste a la calidad. Disponible full time en Mendoza.',
    contactWa: 'Escribir por WhatsApp',
    footerMade: 'Sitio por',
  },
  en: {
    htmlLang: 'en',
    ogLocale: 'en_US',
    title: 'Ariel Dante Llensa | Chef in Mendoza, Argentina',
    description:
      'Professional cook in Mendoza, Argentina, with 7+ years of experience: head chef, high-end wineries, plating and team leadership. Available full time.',
    skip: 'Skip to content',
    nav: { about: 'Profile', dishes: 'Dishes', path: 'Career', contact: 'Contact' },
    langSwitch: 'Español',
    eyebrow: 'Cook · Mendoza',
    lede: 'Technique, pace and plating.',
    scroll: 'Scroll',
    waText: 'Hi Ariel, I saw your portfolio and would like to talk about a job opportunity.',
    featureFig: 'Torch-seared',
    aboutKicker: 'I',
    aboutTitle: 'Profile',
    aboutLead:
      'A professional cook trained at IGA Mendoza, focused on kitchen management, team leadership and, above all, plating.',
    aboutBody: [
      'I have worked restaurant openings and high-demand events, and rotated through every station: cold, hot and the pass. I adapt quickly to different paces and teams.',
      'Organised and proactive, I perform under pressure without lowering the bar: every plate that leaves the pass has to look and taste the way it should.',
    ],
    stats: ['7+ years in kitchens', '5 professional kitchens', '3 winery restaurants'],
    available: 'Available full time',
    dishesKicker: 'II',
    dishesTitle: 'Dishes',
    dishesIntro: 'A selection of my own work during service.',
    seeOnIg: 'View on Instagram',
    close: 'Close',
    menuKicker: 'III',
    menuTitle: 'Career tasting menu',
    menuIntro: 'Three kitchens, served in order.',
    courses: ['First course', 'Second course', 'Third course'],
    eduLabel: 'Education',
    eduSchool: 'IGA Mendoza, Culinary Institute',
    eduTitle: 'University Diploma in Gastronomy and Haute Cuisine',
    skillsKicker: 'IV',
    skillsTitle: 'Mise en place',
    skills: [
      { name: 'Plating', desc: 'Precise presentation, tweezers and detail down to the last sprout.' },
      { name: 'Kitchen management', desc: 'Daily prep, shift planning, stock and restocking.' },
      { name: 'Leadership', desc: 'Head chef experience and brigade coordination during service.' },
      { name: 'Every station', desc: 'Cold, starters, hot, sushi and the pass.' },
      { name: 'High volume', desc: 'Openings, events and continuous service without losing quality.' },
      { name: 'Fine dining', desc: 'Professional techniques and high-end winery standards.' },
    ],
    contactKicker: 'V',
    contactLabel: 'Contact',
    contactTitle: "Let's talk",
    contactBody: 'I am looking to join a brigade that cares about quality. Available full time in Mendoza.',
    contactWa: 'Message on WhatsApp',
    footerMade: 'Site by',
  },
} as const;

export type UI = (typeof ui)[Lang];
