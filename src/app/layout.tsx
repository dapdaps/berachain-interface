"use client";

import { RPC_API_KEYS } from "@/components/constants";
import Rpc from "@/components/rpc";
import TapSound from "@/components/tap-sound";
import { TooltipProvider } from "@/components/ui/tooltip";
import SceneContextProvider from "@/context/scene";
import WagmiProvider from "@/context/wagmi";
import useIsMobile from "@/hooks/use-isMobile";
import MainLayout from "@/layouts/main";
import MobileLayout from "@/layouts/mobile";
import { RoycoProvider } from "@/sdk";
import { useTapSoundStore } from "@/stores/tap-sound";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import Script from 'next/script';
import React, { Suspense, useEffect, useRef } from "react";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

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
        originUrl={process.env.NEXT_PUBLIC_ROYCO_ORIGIN_URL!}
        originKey={process.env.NEXT_PUBLIC_ROYCO_ORIGIN_KEY!}
        originId={process.env.NEXT_PUBLIC_ROYCO_ORIGIN_ID!}
        rpcApiKeys={RPC_API_KEYS}
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
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-SZ82B6ZN43"></Script>
      <Script id="ga-config">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-SZ82B6ZN43');`}
      </Script>
    </html>
  );
}
