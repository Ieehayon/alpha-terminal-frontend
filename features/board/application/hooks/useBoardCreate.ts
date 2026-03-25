"use client"

import { useState } from "react"
import { ApiError } from "@/infrastructure/http/apiError"
import { createBoardPost } from "../../infrastructure/api/boardApi"

interface FormState {
    title: string
    content: string
}

export function useBoardCreate() {
    const [form, setForm] = useState<FormState>({ title: "", content: "" })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const setField = (field: keyof FormState, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }))
    }

    const submit = async (): Promise<boolean> => {
        if (!form.title.trim() || !form.content.trim()) {
            setError("제목과 본문을 모두 입력해주세요.")
            return false
        }
        setIsSubmitting(true)
        setError(null)
        try {
            await createBoardPost(form.title.trim(), form.content.trim())
            return true
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message || "게시물 작성에 실패했습니다.")
            } else {
                setError("게시물 작성에 실패했습니다.")
            }
            return false
        } finally {
            setIsSubmitting(false)
        }
    }

    return { form, setField, isSubmitting, error, submit }
}
