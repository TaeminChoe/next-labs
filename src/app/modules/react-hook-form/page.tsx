"use client";
import { useForm } from "react-hook-form";

import {
  InputTextBox,
  InputSelectBox,
  InputMultiCheckBox,
  InputSingleCheckBox,
  InputDateBox,
  InputDateRangeBox,
  InputFileBox,
  InputRadioGroupBox,
  InputTagBox,
  InputToggleBox,
  passwordValidation,
  phoneNumberValidation,
  multiCheckBoxValidation,
  dateRangeBoxValidation,
  singleFileBoxValidation,
  tagBoxValidation,
  MultiFileBoxValidation,
  formatPhoneNumber,
} from "@/modules/react-hook-form";
import { demoPageCode } from "./codeSnippets";
import DemoLayout from "@/ui/organism/DemoLayout";

interface FormData {
  birthDate: string;
  period: string[];
  avatar: string;
  attachments: string[];
  languages: string;
  gender: string;
  country: string;
  agreePrivacy: boolean;
  keywords: string[];
  enableNotification: boolean;
  companyName: string;
  description: string;
  phoneNumber: string;
  password: string;
  passwordConfirm: string;
}

export default function DemoPage() {
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
    <DemoLayout title="react-hook-form" demoCode={demoPageCode}>
      <div className="min-w-150 space-y-5">
        {/* INPUT */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
          <InputToggleBox
            label="알림 허용"
            name="enableNotification"
            register={register}
            validationRules={{ required: "알림을 허용해주세요." }}
            value={watch("enableNotification")}
            error={errors.enableNotification?.message}
            description={`브라우저에서 알림을 수신할 수 있도록 설정합니다.\n(언제든 설정에서 변경 가능)`}
          />
          <InputTextBox
            label="기업명"
            name="companyName"
            register={register}
            validationRules={{ required: "기업명을 입력해주세요." }}
            error={errors.companyName?.message}
          />
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
          <InputTextBox
            label="연락처"
            name="phoneNumber"
            register={register}
            placeholder=""
            validationRules={phoneNumberValidation<FormData>()}
            description={"연락처는 -없이 숫자만 입력해주세요."}
            error={errors.phoneNumber?.message}
            format={formatPhoneNumber}
          />
          <InputTextBox
            label="비밀번호"
            name="password"
            type="password"
            register={register}
            validationRules={passwordValidation<FormData>()}
            placeholder="********"
            error={errors.password?.message}
          />
          <InputTextBox
            label="비밀번호 확인"
            name="passwordConfirm"
            type="password"
            register={register}
            placeholder="********"
            validationRules={{
              validate: value => {
                const password = getValues("password");
                return password === value
                  ? true
                  : "비밀번호와 일치하지 않습니다.";
              },
            }}
            error={errors.passwordConfirm?.message}
          />

          {/* 버튼 영역 */}
          <div className="w-full flex justify-center">
            <button
              type="submit"
              className={`
                px-6 py-2
                bg-blue-600 rounded-md
                text-white text-sm font-medium
                transition hover:bg-blue-700 cursor-pointer
              `}
            >
              다음
            </button>
          </div>
        </form>
      </div>
    </DemoLayout>
  );
}
