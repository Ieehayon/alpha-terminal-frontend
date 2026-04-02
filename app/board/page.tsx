"use client"

import Link from "next/link"
import { useAtomValue } from "jotai"
import { authAtom } from "@/store/authAtom"
import { useBoardList } from "@/features/board/application/hooks/useBoardList"

export default function BoardPage() {
    const isAuthenticated = useAtomValue(authAtom) === "AUTHENTICATED"
    const { items, page, totalPages, isLoading, error, goToPage } = useBoardList()

    return (
        <main className="max-w-5xl mx-auto p-6 pt-8 md:p-8">
            <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-outline pb-4">
                <div>
                    <div className="font-headline font-bold text-on-surface text-xl uppercase tracking-tighter">
                        BOARD
                    </div>
                    <div className="font-mono text-sm text-on-surface-variant mt-0.5">
                        종목 분석·시황 관련 게시물을 공유합니다.
                    </div>
                </div>
                {isAuthenticated && (
                    <Link
                        href="/board/create"
                        className="inline-flex items-center gap-1.5 self-start bg-primary px-4 py-2 font-mono text-[11px] text-white uppercase hover:opacity-90 sm:self-auto"
                    >
                        <span className="material-symbols-outlined text-[14px]">edit</span>
                        NEW_POST
                    </Link>
                )}
            </header>

            <section aria-label="게시물 목록">
                {isLoading ? (
                    <div className="flex flex-col gap-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-14 bg-surface-container animate-pulse" />
                        ))}
                    </div>
                ) : error ? (
                    <div className="border border-outline px-4 py-3 font-mono text-sm text-error">
                        [ERROR] {error}
                    </div>
                ) : items.length === 0 ? (
                    <div className="border border-dashed border-outline py-16 text-center">
                        <p className="font-mono text-sm text-on-surface-variant">
                            아직 게시물이 없습니다.
                        </p>
                        {isAuthenticated && (
                            <Link
                                href="/board/create"
                                className="mt-4 inline-block bg-primary px-4 py-2 font-mono text-sm text-white uppercase hover:opacity-90"
                            >
                                첫 게시물 작성하기
                            </Link>
                        )}
                    </div>
                ) : (
                    <>
                        <ul className="flex flex-col divide-y divide-outline-variant border border-outline">
                            {items.map((post) => (
                                <li key={post.board_id}>
                                    <Link
                                        href={`/board/read/${post.board_id}`}
                                        className="flex items-center justify-between px-5 py-3.5 hover:bg-surface-container transition-none"
                                    >
                                        <div className="min-w-0">
                                                            <p className="truncate font-mono text-sm font-medium text-on-surface flex items-center gap-2">
                                                {post.shared_card_id != null && post.title.startsWith("[AI") && (
                                                    <span
                                                        className="shrink-0 rounded border border-amber-600/40 px-1 py-0.5 text-[9px] uppercase text-amber-700 dark:text-amber-400"
                                                        title="AI 분석 카드 연결"
                                                    >
                                                        AI
                                                    </span>
                                                )}
                                                <span className="truncate">{post.title}</span>
                                            </p>
                                            <p className="mt-0.5 font-mono text-xs text-outline">
                                                {post.nickname} · {new Date(post.created_at).toLocaleDateString("ko-KR")}
                                            </p>
                                        </div>
                                        <span className="material-symbols-outlined ml-3 text-[16px] shrink-0 text-outline">
                                            chevron_right
                                        </span>
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
                                    className="border border-outline px-3 py-1 font-mono text-[11px] disabled:opacity-40 hover:bg-surface-container uppercase"
                                >
                                    PREV
                                </button>
                                <span className="px-3 py-1 font-mono text-[11px] text-on-surface-variant">
                                    {page} / {totalPages}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => goToPage(page + 1)}
                                    disabled={page >= totalPages}
                                    className="border border-outline px-3 py-1 font-mono text-[11px] disabled:opacity-40 hover:bg-surface-container uppercase"
                                >
                                    NEXT
                                </button>
                            </div>
                        )}
                    </>
                )}
            </section>
        </main>
    )
}
