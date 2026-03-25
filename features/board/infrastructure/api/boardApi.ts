import { httpClient } from "@/infrastructure/http/httpClient"
import type { BoardPost, BoardListResponse } from "../../domain/model/boardPost"

export async function fetchBoardList(page = 1, size = 10): Promise<BoardListResponse> {
    const res = await httpClient.get(`/board/list?page=${page}&size=${size}`)
    return res.json()
}

export async function createBoardPost(title: string, content: string): Promise<BoardListItem> {
    const res = await httpClient.post("/board", { title, content })
    return res.json()
}
