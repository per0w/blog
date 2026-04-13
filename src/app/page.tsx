import { About } from "@/components/about/about";
import { ContactUs } from "@/components/contact-us/contact-us";
import { Experience } from "@/components/experience/experience";
import { Hero } from "@/components/hero/hero";
import { Posts } from "@/components/posts/posts";
import { Projects } from "@/components/projects/projects";
import { MAIN_CONTENT_ID } from "@/constants/common";

export default function Home() {
  return (
    <main
      aria-label="Главная: портфолио и контакты"
      className="outline-none focus:outline-none"
      id={MAIN_CONTENT_ID}
      tabIndex={-1}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Hero />

        <About />

        <Experience />

        <Projects />

        <Posts />

        <ContactUs />
      </div>
    </main>
  );
}
