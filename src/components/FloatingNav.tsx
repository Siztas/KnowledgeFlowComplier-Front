"use client";

import { Box, Flex, IconButton, Tooltip, Text } from "@chakra-ui/react";
import { ArrowUpIcon, RepeatIcon } from "@chakra-ui/icons";
import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

const MotionFlex = motion(Flex);
const MotionIconButton = motion(IconButton);
const MotionBox = motion(Box);

interface FloatingNavProps {
  onRefresh: () => void;
}

const FloatingNav = ({ onRefresh }: FloatingNavProps) => {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showRefreshMessage, setShowRefreshMessage] = useState(false);
  
  // 监听滚动事件，决定是否显示回到顶部按钮
  useEffect(() => {
    const handleScroll = () => {
      // 获取主内容区域元素
      const contentElement = document.querySelector('.main-content-area');
      
      if (contentElement) {
        // 当内容区域滚动超过300px时显示按钮
        setShowScrollButton((contentElement as Element).scrollTop > 300);
      } else {
        // 当页面滚动超过300px时显示按钮
        setShowScrollButton(window.scrollY > 300);
      }
    };
    
    // 为主内容区域添加滚动事件监听
    const contentElement = document.querySelector('.main-content-area');
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll);
    }
    
    // 也添加窗口滚动事件监听作为备选
    window.addEventListener('scroll', handleScroll);
    
    // 初始检查
    handleScroll();
    
    // 组件卸载时移除事件监听
    return () => {
      if (contentElement) {
        contentElement.removeEventListener('scroll', handleScroll);
      }
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
  
  // 处理刷新操作
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setShowRefreshMessage(true);
    
    // 调用刷新函数
    onRefresh();
    
    // 显示刷新消息，然后自动消失
    setTimeout(() => {
      setShowRefreshMessage(false);
      setTimeout(() => {
        setIsRefreshing(false);
      }, 300);
    }, 2000);
    
    // 滚动到顶端
    scrollToTop();
  }, [onRefresh, scrollToTop]);
  
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
    },
    rotate: {
      rotate: 360,
      transition: {
        duration: 1,
        ease: "linear",
        repeat: Infinity
      }
    }
  };
  
  return (
    <MotionFlex
      position="fixed"
      bottom="30px"
      right="calc(5% + 15px)"
      direction="column"
      gap={3}
      zIndex={100}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* 刷新消息提示 */}
      <AnimatePresence>
        {showRefreshMessage && (
          <MotionBox
            position="absolute"
            bottom="110px"
            right="0"
            bg="green.500"
            color="white"
            py={2}
            px={4}
            borderRadius="md"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Text fontSize="sm">内容已刷新</Text>
          </MotionBox>
        )}
      </AnimatePresence>
      
      {/* 回到顶端按钮 */}
      <Tooltip label="回到顶端" placement="left" hasArrow>
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
      <Tooltip label="刷新内容" placement="left" hasArrow>
        <MotionIconButton
          aria-label="刷新内容"
          icon={<RepeatIcon />}
          colorScheme="brand"
          variant={isRefreshing ? "solid" : "outline"}
          size="lg"
          borderRadius="full"
          boxShadow="md"
          onClick={handleRefresh}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          animate={isRefreshing ? "rotate" : "visible"}
          disabled={isRefreshing}
        />
      </Tooltip>
    </MotionFlex>
  );
};

export default FloatingNav; 