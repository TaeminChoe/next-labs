import { FieldValues } from "react-hook-form";

import { ToggleIcon } from "../ui";

import { InputProps } from "../types";
import InputLayout from "./InputLayout";

interface Props<T extends FieldValues> extends InputProps<T> {
  value: boolean;
}

/**
 * InputToggleBox 사용 예시
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
 *       <InputToggleBox
 *         label="알림 허용"
 *         name="enableNotification"
 *         register={register}
 *         validationRules={{ required: "알림을 허용해주세요." }}
 *         error={errors.enableNotification?.message}
 *         description={`브라우저에서 알림을 수신할 수 있도록 설정합니다.\n(언제든 설정에서 변경 가능)`}
 *       />
 *     </form>
 *   )
 * ```
 */

export default function InputToggleBox<T extends FieldValues>({
  label,
  name,
  register,
  validationRules,
  error,
  description,
  wrapperClassName,
  labelClassName,
  inputLayoutClassName,
  value,
}: Props<T>) {
  return (
    <InputLayout
      label={label}
      description={description}
      error={error}
      wrapperClassName={wrapperClassName}
      labelClassName={labelClassName}
      inputLayoutClassName={inputLayoutClassName}
    >
      <label className="relative inline-flex items-center cursor-pointer py-[10px]">
        <input
          type="checkbox"
          {...register(name, validationRules)}
          className="sr-only peer"
        />
        <ToggleIcon state={value} className="w-12 h-6 text-cyan-500" />
      </label>
    </InputLayout>
  );
}
