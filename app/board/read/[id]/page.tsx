"use client"

import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useBoardRead } from "@/features/board/application/hooks/useBoardRead"
import { useAtomValue } from "jotai"
import { authStateAtom } from "@/features/auth/application/atoms/authAtom"

export default function BoardReadPage() {
    const params = useParams()
    const router = useRouter()
    const boardId = Number(params.id)
    const authState = useAtomValue(authStateAtom)
    const isAuthenticated = authState.status === "AUTHENTICATED"
    const currentNickname = authState.status === "AUTHENTICATED" ? authState.user.nickname : null

    const { post, isLoading, error, isDeleting, deletePost } = useBoardRead(boardId)

    const handleDelete = async () => {
        if (!confirm("게시물을 삭제하시겠습니까?")) return
        const ok = await deletePost()
        if (ok) router.push("/board")
    }

    if (isLoading) {
        return (
            <main className="min-h-screen bg-background text-foreground p-6 md:p-10 max-w-3xl mx-auto">
                <div className="h-8 w-48 rounded bg-gray-200 dark:bg-gray-700 animate-pulse mb-4" />
                <div className="h-4 w-32 rounded bg-gray-100 dark:bg-gray-800 animate-pulse mb-8" />
                <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-4 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" />
                    ))}
                </div>
            </main>
        )
    }

    if (error || !post) {
        return (
            <main className="min-h-screen bg-background text-foreground p-6 md:p-10 max-w-3xl mx-auto">
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300 mb-6">
                    {error ?? "게시물을 찾을 수 없습니다."}
                </div>
                <Link
                    href="/board"
                    className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                >
                    ← 게시판으로 돌아가기
                </Link>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-background text-foreground p-6 md:p-10 max-w-3xl mx-auto">
            <article>
                <header className="mb-6 border-b border-gray-200 pb-4 dark:border-gray-700">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 break-keep">
                        {post.title}
                    </h1>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                        <span>{post.nickname}</span>
                        <span>·</span>
                        <time dateTime={post.created_at}>
                            {new Date(post.created_at).toLocaleString("ko-KR", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </time>
                        {post.updated_at && post.updated_at !== post.created_at && (
                            <>
                                <span>·</span>
                                <span className="text-xs">
                                    수정됨{" "}
                                    {new Date(post.updated_at).toLocaleString("ko-KR", {
                                        month: "long",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </span>
                            </>
                        )}
                    </div>
                </header>

                <div className="prose prose-sm max-w-none text-gray-800 dark:text-gray-200 leading-7 whitespace-pre-wrap">
                    {post.content}
                </div>
            </article>

            <footer className="mt-10 flex flex-wrap items-center gap-3 border-t border-gray-200 pt-6 dark:border-gray-700">
                <Link
                    href="/board"
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                    목록으로
                </Link>

                {isAuthenticated && currentNickname === post.nickname && (
                    <>
                        <Link
                            href={`/board/edit/${post.board_id}`}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                            수정
                        </Link>
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950"
                        >
                            {isDeleting ? "삭제 중..." : "삭제"}
                        </button>
                    </>
                )}
            </footer>
        </main>
    )
}
