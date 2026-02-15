// src/app/layout.tsx
'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AppSidebar } from "@/components/app-sidebar";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <div className="flex min-h-screen bg-slate-50">
          {/* 사이드바 (조건부 렌더링은 내부에서 처리됨) */}
          <AppSidebar />
          
          {/* 메인 컨텐츠 영역 */}
          <main className={`flex-1 transition-all duration-300 ${!isPublicPage ? 'ml-64' : ''}`}>
            {children}
          </main>
        </div>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}