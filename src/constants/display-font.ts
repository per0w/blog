/** localStorage: выбор дисплейного шрифта для заголовков (hero + секции). */
export const DISPLAY_FONT_STORAGE_KEY = "per0w-display-font";

/**
 * Дисплейные заголовки: бесплатные гарнитуры с кириллицей из Google Fonts (OFL / открытая лицензия).
 * Первые позиции — аналоги подборки «Космические шрифты на кириллице»
 * https://smm-design.ru/kosmicheskie-shrifty-kirillica/ ; далее — доп. техно/космос из каталога GF.
 */
export const DISPLAY_FONTS = [
  "nasalization",
  "zekton",
  "neuropol-x",
  "saiba-45",
  "vivl-rail",
  "good-future",
  "tablon",
  "freak-show",
  "pinnacle",
  "tesla",
  "unbounded",
  "rubik-iso",
  "rubik-lines",
  "rubik-moonrocks",
  "stalinist-one",
  "kelly-slab",
  "russo-one",
  "press-start-2p",
  "exo-2",
  "rubik-pixels",
  "rubik-broken-fax",
  "rubik-wet-paint",
  "rubik-mono-one",
] as const;

export type DisplayFontId = (typeof DISPLAY_FONTS)[number];

/** Подпись для aria/title: для аналогов подборки — «имя · GF»; остальные — как в каталоге Google Fonts. */
export const DISPLAY_FONT_LABELS: Record<DisplayFontId, string> = {
  nasalization: "Nasalization · Tektur",
  zekton: "Zekton · Handjet",
  "neuropol-x": "Neuropol X · Dela Gothic One",
  "saiba-45": "Saiba-45 · Kablammo",
  "vivl-rail": "VIVL Rail · Pixelify Sans",
  "good-future": "Good Future · Orelega One",
  tablon: "Tablon · Rubik Storm",
  "freak-show": "Freak Show · Rubik Glitch",
  pinnacle: "Pinnacle · Train One",
  tesla: "Тесла · Ruslan Display",
  unbounded: "Unbounded",
  "rubik-iso": "Rubik Iso",
  "rubik-lines": "Rubik Lines",
  "rubik-moonrocks": "Rubik Moonrocks",
  "stalinist-one": "Stalinist One",
  "kelly-slab": "Kelly Slab",
  "russo-one": "Russo One",
  "press-start-2p": "Press Start 2P",
  "exo-2": "Exo 2",
  "rubik-pixels": "Rubik Pixels",
  "rubik-broken-fax": "Rubik Broken Fax",
  "rubik-wet-paint": "Rubik Wet Paint",
  "rubik-mono-one": "Rubik Mono One",
};

export function isDisplayFontId(value: string): value is DisplayFontId {
  return (DISPLAY_FONTS as readonly string[]).includes(value);
}

/**
 * В hero без ужатого letter-spacing на .hero-cyber-title-wrap.
 * Остальные шрифты — на <html> выставляется data-hero-title-tight (см. globals.css).
 */
export const DISPLAY_FONT_HERO_RELAXED_TRACKING_IDS = [
  "nasalization",
  "neuropol-x",
  "saiba-45",
  "vivl-rail",
  "tablon",
  "exo-2",
] as const satisfies readonly DisplayFontId[];

export function displayFontNeedsHeroTitleTight(id: DisplayFontId): boolean {
  return !(DISPLAY_FONT_HERO_RELAXED_TRACKING_IDS as readonly string[]).includes(id);
}

/** Доп. fluid-кегль hero на узких экранах — data-hero-title-fluid. */
export const DISPLAY_FONT_HERO_FLUID_MOBILE_IDS = [
  "zekton",
  "unbounded",
  "rubik-iso",
  "rubik-lines",
  "kelly-slab",
  "exo-2",
] as const satisfies readonly DisplayFontId[];

export function displayFontNeedsHeroFluidMobile(id: DisplayFontId): boolean {
  return (DISPLAY_FONT_HERO_FLUID_MOBILE_IDS as readonly string[]).includes(id);
}

/**
 * Заголовки секций (h2): у пиксельных и узких гарнитур слишком широкий letter-spacing «разрывает» строку.
 */
export const DISPLAY_FONT_SECTION_TIGHT_TRACKING_IDS = [
  "press-start-2p",
  "rubik-mono-one",
  "rubik-pixels",
  "rubik-broken-fax",
] as const satisfies readonly DisplayFontId[];

export function displayFontNeedsSectionTightTracking(id: DisplayFontId): boolean {
  return (DISPLAY_FONT_SECTION_TIGHT_TRACKING_IDS as readonly string[]).includes(id);
}

/** Press Start 2P: на мобилке ещё сильнее ужимаем трекинг — data-hero-title-pixel. */
export function displayFontIsHeroPressStartPixel(id: DisplayFontId): boolean {
  return id === "press-start-2p";
}
