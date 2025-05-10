"use client";

import { ChakraProvider, extendTheme, ColorModeScript } from "@chakra-ui/react";
import { useEffect } from "react";
import Script from "next/script";

// 扩展主题
const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "black",
        color: "white",
      },
    },
  },
  fonts: {
    heading: `"PingFang SC", "Microsoft YaHei", "Hiragino Sans GB", "WenQuanYi Micro Hei", sans-serif`,
    body: `"PingFang SC", "Microsoft YaHei", "Hiragino Sans GB", "WenQuanYi Micro Hei", sans-serif`,
  },
  colors: {
    brand: {
      50: "#e3f2fd",
      100: "#bbdefb",
      200: "#90caf9",
      300: "#64b5f6",
      400: "#42a5f5",
      500: "#2196f3",
      600: "#1e88e5",
      700: "#1976d2",
      800: "#1565c0",
      900: "#0d47a1",
    },
    sidebar: {
      bg: "#121212",
      hover: "#1a1a1a",
      active: "#252525",
    },
    card: {
      bg: "#1a1a1a",
      hover: "#252525",
    }
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "normal",
      },
      variants: {
        solid: {
          bg: "brand.500",
          color: "white",
          _hover: {
            bg: "brand.600",
          },
        },
        ghost: {
          color: "white",
          _hover: {
            bg: "whiteAlpha.200",
          },
        },
      },
    },
    Input: {
      variants: {
        outline: {
          field: {
            borderColor: "whiteAlpha.300",
            bg: "whiteAlpha.50",
            color: "white",
            _hover: {
              borderColor: "whiteAlpha.400",
            },
            _focus: {
              borderColor: "brand.500",
              boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
            },
          },
        },
      },
    },
  },
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
    cssVarPrefix: "kfc",
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  // 移除水合不匹配的属性
  useEffect(() => {
    // 确保移除所有可能导致水合错误的属性
    const elementsToFix = [document.documentElement, document.body];
    
    elementsToFix.forEach(el => {
      if (el) {
        // 移除可能导致水合错误的属性
        ['data-theme', 'data-chakra-ui'].forEach(attr => {
          if (el.hasAttribute(attr)) {
            el.removeAttribute(attr);
          }
        });
        
        // 移除内联样式中的 CSS 变量
        if (el.style && el.style.cssText) {
          const styleText = el.style.cssText;
          if (styleText.includes('--chakra')) {
            el.style.cssText = '';
          }
        }
      }
    });
    
    // 移除 Chakra 添加的样式标签
    const styleElements = document.head.querySelectorAll('style[data-emotion="css"]');
    styleElements.forEach(el => {
      const content = el.textContent || '';
      if (content.includes('--chakra') && document.querySelectorAll('style[data-emotion="css"]').length > 1) {
        el.remove();
      }
    });
  }, []);

  return (
    <>
      <Script
        id="chakra-hydration-fix"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                // 移除可能导致水合错误的属性
                const elementsToFix = [document.documentElement, document.body];
                elementsToFix.forEach(el => {
                  if (el) {
                    ['data-theme', 'data-chakra-ui'].forEach(attr => {
                      if (el.hasAttribute(attr)) {
                        el.removeAttribute(attr);
                      }
                    });
                    
                    // 清除内联样式
                    if (el.style && el.style.cssText.includes('--chakra')) {
                      el.style.cssText = '';
                    }
                  }
                });
              } catch (e) {
                console.error('Hydration fix script error:', e);
              }
            })();
          `,
        }}
      />
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme} resetCSS={true} disableGlobalStyle={false}>
        {children}
      </ChakraProvider>
    </>
  );
} 