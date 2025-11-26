import { FieldValues } from "react-hook-form";

import { InputProps } from "../types";
import InputLayout from "./InputLayout";

interface Props<T extends FieldValues> extends InputProps<T> {
  hideLabel?: boolean;
}

/**
 * InputSingleCheckBox 사용 예시
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
 *       <InputSingleCheckBox
 *         name="agreePrivacy"
 *         // label={"개인정보제공"}
 *         register={register}
 *         description={
 *           <>
 *             <span>개인정보 수집 및 이용에 동의합니다. </span>
 *             <a
 *               href="#"
 *               className="text-blue-600 underline"
 *             >
 *               (자세히 보기)
 *             </a>
 *           </>
 *         }
 *         validationRules={{ required: "동의가 필요합니다." }}
 *         error={errors.agreePrivacy?.message}
 *       />
 *     </form>
 *   )
 * ```
 */

export default function InputSingleCheckBox<T extends FieldValues>({
  label,
  name,
  register,
  validationRules,
  description,
  error,
  hideLabel = false,
  wrapperClassName,
  labelClassName,
  inputLayoutClassName,
}: Props<T>) {
  return (
    <InputLayout
      error={error}
      wrapperClassName={wrapperClassName}
      labelClassName={labelClassName}
      inputLayoutClassName={inputLayoutClassName}
    >
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          {...register(name, validationRules)}
          className="w-4 h-4 accent-primary"
        />
        <div className="text-sm text-gray-700">{description}</div>
      </div>
    </InputLayout>
  );
}
