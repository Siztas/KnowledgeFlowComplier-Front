"use client";

import { Box, Grid, Text } from "@chakra-ui/react";
import { useDroppable } from "@dnd-kit/core";
import { useArticleStore } from "@/store/articleStore";
import ShelfArticleCard from "./ShelfArticleCard";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const ShelfDroppable = () => {
  const shelfArticles = useArticleStore((state) => state.shelfArticles) || [];
  
  // 设置可放置区域
  const { isOver, setNodeRef } = useDroppable({
    id: 'shelf-droppable',
    data: {
      type: 'shelf'
    }
  });

  return (
    <Box h="100%" display="flex" justifyContent="center" width="100%" px={0} mx={0}>
      {/* 拖放区域 */}
      <MotionBox
        ref={setNodeRef}
        minH={shelfArticles.length === 0 ? "200px" : "auto"}
        maxH="calc(100vh - 200px)" // 固定最大高度
        overflowY="auto"
        display="flex"
        flexDirection="column"
        borderRadius="md"
        p={3}
        width="90%" // 使用百分比宽度以适应侧栏
        maxW="200px" // 限制最大宽度，确保不会超出侧栏
        ml={0}
        mr={0}
        mx="auto" // 确保水平居中
        flexShrink={0} // 防止收缩
        animate={{
          borderColor: isOver ? 'rgb(33, 150, 243)' : 'rgba(255, 255, 255, 0.2)',
          borderWidth: isOver ? '3px' : '2px',
          backgroundColor: isOver ? 'rgba(33, 150, 243, 0.1)' : 'transparent',
          scale: isOver ? 1.02 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20
        }}
        borderWidth={2}
        borderStyle="dashed"
        borderColor="whiteAlpha.200"
      >
        {shelfArticles.length === 0 ? (
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
              <Text color={isOver ? "brand.300" : "whiteAlpha.700"} fontWeight={isOver ? "medium" : "normal"}>
                将文章拖放到此处收藏
              </Text>
            </MotionBox>
          </Box>
        ) : (
          <Grid 
            templateColumns="1fr" // 始终保持单列布局
            gap={4}
          >
            {shelfArticles.map(article => (
              <ShelfArticleCard key={article.id} article={article} />
            ))}
          </Grid>
        )}
      </MotionBox>
    </Box>
  );
};

export default ShelfDroppable; 