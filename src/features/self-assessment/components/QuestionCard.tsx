import { ReactNode } from "react";

interface QuestionCardProps {
  number?: number;
  text: string;
  children: ReactNode;
  required?: boolean;
  hasError?: boolean;
  id?: string;
}

export const QuestionCard = ({
  number,
  text,
  children,
  required = true,
  hasError = false,
  id,
}: QuestionCardProps) => {
  return (
    <div
      id={id}
      className={`border-b border-gray-100 pb-6 last:border-b-0 last:pb-0 transition-all duration-300 ${
        hasError
          ? "bg-red-50/40 p-4 rounded-xl border border-red-200 shadow-sm"
          : ""
      }`}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <p className="text-sm font-semibold text-gray-900 leading-relaxed">
          {number && <span className="mr-2 text-gray-500">{number}.</span>}
          {text}
          {required && <span className="ml-1 text-[#B41F2A]">*</span>}
        </p>
        {required && (
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase ${
              hasError
                ? "bg-[#B41F2A] text-white animate-pulse"
                : "bg-red-50 text-[#B41F2A]"
            }`}
          >
            {hasError ? "Wajib Diisi!" : "Wajib"}
          </span>
        )}
      </div>
      <div className="mt-2 pl-6">{children}</div>
    </div>
  );
};
