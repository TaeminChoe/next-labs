import { ChangeEvent, ReactNode, useState } from "react";
import { FieldValues } from "react-hook-form";

import { InputProps } from "../types";
import { InvisibleIcon } from "../ui";
import InputLayout from "./InputLayout";

interface Props<T extends FieldValues> extends InputProps<T> {
  textarea?: boolean;
  type?: "text" | "password" | "number";
  format?: (value: string, prevValue: string) => string | undefined;
  disabled?: boolean;
  required?: boolean;
}
/**
 * InputTextBox 사용 예시
 *
 * 주의) format을 사용하고자 한다면 숫자만 입력한다고 하더라도 text타입으로 선언해야 합니다.
 *
 * [1] 일반 텍스트 입력
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
 *       <InputTextBox
 *         label="이메일"
 *         name="email"
 *         register={register}
 *         placeholder={"예: user@example.com"}
 *         validationRules={emailValidation<FormData>()}
 *         error={errors.email?.message}
 *         description={`개인용 이메일 주소를 입력해주세요.\n회사 이메일은 사용하지 마세요.`}
 *       />
 *       <InputTextBox
 *         label="사업자 등록번호"
 *         name="businessNumber"
 *         type="text"
 *         register={register}
 *         placeholder=""
 *         validationRules={{
 *           required: "사업자 등록번호를 입력해주세요",
 *           pattern: {
 *             value: /^\d{10}$/,
 *             message: "사업자등록번호는 숫자 10자리이어야 합니다.",
 *           },
 *         }}
 *         description={"사업자등록번호는 -없이 숫자만 입력해주세요."}
 *         error={errors.businessNumber?.message}
 *         format={formatBusinessNumber}
 *       />
 *     </form>
 *   )
 * ```
 *
 * [2] 비밀번호 입력
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
 *       <InputTextBox
 *         label="비밀번호"
 *         name="password"
 *         type="password"
 *         register={register}
 *         validationRules={passwordValidation<FormData>()}
 *         placeholder="********"
 *         error={errors.password?.message}
 *       />
 *       <InputTextBox
 *         label="비밀번호 확인"
 *         name="passwordConfirm"
 *         type="password"
 *         register={register}
 *         placeholder="********"
 *         validationRules={{
 *           validate: value => {
 *             const password = getValues("password");
 *             return password === value
 *             ? true
 *             : "비밀번호와 일치하지 않습니다.";
 *           },
 *         }}
 *         error={errors.passwordConfirm?.message}
 *       />
 *     </form>
 *   )
 * ```
 *
 * [3] 숫자 입력
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
 *       <InputTextBox
 *         label="휴대폰번호"
 *         name="phone"
 *         type="number"
 *         register={register}
 *         placeholder=""
 *         validationRules={{ required: "휴대본번호를 입력해주세요" }}
 *         description={"휴대폰 번호는 -없이 숫자만 입력해주세요."}
 *         error={errors.age?.message}
 *       />
 *     </form>
 *   )
 * ```
 *
 * [4] 텍스트 영역 입력
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
 *       <InputTextBox
 *         label="설명"
 *         name="description"
 *         register={register}
 *         placeholder="내용을 입력해주세요"
 *         textarea
 *         validationRules={{ required: "설명을 입력해주세요" }}
 *         error={errors.description?.message}
 *         description={`설명은 회사 내부 참고 목적으로 사용됩니다.`}
 *       />
 *     </form>
 *   )
 * ```
 */

export default function InputTextBox<T extends FieldValues>({
  label,
  name,
  register,
  validationRules,
  placeholder,
  error,
  textarea = false,
  description,
  type = "text",
  format,
  labelClassName,
  wrapperClassName,
  disabled,
  required,
}: Props<T>) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  const registered = register(name, validationRules);
  const formattedRegister = format
    ? {
        ...registered,
        onChange: (e: ChangeEvent<HTMLInputElement>) => {
          const prevValue = e.target.value;
          const next = format(e.target.value, prevValue);
          if (next !== undefined) {
            e.target.value = next;
            registered.onChange(e);
          }
        },
      }
    : registered;

  return (
    <InputLayout
      label={label}
      description={description}
      error={error}
      labelClassName={labelClassName}
      wrapperClassName={wrapperClassName}
      required={required}
    >
      {textarea ? (
        <textarea
          {...registered}
          placeholder={placeholder}
          className={`
            w-full px-4 py-[10px]
            border rounded-sm text-zienblack-100 resize-none
            ${error ? "border-red-text" : "border-zienblack-20"}
            focus:outline-none focus:ring-2 focus:ring-zienpurple-50 focus:border-zienpurple-50 transition
            disabled:bg-zienblack-10 disabled:text-text
          `}
          rows={6}
          disabled={disabled}
        />
      ) : (
        <div className="relative w-full">
          <input
            type={inputType}
            {...formattedRegister}
            placeholder={placeholder}
            disabled={disabled}
            className={`
              w-full px-4 py-2 pr-10
              border rounded-sm text-zienblack-100
              ${error ? "border-red-300" : "border-zienblack-20"}
              placeholder:text-text placeholder:font-body2-regular transition
              focus:outline-none focus:ring-1 focus:ring-zienpurple-50 focus:border-zienpurple-50 
              ${
                type === "number"
                  ? `
                      appearance-none [appearance:textfield]
                      [&::-webkit-outer-spin-button]:appearance-none 
                      [&::-webkit-inner-spin-button]:appearance-none
                    `
                  : ""
              }
            `}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className={`
                absolute top-1/2 right-3 -translate-y-1/2
                text-xs text-gray-500 cursor-pointer
                hover:text-gray-700
              `}
            >
              <InvisibleIcon state={showPassword} />
              {/* {showPassword ? "숨김" : "보기"} */}
            </button>
          )}
        </div>
      )}
    </InputLayout>
  );
}
