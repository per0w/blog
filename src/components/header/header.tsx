import { SECTIONS_IDS } from "@/constants/common";
import Link from "next/link";
import ThemeSwitcher from "../theme-switcher/theme-switcher";

export const Header = () => {
  return (
    <div className="sticky top-0 z-40 w-full backdrop-blur flex-none lg:z-50 lg:border-b lg:border-slate-900/10 dark:border-slate-50/[0.06] bg-white/95 supports-backdrop-blur:bg-white/60 dark:bg-transparent">
      <div className="max-w-8xl mx-auto">
        <div className="py-4 border-b border-slate-900/10 lg:px-8 lg:border-0 dark:border-slate-300/10 mx-4 lg:mx-0">
          <div className="relative flex items-center">
            <Link
              className="title font-semibold text-1xl tracking-tighter"
              href="/"
            >
              PEROV.DEV
            </Link>
            <div className="relative lg:flex items-center ml-auto">
              <nav className="text-sm leading-6 hidden lg:flex font-semibold text-slate-700 dark:text-slate-200">
                <ul className="flex space-x-8">
                  <li>
                    <Link
                      href={`/#${SECTIONS_IDS.about}`}
                      className="hover:text-sky-500 dark:hover:text-sky-400"
                    >
                      Обо мне
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`#${SECTIONS_IDS.experience}`}
                      className="hover:text-sky-500 dark:hover:text-sky-400"
                    >
                      Опыт
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`#${SECTIONS_IDS.projects}`}
                      className="hover:text-sky-500 dark:hover:text-sky-400"
                    >
                      Проекты
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`#${SECTIONS_IDS.lastArticles}`}
                      className="hover:text-sky-500 dark:hover:text-sky-400"
                    >
                      Блог
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="hover:text-sky-500 dark:hover:text-sky-400"
                      href={`#${SECTIONS_IDS.contactUs}`}
                    >
                      Контакты
                    </Link>
                  </li>
                </ul>
              </nav>
              <div className="flex items-center ml-6">
                <ThemeSwitcher />
                <a
                  href="https://github.com/per0w"
                  target="blank"
                  className="ml-6 block  hover:text-slate-500 dark:hover:text-slate-300"
                >
                  <span className="sr-only">perov githubs</span>
                  <svg
                    viewBox="0 0 16 16"
                    className="w-5 h-5"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                  </svg>
                </a>
                <a
                  href="https://t.me/per0w/"
                  target="blank"
                  className="ml-6 block  hover:text-slate-500 dark:hover:text-slate-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                  >
                    <defs>
                      <linearGradient
                        id="logosTelegram0"
                        x1="50%"
                        x2="50%"
                        y1="0%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#2aabee" />
                        <stop offset="100%" stopColor="#229ed9" />
                      </linearGradient>
                    </defs>
                    <path
                      fill="url(#logosTelegram0)"
                      d="M128 0C94.06 0 61.48 13.494 37.5 37.49A128.04 128.04 0 0 0 0 128c0 33.934 13.5 66.514 37.5 90.51C61.48 242.506 94.06 256 128 256s66.52-13.494 90.5-37.49c24-23.996 37.5-56.576 37.5-90.51s-13.5-66.514-37.5-90.51C194.52 13.494 161.94 0 128 0"
                    />
                    <path
                      fill="#fff"
                      d="M57.94 126.648q55.98-24.384 74.64-32.152c35.56-14.786 42.94-17.354 47.76-17.441c1.06-.017 3.42.245 4.96 1.49c1.28 1.05 1.64 2.47 1.82 3.467c.16.996.38 3.266.2 5.038c-1.92 20.24-10.26 69.356-14.5 92.026c-1.78 9.592-5.32 12.808-8.74 13.122c-7.44.684-13.08-4.912-20.28-9.63c-11.26-7.386-17.62-11.982-28.56-19.188c-12.64-8.328-4.44-12.906 2.76-20.386c1.88-1.958 34.64-31.748 35.26-34.45c.08-.338.16-1.598-.6-2.262c-.74-.666-1.84-.438-2.64-.258c-1.14.256-19.12 12.152-54 35.686c-5.1 3.508-9.72 5.218-13.88 5.128c-4.56-.098-13.36-2.584-19.9-4.708c-8-2.606-14.38-3.984-13.82-8.41c.28-2.304 3.46-4.662 9.52-7.072"
                    />
                  </svg>
                </a>
              </div>
            </div>
            <div className="ml-2 -my-1 lg:hidden">
              <button
                type="button"
                className="text-slate-500 w-8 h-8 flex items-center justify-center hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300"
              >
                <span className="sr-only">Navigation</span>
                <svg width="24" height="24" fill="none" aria-hidden="true">
                  <path
                    d="M12 6v.01M12 12v.01M12 18v.01M12 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm0 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm0 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
