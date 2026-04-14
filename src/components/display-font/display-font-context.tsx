"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  DISPLAY_FONT_LABELS,
  DISPLAY_FONT_STORAGE_KEY,
  DISPLAY_FONTS,
  displayFontIsHeroPressStartPixel,
  displayFontNeedsHeroFluidMobile,
  displayFontNeedsHeroTitleTight,
  type DisplayFontId,
  isDisplayFontId,
} from "@/constants/display-font";

type DisplayFontContextValue = {
  id: DisplayFontId;
  cycle: () => void;
  label: string;
};

const DisplayFontContext = createContext<DisplayFontContextValue | null>(null);

export function DisplayFontProvider({ children }: { children: ReactNode }) {
  const [id, setId] = useState<DisplayFontId>("nasalization");

  /* После гидратации подтягиваем сохранённый шрифт; на SSR остаётся первый из DISPLAY_FONTS. */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DISPLAY_FONT_STORAGE_KEY);
      if (raw && isDisplayFontId(raw)) {
        /* eslint-disable-next-line react-hooks/set-state-in-effect -- единичная синхронизация с localStorage, не цепочка рендеров */
        setId(raw);
      }
    } catch {
      /* приватный режим */
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.displayFont = id;

    /* Атрибуты для hero в globals.css — без длинных html:is(...) по каждому шрифту */
    if (displayFontNeedsHeroTitleTight(id)) {
      root.dataset.heroTitleTight = "true";
    } else {
      delete root.dataset.heroTitleTight;
    }
    if (displayFontNeedsHeroFluidMobile(id)) {
      root.dataset.heroTitleFluid = "true";
    } else {
      delete root.dataset.heroTitleFluid;
    }
    if (displayFontIsHeroPressStartPixel(id)) {
      root.dataset.heroTitlePixel = "true";
    } else {
      delete root.dataset.heroTitlePixel;
    }

    try {
      localStorage.setItem(DISPLAY_FONT_STORAGE_KEY, id);
    } catch {
      /* приватный режим */
    }
  }, [id]);

  const cycle = useCallback(() => {
    setId((prev) => {
      const i = DISPLAY_FONTS.indexOf(prev);
      return DISPLAY_FONTS[(i + 1) % DISPLAY_FONTS.length]!;
    });
  }, []);

  const value = useMemo(
    () => ({
      id,
      cycle,
      label: DISPLAY_FONT_LABELS[id],
    }),
    [id, cycle],
  );

  return <DisplayFontContext.Provider value={value}>{children}</DisplayFontContext.Provider>;
}

export function useDisplayFont(): DisplayFontContextValue {
  const ctx = useContext(DisplayFontContext);
  if (!ctx) {
    throw new Error("useDisplayFont: оберните дерево в DisplayFontProvider");
  }
  return ctx;
}
