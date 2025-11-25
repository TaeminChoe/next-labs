import { forwardRef, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

import { CalendarIcon } from "../../ui";

type ButtonProps = React.ComponentPropsWithoutRef<"button"> & {
  value?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

const CustomInputBox = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ value, onClick, className, ...rest }, ref) => {
    return (
      <button
        type="button"
        onClick={onClick}
        ref={ref}
        className={twMerge(
          clsx(
            `w-full flex justify-between items-center gap-2 
            border px-4 py-[10px] rounded-lg cursor-pointer`,
            className
          )
        )}
        {...rest}
      >
        <span>{value || "날짜 선택"}</span>
        <CalendarIcon className="text-gray-700 w-[18px] h-[18px]" />
      </button>
    );
  }
);

CustomInputBox.displayName = "CustomInputBox";
export default CustomInputBox;
