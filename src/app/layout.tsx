"use client";

import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import "react-loading-skeleton/dist/skeleton.css";
import MainLayout from "@/layouts/main";
import WagmiProvider from "@/context/wagmi";
import { ToastContainer } from "react-toastify";
import React, { Suspense, useEffect, useRef } from "react";
import { SkeletonTheme } from "react-loading-skeleton";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import useIsMobile from "@/hooks/use-isMobile";
import MobileLayout from "@/layouts/mobile";
import { useTapSoundStore } from "@/stores/tap-sound";
import TapSound from "@/components/tap-sound";
import Rpc from "@/components/rpc";
import SceneContextProvider from "@/context/scene";
import { RoycoProvider } from "@/sdk";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isMobile = useIsMobile();

  const tapRef = useRef<any>(null);
  const tapSound = useTapSoundStore();

  useEffect(() => {
    tapSound.set({
      play: () => {
        tapRef.current?.play?.();
      }
    });
  }, []);

  return (
    <html lang="en" className="md:overflow-hidden">
      <head>
        <title>BeraTown</title>
        <meta
          name="description"
          content="Effortlessly explore & dive into all dApps in the Bera ecosystem from one streamlined hub."
        />
        <link rel="icon" href="/images/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/images/favicon.ico" />
      </head>
      <body className="md:overflow-hidden">
        <RoycoProvider
          originUrl={process.env.NEXT_PUBLIC_SUPABASE_URL!}
          originKey={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}
          originId={process.env.NEXT_PUBLIC_ROYCO_ORIGIN_ID!}
        >
          <TooltipProvider delayDuration={0}>
            <WagmiProvider>
              <SkeletonTheme baseColor="#7990F4" highlightColor="#FFDC50">
                <SceneContextProvider>
                  <Suspense>
                    {isMobile ? (
                      <MobileLayout>{children}</MobileLayout>
                    ) : (
                      <MainLayout>{children}</MainLayout>
                    )}
                    <Rpc />
                  </Suspense>
                </SceneContextProvider>
              </SkeletonTheme>
            </WagmiProvider>
          </TooltipProvider>
        </RoycoProvider>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={true}
          toastStyle={{ backgroundColor: "transparent", boxShadow: "none" }}
          theme="light"
          newestOnTop
          rtl={false}
          pauseOnFocusLoss
          closeButton={false}
        />
        <ProgressBar
          height="4px"
          color="#ffdc50"
          options={{ showSpinner: false }}
          shallowRouting
        />
        <TapSound ref={tapRef} />
      </body>
    </html>
  );
}
