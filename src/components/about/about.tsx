import { SECTIONS_IDS } from "@/constants/common";
import { Skils } from "../skils/skils";
import { Section } from "@/ui/section/section";

export const About = () => {
  return (
    <Section id={SECTIONS_IDS.about} title="Обо мне:">
      <div className="max-w-2xl p-4">
        <p className="tracking-wider text-sm mb-2 text-center">
          Работаю фронтенд-разработчиком более 6 лет. Имею опыт работы DevOps
          инженером. Умею создавать сложные и высокопроизводительные
          веб-приложения.
        </p>
      </div>
      <Skils />
    </Section>
  );
};
