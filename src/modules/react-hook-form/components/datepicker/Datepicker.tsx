import { ko } from "date-fns/locale";
import DatePicker, { DatePickerProps } from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import "../../styles/react-datepicker.css";

export default function Datepicker(props: DatePickerProps) {
  return (
    <DatePicker
      {...props}
      dateFormat="yyyy-MM-dd" // 날짜 형태
      shouldCloseOnSelect // 날짜를 선택하면 datepicker가 자동으로 닫힘
      locale={ko}
    />
  );
}
