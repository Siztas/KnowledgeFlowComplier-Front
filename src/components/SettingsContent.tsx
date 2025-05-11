"use client";

import { 
  Box, 
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel, 
  Heading, 
  Flex, 
  Button, 
  useToast,
  Spinner,
  Text
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useSidebarStore } from "@/store/sidebarStore";
import { useSettingsStore } from "@/store/settingsStore";
import { useEffect } from "react";
import ThemeSettings from "./ThemeSettings";
import ContentPreferences from "./ContentPreferences";
import NotificationSettings from "./NotificationSettings";

const MotionBox = motion(Box);

// 返回按钮组件
const BackButton = ({ onClick }: { onClick: () => void }) => (
  <MotionBox
    position="absolute"
    top="10px"
    left="50%"
    transform="translateX(-50%)"
    width="50px"
    height="5px"
    bg="#333"
    borderRadius="full"
    cursor="pointer"
    onClick={onClick}
    whileHover={{ scale: 1.2, backgroundColor: "#555" }}
    whileTap={{ scale: 0.9 }}
    zIndex={300}
  />
);

const SettingsContent = () => {
  const { setActiveSidebar } = useSidebarStore();
  const { 
    settings, 
    loadSettings, 
    resetSettings, 
    isLoadingSettings, 
    settingsError 
  } = useSettingsStore();
  
  const toast = useToast();
  
  // 加载设置
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);
  
  // 处理设置重置
  const handleResetSettings = async () => {
    try {
      await resetSettings();
      toast({
        title: "设置已重置",
        description: "所有设置已恢复为默认值",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "重置设置失败",
        description: error instanceof Error ? error.message : "发生未知错误",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  // 加载中状态
  if (isLoadingSettings) {
    return (
      <Flex direction="column" width="100%" height="100%" align="center" justify="center">
        <BackButton onClick={() => setActiveSidebar('original')} />
        <Spinner size="xl" color="brand.500" thickness="4px" />
        <Text mt={4} color="whiteAlpha.800">加载设置中...</Text>
      </Flex>
    );
  }
  
  // 错误状态
  if (settingsError) {
    return (
      <Flex direction="column" width="100%" height="100%" align="center" justify="center">
        <BackButton onClick={() => setActiveSidebar('original')} />
        <Heading size="md" color="red.400" mb={4}>加载设置失败</Heading>
        <Text color="whiteAlpha.800" mb={4}>{settingsError}</Text>
        <Button colorScheme="brand" onClick={() => loadSettings()}>
          重试
        </Button>
      </Flex>
    );
  }
  
  return (
    <Flex direction="column" width="100%" height="100%" align="center" px={0}>
      <BackButton onClick={() => setActiveSidebar('original')} />
      <Heading size="md" color="white" mb={6} mt={6} textAlign="center">
        系统设置
      </Heading>
      
      <Box width="90%" flex="1" overflow="auto">
        <Tabs variant="enclosed" colorScheme="brand" isFitted>
          <TabList mb={4}>
            <Tab _selected={{ color: 'white', bg: '#1a1a1a' }}>主题</Tab>
            <Tab _selected={{ color: 'white', bg: '#1a1a1a' }}>内容偏好</Tab>
            <Tab _selected={{ color: 'white', bg: '#1a1a1a' }}>通知</Tab>
          </TabList>
          
          <TabPanels>
            <TabPanel bg="#1a1a1a" borderRadius="md">
              <ThemeSettings />
            </TabPanel>
            
            <TabPanel bg="#1a1a1a" borderRadius="md">
              <ContentPreferences />
            </TabPanel>
            
            <TabPanel bg="#1a1a1a" borderRadius="md">
              <NotificationSettings />
            </TabPanel>
          </TabPanels>
        </Tabs>
        
        <Flex justify="center" mt={6} mb={8}>
          <Button 
            colorScheme="red" 
            variant="outline" 
            onClick={handleResetSettings}
            size="sm"
          >
            重置所有设置
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
};

export default SettingsContent; 