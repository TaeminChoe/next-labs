import { useState, KeyboardEvent } from "react";
import { FieldValues, UseFormSetValue, UseFormWatch } from "react-hook-form";

import { InputProps } from "../types";
import InputLayout from "./InputLayout";

interface Props<T extends FieldValues> extends InputProps<T> {
  setValue: UseFormSetValue<T>;
  watch: UseFormWatch<T>;
}

/**
 * InputTagBox 사용 예시
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
 *       <InputTagBox
 *         label="키워드"
 *         name="keywords"
 *         register={register}
 *         setValue={setValue}
 *         watch={watch}
 *         validationRules={tagBoxValidation<FormData>()}
 *         error={errors.keywords?.message}
 *         description="기술 스택 또는 관심 키워드를 태그로 입력하세요. (예: react, nextjs)"
 *         inputLayoutClassName="flex flex-col gap-1"
 *       />
 *     </form>
 *   )
 * ```
 */

export default function InputTagBox<T extends FieldValues>({
  label,
  name,
  register,
  setValue,
  watch,
  validationRules,
  error,
  description,
  inputLayoutClassName,
}: Props<T>) {
  const tags = (watch(name) as string[]) || [];
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && inputValue.trim() !== "") {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (!tags.includes(newTag)) {
        const newTags = [...tags, newTag];
        setValue(name, newTags as any, { shouldValidate: true });
      }
      setInputValue("");
    }
  };

  const handleRemove = (index: number) => {
    const updated = [...tags];
    updated.splice(index, 1);
    setValue(name, updated as any, { shouldValidate: true });
  };

  return (
    <InputLayout
      label={label}
      description={description}
      error={error}
      inputLayoutClassName={inputLayoutClassName}
    >
      <input
        type="text"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="태그를 입력 후 Enter 또는 ,를 눌러 추가"
        className={`
            w-full md:max-w-md mb-2 px-3 py-2 
            border border-gray-300 rounded-md text-sm 
            focus:outline-none focus:ring-2 focus:ring-[#1f3d7b]
          `}
      />

      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <div
            key={index}
            className={`
                flex items-center
                px-3 py-1
                bg-[#1f3d7b] rounded-full
                text-white text-sm
              `}
          >
            {tag}
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="ml-2 text-xs text-white hover:text-gray-200"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </InputLayout>
  );
}
