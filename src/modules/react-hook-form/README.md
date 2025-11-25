# 🧩 react-hook-form

react-hook-form이라는 라이브러리를 활용해서 input요소를 관리합니다.

다양한 타입의 Input 요소를 관리하여 프로젝트 내의 모든 Input에 대응할 수 있도록 작성하는 것이 목표입니다.

## 📁 구조

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

- components : Input요소로 사용될 컴포넌트들과 내부에서 사용되는 컴포넌트
- format : 휴대폰, 사업자 번호와 같이 포맷이 필요한 데이터 형식 정의
- styles : textEditor에서 사용되는 react-quill과 날짜 형식에서 사용되는 datepicker의 커스텀 css
- types : 내부에서 사용되는 타입 정의
- ui : 컴포넌트에서 공용으로 활용되는 UI 컴포넌트
  - 이후 react-hook-form모듈을 가져갈 때, 프로젝트에 공용 UI에 합류시키길 권장

## 🚀 사용법

1. 설치/필요 라이브러리

```shell
npm install tailwind-merge clsx react-hook-form react-quill date-fns react-datepicker react-quill-new
```

2. 기본 코드 예시

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
    </form>
  );
}
```

## 🔍 Playground 페이지

> /modules/react-hook-form

## 📝 참고 사항

### 지원되는 타입

- Text

  - 기본 텍스트 입력
  - 숫자 입력(Number)
  - 비밀번호 입력(Password)
  - 텍스트 영역(Textarea)

- Date

  - 단일 날짜 선택
  - 날짜 범위 선택(Date Range)

- Editor

  - Rich Text 기반 에디터(HTML 출력)
  - 기본적인 문단/리스트/굵기/링크 등 서식 지원

- Files

  - 단일 파일 업로드
  - 다중 파일 업로드
  - 파일명/용량 검증 가능

- Multi Checkbox

  - 여러 옵션을 체크하여 배열 형태로 값 반환

- Radio Group Checkbox

  - 여러 옵션 중 단일 선택
  - 시각적으로 체크박스 형태를 활용하는 타입

- Select

  - 드롭다운으로 옵션 선택
  - 단일 선택·다중 선택 모두 지원 가능

- Single Checkbox

  - true/false를 선택하는 기본 체크박스

- Tag

  - 사용자가 임의의 텍스트를 입력해 키워드를 추가/삭제할 수 있는 입력 타입 (태그 리스트 형태로 값 관리)

- Toggle
  - 스위치 형태의 on/off 입력 방식
  - boolean 값 처리

### 활용법

사용하고자 하는 Input 참조 후, 마우스 가져다 대서 하는 방법 소개

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

![자동완성 예시](/public/images/react-hook-form-exam01.png)

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

### 공통 레이아웃 수정

Label, Input들의 공통 레이아웃인 InputLayout컴포넌트를 수정하여 공통 레이아웃을 구성한다.

```tsx
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
            className={`
              mt-1 text-xs text-red-500
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

## 🚀 로컬 실행 방법

```
npm install
npm run dev
```

---

실행 후 아래 주소로 접근해 모듈별 데모를 확인할 수 있습니다.

http://localhost:3000/
