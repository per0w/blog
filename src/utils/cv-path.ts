/**
 * Путь CV с учётом NEXT_PUBLIC_BASE_PATH (корень vs GitHub Pages /blog).
 * Должен совпадать с логикой window.location при полной загрузке.
 */
export function isCvPathname(pathname: string): boolean {
  const path = pathname.replace(/\/+$/, "") || "/";
  const cvPath = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/cv`;
  return path === cvPath || path.startsWith(`${cvPath}/`);
}
