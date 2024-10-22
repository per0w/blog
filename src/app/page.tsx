import { About } from "@/components/about/about";
import { ContactUs } from "@/components/contact-us/contact-us";
import { Experience } from "@/components/experience/experience";
import { Hero } from "@/components/hero/hero";
import { Posts } from "@/components/posts/posts";
import { Projects } from "@/components/projects/projects";

export default function Home() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Hero />

        <About />

        <Experience />

        <Projects />

        <Posts />

        <ContactUs />
      </div>
    </div>
  );
}
