"use client"

import type React from "react"
import { type PropsWithChildren, useEffect } from "react"

import { useCombinedHistoryCollector } from "../hooks/useHistoryCollector"

export function withHistory<T extends React.ComponentType>(
  WrappedComponent: T
): React.FC<PropsWithChildren & React.ComponentProps<T>> {
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || "Component"

  const ComponentWithHistory: React.FC<PropsWithChildren> = ({
    children,
    ...rest
  }) => {
    const { runTransactionCollector } = useCombinedHistoryCollector()

    // biome-ignore lint/correctness/useExhaustiveDependencies: <reason>
    useEffect(() => {
      void runTransactionCollector()
    }, [])

    return (
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      <WrappedComponent {...rest}>{children}</WrappedComponent>
    )
  }

  ComponentWithHistory.displayName = `WithHistory(${displayName})`

  return ComponentWithHistory as React.FC<
    PropsWithChildren & React.ComponentProps<T>
  >
}
