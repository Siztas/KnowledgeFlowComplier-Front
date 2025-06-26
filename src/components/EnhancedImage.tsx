"use client";

import { Box, Image, ImageProps, Spinner, useBreakpointValue } from "@chakra-ui/react";
import { useState } from "react";
import { processImagePath } from "@/utils/imagePathProcessor";

// 图片展示模式
export type ImageDisplayMode = 'card' | 'thumbnail' | 'fullscreen' | 'detail';

interface EnhancedImageProps extends Omit<ImageProps, 'src'> {
  src?: string;
  alt: string;
  displayMode?: ImageDisplayMode;
  aspectRatio?: number;
  enableZoom?: boolean;
}

/**
 * 增强版图片组件
 * 根据不同显示模式提供最优的图片展示效果
 */
const EnhancedImage: React.FC<EnhancedImageProps> = ({
  src,
  alt,
  displayMode = 'card',
  aspectRatio,
  enableZoom = false,
  ...rest
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  
  // 根据显示模式设置不同的图片尺寸
  const sizesMap = {
    card: { width: 280, height: 280 },
    thumbnail: { width: 40, height: 40 },
    detail: { width: 800, height: 400 },
    fullscreen: { width: 1200, height: 800 }
  };
  
  // 获取当前显示模式的尺寸
  const { width, height } = sizesMap[displayMode];
  
  // 根据显示模式设置不同的objectFit
  const getObjectFit = () => {
    switch (displayMode) {
      case 'card':
        return 'cover';
      case 'thumbnail':
        return 'cover';
      case 'detail':
        return aspectRatio ? 'contain' : 'cover';
      case 'fullscreen':
        return 'contain';
      default:
        return 'cover';
    }
  };
  
  // 根据显示模式设置不同的fallbackUrl
  const getFallbackUrl = () => {
    return `https://via.placeholder.com/${width}x${height}?text=Image+Not+Available`;
  };
  
  // 处理图片路径，传入当前显示模式对应的尺寸
  const imageUrl = processImagePath(src, width, height);
  
  // 根据显示模式计算容器样式
  const containerStyles = {
    card: {
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
      bg: 'white',
    },
    thumbnail: {
      borderRadius: 'md',
      overflow: 'hidden',
      bg: 'white',
    },
    detail: {
      borderRadius: 'md',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
      bg: 'white',
    },
    fullscreen: {
      borderRadius: 'lg',
      overflow: 'hidden',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
      bg: 'white',
    }
  };
  
  // 根据屏幕大小自适应高度
  const adaptiveHeight = useBreakpointValue({
    base: displayMode === 'detail' ? '200px' : (rest.h || rest.height || height),
    md: displayMode === 'detail' ? '350px' : (rest.h || rest.height || height),
    lg: displayMode === 'detail' ? '400px' : (rest.h || rest.height || height)
  });
  
  // 缩放处理
  const handleZoomToggle = () => {
    if (enableZoom) {
      setIsZoomed(!isZoomed);
    }
  };
  
  return (
    <Box
      position="relative"
      {...containerStyles[displayMode]}
      cursor={enableZoom ? 'zoom-in' : 'default'}
      onClick={handleZoomToggle}
      transition="transform 0.3s ease"
      _hover={enableZoom ? { transform: 'scale(1.02)' } : undefined}
    >
      {/* 图片加载中显示骨架屏 */}
      {isLoading && !isError && (
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="gray.700"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex={1}
        >
          <Spinner color="whiteAlpha.800" />
        </Box>
      )}
      
      <Image
        src={imageUrl}
        alt={alt}
        objectFit={getObjectFit()}
        fallbackSrc={getFallbackUrl()}
        w="100%"
        h={adaptiveHeight}
        opacity={isLoading ? 0 : 1}
        transition="opacity 0.3s ease"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setIsError(true);
        }}
        {...rest}
      />
      
      {/* 放大查看的浮层 */}
      {isZoomed && (
        <Box
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="rgba(0, 0, 0, 0.9)"
          zIndex={1000}
          display="flex"
          alignItems="center"
          justifyContent="center"
          onClick={() => setIsZoomed(false)}
          cursor="zoom-out"
        >
          <Image
            src={processImagePath(src, 1600, 1200)}
            alt={alt}
            maxH="90vh"
            maxW="90vw"
            objectFit="contain"
            boxShadow="dark-lg"
          />
          
          <Box
            position="absolute"
            top="20px"
            right="20px"
            color="white"
            fontSize="sm"
            bg="blackAlpha.600"
            p={2}
            borderRadius="md"
          >
            点击任意位置关闭
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default EnhancedImage; 