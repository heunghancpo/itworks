// src/app/layout.tsx
'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AppSidebar } from "@/components/app-sidebar";
import { CommandPalette } from "@/components/command-palette";
import { usePathname } from "next/navigation";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

// 👇 메타데이터 추가
export const metadata: Metadata = {
  title: "이게 되네 (ItWorks)",
  description: "아이디어를 현실로 만드는 곳",
  openGraph: {
    title: "이게 되네 (ItWorks)",
    description: "아이디어를 현실로 만드는 곳",
    url: "https://itworks-7c742.web.app", // 실제 배포 URL
    siteName: "ItWorks",
    images: [
      {
        url: "/og-image.png", // public 폴더에 이미지를 넣어주세요
        width: 1200,
        height: 630,
        alt: "ItWorks Dashboard Preview",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "이게 되네 (ItWorks)",
    description: "아이디어를 현실로 만드는 팀 프로젝트 관리 시스템",
    images: ["/og-image.png"], // 동일한 이미지 사용
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // 사이드바가 보이지 않아야 할 페이지들
  const isPublicPage = ['/login', '/', '/about', '/team'].includes(pathname);

  return (
    <html lang="ko">
      <body className={`${inter.className} overflow-x-hidden`}>
        <div className="flex min-h-screen bg-slate-50 overflow-x-hidden">
          {/* 사이드바 (조건부 렌더링은 내부에서 처리됨) */}
          <AppSidebar />
          
          {/* 메인 컨텐츠 영역 */}
          <main className={`flex-1 min-w-0 transition-all duration-300 overflow-x-hidden ${!isPublicPage ? 'pt-14 lg:pt-0 lg:ml-64' : ''}`}>
            {children}
          </main>
        </div>
        {!isPublicPage && <CommandPalette />}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}