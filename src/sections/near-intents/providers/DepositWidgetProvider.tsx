import type { ReactNode } from "react"
import { ModalStoreProvider } from "./ModalStoreProvider"
import { QueryClientProvider } from "./QueryClientProvider"
import { TokensStoreProvider } from "./TokensStoreProvider"

export const DepositWidgetProvider = ({
  children,
}: { children: ReactNode }) => {
  return (
    <QueryClientProvider>
          {children}
    </QueryClientProvider>
  )
}
