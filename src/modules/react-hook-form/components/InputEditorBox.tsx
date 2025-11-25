"use client";
import { useEffect } from "react";
import { FieldValues, UseFormWatch } from "react-hook-form";
import dynamic from "next/dynamic";

// import ReactQuill from "react-quill-new";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "quill/dist/quill.snow.css"; // 기본 테마 스타일
import "../styles/react-quill.css";

import { InputProps } from "../types";
import InputLayout from "./InputLayout";

interface Props<T extends FieldValues> extends InputProps<T> {
  setValue: (name: keyof T, value: any) => void;
  trigger: (name: keyof T) => Promise<boolean>;
  watch: UseFormWatch<T>;
  wrapperClassName?: string;
  labelClassName?: string;
}

export default function InputEditorBox<T extends FieldValues>({
  label,
  name,
  description,
  watch,
  register,
  validationRules,
  setValue,
  trigger,
  wrapperClassName,
  labelClassName,
  error,
}: Props<T>) {
  const handleOnChange = (value: string) => {
    setValue(name, value === "<p><br</p>" ? "" : value);
    trigger(name);
  };

  useEffect(() => {
    register(name, validationRules);
  }, [register]);

  return (
    <InputLayout
      label={label}
      description={description}
      error={error}
      labelClassName={labelClassName}
      wrapperClassName={wrapperClassName}
    >
      <div className="w-full min-h-[30vh]">
        <ReactQuill
          value={watch(name)}
          onChange={handleOnChange}
          className="react-quill"
        />
      </div>
    </InputLayout>
  );
}
