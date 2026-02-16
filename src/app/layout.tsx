import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { LayoutShell } from '@/components/layout-shell';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ItWorks — 이게 되네',
  description: '아이디어가 현실이 되는 곳',
  keywords: ['프로젝트 관리', '아이디어 보드', '스타트업', '생산성', 'ItWorks'],
  authors: [{ name: 'ItWorks Team' }],
  openGraph: {
    title: 'ItWorks — 이게 되네',
    description: '아이디어가 현실이 되는 곳',
    siteName: 'ItWorks',
    type: 'website',
    locale: 'ko_KR',
    url: 'https://itworks-7c742.web.app',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ItWorks — 이게 되네',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ItWorks — 이게 되네',
    description: '아이디어가 현실이 되는 곳',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={`${inter.className} overflow-x-hidden`}>
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
