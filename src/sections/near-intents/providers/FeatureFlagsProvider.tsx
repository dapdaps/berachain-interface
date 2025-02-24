"use client"

import { type ReactNode, createContext } from "react"

export const FeatureFlagsContext = createContext<any>({
  whitelabelTemplate: "near-intents",
})

export function FeatureFlagsProvider({
  children,
  flags,
}: { children: ReactNode; flags: any }) {
  return (
    <FeatureFlagsContext.Provider value={flags}>
      {children}
    </FeatureFlagsContext.Provider>
  )
}
