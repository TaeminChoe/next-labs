import {
  Control,
  FieldValues,
  useController,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

import { CloseIcon } from "../ui";
import { InputProps } from "../types";
import InputLayout from "./InputLayout";

interface Props<T extends FieldValues> extends InputProps<T> {
  setValue: UseFormSetValue<T>;
  multiple?: boolean;
  watch: UseFormWatch<T>;
  control?: Control<T>; // ← 추가: Provider가 없을 때 주입
}

/**
 * InputFileBox 사용 예시
 *
 * [1] 단일 파일 업로드
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
 *       <InputFileBox
 *         label="프로필 이미지"
 *         name="avatar"
 *         register={register}
 *         watch={watch}
 *         setValue={setValue}
 *         control={control}
 *         validationRules={singleFileBoxValidation<FormData>()}
 *         error={errors.avatar?.message}
 *         description="최대 5MB 이하의 이미지 파일만 업로드할 수 있습니다."
 *       />
 *     </form>
 *   )
 * ```
 *
 * [2] 다중 파일 업로드
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
 *       <InputFileBox
 *         label="첨부파일"
 *         name="attachments"
 *         register={register}
 *         watch={watch}
 *         control={control}
 *         setValue={setValue}
 *         multiple
 *         validationRules={MultiFileBoxValidation<FormData>()}
 *         error={errors.attachments?.message}
 *         description="여러 파일을 동시에 업로드할 수 있습니다."
 *       />
 *     </form>
 *   )
 * ```
 */

export default function InputFileBox<T extends FieldValues>({
  label,
  name,
  register,
  watch,
  setValue,
  multiple = false,
  validationRules,
  error,
  description,
  control: controlProp,
  wrapperClassName,
  inputLayoutClassName,
  labelClassName,
}: Props<T>) {
  const control = controlProp;

  // RHF가 이 컴포넌트를 "완전 제어"함: reset() 시 value가 자동으로 갱신됨
  const { field } = useController<T, any>({
    name,
    control,
    defaultValue: [] as any, // File[]로 운영
  });

  const files: File[] = Array.isArray(field.value)
    ? (field.value as File[])
    : [];

  const dedupe = (list: File[]) => {
    const m = new Map<string, File>();
    list.forEach(f => m.set(`${f.name}:${f.size}:${f.lastModified}`, f));
    return Array.from(m.values());
  };

  const onSelect: React.ChangeEventHandler<HTMLInputElement> = e => {
    const incoming = Array.from(e.target.files ?? []);
    const next = multiple
      ? dedupe([...(files || []), ...incoming])
      : incoming.slice(-1);
    field.onChange(next); // ← RHF 상태에 직접 반영 (setValue 불필요)
    e.currentTarget.value = ""; // 같은 파일 재선택 허용
  };

  const onRemove = (idx: number) => {
    const next = files.filter((_, i) => i !== idx);
    field.onChange(next);
  };

  return (
    <InputLayout
      label={label}
      description={description}
      error={error}
      wrapperClassName={wrapperClassName}
      inputLayoutClassName={inputLayoutClassName}
      labelClassName={labelClassName}
    >
      <div className="flex items-start gap-5">
        <label
          className={`
            py-2 px-4 border border-border-gray rounded-lg 
            text-value cursor-pointer
          `}
        >
          파일 선택
          <input
            type="file"
            multiple={multiple}
            name={name}
            onChange={onSelect}
            className={`
              text-value hidden
              file:mr-4 file:py-2 file:px-4
              file:border file:border-border-gray file:rounded-lg
              file:bg-white file:text-value file:shadow-none
              hover:file:bg-gray-100 transition
            `}
          />
        </label>

        {files.length > 0 && (
          <ul className="mt-2 text-value space-y-1">
            {files.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                className="flex items-center justify-between"
              >
                <span className="truncate">{file.name}</span>
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="ml-2"
                >
                  <CloseIcon className="w-5 h-5 text-error" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </InputLayout>
  );
}
