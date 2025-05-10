"use client";

import { Box, Flex, IconButton, Tooltip } from "@chakra-ui/react";
import { ArrowUpIcon, RepeatIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

const MotionFlex = motion(Flex);
const MotionIconButton = motion(IconButton);

interface FloatingNavProps {
  onRefresh: () => void;
}

const FloatingNav = ({ onRefresh }: FloatingNavProps) => {
  const [showScrollButton, setShowScrollButton] = useState(false);
  
  // 监听滚动事件，决定是否显示回到顶部按钮
  useEffect(() => {
    const handleScroll = () => {
      // 当页面滚动超过300px时显示按钮
      setShowScrollButton(window.scrollY > 300);
    };
    
    // 添加滚动事件监听
    window.addEventListener('scroll', handleScroll);
    
    // 初始检查
    handleScroll();
    
    // 组件卸载时移除事件监听
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // 回到顶端功能
  const scrollToTop = useCallback(() => {
    // 获取主内容区域元素
    const contentElement = document.querySelector('.main-content-area');
    
    if (contentElement) {
      // 如果找到了内容区域，滚动该元素到顶部
      contentElement.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    } else {
      // 回退方案：滚动整个窗口
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  }, []);
  
  // 动画变体
  const buttonVariants = {
    hover: {
      scale: 1.1,
      boxShadow: "0 8px 15px rgba(0, 0, 0, 0.3)"
    },
    tap: {
      scale: 0.95
    },
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1
    }
  };
  
  return (
    <MotionFlex
      position="fixed"
      bottom="30px"
      right="30px"
      direction="column"
      gap={3}
      zIndex={100}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* 回到顶端按钮 */}
      <Tooltip label="回到顶端" placement="left">
        <MotionIconButton
          aria-label="回到顶端"
          icon={<ArrowUpIcon />}
          colorScheme="brand"
          size="lg"
          borderRadius="full"
          boxShadow="md"
          onClick={scrollToTop}
          variants={buttonVariants}
          initial="hidden"
          animate={showScrollButton ? "visible" : "hidden"}
          whileHover="hover"
          whileTap="tap"
          transition={{ 
            duration: 0.3,
            type: "spring",
            stiffness: 300
          }}
        />
      </Tooltip>
      
      {/* 刷新按钮 */}
      <Tooltip label="刷新内容" placement="left">
        <MotionIconButton
          aria-label="刷新内容"
          icon={<RepeatIcon />}
          colorScheme="brand"
          variant="outline"
          size="lg"
          borderRadius="full"
          boxShadow="md"
          onClick={onRefresh}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        />
      </Tooltip>
    </MotionFlex>
  );
};

export default FloatingNav; 