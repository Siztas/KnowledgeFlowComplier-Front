"use client";

import { useState, useRef } from "react";
import { Box, SimpleGrid, Text, Image, Heading, Button, Flex } from "@chakra-ui/react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { useArticleStore } from "@/store/articleStore";
import DraggableArticleCard from "./DraggableArticleCard";
import { Article } from "@/types/article";
import { ChevronLeftIcon, AddIcon } from "@chakra-ui/icons";

// 动画变体
const variants = {
  overlay: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { 
      duration: 0.3,
      ease: "easeInOut"
    }
  },
  fullArticle: {
    initial: { opacity: 0, scale: 0.95, y: 10 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.7, y: 50 },
    transition: { 
      type: "tween",
      duration: 0.35,
      ease: [0.25, 0.1, 0.25, 1.0] // 使用cubic-bezier曲线，更平滑的动画
    }
  }
};

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const MainContent = () => {
  const articles = useArticleStore((state) => state.articles);
  const selectedArticle = useArticleStore((state) => state.selectedArticle);
  const setSelectedArticle = useArticleStore((state) => state.setSelectedArticle);
  const addToShelf = useArticleStore((state) => state.addToShelf);
  const isArticleInShelf = useArticleStore((state) => state.isArticleInShelf);
  
  // 用于左划的动作值
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-200, 0], [0, 1]);
  const scale = useTransform(x, [-200, 0], [0.8, 1]);
  const [isSwipedLeft, setIsSwipedLeft] = useState(false);
  
  // 用于检测点击事件的引用
  const contentRef = useRef<HTMLDivElement>(null);
  
  const handleClose = () => {
    setSelectedArticle(null);
    setIsSwipedLeft(false);
  };
  
  const handleAddToShelf = () => {
    if (selectedArticle) {
      addToShelf(selectedArticle);
    }
  };
  
  // 处理拖动结束
  const handleDragEnd = (event: any, info: any) => {
    // 如果向左滑动超过200px，添加到书架
    if (info.offset.x < -200) {
      setIsSwipedLeft(true);
      if (selectedArticle) {
        addToShelf(selectedArticle);
        
        // 添加短暂延迟后关闭全文视图
        setTimeout(() => {
          setSelectedArticle(null);
          setIsSwipedLeft(false);
        }, 500);
      }
    } else {
      // 如果没有滑动足够距离，重置位置
      x.set(0);
    }
  };
  
  // 处理背景点击事件
  const handleBackdropClick = (e: React.MouseEvent) => {
    // 确保点击的是背景而不是内容
    if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
      handleClose();
    }
  };

  return (
    <Box p={2}>
      {/* 文章卡片网格 - 5列布局 */}
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }} gap={4} position="relative" zIndex="1">
        {articles.map((article) => (
          <MotionBox 
            key={article.id} 
            layoutId={`article-card-${article.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.3,
              ease: "easeOut"
            }}
          >
            <DraggableArticleCard article={article} />
          </MotionBox>
        ))}
      </SimpleGrid>

      {/* 文章全文显示 - 模态对话框形式 - 移到最后确保在最上层 */}
      <AnimatePresence mode="wait">
        {selectedArticle && (
          <MotionBox
            position="fixed"
            top="0"
            left="0"
            right="0"
            bottom="0"
            bg="rgba(0, 0, 0, 0.7)" // 更暗的半透明背景
            zIndex="500" // 提高z-index确保在最上层
            display="flex"
            alignItems="center"
            justifyContent="center"
            onClick={handleBackdropClick} // 点击背景关闭
            variants={variants.overlay}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <MotionFlex
              ref={contentRef}
              direction="column"
              maxW="900px" // 限制最大宽度
              maxH="90vh" // 限制最大高度
              w="90%" // 占据屏幕90%宽度
              h="auto" // 高度自适应
              bg="card.bg"
              color="white"
              borderRadius="xl"
              boxShadow="dark-lg"
              overflow="hidden"
              style={{ x, opacity, scale }}
              drag="x"
              dragConstraints={{ left: -300, right: 0 }}
              dragElastic={0.1}
              onDragEnd={handleDragEnd}
              onClick={(e) => e.stopPropagation()} // 防止点击内容时关闭
              variants={variants.fullArticle}
              initial="initial"
              animate="animate"
              exit="exit"
              layoutId={`article-card-${selectedArticle.id}`} // 添加layoutId用于动画连接
              layout="position" // 添加layout属性以改进布局动画
            >
              <Flex p={4} justifyContent="space-between" alignItems="center" borderBottomWidth={1} borderColor="whiteAlpha.200">
                <Button leftIcon={<ChevronLeftIcon />} variant="ghost" onClick={handleClose}>
                  返回
                </Button>
                <Button 
                  leftIcon={<AddIcon />} 
                  colorScheme={isArticleInShelf(selectedArticle.id) ? "green" : "brand"}
                  variant={isArticleInShelf(selectedArticle.id) ? "solid" : "outline"}
                  onClick={handleAddToShelf}
                  isDisabled={isArticleInShelf(selectedArticle.id)}
                >
                  {isArticleInShelf(selectedArticle.id) ? "已添加到书架" : "添加到书架"}
                </Button>
              </Flex>
              
              <Box flex="1" p={8} overflow="auto">
                <Box maxW="800px" mx="auto">
                  <motion.div layoutId={`article-image-${selectedArticle.id}`}>
                    <Image 
                      src={selectedArticle.imageUrl} 
                      alt={selectedArticle.title}
                      w="100%"
                      h="300px"
                      objectFit="cover"
                      borderRadius="md"
                      mb={6}
                    />
                  </motion.div>
                  
                  <motion.div layoutId={`article-title-${selectedArticle.id}`}>
                    <Heading mb={4} color="white">{selectedArticle.title}</Heading>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, ease: "easeOut" }}
                  >
                    <Text fontSize="lg" lineHeight="tall" color="whiteAlpha.900">
                      {selectedArticle.content}
                    </Text>
                  </motion.div>
                </Box>
              </Box>
            </MotionFlex>
            
            {/* 左划提示 */}
            <MotionBox
              position="absolute"
              left={0}
              top="50%"
              transform="translateY(-50%)"
              bg="brand.500"
              color="white"
              p={4}
              borderRightRadius="md"
              initial={{ opacity: 0, x: -100 }}
              animate={{ 
                opacity: x.get() < -50 ? 1 : 0,
                x: x.get() < -50 ? 0 : -100
              }}
              transition={{ duration: 0.2 }}
            >
              <Flex direction="column" alignItems="center">
                <AddIcon mb={2} />
                <Text>添加到书架</Text>
              </Flex>
            </MotionBox>
            
            {/* 成功添加提示 */}
            {isSwipedLeft && (
              <MotionBox
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                bg="green.500"
                color="white"
                p={6}
                borderRadius="md"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                textAlign="center"
              >
                <Heading size="md">已添加到书架</Heading>
              </MotionBox>
            )}
          </MotionBox>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default MainContent; 