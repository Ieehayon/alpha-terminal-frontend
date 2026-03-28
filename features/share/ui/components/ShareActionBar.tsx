"use client"

import { useState } from "react"
import type { ShareCardPayload } from "../../domain/model/sharedCard"
import { useCardActions } from "../../application/hooks/useCardActions"
import { shareCard } from "../../infrastructure/api/shareApi"
import { CommentModal } from "./CommentModal"
import { SNSShareModal } from "./SNSShareModal"

interface Props {
    cardId?: number           // 이미 공유된 카드 ID (홈 피드 등)
    sharePayload?: ShareCardPayload  // 공유할 데이터 (대시보드 카드)
    initialLikeCount?: number
    initialCommentCount?: number
    isLoggedIn?: boolean
}

export function ShareActionBar({
    cardId: initialCardId,
    sharePayload,
    initialLikeCount = 0,
    initialCommentCount = 0,
    isLoggedIn = false,
}: Props) {
    const [cardId, setCardId] = useState<number | undefined>(initialCardId)
    const [sharing, setSharing] = useState(false)
    const [shareError, setShareError] = useState<string | null>(null)
    const [commentOpen, setCommentOpen] = useState(false)
    const [shareModalOpen, setShareModalOpen] = useState(false)

    const {
        likeCount,
        liked,
        handleLike,
        comments,
        commentCount,
        commentLoading,
        loadComments,
        handleAddComment,
    } = useCardActions(cardId ?? -1, initialLikeCount)

    const handleShare = async () => {
        if (!isLoggedIn) {
            alert("로그인 후 공유할 수 있습니다.")
            return
        }
        if (cardId) {
            setShareModalOpen(true)
            return
        }
        if (!sharePayload) return
        setSharing(true)
        setShareError(null)
        try {
            const shared = await shareCard(sharePayload)
            setCardId(shared.id)
            setShareModalOpen(true)
        } catch (e) {
            setShareError(e instanceof Error ? e.message : "공유 실패")
        } finally {
            setSharing(false)
        }
    }

    return (
        <>
            <div className="flex items-center gap-4 border-t border-outline pt-3 mt-1">
                {/* 좋아요 */}
                <button
                    onClick={() => cardId && handleLike()}
                    disabled={!cardId}
                    className={`flex items-center gap-1.5 text-sm transition ${
                        liked
                            ? "text-red-400"
                            : "text-gray-400 hover:text-red-400"
                    } disabled:opacity-40`}
                    aria-label="좋아요"
                >
                    <span className="text-base">{liked ? "❤️" : "🤍"}</span>
                    <span>{likeCount}</span>
                </button>

                {/* 댓글 */}
                <button
                    onClick={() => {
                        if (!cardId) return
                        setCommentOpen(true)
                    }}
                    disabled={!cardId}
                    className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-blue-400 transition disabled:opacity-40"
                    aria-label="댓글"
                >
                    <span className="text-base">💬</span>
                    <span>{cardId ? commentCount : initialCommentCount}</span>
                </button>

                {/* 공유 */}
                <button
                    onClick={handleShare}
                    disabled={sharing}
                    className="ml-auto flex items-center gap-1.5 text-sm text-gray-400 hover:text-green-400 transition disabled:opacity-40"
                    aria-label="공유"
                >
                    <span className="text-base">↗️</span>
                    <span>{sharing ? "공유 중..." : cardId ? "공유됨" : "공유하기"}</span>
                </button>
            </div>

            {shareError && (
                <p className="mt-1 text-xs text-red-400">{shareError}</p>
            )}

            {commentOpen && cardId && (
                <CommentModal
                    cardId={cardId}
                    open={commentOpen}
                    comments={comments}
                    loading={commentLoading}
                    onOpen={loadComments}
                    onClose={() => setCommentOpen(false)}
                    onSubmit={handleAddComment}
                />
            )}

            {shareModalOpen && cardId && sharePayload && (
                <SNSShareModal
                    open={shareModalOpen}
                    onClose={() => setShareModalOpen(false)}
                    cardId={cardId}
                    symbol={sharePayload.symbol}
                    name={sharePayload.name}
                    summary={sharePayload.summary}
                />
            )}
        </>
    )
}
