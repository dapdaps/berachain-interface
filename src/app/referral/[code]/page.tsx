'use client'

import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Referral() {
    const { code } = useParams()
    const router = useRouter()
    useEffect(() => {
        if (code) {
            window.localStorage.setItem('referral_code', code as string)
            setTimeout(() => {
                router.push('/')
            }, 1000)
        }
    }, [])
    return null
}