import { SECTIONS_IDS } from "@/constants/common";
import { Section } from "@/ui/section/section";

type ExperienceItemProps = {
  description: string;
  year: string;
  title: string;
  current?: boolean;
};

const ExperienceItem = ({
  description,
  year,
  title,
  current = false,
}: ExperienceItemProps) => {
  return (
    <div className="relative w-full">
      {!current && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="absolute -top-0.5 z-10 -ml-3.5 h-7 w-7 rounded-full"
        >
          <path
            fillRule="evenodd"
            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
            clipRule="evenodd"
          />
        </svg>
      )}
      <div className="ml-6">
        <h1>{title}</h1>
        <p className="mt-2 max-w-screen-sm text-sm text-gray-500">
          {description}
        </p>
        <span className="mt-1 block text-sm font-semibold">{year}</span>
      </div>
    </div>
  );
};

type ExperienceProps = {
  jobs?: ExperienceItemProps[];
};

const DEFAULT_JOBS: ExperienceItemProps[] = [
  { year: "2016-2019", description: "", title: "Optimax Dev - DevOps-инженер" },
  { year: "2019", description: "", title: "CosySoft - Frontend-разработчик" },
  {
    year: "2019-2020",
    description: "",
    title: "Optimax Dev - Frontend-разработчик",
  },
  {
    year: "2020-2021",
    description: "",
    title: "Optimax Dev - Frontend Team Lead",
  },
  {
    year: "2021",
    description: "",
    title: "Газпромбанк - Главный инженер разработки",
    current: true,
  },
];

export const Experience = ({ jobs = DEFAULT_JOBS }: ExperienceProps) => {
  return (
    <Section id={SECTIONS_IDS.experience} title="Опыт:">
      <div className="flex items-center justify-center bg-white px-6 md:px-60">
        <div className="space-y-6 border-l-2 border-dashed">
          {jobs.map((job) => {
            return <ExperienceItem key={job.title} {...job} />;
          })}
        </div>
      </div>
    </Section>
  );
};
