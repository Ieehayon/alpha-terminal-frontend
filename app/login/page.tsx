"use client";

import { clientEnv } from "@/infrastructure/config/env";
import KakaoLoginButton from "@/components/KakaoLoginButton";

export default function LoginPage() {
  const kakaoHref = clientEnv.apiBaseUrl + clientEnv.kakaoLoginPath;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-8 flex flex-col items-center gap-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Alpha Desk</h1>
          <p className="mt-1 text-sm text-gray-500">로그인하여 서비스를 이용하세요</p>
        </div>

        <div className="w-full flex flex-col gap-3">
          <KakaoLoginButton href={kakaoHref} />
          {/* 추후 Google, Naver, Meta 버튼 추가 */}
        </div>
      </div>
    </div>
  );
}
