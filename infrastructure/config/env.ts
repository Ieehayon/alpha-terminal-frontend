const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`[env] 필수 환경 변수가 누락되었습니다: ${key}`);
  }
  return value;
};

export const clientEnv = {
  apiBaseUrl: requireEnv("NEXT_PUBLIC_API_BASE_URL"),
  googleLoginPath: requireEnv("NEXT_PUBLIC_GOOGLE_LOGIN_PATH"),
  kakaoLoginPath: requireEnv("NEXT_PUBLIC_KAKAO_LOGIN_PATH"),
} as const;
