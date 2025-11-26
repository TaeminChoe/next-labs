import { FieldValues, UseFormWatch } from "react-hook-form";

import { InputProps, Option } from "../types";
import InputLayout from "./InputLayout";

interface Props<T extends FieldValues> extends InputProps<T> {
  options: Option[];
  watch: UseFormWatch<T>;
}

/**
 * InputMultiCheckBox 사용 예시
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
 *       <InputMultiCheckBox
 *         label="선호하는 언어"
 *         name="languages"
 *         register={register}
 *         watch={watch}
 *         options={[
 *           { label: "JavaScript", value: "js" },
 *           { label: "Python", value: "py" },
 *           { label: "Go", value: "go" },
 *           { label: "Rust", value: "rust" },
 *         ]}
 *         validationRules={multiCheckBoxValidation<FormData>()}
 *         error={errors.languages?.message}
 *       />
 *     </form>
 *   )
 * ```
 */

export default function InputMultiCheckBox<T extends FieldValues>({
  label,
  name,
  options,
  register,
  watch,
  validationRules,
  error,
  description,
}: Props<T>) {
  const selectedValues = (watch(name) || []) as string[];

  return (
    <InputLayout label={label} description={description} error={error}>
      <div className="flex flex-wrap gap-2 w-full">
        {options.map(option => {
          const id = `${name}-${option.value}`;
          const isSelected = selectedValues.includes(option.value);

          return (
            <label
              key={option.value}
              htmlFor={id}
              className={`
                  px-4 py-2
                  border rounded-full cursor-pointer 
                  text-sm font-medium transition 
                  ${
                    isSelected
                      ? "bg-[#1f3d7b] text-white border-[#1f3d7b]"
                      : "bg-white text-gray-500 border-gray-300 hover:bg-gray-50"
                  }
                `}
            >
              <input
                type="checkbox"
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
