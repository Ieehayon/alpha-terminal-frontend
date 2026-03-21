"use client";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900">서비스 이용약관 동의</h1>
          <p className="mt-1 text-sm text-gray-500">
            서비스 이용을 위해 아래 약관에 동의해 주세요
          </p>
        </div>

        {/* 약관 동의 UI — 추후 구현 */}
        <div className="rounded-lg border border-gray-200 p-4 text-sm text-gray-600 h-40 overflow-y-auto">
          <p>약관 내용이 여기에 표시됩니다.</p>
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            className="w-full py-3 rounded-lg bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition-colors"
          >
            동의하고 시작하기
          </button>
          <a
            href="/login"
            className="text-center text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            취소
          </a>
        </div>
      </div>
    </div>
  );
}
