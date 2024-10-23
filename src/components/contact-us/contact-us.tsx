import { SECTIONS_IDS } from "@/constants/common";
import { Section } from "@/ui/section/section";

export const ContactUs = () => {
  return (
    <Section id={SECTIONS_IDS.contactUs} title="Контакты:">
      <div className="mt-6">
        <div className="grid sm:grid-cols-2 items-start gap-14 p-8 mx-auto max-w-4xl rounded-md">
          <div>
            <div className="mt-12">
              <h2 className="text-base font-bold">Email</h2>
              <ul className="mt-4">
                <li className="flex items-center">
                  <div className="h-10 w-10 rounded-full flex items-center justify-center shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20px"
                      height="20px"
                      fill="currentColor"
                      viewBox="0 0 479.058 479.058"
                    >
                      <path
                        d="M434.146 59.882H44.912C20.146 59.882 0 80.028 0 104.794v269.47c0 24.766 20.146 44.912 44.912 44.912h389.234c24.766 0 44.912-20.146 44.912-44.912v-269.47c0-24.766-20.146-44.912-44.912-44.912zm0 29.941c2.034 0 3.969.422 5.738 1.159L239.529 264.631 39.173 90.982a14.902 14.902 0 0 1 5.738-1.159zm0 299.411H44.912c-8.26 0-14.971-6.71-14.971-14.971V122.615l199.778 173.141c2.822 2.441 6.316 3.655 9.81 3.655s6.988-1.213 9.81-3.655l199.778-173.141v251.649c-.001 8.26-6.711 14.97-14.971 14.97z"
                        data-original="#000000"
                      />
                    </svg>
                  </div>
                  <a href="#" className="text-sm ml-4">
                    <small className="block">Mail</small>
                    <strong>per0w@yandex.ru</strong>
                  </a>
                </li>
              </ul>
            </div>

            <div className="mt-12">
              <h2 className="text-base font-bold">Socials</h2>

              <ul className="flex mt-4 space-x-4">
                <li className="h-10 w-10 rounded-full flex items-center justify-center shrink-0">
                  <a
                    href="https://github.com/per0w"
                    target="blank"
                    className="block hover:text-slate-500 dark:hover:text-slate-300"
                  >
                    <span className="sr-only">perov githubs</span>
                    <svg
                      viewBox="0 0 16 16"
                      className="w-10 h-10"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                    </svg>
                  </a>
                </li>
                <li className="bg-[#e6e6e6cf] h-10 w-10 rounded-full flex items-center justify-center shrink-0">
                  <a
                    href="https://t.me/per0w/"
                    target="blank"
                    className="block hover:text-slate-500 dark:hover:text-slate-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-10 h-10"
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
                </li>
              </ul>
            </div>
          </div>

          <form className="ml-auo space-y-4">
            <input
              type="text"
              placeholder="Имя"
              className="w-full text-gray-800 rounded-md py-2.5 px-4 border text-sm outline-blue-500"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full text-gray-800 rounded-md py-2.5 px-4 border text-sm outline-blue-500"
            />
            <input
              type="text"
              placeholder="Тема"
              className="w-full text-gray-800 rounded-md py-2.5 px-4 border text-sm outline-blue-500"
            />
            <textarea
              placeholder="Сообщение"
              rows={6}
              className="w-full text-gray-800 rounded-md px-4 border text-sm pt-2.5 outline-blue-500"
            ></textarea>
            <button
              type="button"
              className="text-white bg-blue-500 hover:bg-blue-600 rounded-md text-sm px-4 py-3 w-full !mt-6"
            >
              Отправить
            </button>
          </form>
        </div>
      </div>
    </Section>
  );
};
