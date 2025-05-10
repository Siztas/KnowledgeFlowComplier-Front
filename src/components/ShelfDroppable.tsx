"use client";

import { Box, Grid, Text } from "@chakra-ui/react";
import { useDroppable } from "@dnd-kit/core";
import { useArticleStore } from "@/store/articleStore";
import ShelfArticleCard from "./ShelfArticleCard";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

interface ShelfDroppableProps {
  isExpanded?: boolean;
}

const ShelfDroppable = ({ isExpanded = false }: ShelfDroppableProps) => {
  const savedArticles = useArticleStore((state) => state.savedArticles);
  
  // 设置可放置区域
  const { isOver, setNodeRef } = useDroppable({
    id: 'shelf-droppable',
    data: {
      type: 'shelf'
    }
  });

  return (
    <Box h="100%">
      {/* 拖放区域 */}
      <MotionBox
        ref={setNodeRef}
        minH={savedArticles.length === 0 ? "200px" : "auto"}
        maxH={isExpanded ? "300px" : "none"}
        overflowY={isExpanded ? "auto" : "visible"}
        display="flex"
        flexDirection="column"
        borderRadius="md"
        p={4}
        animate={{
          borderColor: isOver ? 'rgb(33, 150, 243)' : 'rgba(255, 255, 255, 0.2)',
          borderWidth: isOver ? '3px' : '2px',
          backgroundColor: isOver ? 'rgba(33, 150, 243, 0.1)' : 'transparent',
          scale: isOver ? 1.02 : 1
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
              <Text color={isOver ? "brand.300" : "whiteAlpha.700"} fontWeight={isOver ? "medium" : "normal"}>
                将文章拖放到此处收藏
              </Text>
            </MotionBox>
          </Box>
        ) : (
          <Grid 
            templateColumns={isExpanded ? "repeat(auto-fill, minmax(200px, 1fr))" : "1fr"} 
            gap={4}
          >
            {savedArticles.map(article => (
              <ShelfArticleCard key={article.id} article={article} />
            ))}
          </Grid>
        )}
      </MotionBox>
    </Box>
  );
};

export default ShelfDroppable; 