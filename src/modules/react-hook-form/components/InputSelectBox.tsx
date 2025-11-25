import { useEffect, useRef, useState } from "react";
import { FieldValues } from "react-hook-form";

import { Dropdown } from "../ui";

import { InputProps, Option } from "../types";
import InputLayout from "./InputLayout";

interface Props<T extends FieldValues> extends InputProps<T> {
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  maxMenuHeight?: number;
  disabled?: boolean;
}

/**
 * InputSelectBox 사용 예시
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
 *       <InputSelectBox
 *         label="국가"
 *         name="country"
 *         register={register}
 *         options={[
 *           { label: "대한민국", value: "kr" },
 *           { label: "미국", value: "us" },
 *           { label: "일본", value: "jp" },
 *         ]}
 *         value={watch("country")}
 *         onChange={v =>
 *           setValue("country", v, {
 *             shouldDirty: true,
 *             shouldValidate: true,
 *           })
 *         }
 *         placeholder="국가를 선택해주세요"
 *         validationRules={{ required: "국가를 선택해주세요" }}
 *         error={errors.country?.message}
 *         description={`*선택한 국가를 기준으로\n정보가 자동 설정됩니다.`}
 *       />
 *     </form>
 *   )
 * ```
 */

export default function InputSelectBox<T extends FieldValues>({
  value,
  onChange,
  label,
  name,
  options,
  register,
  validationRules,
  placeholder,
  error,
  description,
  maxMenuHeight,
  wrapperClassName,
  labelClassName,
  disabled,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = options.find(o => o.value === value);

  // 바깥 클릭 닫기
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <InputLayout
      label={label}
      description={description}
      error={error}
      wrapperClassName={wrapperClassName}
      labelClassName={labelClassName}
    >
      <div ref={ref} className={`relative w-full`}>
        {/* RHF와 쉽게 물리려면 name 주고 hidden input으로 값 전달 */}
        {name && (
          <input
            type="hidden"
            value={value ?? ""}
            readOnly
            {...register(name, validationRules)}
          />
        )}

        <Dropdown
          placeholder={placeholder}
          options={options}
          onChange={onChange}
          value={value}
          error={error}
          maxMenuHeight={maxMenuHeight}
          disabled={disabled}
        />
      </div>
    </InputLayout>
  );
}
