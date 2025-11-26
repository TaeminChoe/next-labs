import { useEffect, useState } from "react";
import { format } from "date-fns";
import { FieldValues, UseFormSetValue, UseFormWatch } from "react-hook-form";

import { InputProps } from "../types";
import Datepicker from "./datepicker/Datepicker";
import InputLayout from "./InputLayout";
import CustomInputBox from "./datepicker/CustomInputBox";

interface Props<T extends FieldValues> extends InputProps<T> {
  setValue: UseFormSetValue<T>;
  value: string[];
  formatStr?: string;
}

/**
 * InputDateRangeBox 사용 예시
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
 *      <InputDateRangeBox
 *        label="기간 선택"
 *        name="period"
 *        register={register}
 *        value={watch("period")}
 *        setValue={setValue}
 *        validationRules={dateRangeBoxValidation<FormData>()}
 *        error={errors.period?.message}
 *        description="시작일과 종료일을 선택하세요. (예: 2025-06-20 ~ 2025-06-26)"
 *      />
 *     </form>
 *   )
 * ```
 */

export default function InputDateRangeBox<T extends FieldValues>({
  label,
  name,
  register,
  setValue,
  value,
  validationRules,
  error,
  description,
  formatStr = "yyyy-MM-dd",
  labelClassName,
  wrapperClassName,
  inputLayoutClassName,
}: Props<T>) {
  const [startDate, setStartDate] = useState<Date | null>();
  const [endDate, setEndDate] = useState<Date | null>();

  useEffect(() => {
    register(name, validationRules);
    if (value) {
      setStartDate(value ? new Date(value[0]) : null);
      setEndDate(value ? new Date(value[1]) : null);
    }
  }, [register]);

  useEffect(() => {
    if (startDate !== undefined && endDate !== undefined) {
      setValue(
        name,
        [
          startDate ? format(startDate, formatStr) : null,
          endDate ? format(endDate, formatStr) : null,
        ] as any,
        { shouldValidate: true }
      );
    }
  }, [startDate, endDate]);

  const handleChange = (date: [Date | null, Date | null]) => {
    setStartDate(date[0]);
    setEndDate(date[1]);
  };

  return (
    <InputLayout
      label={label}
      description={description}
      error={error}
      labelClassName={labelClassName}
      wrapperClassName={wrapperClassName}
      inputLayoutClassName={inputLayoutClassName}
    >
      <Datepicker
        selectsRange
        startDate={startDate}
        endDate={endDate}
        onChange={handleChange}
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
