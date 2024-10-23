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
import { SVGProps } from "react";

export const AnsibleIcon = () => (
  <Image src={Ansible} alt="Ansible" width={32} height={32} />
);

export const AstroIcon = () => (
  <Image src={Astro} alt="Astro" width={32} height={32} />
);

export const BabelIcon = () => (
  <Image src={Babel} alt="Babel" width={32} height={32} />
);

export const BashIcon = () => (
  <Image src={Bash} alt="Bash" width={32} height={32} />
);

export const CSS3Icon = () => (
  <Image src={CSS3} alt="CSS3" width={32} height={32} />
);

export const DenoIcon = () => (
  <Image src={Deno} alt="Deno" width={32} height={32} />
);

export const DockerIcon = () => (
  <Image src={Docker} alt="Docker" width={32} height={32} />
);

export const GulpIcon = () => (
  <Image src={Gulp} alt="Gulp" width={32} height={32} />
);

export const HTML5Icon = () => (
  <Image src={HTML5} alt="HTML5" width={32} height={32} />
);

export const JavaScriptIcon = () => (
  <Image src={JavaScript} alt="JavaScript" width={32} height={32} />
);

export const KubernetesIcon = () => (
  <Image src={Kubernetes} alt="Kubernetes" width={32} height={32} />
);

export const LinuxIcon = () => (
  <Image src={Linux} alt="Linux" width={32} height={32} />
);

export const MaterialUIIcon = () => (
  <Image src={MaterialUI} alt="MaterialUI" width={32} height={32} />
);

export const NextjsIcon = () => (
  <Image src={Nextjs} alt="Nextjs" width={32} height={32} />
);

export const NGINXIcon = () => (
  <Image src={NGINX} alt="NGINX" width={32} height={32} />
);

export const NodejsIcon = () => (
  <Image src={Nodejs} alt="Nodejs" width={32} height={32} />
);

export const ReactJSIcon = () => (
  <Image src={ReactJS} alt="ReactJS" width={32} height={32} />
);

export const ReduxIcon = () => (
  <Image src={Redux} alt="Redux" width={32} height={32} />
);

export const SassIcon = () => (
  <Image src={Sass} alt="Sass" width={32} height={32} />
);

export const SvelteIcon = () => (
  <Image src={Svelte} alt="Svelte" width={32} height={32} />
);

export const TailwindIcon = () => (
  <Image src={Tailwind} alt="Tailwind" width={32} height={32} />
);

export const TypeScriptIcon = () => (
  <Image src={TypeScript} alt="TypeScript" width={32} height={32} />
);

export const ViteIcon = () => (
  <Image src={Vite} alt="Vite" width={32} height={32} />
);

export const WebpackIcon = () => (
  <Image src={Webpack} alt="Webpack" width={32} height={32} />
);

export function DarkModeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      fill="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path
        d="M12 1.992a10 10 0 1 0 9.236 13.838c.341 -.82 -.476 -1.644 -1.298 -1.31a6.5 6.5 0 0 1 -6.864 -10.787l.077 -.08c.551 -.63 .113 -1.653 -.758 -1.653h-.266l-.068 -.006l-.06 -.002z"
        strokeWidth="0"
        fill="currentColor"
      />
    </svg>
  );
}

export function LightModeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      fill="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
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
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
    </svg>
  );
}
