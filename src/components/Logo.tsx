"use client";

import { Box, Text, Flex, Tooltip } from "@chakra-ui/react";
import { BsBookHalf } from "react-icons/bs";
import { motion } from "framer-motion";
import { useArticleStore } from "@/store/articleStore";
import { useSidebarStore } from "@/store/sidebarStore";

const MotionFlex = motion(Flex);
const MotionBox = motion(Box);
const MotionText = motion(Text);

const Logo = () => {
  const { clearSearch } = useArticleStore();
  const { setActiveSidebar } = useSidebarStore();
  
  // 处理Logo点击
  const handleLogoClick = () => {
    // 返回主页面 - 清除搜索状态，返回原始侧栏
    clearSearch();
    setActiveSidebar('original');
  };
  
  // 动画变体
  const logoVariants = {
    initial: {
      opacity: 0,
      y: -10,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
    tap: {
      scale: 0.95,
      transition: {
        duration: 0.1,
        ease: "easeInOut",
      },
    },
  };
  
  const iconVariants = {
    hover: {
      rotate: [0, -10, 10, -5, 5, 0],
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  };
  
  const textVariants = {
    hover: {
      letterSpacing: "0.05em",
      transition: {
        duration: 0.3,
      },
    },
  };
  
  return (
    <Tooltip label="返回主页" placement="bottom" hasArrow>
      <MotionFlex
        align="center"
        ml={4}
        mt={4}
        cursor="pointer"
        variants={logoVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        whileTap="tap"
        onClick={handleLogoClick}
        role="button"
        aria-label="返回主页"
      >
        <MotionBox
          bg="brand.500"
          borderRadius="md"
          p={2}
          display="flex"
          alignItems="center"
          justifyContent="center"
          mr={2}
          boxSize="40px"
          variants={iconVariants}
          whileHover="hover"
          boxShadow="0 2px 8px rgba(0,0,0,0.2)"
          _hover={{
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            bg: "brand.600"
          }}
        >
          <BsBookHalf size={24} color="white" />
        </MotionBox>
        <MotionText
          fontWeight="bold"
          fontSize="xl"
          bgGradient="linear(to-r, brand.300, brand.500)"
          bgClip="text"
          variants={textVariants}
        >
          KFC
        </MotionText>
      </MotionFlex>
    </Tooltip>
  );
};

export default Logo; 