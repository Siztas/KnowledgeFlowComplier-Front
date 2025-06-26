"use client";

import { ReactNode, useState } from "react";
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { useArticleStore } from "@/store/articleStore";
import { Article } from "@/types/article";
import { Box, Heading } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import EnhancedImage from "./EnhancedImage";

interface DndProviderProps {
  children: ReactNode;
}

const MotionBox = motion(Box);

const DndProvider = ({ children }: DndProviderProps) => {
  const addToShelf = useArticleStore((state) => state.addToShelf);
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  
  // 配置传感器，使拖动更精确
  const sensors = useSensors(
    useSensor(PointerSensor, {
      // 激活距离 - 需要移动多少像素才会触发拖动
      activationConstraint: {
        distance: 8, // 8px的移动距离才会触发拖动，这样可以避免与点击冲突
      },
    })
  );
  
  // 处理拖拽开始事件
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const articleData = active.data.current;
    
    if (articleData && articleData.type === 'article') {
      setActiveArticle(articleData.article);
    }
  };
  
  // 处理拖拽结束事件
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    // 检查是否将文章拖放到了书架区域
    if (over && over.id === 'shelf-droppable') {
      // 获取被拖动的文章数据
      const articleData = active.data.current;
      
      if (articleData && articleData.type === 'article') {
        // 将文章添加到书架
        addToShelf(articleData.article);
      }
    }
    
    // 重置激活状态
    setActiveArticle(null);
  };

  return (
    <DndContext 
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      {children}
      
      <AnimatePresence>
        {activeArticle && (
          <DragOverlay>
            <MotionBox
              initial={{ opacity: 0.8, scale: 1.05 }}
              animate={{ 
                opacity: 0.9, 
                scale: 1.05,
                rotate: 2,
                boxShadow: "0 15px 30px rgba(0,0,0,0.4)"
              }}
              transition={{ duration: 0.2 }}
              bg="card.bg"
              borderRadius="16px"
              overflow="hidden"
              boxShadow="dark-lg"
              w="280px"
              className="article-card"
            >
              <EnhancedImage 
                src={activeArticle.imageUrl} 
                alt={activeArticle.title}
                displayMode="thumbnail"
                w="100%"
                h="180px"
              />
              <Box p={3}>
                <Heading size="sm" noOfLines={2} color="white">
                  {activeArticle.title}
                </Heading>
              </Box>
            </MotionBox>
          </DragOverlay>
        )}
      </AnimatePresence>
    </DndContext>
  );
};

export default DndProvider; 