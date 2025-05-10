"use client";

import { Box, Heading, Flex, useTheme } from "@chakra-ui/react";
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRightIcon } from "@chakra-ui/icons";
import ShelfDroppable from "./ShelfDroppable";
import RagQueryUI from "./RagQueryUI";
import { useArticleStore } from "@/store/articleStore";

const MotionBox = motion(Box);

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const savedArticles = useArticleStore((state) => state.savedArticles);
  const theme = useTheme();
  
  // 从主题中获取颜色代码
  const sidebarColor = "#121212"; // sidebar.bg的颜色代码
  const sidebarHoverColor = "#1a1a1a"; // sidebar.hover的颜色代码

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Box position="relative" h="100%" zIndex="100">
      <MotionBox 
        p={4} 
        h="100%" 
        animate={{ 
          width: isExpanded ? "calc(80vw)" : "300px", // 展开时占据80%的视窗宽度
          zIndex: isExpanded ? 200 : 100
        }}
        transition={{ 
          duration: 0.4, 
          ease: [0.25, 0.1, 0.25, 1.0], // 使用cubic-bezier曲线，更平滑的动画
          type: "tween" 
        }}
        position="relative"
        display="flex"
        flexDirection="row" // 改为水平方向布局
        bg="sidebar.bg"
        boxShadow={isExpanded ? "dark-lg" : "md"}
        className="sidebar"
        ml={2}
        borderRadius="xl"
        overflow="hidden" // 确保内容不会溢出
      >
        {/* 左侧书架区域 - 固定宽度 */}
        <Flex 
          
          direction="column" 
          width="280px" 
          minWidth="280px"
          flexShrink={0} // 防止收缩
          flexBasis="280px" // 确保基础尺寸也是固定的
          borderRight={isExpanded ? "1px solid" : "none"}
          borderColor="whiteAlpha.200"
        >
          <Heading size="md" color="white" mb={6}>我的书架</Heading>
          
          {/* 书架区域 */}
          <Box flex="1 1 auto" overflow="center" width="100%">
            <ShelfDroppable />
          </Box>
        </Flex>
        
        {/* 右侧RAG问答区域 - 仅在展开时显示 */}
        {isExpanded && (
          <MotionBox
            flex="1"
            ml={6}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              delay: 0.1, 
              duration: 0.3,
              ease: "easeOut"
            }}
            overflowY="auto"
            pr={4}
          >
            <RagQueryUI />
          </MotionBox>
        )}
      </MotionBox>

      {/* 半圆形展开按钮 - 确保可见，放在容器外部 */}
      <MotionBox
        position="absolute"
        right="-15px"
        top="50%"
        transform="translateY(-50%)"
        width="50px"
        height="100px"
        bg={sidebarColor}
        borderRightRadius="full"
        display="flex"
        alignItems="center"
        justifyContent="flex-start"
        paddingLeft="15px"
        cursor="pointer"
        onClick={toggleExpand}
        animate={{
          right: isExpanded ? "20px" : "-25px",
          transform: isExpanded ? "translateY(-50%) rotate(180deg)" : "translateY(-50%)",
          backgroundColor: isExpanded ? sidebarHoverColor : sidebarColor
        }}
        transition={{ 
          duration: 0.3,
          ease: "easeInOut"
        }}
        zIndex={300} // 提高z-index确保按钮始终可见
        boxShadow="0 0 15px rgba(0,0,0,0.4)"
        _hover={{
          bg: sidebarHoverColor,
          boxShadow: "0 0 20px rgba(0,0,0,0.5)"
        }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronRightIcon color="white" boxSize={7} fontWeight="bold" />
      </MotionBox>
      
      {/* 半透明背景 - 仅在展开时显示 */}
      {isExpanded && (
        <Box
          position="fixed"
          top={0}
          right={0}
          width="20vw" // 占据视窗宽度的20%
          height="100vh"
          bg="rgba(0, 0, 0, 0.5)"
          zIndex={199} // 低于侧栏但高于内容区域
        />
      )}
    </Box>
  );
};

export default Sidebar; 