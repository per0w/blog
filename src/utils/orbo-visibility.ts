/**
 * Если секция видна меньше порога — считаем, что пользователь уже «уехал» со скроллом.
 * Учитываем и долю от высоты элемента, и долю viewport: иначе длинные блоки (опыт, проекты)
 * при полноэкранном скролле ошибочно считались «почти невидимыми».
 */
export const MIN_SECTION_VISIBILITY_RATIO = 0.14;

/** Доля пересечения секции с viewport по вертикали (0…1). */
export function getSectionVerticalVisibilityRatio(el: HTMLElement): number {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight;
  const visibleTop = Math.max(0, rect.top);
  const visibleBottom = Math.min(vh, rect.bottom);
  const visibleHeight = Math.max(0, visibleBottom - visibleTop);
  if (rect.height <= 0) {
    return 0;
  }
  const elementRatio = visibleHeight / rect.height;
  const viewportRatio = vh > 0 ? visibleHeight / vh : 0;
  return Math.max(elementRatio, viewportRatio);
}
