"use client"

import { useEffect, useState } from "react"
import { ApiError } from "@/infrastructure/http/apiError"
import { fetchAnalysisLogs } from "@/features/dashboard/infrastructure/api/dashboardApi"
import { calcHomeStats } from "../../domain/selectors/homeSelectors"
import { calcTodayBriefing } from "../../domain/selectors/todayBriefingSelectors"
import type { HomeStats } from "../../domain/model/homeStats"
import type { TodayBriefing } from "../../domain/model/todayBriefing"

type HomeState =
    | { status: "LOADING" }
    | { status: "UNAUTHENTICATED" }
    | { status: "EMPTY" }
    | { status: "READY"; stats: HomeStats; briefing: TodayBriefing }
    | { status: "ERROR"; message: string }

export function useHome(): HomeState {
    const [state, setState] = useState<HomeState>({ status: "LOADING" })

    useEffect(() => {
        fetchAnalysisLogs()
            .then((logs) => {
                if (logs.length === 0) {
                    setState({ status: "EMPTY" })
                } else {
                    setState({
                        status: "READY",
                        stats: calcHomeStats(logs),
                        briefing: calcTodayBriefing(logs),
                    })
                }
            })
            .catch((err) => {
                if (err instanceof ApiError && err.status === 401) {
                    setState({ status: "UNAUTHENTICATED" })
                } else {
                    setState({ status: "ERROR", message: "데이터를 불러오지 못했습니다." })
                }
            })
    }, [])

    return state
}
