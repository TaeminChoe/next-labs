# 🧩 React Hook Form Input System

**Next.js + TailwindCSS 기반 UI 입력 시스템 모듈**

이 모듈은 **react-hook-form**을 기반으로 다양한 Input 요소(Text, Select, Date, File, Toggle 등)를  
**일관된 API, 일관된 UI, 일관된 이벤트 처리 방식**으로 사용할 수 있도록 구성된 입력 시스템입니다.

프로젝트 전체의 Input 컴포넌트를 표준화하여,  
중복 코드와 스타일 불일치를 제거하고 유지보수성을 높이는 것을 목표로 설계되었습니다.

---

## 📑 목차

- [특징](#특징-features)
- [폴더 구조](#폴더-구조)
  - [각 폴더 설명](#각-폴더-설명)
- [설치](#설치)
  - [의존 라이브러리 설치](#1-의존-라이브러리-설치)
  - [전역 스타일 등록](#2-전역-스타일-등록)
- [빠른 시작 (Quick Start)](#빠른-시작-quick-start)
- [Input Components 상세 설명](#input-compoennts-상세-설명)
  - [Props > wrapperClassName 활용 예시](#props-wrapperclassname-활용-예시)
  - [Props > labelClassName 활용 예시](#props-labelclassname-활용-예시)
  - [Props > inputLayoutClassName 활용 예시](#props-inputlayoutclassname-활용-예시)
  - [활용법](#활용법)
- [InputTextBox](#inputtextbox)
  - [기본 테스트 입력](#1-기본-테스트-입력)
  - [비밀번호 입력](#2-비밀번호-입력)
  - [텍스트 영역 입력](#3-텍스트-영역-입력)
  - [숫자 입력](#4-숫자-입력)
- [InputSelectBox](#inputselectbox)
- [InputDateBox / InputDateRangeBox](#inputdatebox--inputdaterangebox)
  - [단일 날짜 입력](#1-단일-날짜-입력)
  - [범위 날짜 입력](#2-범위-날짜-입력)
- [InputEditorBox](#inputeditorbox)
- [InputFileBox](#inputfilebox)
  - [단일 파일 업로드](#1-단일-파일-업로드)
  - [다중 파일 업로드](#2-다중-파일-업로드)
- [InputToggleBox](#inputtogglebox)
- [InputSingleCheckbox](#inputsinglecheckbox)
- [InputMultiCheckbox](#inputmulticheckbox)
- [InputRadioGroupBox](#inputradiogroupbox)
- [InputTagBox](#inputtagbox)
- [InputLayout (공통 레이아웃 시스템)](#inputlayout-공통-레이아웃-시스템)
- [validation / format](#validation--format)
  - [validation](#validation)
  - [format](#format)
  - [validation, format 적용](#validation-format-적용)
- [Playground](#playground)
- [로컬 실행](#로컬-실행)
- [주의 사항](#주의-사항)
- [Version](#version)

---

## 📌 특징 (Features)

- **react-hook-form 완전 호환**
- **Text / Select / Date / DateRange / Editor / File / Toggle / Checkbox 등 10+ 타입 지원**
- 모든 Input에 동일한 API 구조(`name`, `label`, `register`, `error`, `validationRules`)
- **공통 InputLayout 기반**  
  → label, error, description, spacing 일관화
- **자동 코드 스니펫 Playground 제공**
- **TailwindCSS + clsx + tailwind-merge** 기반 스타일
- 타입 안정성(TypeScript 100% 지원)
- 프로젝트 공통 UI와 자연스럽게 통합되도록 설계

---

## 📁 폴더 구조

```
./src/modules/react-hook-form/
|-- README.md
|-- components
|   |-- InputDateBox.tsx
|   |-- InputDateRangeBox.tsx
|   |-- InputEditorBox.tsx
|   |-- InputFileBox.tsx
|   |-- InputLayout.tsx
|   |-- InputMultiCheckBox.tsx
|   |-- InputRadioGroupBox.tsx
|   |-- InputSelectBox.tsx
|   |-- InputSingleCheckBox.tsx
|   |-- InputTagBox.tsx
|   |-- InputTextBox.tsx
|   |-- InputToggleBox.tsx
|   `-- datepicker
|       |-- CustomInputBox.tsx
|       `-- Datepicker.tsx
|-- format
|   `-- index.ts
|-- index.ts
|-- styles
|   |-- react-datepicker.css
|   `-- react-quill.css
|-- types
|   `-- index.ts
|-- ui
|   |-- CalendarIcon.tsx
|   |-- CloseIcon.tsx
|   |-- Dropdown.tsx
|   |-- InvisibleIcon.tsx
|   |-- RightArrowIcon.tsx
|   |-- ToggleIcon.tsx
|   `-- index.ts
`-- validations
    `-- index.ts
```

### 각 폴더 설명

| 폴더        | 설명                                         |
| ----------- | -------------------------------------------- |
| components  | Input 요소로 사용될 컴포넌트들               |
| format      | 휴대폰/사업자번호 등 포맷 함수               |
| styles      | react-quill / react-datepicker 커스텀 스타일 |
| types       | 모든 컴포넌트 공통 타입 정의                 |
| ui          | 아이콘 및 내부 공용 UI                       |
| validations | 검증 함수 (phone, email 등)                  |

---

## 🚀 설치

### 1) 의존 라이브러리 설치

```bash
npm install tailwind-merge clsx react-hook-form react-quill date-fns react-datepicker react-quill-new
```

### 2) 전역 스타일 등록

`globals.css` 또는 `_app.tsx`에 CSS import:

```css
@import "@/modules/react-hook-form/styles/react-quill.css";
@import "@/modules/react-hook-form/styles/react-datepicker.css";
```

---

## ⚡ 빠른 시작 (Quick Start)

```tsx
import { useForm } from "react-hook-form";
import { InputTextBox, InputSelectBox } from "@/modules/react-hook-form";

interface FormData {
  companyName: string;
  country: string;
}

export default function Page() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onChange",
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <InputTextBox
        label="기업명"
        name="companyName"
        register={register}
        validationRules={{ required: "기업명을 입력해주세요." }}
        error={errors.companyName?.message}
      />

      <InputSelectBox
        label="국가"
        name="country"
        register={register}
        options={[
          { label: "대한민국", value: "kr" },
          { label: "미국", value: "us" },
          { label: "일본", value: "jp" },
        ]}
        value={watch("country")}
        onChange={v =>
          setValue("country", v, { shouldDirty: true, shouldValidate: true })
        }
        placeholder="국가를 선택해주세요"
        validationRules={{ required: "국가를 선택해주세요" }}
        error={errors.country?.message}
      />
    </form>
  );
}
```

---

## 🧱 Input Compoennts 상세 설명

공통 Props 규칙

모든 Input은 아래의 공통 props를 지원합니다.

| Props                  | Type                                   | Description             |
| ---------------------- | -------------------------------------- | ----------------------- |
| `label`                | string                                 | 입력 필드 라벨          |
| `name`                 | string                                 | react-hook-form name    |
| `register`             | ReturnType<typeof useForm>["register"] | RHF register            |
| `error`                | string                                 | 에러 메시지             |
| `validationRules`      | RegisterOptions                        | RHF 규칙                |
| `description`          | string                                 | 라벨 아래 표시되는 설명 |
| `required`             | boolean                                | 필수 여부 표시          |
| `wrapperClassName`     | string                                 | 전체 레이아웃 className |
| `labelClassName`       | string                                 | 라벨영역 className      |
| `inputLayoutClassName` | string                                 | Input영역 ClassName     |

### Props > wrapperClassName 활용 예시

Label과 Input을 Inline 혹은 Block형태로 나누고 싶을 때 커스텀

```tsx
<InputTextBox
  label="기업명"
  name="companyName"
  register={register}
  validationRules={{ required: "기업명을 입력해주세요." }}
  error={errors.companyName?.message}
  // wrapperClassName="flex-col" // inline(default) or Block
/>
```

Inline(Default)

![inlinelayout](/public/images/react-hook-form/inlineLayoutExam.png)

Block(주석 해제 버전)

![blockLayoutExam](/public/images/react-hook-form/blockLayoutExam.png)

### Props > labelClassName 활용 예시

여러 Input들의 label길이를 통일할 때 사용

```tsx
<InputTextBox
  label="기업명"
  name="companyName"
  register={register}
  validationRules={{ required: "기업명을 입력해주세요." }}
  error={errors.companyName?.message}
  labelClassName="min-w-50"
/>
```

![labelClassNameExam](/public/images/react-hook-form/labelClassNameExam.png)

### Props > inputLayoutClassName 활용 예시

InputTagBox사용 시 Input과 Tag의 레이아웃을 지정

```tsx
<InputTagBox
  label="키워드"
  name="keywords"
  register={register}
  setValue={setValue}
  watch={watch}
  validationRules={tagBoxValidation<FormData>()}
  error={errors.keywords?.message}
  description="기술 스택 또는 관심 키워드를 태그로 입력하세요. (예: react, nextjs)"
  inputLayoutClassName="flex flex-col gap-1"
/>
```

![inputClassNameExam](/public/images/react-hook-form/inputClassNameExam.png)

## 활용법

1. 활용하고자 하는 페이지에 useForm을 선언하고, 필요한 데이터의 타입을 선언

```tsx
interface FormData {
  companyName: string;
  country: string;
}

export default function Page() {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      country: "",
    },
  });

  ...

}
```

2. 원하는 Input유형을 선택하여 참조문을 추가

```tsx
import {
  InputTextBox,
  InputSelectBox,
  InputMultiCheckBox,
} from "@/modules/react-hook-form";
```

3. 코드내에 컴포넌트 임의로 작성 후 마우스를 컴포넌트 위로 마우스오버시 예시코드 표출

![자동완성 예시](/public/images/react-hook-form/react-hook-form-exam01.png)

4. 예시코드를 가져와 코드에 붙여넣고 name 등을 미리 정의한 타입에 맞게 수정

```tsx
<InputTextBox
  label="기업명"
  name="companyName"
  register={register}
  validationRules={{ required: "기업명을 입력해주세요." }}
  error={errors.companyName?.message}
/>
```

---

## 🔤 InputTextBox

텍스트/비밀번호/숫자/텍스트영역 등을 처리하는 기본 입력 컴포넌트입니다.

### 1. 기본 테스트 입력

```tsx
<InputTextBox
  label="기업명"
  name="companyName"
  register={register}
  validationRules={{ required: "기업명은 필수입니다." }}
  error={errors.companyName?.message}
/>
```

### 2. 비밀번호 입력

```tsx
<InputTextBox
  label="비밀번호"
  name="password"
  type="password"
  register={register}
  validationRules={passwordValidation<FormData>()}
  placeholder="********"
  error={errors.password?.message}
/>
```

### 3. 텍스트 영역 입력

```tsx
<InputTextBox
  label="설명"
  name="description"
  register={register}
  placeholder="내용을 입력해주세요"
  textarea
  validationRules={{ required: "설명을 입력해주세요" }}
  error={errors.description?.message}
  description={`설명은 회사 내부 참고 목적으로 사용됩니다.`}
/>
```

### 4. 숫자 입력

```tsx
<InputTextBox
  label="휴대폰번호"
  name="phone"
  type="number"
  register={register}
  placeholder=""
  validationRules={{ required: "휴대본번호를 입력해주세요" }}
  description={"휴대폰 번호는 -없이 숫자만 입력해주세요."}
  error={errors.age?.message}
/>
```

---

## 🔽 InputSelectBox

```tsx
<InputSelectBox
  label="국가"
  name="country"
  register={register}
  options={[
    { label: "대한민국", value: "kr" },
    { label: "미국", value: "us" },
    { label: "일본", value: "jp" },
  ]}
  value={watch("country")}
  onChange={v =>
    setValue("country", v, {
      shouldDirty: true,
      shouldValidate: true,
    })
  }
  placeholder="국가를 선택해주세요"
  validationRules={{ required: "국가를 선택해주세요" }}
  error={errors.country?.message}
  description={`*선택한 국가를 기준으로\n정보가 자동 설정됩니다.`}
/>
```

---

## 📅 InputDateBox / InputDateRangeBox

react-datepicker 기반 날짜 선택 컴포넌트.

### 1. 단일 날짜 입력

```tsx
<InputDateBox
  label="생년월일"
  name="birthDate"
  register={register}
  value={watch("birthDate")}
  setValue={setValue}
  validationRules={{ required: "날짜를 선택해주세요." }}
  error={errors.birthDate?.message}
  description="날짜를 선택해주세요."
/>
```

### 2. 범위 날짜 입력

```tsx
<InputDateRangeBox
  label="기간 선택"
  name="period"
  register={register}
  value={watch("period")}
  setValue={setValue}
  validationRules={dateRangeBoxValidation<FormData>()}
  error={errors.period?.message}
  description="시작일과 종료일을 선택하세요. (예: 2025-06-20 ~ 2025-06-26)"
/>
```

---

## 📝 InputEditorBox

react-quill 기반 리치 텍스트 에디터.

```tsx
<InputEditorBox
  setValue={setValue}
  watch={watch}
  label="게시글"
  trigger={trigger}
  name="contents"
  register={register}
  validationRules={{ required: "게시글을 입력해주세요." }}
  error={errors.contents?.message}
/>
```

---

## 📁 InputFileBox

단일 / 다중 파일 업로드 지원.

### 1. 단일 파일 업로드

```tsx
<InputFileBox
  label="프로필 이미지"
  name="avatar"
  register={register}
  watch={watch}
  setValue={setValue}
  control={control}
  validationRules={singleFileBoxValidation<FormData>()}
  error={errors.avatar?.message}
  description="최대 5MB 이하의 이미지 파일만 업로드할 수 있습니다."
/>
```

### 2. 다중 파일 업로드

```tsx
<InputFileBox
  label="첨부파일"
  name="attachments"
  register={register}
  watch={watch}
  control={control}
  setValue={setValue}
  multiple
  validationRules={MultiFileBoxValidation<FormData>()}
  error={errors.attachments?.message}
  description="여러 파일을 동시에 업로드할 수 있습니다."
/>
```

---

## 🔘 InputToggleBox

boolean 스위치 UI.

```tsx
<InputToggleBox
  label="알림 허용"
  name="enableNotification"
  register={register}
  validationRules={{ required: "알림을 허용해주세요." }}
  error={errors.enableNotification?.message}
  description={`브라우저에서 알림을 수신할 수 있도록 설정합니다.\n(언제든 설정에서 변경 가능)`}
/>
```

---

## 🔳 InputSingleCheckbox

```tsx
<InputSingleCheckBox
  name="agreePrivacy"
  // label={"개인정보제공"}
  register={register}
  description={
    <>
      <span>개인정보 수집 및 이용에 동의합니다. </span>
      <a href="#" className="text-blue-600 underline">
        (자세히 보기)
      </a>
    </>
  }
  validationRules={{ required: "동의가 필요합니다." }}
  error={errors.agreePrivacy?.message}
/>
```

---

## 🔲 InputMultiCheckbox

```tsx
<InputMultiCheckBox
  label="선호하는 언어"
  name="languages"
  register={register}
  watch={watch}
  options={[
    { label: "JavaScript", value: "js" },
    { label: "Python", value: "py" },
    { label: "Go", value: "go" },
    { label: "Rust", value: "rust" },
  ]}
  validationRules={multiCheckBoxValidation<FormData>()}
  error={errors.languages?.message}
/>
```

---

## 🔘 InputRadioGroupBox

```tsx
<InputRadioGroupBox
  label="성별"
  name="gender"
  options={[
    { label: "남성", value: "male" },
    { label: "여성", value: "female" },
  ]}
  watch={watch}
  register={register}
  validationRules={{ required: "성별을 선택해주세요." }}
  error={errors.gender?.message}
  description="성별을 선택해주세요"
/>
```

---

## 🏷 InputTagBox

```tsx
<InputTagBox
  label="키워드"
  name="keywords"
  register={register}
  setValue={setValue}
  watch={watch}
  validationRules={tagBoxValidation<FormData>()}
  error={errors.keywords?.message}
  description="기술 스택 또는 관심 키워드를 태그로 입력하세요. (예: react, nextjs)"
  inputLayoutClassName="flex flex-col gap-1"
/>
```

---

## 🎨 InputLayout (공통 레이아웃 시스템)

모든 Input은 공통 InputLayout을 기반으로 동일한 구조로 표시됩니다.

```tsx
// InputLayout.tsx
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

interface Props {
  label?: string;
  children: ReactNode;
  description?: string | React.ReactNode;
  error?: string;
  wrapperClassName?: string;
  labelClassName?: string;
  inputLayoutClassName?: string;
  required?: boolean;
}

export default function InputLayout({
  label,
  children,
  description,
  error,
  wrapperClassName,
  labelClassName,
  inputLayoutClassName,
  required = false,
}: Props) {
  return (
    <div
      className={twMerge(
        clsx("flex items-start gap-2 w-full min-h-[50px]", wrapperClassName)
      )}
    >
      <div className="inline-flex items-center gap-2 min-w-30 mt-2">
        {label && (
          <span
            className={twMerge(
              clsx(`font-body2-bold text-zienblack-80`, labelClassName)
            )}
          >
            {label}
          </span>
        )}
        {required && <span className="font-body3-bold text-red">필수</span>}
      </div>
      {/* Input Component */}
      <div className="w-full">
        <div
          className={twMerge(clsx(`flex gap-2 w-full`, inputLayoutClassName))}
        >
          {children}
        </div>
        <div className="">
          {/* Description */}
          {description && !error && (
            <p className="mt-1 text-xs text-gray-500 whitespace-pre-wrap">
              {description}
            </p>
          )}

          {/* Error */}
          <p
            className={`mt-1 text-xs text-red-500
              ${error ? "block" : "hidden"}
            `}
          >
            {error || ""}
          </p>
        </div>
      </div>
    </div>
  );
}
```

---

## 🔍 validation / format

자주 사용하는 형식의 validation과 format을 미리 선언해두고, Input요소에 활용

아래는 예시로 휴대폰 번호를 입력받는 Input을 생성하는 예제

### validation

000-0000-0000 형식을 지키는지 확인하는 validation

```tsx
export const phoneNumberValidation = <
  T extends FieldValues
>(): RegisterOptions<T> => ({
  required: "연락처를 입력해주세요",
  pattern: {
    value: /^\d{3}-\d{3,4}-\d{4}$/,
    message: "연락처는 숫자 11자리이어야 합니다.",
  },
});
```

### format

input에 입력될 때마다 실행되어 입력된 값을 관리

```tsx
export const formatPhoneNumber = (
  value: string,
  prevValue: string
): string | undefined => {
  const digits = value.replace(/\D/g, ""); // 숫자만 추출

  // 숫자 외 문자가 들어오면 입력 무시
  if (!/^\d*$/.test(digits)) {
    return undefined;
  }

  // 자리 수에 따라 포맷팅
  if (digits.length <= 3) {
    return digits;
  } else if (digits.length <= 7) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  } else if (digits.length <= 11) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  } else {
    // 11자리까지만 허용
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
  }
};
```

### validation, format 적용

```tsx
<InputTextBox
  label="연락처"
  name="phoneNumber"
  register={register}
  validationRules={phoneNumberValidation<FormData>()} // 휴대폰번호 validation
  format={formatPhoneNumber} // 휴대폰번호 format
  description={"연락처는 -없이 숫자만 입력해주세요."}
  error={errors.phoneNumber?.message}
/>
```

---

## 🧪 Playground

`/modules/react-hook-form` 경로에서 모든 Input 작동 예시 + 코드 스니펫 확인 가능.

---

## 🖥 로컬 실행

```bash
npm install
npm run dev
```

접속:

```
http://localhost:3000
```

---

## 📌 주의 사항

- react-quill은 SSR에서 dynamic import 필요
- Datepicker는 timezone 처리 필요
- File 업로드 시 FormData 구성 주의

---

## 📄 Version

v1.0.0 — 2025.11

작성자: 최태민
