import { FieldValues, UseFormWatch } from "react-hook-form";

import { InputProps, Option } from "../types";
import InputLayout from "./InputLayout";

interface Props<T extends FieldValues> extends InputProps<T> {
  options: Option[];
  watch: UseFormWatch<T>;
}

/**
 * InputRadioGroupBox 사용 예시
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
 *       <InputRadioGroupBox
 *         label="성별"
 *         name="gender"
 *         options={[
 *           { label: "남성", value: "male" },
 *           { label: "여성", value: "female" },
 *         ]}
 *         watch={watch}
 *         register={register}
 *         validationRules={{ required: "성별을 선택해주세요." }}
 *         error={errors.gender?.message}
 *         description="성별을 선택해주세요"
 *       />
 *     </form>
 *   )
 * ```
 */

export default function InputRadioGroupBox<T extends FieldValues>({
  label,
  options,
  name,
  watch,
  register,
  validationRules,
  description,
  error,
}: Props<T>) {
  return (
    <InputLayout label={label} description={description} error={error}>
      <div className="flex flex-wrap gap-2">
        {options.map(option => {
          const id = `${name}-${option.value}`;
          const isSelected = watch(name) === option.value;

          return (
            <label
              key={option.value}
              htmlFor={id}
              className={`
                  px-4 py-2 cursor-pointer
                  text-sm font-medium
                  border transition rounded-full
                  ${
                    isSelected
                      ? "bg-[#1f3d7b] text-white border-[#1f3d7b]"
                      : "bg-white text-gray-500 border-gray-300 hover:bg-gray-50"
                  }`}
            >
              <input
                type="radio"
                id={id}
                value={option.value}
                {...register(name, validationRules)}
                className="hidden"
              />
              {option.label}
            </label>
          );
        })}
      </div>
    </InputLayout>
  );
}
