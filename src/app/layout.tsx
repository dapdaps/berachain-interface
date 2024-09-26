import type { Metadata } from 'next';
import './globals.css';
import MainLayout from '@/layouts/main';

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
        <MainLayout>
          {children}
        </MainLayout>
      </body>
    </html>
  );
}
