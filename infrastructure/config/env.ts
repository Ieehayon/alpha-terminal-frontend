/**
 * 환경 변수 중앙 관리 모듈
 *
 * 규칙:
 * - NEXT_PUBLIC_ 접두사: 클라이언트(브라우저)에서 접근 가능
 * - 접두사 없음: 서버 전용 (빌드 타임 또는 서버 컴포넌트에서만 접근)
 *
 * 사용법: process.env.xxx 직접 참조 금지 — 이 모듈을 통해서만 접근
 */

// ─── 필수 환경 변수 목록 ───────────────────────────────────────────────────────

const REQUIRED_ENV_VARS = [
  "NEXT_PUBLIC_API_BASE_URL",
  "NEXT_PUBLIC_KAKAO_LOGIN_PATH",
] as const;

// ─── 누락 변수 일괄 검증 ──────────────────────────────────────────────────────

function validateEnv(): void {
  const missing = REQUIRED_ENV_VARS.filter(
    (key) => !process.env[key] || process.env[key]!.trim() === ""
  );

  if (missing.length > 0) {
    throw new Error(
      `[env] 필수 환경 변수가 누락되었습니다:\n` +
        missing.map((key) => `  - ${key}`).join("\n") +
        `\n.env.local 파일을 확인하거나 .env.example을 참고하세요.`
    );
  }
}

// 서버 사이드(빌드 포함)에서만 검증 실행
if (typeof window === "undefined") {
  validateEnv();
}

// ─── 클라이언트 노출 변수 (NEXT_PUBLIC_) ──────────────────────────────────────

export const clientEnv = {
  /** 백엔드 API 기본 URL (예: http://localhost:33333) */
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL!,

  /** 카카오 로그인 경로 (예: /oauth2/authorization/kakao) */
  kakaoLoginPath: process.env.NEXT_PUBLIC_KAKAO_LOGIN_PATH!,
} as const;

// ─── 서버 전용 변수 (추후 필요 시 추가) ──────────────────────────────────────

// export const serverEnv = {} as const;
