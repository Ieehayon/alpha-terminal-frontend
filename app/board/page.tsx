"use client"

import Link from "next/link"
import { useBoardList } from "@/features/board/application/hooks/useBoardList"

export default function BoardPage() {
    const { items, page, totalPages, isLoading, error, goToPage } = useBoardList()

    return (
        <main className="min-h-screen bg-background text-foreground p-6 md:p-10">
            <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold">게시판</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        종목 분석·시황 관련 게시물을 공유합니다.
                    </p>
                </div>
                <Link
                    href="/board/create"
                    className="inline-flex items-center gap-2 self-start rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 sm:self-auto"
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    게시물 작성
                </Link>
            </header>

            <section aria-label="게시물 목록">
                {isLoading ? (
                    <div className="flex flex-col gap-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-16 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
                        ))}
                    </div>
                ) : error ? (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
                        {error}
                    </div>
                ) : items.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-gray-300 py-16 text-center dark:border-gray-600">
                        <p className="text-sm text-gray-500 dark:text-gray-400">아직 게시물이 없습니다.</p>
                        <Link
                            href="/board/create"
                            className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                        >
                            첫 게시물 작성하기
                        </Link>
                    </div>
                ) : (
                    <>
                        <ul className="flex flex-col divide-y divide-gray-200 rounded-lg border border-gray-200 dark:divide-gray-700 dark:border-gray-700">
                            {items.map((post) => (
                                <li key={post.board_id}>
                                    <Link
                                        href={`/board/read/${post.board_id}`}
                                        className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                    >
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                                                {post.title}
                                            </p>
                                            <p className="mt-0.5 text-xs text-gray-400">
                                                {post.nickname} · {new Date(post.created_at).toLocaleDateString("ko-KR")}
                                            </p>
                                        </div>
                                        <svg className="ml-3 h-4 w-4 shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {totalPages > 1 && (
                            <div className="mt-6 flex justify-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => goToPage(page - 1)}
                                    disabled={page <= 1}
                                    className="rounded border border-gray-300 px-3 py-1 text-sm disabled:opacity-40 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
                                >
                                    이전
                                </button>
                                <span className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400">
                                    {page} / {totalPages}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => goToPage(page + 1)}
                                    disabled={page >= totalPages}
                                    className="rounded border border-gray-300 px-3 py-1 text-sm disabled:opacity-40 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
                                >
                                    다음
                                </button>
                            </div>
                        )}
                    </>
                )}
            </section>
        </main>
    )
}
