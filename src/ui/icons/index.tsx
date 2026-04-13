import type { SVGProps } from "react";

import Image from "next/image";

import Ansible from "./Ansible.svg";
import Astro from "./Astro.svg";
import Babel from "./Babel.svg";
import Bash from "./Bash.svg";
import CSS3 from "./CSS3.svg";
import Deno from "./Deno.svg";
import Docker from "./Docker.svg";
import Gulp from "./Gulp.svg";
import HTML5 from "./HTML5.svg";
import JavaScript from "./JavaScript.svg";
import Kubernetes from "./Kubernetes.svg";
import Linux from "./Linux.svg";
import MaterialUI from "./MaterialUI.svg";
import Nextjs from "./Nextjs.svg";
import NGINX from "./NGINX.svg";
import Nodejs from "./Nodejs.svg";
import ReactJS from "./ReactJS.svg";
import Redux from "./Redux.svg";
import Sass from "./Sass.svg";
import Svelte from "./Svelte.svg";
import Tailwind from "./Tailwind.svg";
import TypeScript from "./TypeScript.svg";
import Vite from "./Vite.svg";
import Webpack from "./Webpack.svg";

export const AnsibleIcon = () => <Image alt="Ansible" height={32} src={Ansible} width={32} />;

export const AstroIcon = () => <Image alt="Astro" height={32} src={Astro} width={32} />;

export const BabelIcon = () => <Image alt="Babel" height={32} src={Babel} width={32} />;

export const BashIcon = () => <Image alt="Bash" height={32} src={Bash} width={32} />;

export const CSS3Icon = () => <Image alt="CSS3" height={32} src={CSS3} width={32} />;

export const DenoIcon = () => <Image alt="Deno" height={32} src={Deno} width={32} />;

export const DockerIcon = () => <Image alt="Docker" height={32} src={Docker} width={32} />;

export const GulpIcon = () => <Image alt="Gulp" height={32} src={Gulp} width={32} />;

export const HTML5Icon = () => <Image alt="HTML5" height={32} src={HTML5} width={32} />;

export const JavaScriptIcon = () => (
  <Image alt="JavaScript" height={32} src={JavaScript} width={32} />
);

export const KubernetesIcon = () => (
  <Image alt="Kubernetes" height={32} src={Kubernetes} width={32} />
);

export const LinuxIcon = () => <Image alt="Linux" height={32} src={Linux} width={32} />;

export const MaterialUIIcon = () => (
  <Image alt="MaterialUI" height={32} src={MaterialUI} width={32} />
);

export const NextjsIcon = () => <Image alt="Nextjs" height={32} src={Nextjs} width={32} />;

export const NGINXIcon = () => <Image alt="NGINX" height={32} src={NGINX} width={32} />;

export const NodejsIcon = () => <Image alt="Nodejs" height={32} src={Nodejs} width={32} />;

export const ReactJSIcon = () => <Image alt="ReactJS" height={32} src={ReactJS} width={32} />;

export const ReduxIcon = () => <Image alt="Redux" height={32} src={Redux} width={32} />;

export const SassIcon = () => <Image alt="Sass" height={32} src={Sass} width={32} />;

export const SvelteIcon = () => <Image alt="Svelte" height={32} src={Svelte} width={32} />;

export const TailwindIcon = () => <Image alt="Tailwind" height={32} src={Tailwind} width={32} />;

export const TypeScriptIcon = () => (
  <Image alt="TypeScript" height={32} src={TypeScript} width={32} />
);

export const ViteIcon = () => <Image alt="Vite" height={32} src={Vite} width={32} />;

export const WebpackIcon = () => <Image alt="Webpack" height={32} src={Webpack} width={32} />;

export function DarkModeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      className="h-5 w-5"
      fill="currentColor"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M0 0h24v24H0z" fill="none" stroke="none" />
      <path
        d="M12 1.992a10 10 0 1 0 9.236 13.838c.341 -.82 -.476 -1.644 -1.298 -1.31a6.5 6.5 0 0 1 -6.864 -10.787l.077 -.08c.551 -.63 .113 -1.653 -.758 -1.653h-.266l-.068 -.006l-.06 -.002z"
        fill="currentColor"
        strokeWidth="0"
      />
    </svg>
  );
}

