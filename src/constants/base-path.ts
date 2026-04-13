/**
 * На GitHub Pages сайт живёт под /blog; на VPS — в корне домена.
 * next/image со строковым src из public/ не дописывает basePath — префиксуем вручную.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Путь от корня хостинга: `/images/...` → `/blog/images/...` при деплое на GH Pages. */
export function withBasePath(path: string): string {
  if (!path.startsWith("/")) {
    return path;
  }
  return `${BASE_PATH}${path}`;
}
