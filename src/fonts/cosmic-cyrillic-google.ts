import {
  Dela_Gothic_One,
  Exo_2,
  Handjet,
  Kablammo,
  Kelly_Slab,
  Orelega_One,
  Pixelify_Sans,
  Press_Start_2P,
  Rubik_Broken_Fax,
  Rubik_Glitch,
  Rubik_Iso,
  Rubik_Lines,
  Rubik_Mono_One,
  Rubik_Moonrocks,
  Rubik_Pixels,
  Rubik_Storm,
  Rubik_Wet_Paint,
  Ruslan_Display,
  Russo_One,
  Stalinist_One,
  Tektur,
  Train_One,
  Unbounded,
} from "next/font/google";

/* Каждый вызов next/font — отдельная const; без spread (ограничение Turbopack + next/font). */
const cosmicNasalization = Tektur({
  display: "swap",
  preload: false,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  weight: "800",
  variable: "--font-display-nasalization",
});
const cosmicZekton = Handjet({
  display: "swap",
  preload: false,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  weight: "600",
  variable: "--font-display-zekton",
});
const cosmicNeuropolX = Dela_Gothic_One({
  display: "swap",
  preload: false,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
  subsets: ["latin", "cyrillic", "latin-ext", "greek", "vietnamese"],
  weight: "400",
  variable: "--font-display-neuropol-x",
});
const cosmicSaiba45 = Kablammo({
  display: "swap",
  preload: false,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
  subsets: ["latin", "cyrillic", "cyrillic-ext", "emoji", "vietnamese"],
  weight: "400",
  variable: "--font-display-saiba-45",
});
const cosmicVivlRail = Pixelify_Sans({
  display: "swap",
  preload: false,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
  subsets: ["latin", "cyrillic", "latin-ext"],
  weight: "600",
  variable: "--font-display-vivl-rail",
});
const cosmicGoodFuture = Orelega_One({
  display: "swap",
  preload: false,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
  subsets: ["latin", "cyrillic", "cyrillic-ext", "latin-ext"],
  weight: "400",
  variable: "--font-display-good-future",
});
const cosmicTablon = Rubik_Storm({
  display: "swap",
  preload: false,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
  subsets: ["latin", "cyrillic", "cyrillic-ext", "hebrew"],
  weight: "400",
  variable: "--font-display-tablon",
});
const cosmicFreakShow = Rubik_Glitch({
  display: "swap",
  preload: false,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
  subsets: ["latin", "cyrillic", "cyrillic-ext", "hebrew"],
  weight: "400",
  variable: "--font-display-freak-show",
});
const cosmicPinnacle = Train_One({
  display: "swap",
  preload: false,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
  subsets: ["latin", "cyrillic", "latin-ext"],
  weight: "400",
  variable: "--font-display-pinnacle",
});
const cosmicTesla = Ruslan_Display({
  display: "swap",
  preload: false,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
  subsets: ["latin", "cyrillic", "latin-ext", "math", "symbols"],
  weight: "400",
  variable: "--font-display-tesla",
});
const cosmicUnbounded = Unbounded({
  display: "swap",
  preload: false,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
  subsets: ["latin", "cyrillic", "cyrillic-ext", "vietnamese"],
  weight: "700",
  variable: "--font-display-unbounded",
});
const cosmicRubikIso = Rubik_Iso({
  display: "swap",
  preload: false,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
  subsets: ["latin", "cyrillic", "cyrillic-ext", "hebrew", "latin-ext"],
  weight: "400",
  variable: "--font-display-rubik-iso",
});
const cosmicRubikLines = Rubik_Lines({
  display: "swap",
  preload: false,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
  subsets: ["latin", "cyrillic", "cyrillic-ext", "hebrew", "latin-ext", "math", "symbols"],
  weight: "400",
  variable: "--font-display-rubik-lines",
});
const cosmicRubikMoonrocks = Rubik_Moonrocks({
  display: "swap",
  preload: false,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
  subsets: ["latin", "cyrillic", "cyrillic-ext", "hebrew", "latin-ext"],
  weight: "400",
  variable: "--font-display-rubik-moonrocks",
});
const cosmicStalinistOne = Stalinist_One({
  display: "swap",
  preload: false,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
  subsets: ["latin", "cyrillic", "latin-ext"],
  weight: "400",
  variable: "--font-display-stalinist-one",
});
const cosmicKellySlab = Kelly_Slab({
  display: "swap",
  preload: false,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
  subsets: ["latin", "cyrillic", "latin-ext"],
  weight: "400",
  variable: "--font-display-kelly-slab",
});
const cosmicRussoOne = Russo_One({
  display: "swap",
  preload: false,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
  subsets: ["latin", "cyrillic", "latin-ext"],
  weight: "400",
  variable: "--font-display-russo-one",
});
const cosmicPressStart2P = Press_Start_2P({
  display: "swap",
  preload: false,
  fallback: ["ui-monospace", "monospace"],
  subsets: ["latin", "cyrillic", "cyrillic-ext", "greek", "latin-ext"],
  weight: "400",
  variable: "--font-display-press-start-2p",
});
const cosmicExo2 = Exo_2({
  display: "swap",
  preload: false,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
  subsets: ["latin", "cyrillic", "cyrillic-ext", "latin-ext", "vietnamese"],
  weight: "700",
  variable: "--font-display-exo-2",
});
const cosmicRubikPixels = Rubik_Pixels({
  display: "swap",
  preload: false,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
  subsets: ["latin", "cyrillic", "cyrillic-ext", "hebrew", "latin-ext"],
  weight: "400",
  variable: "--font-display-rubik-pixels",
});
const cosmicRubikBrokenFax = Rubik_Broken_Fax({
  display: "swap",
  preload: false,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
  subsets: ["latin", "cyrillic", "cyrillic-ext", "hebrew", "latin-ext", "math", "symbols"],
  weight: "400",
  variable: "--font-display-rubik-broken-fax",
});
const cosmicRubikWetPaint = Rubik_Wet_Paint({
  display: "swap",
  preload: false,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
  subsets: ["latin", "cyrillic", "cyrillic-ext", "hebrew", "latin-ext"],
  weight: "400",
  variable: "--font-display-rubik-wet-paint",
});
const cosmicRubikMonoOne = Rubik_Mono_One({
  display: "swap",
  preload: false,
  fallback: ["ui-monospace", "monospace"],
  subsets: ["latin", "cyrillic", "latin-ext"],
  weight: "400",
  variable: "--font-display-rubik-mono-one",
});

/** Экземпляры next/font — layout подключает variable, hero/section — className. */
export const cosmicDisplayGoogle = {
  nasalization: cosmicNasalization,
  zekton: cosmicZekton,
  "neuropol-x": cosmicNeuropolX,
  "saiba-45": cosmicSaiba45,
  "vivl-rail": cosmicVivlRail,
  "good-future": cosmicGoodFuture,
  tablon: cosmicTablon,
  "freak-show": cosmicFreakShow,
  pinnacle: cosmicPinnacle,
  tesla: cosmicTesla,
  unbounded: cosmicUnbounded,
  "rubik-iso": cosmicRubikIso,
  "rubik-lines": cosmicRubikLines,
  "rubik-moonrocks": cosmicRubikMoonrocks,
  "stalinist-one": cosmicStalinistOne,
  "kelly-slab": cosmicKellySlab,
  "russo-one": cosmicRussoOne,
  "press-start-2p": cosmicPressStart2P,
  "exo-2": cosmicExo2,
  "rubik-pixels": cosmicRubikPixels,
  "rubik-broken-fax": cosmicRubikBrokenFax,
  "rubik-wet-paint": cosmicRubikWetPaint,
  "rubik-mono-one": cosmicRubikMonoOne,
};
