import { ReactNode } from "react";
import {
  Path,
  FieldValues,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";

export interface Option {
  label: string;
  value: string;
}

export interface InputProps<T extends FieldValues> {
  label?: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  placeholder?: string;
  validationRules?: RegisterOptions<T>;
  error?: string;
  description?: string | ReactNode;
  wrapperClassName?: string;
  labelClassName?: string;
  inputLayoutClassName?: string;
}

export interface DateRangeValue {
  startDate: string;
  endDate: string;
}

export type FileInputValue = File | File[] | null;
