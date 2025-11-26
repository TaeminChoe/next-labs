import { FieldValues, RegisterOptions } from "react-hook-form";

export const emailValidation = <
  T extends FieldValues
>(): RegisterOptions<T> => ({
  required: "이메일을 입력해주세요.",
  pattern: {
    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // 안전한 이메일 정규식
    message: "올바른 이메일 형식이 아닙니다.",
  },
});

export const businessNumberValidation = <
  T extends FieldValues
>(): RegisterOptions<T> => ({
  required: "사업자 등록번호를 입력해주세요",
  pattern: {
    value: /^\d{3}-\d{2}-\d{5}$/,
    message: "사업자등록번호는 숫자 10자리이어야 합니다.",
  },
});

export const phoneNumberValidation = <
  T extends FieldValues
>(): RegisterOptions<T> => ({
  required: "연락처를 입력해주세요",
  pattern: {
    value: /^\d{3}-\d{3,4}-\d{4}$/,
    message: "연락처는 숫자 11자리이어야 합니다.",
  },
});

export const passwordValidation = <
  T extends FieldValues
>(): RegisterOptions<T> => ({
  required: "비밀번호는 필수 입력입니다.",
  pattern: {
    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/,
    message:
      "비밀번호는 영문 대소문자, 숫자, 특수문자를 포함해 8자 이상이어야 합니다.",
  },
});

export const multiCheckBoxValidation = <
  T extends FieldValues
>(): RegisterOptions<T> => ({
  validate: value =>
    Array.isArray(value) && value.length > 0
      ? true
      : "하나 이상 선택해야 합니다.",
});

export const singleFileBoxValidation = <
  T extends FieldValues
>(): RegisterOptions<T> => ({
  validate: (value: unknown) => {
    const MAX_SIZE = 5 * 1024 * 1024;

    // 1. FileList 타입 확인
    if (!(value instanceof FileList)) {
      return "올바른 파일 형식이 아닙니다.";
    }

    // 2. 파일 미선택
    if (value.length === 0) {
      return "파일을 선택해주세요.";
    }

    // 3. 용량 체크
    const hasOversized = Array.from(value).some(file => file.size > MAX_SIZE);
    return hasOversized ? "5MB 이하의 파일만 업로드 가능합니다." : true;
  },
});

export const MultiFileBoxValidation = <
  T extends FieldValues
>(): RegisterOptions<T> => ({
  validate: (value: unknown) => {
    const MAX_SIZE = 5 * 1024 * 1024;

    // 1. FileList 타입 확인
    if (!(value instanceof FileList)) {
      return "올바른 파일 형식이 아닙니다.";
    }

    // 2. 파일 미선택
    if (value.length === 0) {
      return "파일을 선택해주세요.";
    }

    // 3. 용량 체크
    const hasOversized = Array.from(value).some(file => file.size > MAX_SIZE);
    return hasOversized ? "5MB 이하의 파일만 업로드 가능합니다." : true;
  },
});

export const tagBoxValidation = <
  T extends FieldValues
>(): RegisterOptions<T> => ({
  validate: value =>
    Array.isArray(value) && value.length > 0
      ? true
      : "최소 1개 이상의 태그를 입력해주세요.",
});

export const dateRangeBoxValidation = <
  T extends FieldValues
>(): RegisterOptions<T> => ({
  validate: (values: [string, string]) => {
    return values[0] && values[1]
      ? true
      : "시작일과 종료일을 모두 선택해주세요.";
  },
});
