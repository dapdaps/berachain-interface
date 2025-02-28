"use client"

import { useSearchParams } from "next/navigation"
import { useEffect } from "react"

import { useModalStore } from "../providers/ModalStoreProvider"
import { ModalType } from "../stores/modalStore"

export const useModalSearchParams = () => {
  const { setModalType } = useModalStore((state) => state)
  const searchParams = useSearchParams()

  // biome-ignore lint/correctness/useExhaustiveDependencies: <reason>
  useEffect(() => {
    const modalType = searchParams.get("modalType") as string | null
    if (
      modalType &&
      Object.values(ModalType).includes(modalType as ModalType)
    ) {
      setModalType(modalType as ModalType)
    }
  }, [])
}
