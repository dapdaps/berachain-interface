import type { Metadata } from 'next';
import './globals.css';
import MainLayout from '@/layouts/main';
import WagmiProvider from '@/context/wagmi';

export const metadata: Metadata = {
  title: 'Berachain',
  description: 'berachain-interface',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
      <WagmiProvider>
        <MainLayout>
          {children}
        </MainLayout>
      </WagmiProvider>
      </body>
    </html>
  );
}
