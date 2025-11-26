import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

interface Props {
  label?: string;
  children: ReactNode;
  description?: string | React.ReactNode;
  error?: string;
  wrapperClassName?: string;
  labelClassName?: string;
  inputLayoutClassName?: string;
  required?: boolean;
}

export default function InputLayout({
  label,
  children,
  description,
  error,
  wrapperClassName,
  labelClassName,
  inputLayoutClassName,
  required = false,
}: Props) {
  return (
    <div
      className={twMerge(
        clsx("flex items-start gap-2 w-full min-h-[50px]", wrapperClassName)
      )}
    >
      <div className="inline-flex items-center gap-2 min-w-30 mt-2">
        {label && (
          <span
            className={twMerge(
              clsx(`font-body2-bold text-zienblack-80`, labelClassName)
            )}
          >
            {label}
          </span>
        )}
        {required && <span className="font-body3-bold text-red">필수</span>}
      </div>
      {/* Input Component */}
      <div className="w-full">
        <div
          className={twMerge(clsx(`flex gap-2 w-full`, inputLayoutClassName))}
        >
          {children}
        </div>
        <div className="">
          {/* Description */}
          {description && !error && (
            <p className="mt-1 text-xs text-gray-500 whitespace-pre-wrap">
              {description}
            </p>
          )}

          {/* Error */}
          <p
            className={`mt-1 text-xs text-red-500
              ${error ? "block" : "hidden"}
            `}
          >
            {error || ""}
          </p>
        </div>
      </div>
    </div>
  );
}
