"use client"

import type React from "react"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"
import dynamic from "next/dynamic"
const Devtools = dynamic(
  () => import("@tanstack/react-query-devtools").then(m => m.ReactQueryDevtools),
  { ssr: false }
)

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 1,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" ? (
        <Devtools initialIsOpen={false} />
      ) : null}
    </QueryClientProvider>
  )
}
