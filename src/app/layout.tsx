import type { Metadata } from 'next';
import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
import MainLayout from '@/layouts/main';
import WagmiProvider from '@/context/wagmi';
import { ToastContainer } from 'react-toastify';

export const metadata: Metadata = {
  title: 'Berachain',
  description: 'berachain-interface'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body>
        <WagmiProvider>
          <MainLayout>{children}</MainLayout>
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
      </body>
    </html>
  );
}