export function LightModeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      className="h-5 w-5"
      fill="currentColor"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M0 0h24v24H0z" fill="none" stroke="none" />
      <path
        d="M12 19a1 1 0 0 1 .993 .883l.007 .117v1a1 1 0 0 1 -1.993 .117l-.007 -.117v-1a1 1 0 0 1 1 -1z"
        strokeWidth="0"
      />
      <path
        d="M18.313 16.91l.094 .083l.7 .7a1 1 0 0 1 -1.32 1.497l-.094 -.083l-.7 -.7a1 1  0 1 1.218 -1.567l.102 .07z"
        strokeWidth="0"
      />
      <path
        d="M7.007 16.993a1 1 0 0 1 .083 1.32l-.083 .094l-.7 .7a1 1 0 0 1 -1.497 -1.32l.083 -.094l.7 -.7a1 1 0 0 1 1.414 0z"
        strokeWidth="0"
      />
      <path
        d="M4 11a1 1 0 0 1 .117 1.993l-.117 .007h-1a1 1 0 0 1 -.117 -1.993l.117 -.007h1z"
        strokeWidth="0"
      />
      <path
        d="M21 11a1 1 0 0 1 .117 1.993l-.117 .007h-1a1 1 0 0 1 -.117 -1.993l.117 -.007h1z"
        strokeWidth="0"
      />
      <path
        d="M6.213 4.81l.094 .083l.7 .7a1 1 0 0 1 -1.32 1.497l-.094 -.083l-.7 -.7a1 1 0 0 1 1.217 -1.567l.102 .07z"
        strokeWidth="0"
      />
      <path
        d="M19.107 4.893a1 1 0 0 1 .083 1.32l-.083 .094l-.7 .7a1 1 0 0 1 -1.497 -1.32l.083 -.094l.7 -.7a1 1 0 0 1 1.414 0z"
        strokeWidth="0"
      />
      <path
        d="M12 2a1 1 0 0 1 .993 .883l.007 .117v1a1 1 0 0 1 -1.993 .117l-.007 -.117v-1a1 1 0 0 1 1 -1z"
        strokeWidth="0"
      />
      <path
        d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z"
        strokeWidth="0"
      />
    </svg>
  );
}

export function GitHubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" fill="currentColor" viewBox="0 0 16 16" {...props}>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
    </svg>
  );
}

/** Логотип VK (Simple Icons, currentColor) — актуальная геометрия «VK» в квадрате. */
export function VkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="m9.489.004.729-.003h3.564l.73.003.914.01.433.007.418.011.403.014.388.016.374.021.36.025.345.03.333.033c1.74.196 2.933.616 3.833 1.516.9.9 1.32 2.092 1.516 3.833l.034.333.029.346.025.36.02.373.025.588.012.41.013.644.009.915.004.98-.001 3.313-.003.73-.01.914-.007.433-.011.418-.014.403-.016.388-.021.374-.025.36-.03.345-.033.333c-.196 1.74-.616 2.933-1.516 3.833-.9.9-2.092 1.32-3.833 1.516l-.333.034-.346.029-.36.025-.373.02-.588.025-.41.012-.644.013-.915.009-.98.004-3.313-.001-.73-.003-.914-.01-.433-.007-.418-.011-.403-.014-.388-.016-.374-.021-.36-.025-.345-.03-.333-.033c-1.74-.196-2.933-.616-3.833-1.516-.9-.9-1.32-2.092-1.516-3.833l-.034-.333-.029-.346-.025-.36-.02-.373-.025-.588-.012-.41-.013-.644-.009-.915-.004-.98.001-3.313.003-.73.01-.914.007-.433.011-.418.014-.403.016-.388.021-.374.025-.36.03-.345.033-.333c.196-1.74.616-2.933 1.516-3.833.9-.9 2.092-1.32 3.833-1.516l.333-.034.346-.029.36-.025.373-.02.588-.025.41-.012.644-.013.915-.009ZM6.79 7.3H4.05c.13 6.24 3.25 9.99 8.72 9.99h.31v-3.57c2.01.2 3.53 1.67 4.14 3.57h2.84c-.78-2.84-2.83-4.41-4.11-5.01 1.28-.74 3.08-2.54 3.51-4.98h-2.58c-.56 1.98-2.22 3.78-3.8 3.95V7.3H10.5v6.92c-1.6-.4-3.62-2.34-3.71-6.92Z" />
    </svg>
  );
}

export function TelegramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

export { MaxMessengerIcon } from "./max-messenger-icon";
