"use client";

import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { authAtom } from "@/store/authAtom";
import { fetchMe } from "@/infrastructure/api/authApi";

/**
 * 앱 초기화 시 /authentication/me를 호출해 쿠키 기반 세션을 복원한다.
 * 페이지 새로고침해도 로그인 상태가 유지된다.
 */
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const setAuth = useSetAtom(authAtom);

  useEffect(() => {
    fetchMe()
      .then((me) => {
        if (me.is_registered) {
          setAuth("AUTHENTICATED");
        }
      })
      .catch(() => {
        // 세션 없음 — 로그인 상태 그대로 UNAUTHENTICATED 유지
      });
  }, [setAuth]);

  return <>{children}</>;
}
