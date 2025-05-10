"use client";

import { Box, VStack, Flex, Text, IconButton, Tooltip } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { BsBookHalf, BsBookmarkHeart, BsGraphUp, BsGearWideConnected } from "react-icons/bs";
import { useSidebarStore } from "@/store/sidebarStore";

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

// 按钮悬停动画变体
const buttonVariants = {
  initial: { 
    backgroundColor: "transparent", 
    color: "white",
    boxShadow: "none"
  },
  hover: { 
    backgroundColor: "#2d2d2d", 
    color: "#63B3ED", // 使用更亮的蓝色
    scale: 1.03,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)"
  },
  tap: { 
    scale: 0.97,
    backgroundColor: "#333333"
  }
};

const OriginalSidebar = () => {
  const { setActiveSidebar } = useSidebarStore();
  
  // 导航选项数据
  const navigationItems = [
    { id: 'bookshelf', name: '书柜', icon: BsBookHalf, onClick: () => setActiveSidebar('bookshelf') },
    { id: 'favorites', name: '收藏', icon: BsBookmarkHeart, onClick: () => setActiveSidebar('favorites') },
    { id: 'trending', name: '研究热榜', icon: BsGraphUp, onClick: () => setActiveSidebar('trending') }
  ];

  // 设置按钮
  const settingsButton = { id: 'settings', name: '设置', icon: BsGearWideConnected, onClick: () => setActiveSidebar('settings') };
  
  return (
    <Flex direction="column" h="100%" justify="space-between" p={4} align="flex-start" width="100%">
      {/* 顶部导航按钮 */}
      <VStack spacing={6} align="flex-start" mt={6} width="90%" maxW="240px">
        {/* <Text fontSize="lg" fontWeight="bold" mb={2} color="white" textAlign="center">
          导航菜单
        </Text> */}
        
        {navigationItems.map((item) => (
          <MotionFlex
            key={item.id}
            align="center"
            cursor="pointer"
            p={3}
            borderRadius="md"
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            onClick={item.onClick}
            transition={{ duration: 0.2 }}
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            <MotionBox 
              fontSize="xl" 
              mr={3}
              variants={{
                hover: { rotate: [0, -10, 10, -5, 0], transition: { duration: 0.5 } }
              }}
              style={{ color: "inherit" }}
              flexShrink={0}
            >
              <item.icon />
            </MotionBox>
            <Text fontWeight="medium" style={{ color: "inherit" }} isTruncated>
              {item.name}
            </Text>
          </MotionFlex>
        ))}
      </VStack>
      
      {/* 底部设置按钮 */}
      <Box width="90%" maxW="240px" mb={4} alignSelf="flex-start">
        <MotionFlex
          align="center"
          cursor="pointer"
          p={3}
          borderRadius="md"
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          onClick={settingsButton.onClick}
          transition={{ duration: 0.2 }}
          style={{ WebkitTapHighlightColor: "transparent" }}
        >
          <MotionBox 
            fontSize="xl" 
            mr={3}
            variants={{
              hover: { rotate: 180, transition: { duration: 0.5 } }
            }}
            style={{ color: "inherit" }}
            flexShrink={0}
          >
            <settingsButton.icon />
          </MotionBox>
          <Text fontWeight="medium" style={{ color: "inherit" }} isTruncated>
            {settingsButton.name}
          </Text>
        </MotionFlex>
      </Box>
    </Flex>
  );
};

export default OriginalSidebar; 