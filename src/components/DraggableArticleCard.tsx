"use client";

import { Box, Heading } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Article } from "@/types/article";
import { useArticleStore } from "@/store/articleStore";
import EnhancedImage from "./EnhancedImage";

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

  // 截取标题，显示为两行
  const truncateTitle = (str: string, maxLength: number = 50) => {
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength) + '...';
  };

  return (
    <Box position="relative" h="400px">
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
        bg="transparent"
        borderRadius="16px"
        overflow="hidden"
        boxShadow="0 8px 16px rgba(0, 0, 0, 0.4)"
        onClick={() => setSelectedArticle(article)}
        whileHover={{ 
          y: -6, 
          boxShadow: "0 15px 25px rgba(0, 0, 0, 0.5)",
          transition: { duration: 0.2 }
        }}
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
        height="100%"
        width="100%"
        display="flex"
        flexDirection="column"
        className="article-card"
      >
        {isArticleInShelf(id) && (
          <Box 
            position="absolute" 
            top="10px" 
            right="10px" 
            bg="green.500" 
            color="white" 
            borderRadius="full" 
            w="24px" 
            h="24px" 
            display="flex" 
            alignItems="center" 
            justifyContent="center"
            fontSize="sm"
            fontWeight="bold"
            zIndex={2}
            boxShadow="0 2px 5px rgba(0, 0, 0, 0.3)"
          >
            ✓
          </Box>
        )}
        
        {/* 拖动指示器 */}
        <Box 
          position="absolute" 
          top="10px" 
          left="10px" 
          bg="blackAlpha.700" 
          borderRadius="md" 
          p={1}
          opacity={0.7}
          zIndex={2}
          display="flex"
          alignItems="center"
          justifyContent="center"
          boxShadow="0 2px 5px rgba(0, 0, 0, 0.2)"
        >
          <Box as="span" fontSize="xs" color="white">拖动</Box>
        </Box>
        
        <motion.div 
          layoutId={`article-image-${id}`} 
          style={{ flex: "0 0 auto" }}
          transition={{ duration: 0.35, ease: "linear" }}
        >
          <EnhancedImage 
            src={imageUrl} 
            alt={title}
            displayMode="card"
            w="100%"
            h="280px"
            borderRadius="16px"
          />
        </motion.div>
        
        <Box 
          p={4} 
          flex="1" 
          display="flex" 
          flexDirection="column" 
          justifyContent="flex-start"
          bg="transparent"
        >
          <motion.div 
            layoutId={`article-title-${id}`}
            transition={{ duration: 0.35, ease: "linear" }}
          >
            <Heading 
              size="sm" 
              mb={2} 
              color="white" 
              lineHeight="1.4"
              fontWeight="500"
              noOfLines={3}
            >
              {truncateTitle(title)}
            </Heading>
          </motion.div>
        </Box>
      </MotionBox>
    </Box>
  );
};

export default DraggableArticleCard; 