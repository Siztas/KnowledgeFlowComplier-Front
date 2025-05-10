"use client";

import "./globals.css";
import { Providers } from "./providers";
import Script from "next/script";
import { useEffect } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 在客户端运行时移除可能导致水合错误的属性
  useEffect(() => {
    // 移除可能导致水合错误的属性
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.removeAttribute('style');
    document.body.removeAttribute('data-theme');
    
    // 移除可能导致水合错误的class
    const bodyClasses = document.body.className.split(' ');
    const filteredClasses = bodyClasses.filter(cls => !cls.includes('chakra'));
    document.body.className = filteredClasses.join(' ');
  }, []);
  
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <Script id="disable-theme-attributes" strategy="beforeInteractive">
          {`
            (function() {
              try {
                document.documentElement.removeAttribute('data-theme');
                document.documentElement.style = '';
                
                // 预先设置暗色主题
                document.documentElement.classList.add('dark-theme');
                document.body.classList.add('dark-theme');
              } catch(e) {}
            })();
          `}
        </Script>
      </head>
      <body suppressHydrationWarning={true} className="dark-theme">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
