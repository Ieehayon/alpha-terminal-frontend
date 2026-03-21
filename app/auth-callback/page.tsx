"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchMe } from "@/infrastructure/api/authApi";

type Status = "loading" | "error";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    fetchMe()
      .then((me) => {
        if (me.isTemporary) {
          // 임시 토큰 → 약관 동의 필요 (5분 유효)
          router.replace("/terms");
        } else {
          // 정식 토큰 → 기존 사용자, 대시보드로 이동
          router.replace("/dashboard");
        }
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : "알 수 없는 오류";
        setErrorMessage(message);
        setStatus("error");
      });
  }, [router]);

  if (status === "error") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-500 font-medium">로그인 처리 중 오류가 발생했습니다.</p>
        <p className="text-sm text-gray-400">{errorMessage}</p>
        <a href="/login" className="text-blue-600 underline text-sm">
          로그인 페이지로 돌아가기
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-gray-500">로그인 처리 중입니다...</p>
    </div>
  );
}
