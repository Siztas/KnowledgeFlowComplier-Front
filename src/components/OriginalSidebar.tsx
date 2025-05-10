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
    boxShadow: "none",
    zIndex: 1
  },
  hover: { 
    backgroundColor: "rgba(33, 150, 243, 0.15)", // 调整透明度，确保在暗色背景上可见
    color: "#2196f3", // brand.500的颜色
    scale: 1.05,
    boxShadow: "0 4px 20px rgba(33, 150, 243, 0.3)", // 调整阴影效果
    zIndex: 50 // 确保悬停元素位于顶层
  },
  tap: { 
    scale: 0.97,
    backgroundColor: "rgba(33, 150, 243, 0.2)", // 调整透明度
    zIndex: 50
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
    <Flex 
      direction="column" 
      h="100%" 
      justify="space-between" 
      p={4} 
      align="flex-start" 
      width="100%"
      sx={{
        '& .nav-button:hover': {
          backgroundColor: "rgba(33, 150, 243, 0.1)",  // 明确设置hover状态的背景色
          borderLeft: "3px solid #2196f3 !important", // 强制应用左边框样式
          color: "#2196f3"  // 设置文字颜色
        },
        '& .nav-button': {
          transition: "all 0.3s ease",
          borderLeft: "3px solid transparent",
          position: "relative"
        }
      }}
    >
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
            transition={{ duration: 0.3, type: "spring", stiffness: 400 }}
            style={{ 
              WebkitTapHighlightColor: "transparent",
              borderLeft: "3px solid transparent",
              paddingLeft: "10px",
              position: "relative" // 添加相对定位以支持伪元素
            }}
            _hover={{
              borderLeft: "3px solid #2196f3",
              backgroundColor: "rgba(33, 150, 243, 0.1)" // 添加背景色增强视觉效果
            }}
            width="100%"
            className="nav-button"
          >
            <MotionBox 
              fontSize="xl" 
              mr={3}
              variants={{
                hover: { 
                  rotate: [0, -10, 10, -5, 0], 
                  scale: [1, 1.2, 1.1],
                  color: "#2196f3", // 添加颜色变化
                  transition: { 
                    duration: 0.5,
                    repeat: 0 
                  } 
                }
              }}
              style={{ 
                color: "inherit", 
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.2, color: "#2196f3" }}
              flexShrink={0}
            >
              <item.icon />
            </MotionBox>
            <Text fontWeight="medium" style={{ color: "inherit", transition: "color 0.3s ease" }} isTruncated>
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
          transition={{ duration: 0.3, type: "spring", stiffness: 400 }}
          style={{ 
            WebkitTapHighlightColor: "transparent",
            borderLeft: "3px solid transparent",
            paddingLeft: "10px",
            position: "relative" // 添加相对定位以支持伪元素
          }}
          _hover={{
            borderLeft: "3px solid #2196f3",
            backgroundColor: "rgba(33, 150, 243, 0.1)" // 添加背景色增强视觉效果
          }}
          width="100%"
          className="nav-button"
        >
          <MotionBox 
            fontSize="xl" 
            mr={3}
            variants={{
              hover: { 
                rotate: 180, 
                scale: [1, 1.2, 1.1],
                color: "#2196f3", // 添加颜色变化
                transition: { 
                  duration: 0.5,
                  repeat: 0 
                } 
              }
            }}
            style={{ 
              color: "inherit", 
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.2, color: "#2196f3", rotate: 180 }}
            flexShrink={0}
          >
            <settingsButton.icon />
          </MotionBox>
          <Text fontWeight="medium" style={{ color: "inherit", transition: "color 0.3s ease" }} isTruncated>
            {settingsButton.name}
          </Text>
        </MotionFlex>
      </Box>
    </Flex>
  );
};

export default OriginalSidebar; 