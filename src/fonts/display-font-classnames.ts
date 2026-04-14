import { DISPLAY_FONTS, type DisplayFontId } from "@/constants/display-font";
import { cosmicDisplayGoogle } from "@/fonts/cosmic-cyrillic-google";

/**
 * className из next/font — тот же font-family, что и в @font-face.
 * Собирается из DISPLAY_FONTS + cosmicDisplayGoogle, чтобы не дублировать ключи вручную.
 */
export const DISPLAY_FONT_CLASSNAMES = Object.fromEntries(
  DISPLAY_FONTS.map((id) => [id, cosmicDisplayGoogle[id].className]),
) as Record<DisplayFontId, string>;
