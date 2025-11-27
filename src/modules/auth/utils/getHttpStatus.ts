import axios from "axios";

export function getHttpStatus(error: unknown): number | null {
  // axios 에러
  if (axios.isAxiosError(error)) {
    return error.response?.status ?? null;
  }

  // fetch 사용 시 Response 객체 직접 던지는 경우
  if (error instanceof Response) {
    return error.status;
  }

  // 기타 커스텀 에러 구조에서 status 필드만 있는 경우
  if (typeof error === "object" && error !== null) {
    const anyError = error as { status?: number };
    if (typeof anyError.status === "number") {
      return anyError.status;
    }
  }

  return null;
}
