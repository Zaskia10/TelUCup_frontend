import { ReactNode } from "react";

interface SelfAssessmentSectionProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export const SelfAssessmentSection = ({
  title,
  subtitle,
  children,
}: SelfAssessmentSectionProps) => {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm mb-6 transition-all hover:shadow-md">
      <div className="mb-5 flex items-start gap-3">
        <div className="mt-1 flex h-7 w-7 items-center justify-center rounded-md bg-red-50 text-sm font-bold text-[#B41F2A]">
          ◉
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
      </div>
      <div className="space-y-6">{children}</div>
    </section>
  );
};
