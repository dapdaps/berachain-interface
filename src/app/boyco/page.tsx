"use client";

import BoycoPage from "@/sections/boyco";
import { RoycoProvider } from "royco";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export const RPC_API_KEYS: {
  [chain_id: number]: string;
} = {
  1: "https://api.zan.top/node/v1/eth/mainnet/ff581749dd63422abccd9be5ed56f09d"
};

export default function Boyco() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 3,
            refetchOnWindowFocus: false,
            refetchIntervalInBackground: true,
            refetchOnReconnect: false,
            staleTime: 1000 * 60 * 60, // 1 hour
            gcTime: 1000 * 60 * 60 * 24 // 1 day
          }
        }
      })
  );
  return (
    <QueryClientProvider client={queryClient}>
      <RoycoProvider
        originUrl={"https://istbjtfzjcnstpzunkje-all.supabase.co"}
        originKey={
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzdGJqdGZ6amNuc3RwenVua2plIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgxODc3NDUsImV4cCI6MjA1Mzc2Mzc0NX0.p74w0fxcivBLkn_P82XlRG8upTCaKQDP69YsV7Ap5t0"
        }
        originId={"57dc9dc3-45e7-4d0c-bc97-4f33ec31c690"}
        rpcApiKeys={RPC_API_KEYS}
      >
        <BoycoPage />
      </RoycoProvider>
    </QueryClientProvider>
  );
}
