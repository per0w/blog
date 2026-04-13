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

/** Логотип VK (упрощённый контур, currentColor для темы сайта) */
export function VkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm2.2 16.811h-1.742c-.662 0-.86-.525-2.048-1.733-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.845 0-3.896-1.12-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.441 0 .61.203.78.678.835 2.568 2.243 4.813 2.826 4.813.135 0 .237-.068.237-.644V9.723c-.05-1.253-.729-1.354-.729-1.797 0-.218.178-.424.491-.424h2.744c.356 0 .491.186.491.601v4.397c0 .356.153.491.254.491.203 0 .373-.119.746-.474 1.15-1.287 1.982-3.285 1.982-3.285.102-.254.254-.491.695-.491h1.744c.525 0 .644.27.525.644-.203.966-2.177 3.81-2.177 3.81-.186.305-.254.44 0 .78.186.254.78 1.016 1.185 1.64.745 1.185 1.32 2.177 1.473 2.948.153.767-.085 1.15-.576 1.15z" />
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
