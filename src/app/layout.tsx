'use client';

import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-loading-skeleton/dist/skeleton.css';
import MainLayout from '@/layouts/main';
import WagmiProvider from '@/context/wagmi';
import { ToastContainer } from 'react-toastify';
import { Suspense } from 'react';
import { SkeletonTheme } from 'react-loading-skeleton';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import useIsMobile from '@/hooks/use-isMobile';
import MobileLayout from '@/layouts/mobile';

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isMobile = useIsMobile();

  return (
    <html lang='en' className="md:overflow-hidden">
      <head>
        <title>BeraTown</title>
        <meta
          name='description'
          content='Effortlessly explore & dive into all dApps in the Bera ecosystem from one streamlined hub.'
        />
        <link rel="icon" href="/images/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/images/favicon.ico" />
      </head>
      <body className="md:overflow-hidden">
        <WagmiProvider>
          <SkeletonTheme baseColor='#7990F4' highlightColor='#FFDC50'>
            <Suspense>
              {isMobile ? (
                <MobileLayout>{children}</MobileLayout>
              ) : (
                <MainLayout>{children}</MainLayout>
              )}
            </Suspense>
          </SkeletonTheme>
        </WagmiProvider>
        <ToastContainer
          position='top-right'
          autoClose={5000}
          hideProgressBar={true}
          theme='light'
          toastStyle={{ backgroundColor: 'transparent', boxShadow: 'none' }}
          newestOnTop
          rtl={false}
          pauseOnFocusLoss
          closeButton={false}
        />
        <ProgressBar
          height='4px'
          color='#ffdc50'
          options={{ showSpinner: false }}
          shallowRouting
        />
      </body>
    </html>
  );
}
