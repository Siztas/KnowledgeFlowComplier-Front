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
                // 移除可能导致水合错误的通用属性
                document.documentElement.removeAttribute('data-theme');
                document.documentElement.style = '';
                
                // 预先设置暗色主题
                document.documentElement.classList.add('dark-theme');
                document.body.classList.add('dark-theme');
                
                // 处理可能导致水合错误的输入框特定属性
                document.addEventListener('DOMContentLoaded', function() {
                  // 移除Microsoft Editor和spellcheck属性
                  setTimeout(function() {
                    const inputs = document.querySelectorAll('input');
                    inputs.forEach(function(input) {
                      if (input.hasAttribute('data-ms-editor')) {
                        input.removeAttribute('data-ms-editor');
                      }
                      if (input.hasAttribute('spellcheck')) {
                        input.removeAttribute('spellcheck');
                      }
                    });
                  }, 0);
                });
              } catch(e) {
                console.error('Hydration fix script error:', e);
              }
            })();
          `}
        </Script>
      </head>
      <body suppressHydrationWarning={true} className="dark-theme">
        <Providers>
          {children}
        </Providers>
        
        {/* 清理脚本，处理React水合完成后残留的属性 */}
        <Script id="post-hydration-cleanup" strategy="afterInteractive">
          {`
            (function() {
              try {
                // 尝试移除可能导致水合错误的特定属性
                const cleanup = function() {
                  const inputs = document.querySelectorAll('input');
                  inputs.forEach(function(input) {
                    if (input.hasAttribute('data-ms-editor')) {
                      input.removeAttribute('data-ms-editor');
                    }
                    if (input.hasAttribute('spellcheck')) {
                      input.removeAttribute('spellcheck');
                    }
                  });
                };
                
                // 立即执行一次
                cleanup();
                
                // 并在短暂延迟后再次尝试清理
                setTimeout(cleanup, 100);
              } catch(e) {
                console.error('Post-hydration cleanup error:', e);
              }
            })();
          `}
        </Script>
      </body>
    </html>
  );
}
