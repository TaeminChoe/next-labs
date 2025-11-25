export const formatBusinessNumber = (value: string, prevValue: string) => {
  const digits = value.replace(/\D/g, "");

  // 숫자 외 입력 시 무시 (이전 값 유지)
  if (!/^\d*$/.test(digits)) {
    return undefined;
  }

  if (digits.length <= 3) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5, 10)}`;
};

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
