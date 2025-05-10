"use client";

import { Box, Heading, Image } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Article } from "@/types/article";
import { useArticleStore } from "@/store/articleStore";
import { useState } from "react";

interface DraggableArticleCardProps {
  article: Article;
}

const MotionBox = motion(Box);

const DraggableArticleCard = ({ article }: DraggableArticleCardProps) => {
  const { id, title, imageUrl } = article;
  const setSelectedArticle = useArticleStore((state) => state.setSelectedArticle);
  const isArticleInShelf = useArticleStore((state) => state.isArticleInShelf);
  
  // 设置可拖动属性，禁用激活器以便我们可以手动控制
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `article-${id}`,
    data: {
      type: 'article',
      article
    }
  });

  // 设置拖动样式
  const style = {
    transform: CSS.Translate.toString(transform),
    transition: isDragging ? undefined : 'transform 0.3s ease, opacity 0.3s ease',
    zIndex: isDragging ? 100 : 1,
    opacity: isDragging ? 0.3 : 1, // 拖动时原位置变透明
    cursor: isDragging ? 'grabbing' : 'pointer',
  };

  return (
    <Box position="relative">
      {/* 拖动句柄 - 只在卡片顶部区域可拖动 */}
      <Box 
        ref={setNodeRef}
        position="absolute"
        top={0}
        left={0}
        right={0}
        height="30px"
        zIndex={3}
        cursor="grab"
        {...attributes}
        {...listeners}
      />
      
      {/* 卡片内容 - 点击时展开全文 */}
      <MotionBox
        style={style}
        bg="white"
        borderRadius="lg"
        overflow="hidden"
        boxShadow="md"
        onClick={() => setSelectedArticle(article)}
        whileHover={{ y: -5, boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.1)" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          scale: isDragging ? 0.95 : 1 // 拖动时稍微缩小
        }}
        transition={{ 
          duration: 0.3,
          type: "spring",
          stiffness: 500,
          damping: 30
        }}
        position="relative"
      >
        {isArticleInShelf(id) && (
          <Box 
            position="absolute" 
            top="10px" 
            right="10px" 
            bg="green.500" 
            color="white" 
            borderRadius="full" 
            w="20px" 
            h="20px" 
            display="flex" 
            alignItems="center" 
            justifyContent="center"
            fontSize="xs"
            zIndex={2}
          >
            ✓
          </Box>
        )}
        
        {/* 拖动指示器 */}
        <Box 
          position="absolute" 
          top="10px" 
          left="10px" 
          bg="gray.100" 
          borderRadius="md" 
          p={1}
          opacity={0.7}
          zIndex={2}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box as="span" fontSize="xs">拖动此处</Box>
        </Box>
        
        <Image 
          src={imageUrl} 
          alt={title}
          w="100%"
          h="200px"
          objectFit="cover"
        />
        <Box p={4}>
          <Heading size="md" mb={2}>
            {title}
          </Heading>
        </Box>
      </MotionBox>
    </Box>
  );
};

export default DraggableArticleCard; 