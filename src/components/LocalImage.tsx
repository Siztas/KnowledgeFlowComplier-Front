"use client";

import { Image, ImageProps } from "@chakra-ui/react";
import { localImageService } from "@/services/localImageService";

interface LocalImageProps extends Omit<ImageProps, 'src'> {
  src?: string;
  alt: string;
}

/**
 * 本地图片组件
 * 用于处理本地和远程图片路径
 */
export const LocalImage: React.FC<LocalImageProps> = ({ src, alt, ...props }) => {
  // 处理图片URL
  const imageUrl = localImageService.getImageUrl(src);
  const fallbackUrl = localImageService.getFallbackUrl();
  
  return (
    <Image
      src={imageUrl}
      alt={alt}
      fallbackSrc={fallbackUrl}
      {...props}
    />
  );
};

export default LocalImage; 