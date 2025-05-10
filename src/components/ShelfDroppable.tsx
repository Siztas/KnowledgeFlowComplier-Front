"use client";

import { Box, Heading, VStack, Text } from "@chakra-ui/react";
import { useDroppable } from "@dnd-kit/core";
import { useArticleStore } from "@/store/articleStore";
import ShelfArticleCard from "./ShelfArticleCard";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const ShelfDroppable = () => {
  const savedArticles = useArticleStore((state) => state.savedArticles);
  
  // 设置可放置区域
  const { isOver, setNodeRef } = useDroppable({
    id: 'shelf-droppable',
    data: {
      type: 'shelf'
    }
  });

  // 根据是否有拖拽物体悬停在上方设置样式
  const dropStyle = {
    borderColor: isOver ? 'blue.500' : 'gray.300',
    borderWidth: isOver ? 3 : 2,
    borderStyle: 'dashed',
    backgroundColor: isOver ? 'blue.50' : 'transparent',
  };

  return (
    <Box h="100%">
      <Heading size="md" mb={6}>我的书架</Heading>
      
      <MotionBox
        ref={setNodeRef}
        h={savedArticles.length === 0 ? "80%" : "auto"}
        display="flex"
        flexDirection="column"
        borderRadius="md"
        p={4}
        animate={{
          borderColor: isOver ? 'rgb(66, 153, 225)' : 'rgb(203, 213, 224)',
          borderWidth: isOver ? '3px' : '2px',
          backgroundColor: isOver ? 'rgba(235, 248, 255, 0.8)' : 'transparent',
          scale: isOver ? 1.02 : 1
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20
        }}
        borderWidth={2}
        borderStyle="dashed"
        borderColor="gray.300"
      >
        {savedArticles.length === 0 ? (
          <Box
            flex="1"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <MotionBox
              animate={{
                scale: isOver ? 1.1 : 1,
                opacity: isOver ? 1 : 0.7
              }}
              transition={{ duration: 0.2 }}
            >
              <Text color={isOver ? "blue.500" : "gray.500"} fontWeight={isOver ? "medium" : "normal"}>
                将文章拖放到此处收藏
              </Text>
            </MotionBox>
          </Box>
        ) : (
          <VStack gap={4} alignItems="stretch">
            {savedArticles.map(article => (
              <ShelfArticleCard key={article.id} article={article} />
            ))}
          </VStack>
        )}
      </MotionBox>
    </Box>
  );
};

export default ShelfDroppable; 