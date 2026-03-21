import { httpClient } from "@/infrastructure/http/httpClient";

export interface MeResponse {
  /** true면 임시 토큰 보유 → 약관 동의 필요 */
  isTemporary: boolean;
  email: string;
  nickname?: string;
}

export async function fetchMe(): Promise<MeResponse> {
  const res = await httpClient.get("/authentication/me");

  if (!res.ok) {
    throw new Error(`[authApi] /authentication/me 요청 실패: ${res.status}`);
  }

  return res.json() as Promise<MeResponse>;
}
