import { useEffect, useState } from "react";
import { format } from "date-fns";
import { FieldValues, UseFormSetValue } from "react-hook-form";

import { InputProps } from "../types";
import Datepicker from "./datepicker/Datepicker";
import InputLayout from "./InputLayout";
import CustomInputBox from "./datepicker/CustomInputBox";

interface Props<T extends FieldValues> extends InputProps<T> {
  setValue: UseFormSetValue<T>;
  formatStr?: string;
  value: string;
}

/**
 * InputDateBox 사용 예시
 *
 * ```tsx
 *   const {
 *     register,
 *     watch,
 *     handleSubmit,
 *     formState: { errors },
 *   } = useForm<FormValues>();
 *
 *   return (
 *     <form onSubmit={handleSubmit(onSubmit)}>
 *       <InputDateBox
 *         label="생년월일"
 *         name="birthDate"
 *         register={register}
 *         value={watch("birthDate")}
 *         setValue={setValue}
 *         validationRules={{ required: "날짜를 선택해주세요." }}
 *         error={errors.birthDate?.message}
 *         description="날짜를 선택해주세요."
 *        />
 *     </form>
 *   )
 * ```
 */

export default function InputDateBox<T extends FieldValues>({
  label,
  name,
  register,
  setValue,
  value,
  validationRules,
  error,
  description,
  formatStr = "yyyy-MM-dd",
  wrapperClassName,
  labelClassName,
}: Props<T>) {
  const [selectedDate, setSelectedDate] = useState<Date | null>();

  useEffect(() => {
    register(name, validationRules);
    setSelectedDate(value ? new Date(value) : null);
  }, [register]);

  useEffect(() => {
    if (selectedDate) {
      const formatted = format(selectedDate as Date, formatStr);
      setValue(name, formatted as any, { shouldValidate: true });
    }
  }, [selectedDate]);

  return (
    <InputLayout
      label={label}
      description={description}
      error={error}
      labelClassName={labelClassName}
      wrapperClassName={wrapperClassName}
    >
      <Datepicker
        selected={selectedDate}
        onChange={setSelectedDate}
        dateFormat={formatStr}
        className={`
          w-full px-3 py-2 
          border border-gray-300 rounded-md text-sm 
          focus:outline-none focus:ring-2 focus:ring-[#1f3d7b]
        `}
        wrapperClassName="w-full"
        customInput={<CustomInputBox />}
      />
    </InputLayout>
  );
}
