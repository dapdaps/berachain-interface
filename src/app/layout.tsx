'use client';

import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-loading-skeleton/dist/skeleton.css';
import MainLayout from '@/layouts/main';
import WagmiProvider from '@/context/wagmi';
import { ToastContainer } from 'react-toastify';

import { SkeletonTheme } from 'react-loading-skeleton';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

let className = ''

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang='en'>
      <head>
        <title>Berachain</title>
        <meta name="description" content="berachain-interface" />
      </head>
      <body>
        <WagmiProvider>
          <SkeletonTheme baseColor="#7990F4" highlightColor="#FFDC50">
            <MainLayout className={className}>{children}</MainLayout>
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
          height="4px"
          color="#ffdc50"
          options={{ showSpinner: false }}
          shallowRouting
        />
      </body>
    </html>
  );
}
