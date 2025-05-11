"use client";

import { 
  Box, 
  VStack, 
  Heading, 
  FormControl, 
  FormLabel, 
  Select, 
  Switch, 
  HStack, 
  Text, 
  useColorMode, 
  useToast,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Tooltip,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useSettingsStore } from "@/store/settingsStore";

const ThemeSettings = () => {
  const { settings, updateSettings, settingsError } = useSettingsStore();
  const { colorMode, setColorMode } = useColorMode();
  const toast = useToast();
  
  // 本地状态，用于显示文章数量的tooltip
  const [showTooltip, setShowTooltip] = useState(false);
  const [articlesPerPage, setArticlesPerPage] = useState(settings.articlesPerPage);
  
  // 同步colorMode和设置中的theme
  useEffect(() => {
    if (settings.theme !== 'auto' && settings.theme !== colorMode) {
      setColorMode(settings.theme);
    }
  }, [settings.theme, colorMode, setColorMode]);
  
  // 处理设置错误
  useEffect(() => {
    if (settingsError) {
      toast({
        title: "设置更新失败",
        description: settingsError,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [settingsError, toast]);
  
  // 处理主题变更
  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTheme = e.target.value as 'light' | 'dark' | 'auto';
    updateSettings({ theme: newTheme });
    
    // 如果选择了明确的主题（非auto），则立即应用
    if (newTheme !== 'auto') {
      setColorMode(newTheme);
    }
  };
  
  // 处理文章显示方式变更
  const handleDisplayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSettings({ articleDisplay: e.target.value as 'card' | 'list' });
  };
  
  // 处理通知设置变更
  const handleNotificationsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSettings({ notificationsEnabled: e.target.checked });
  };
  
  // 处理邮件通知变更
  const handleEmailNotificationsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSettings({ emailNotifications: e.target.checked });
  };
  
  // 处理每页文章数量变更
  const handleArticlesPerPageChange = (value: number) => {
    setArticlesPerPage(value);
  };
  
  // 当滑动结束时更新设置
  const handleArticlesPerPageChangeEnd = () => {
    updateSettings({ articlesPerPage });
  };
  
  return (
    <Box>
      <VStack spacing={6} align="stretch">
        <Heading size="md" mb={2}>主题与界面</Heading>
        
        {/* 主题选择 */}
        <FormControl>
          <FormLabel>主题模式</FormLabel>
          <Select 
            value={settings.theme} 
            onChange={handleThemeChange}
            bg="#1a1a1a"
            borderColor="whiteAlpha.300"
          >
            <option value="light">浅色模式</option>
            <option value="dark">深色模式</option>
            <option value="auto">跟随系统</option>
          </Select>
        </FormControl>
        
        {/* 文章显示方式 */}
        <FormControl>
          <FormLabel>文章显示方式</FormLabel>
          <Select 
            value={settings.articleDisplay} 
            onChange={handleDisplayChange}
            bg="#1a1a1a"
            borderColor="whiteAlpha.300"
          >
            <option value="card">卡片视图</option>
            <option value="list">列表视图</option>
          </Select>
        </FormControl>
        
        {/* 每页文章数量 */}
        <FormControl>
          <FormLabel>每页文章数量</FormLabel>
          <HStack>
            <Box flex="1">
              <Slider
                value={articlesPerPage}
                min={5}
                max={50}
                step={5}
                onChange={handleArticlesPerPageChange}
                onChangeEnd={handleArticlesPerPageChangeEnd}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <SliderTrack bg="whiteAlpha.200">
                  <SliderFilledTrack bg="brand.500" />
                </SliderTrack>
                <Tooltip
                  hasArrow
                  bg="brand.500"
                  color="white"
                  placement="top"
                  isOpen={showTooltip}
                  label={`${articlesPerPage}`}
                >
                  <SliderThumb boxSize={6} />
                </Tooltip>
              </Slider>
            </Box>
            <NumberInput
              maxW="100px"
              value={articlesPerPage}
              min={5}
              max={50}
              step={5}
              onChange={(_, value) => handleArticlesPerPageChange(value)}
              onBlur={handleArticlesPerPageChangeEnd}
            >
              <NumberInputField bg="#1a1a1a" borderColor="whiteAlpha.300" />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </HStack>
        </FormControl>
        
        {/* 通知设置 */}
        <Heading size="md" mt={4} mb={2}>通知设置</Heading>
        
        <FormControl>
          <HStack justify="space-between">
            <FormLabel mb={0}>启用应用内通知</FormLabel>
            <Switch 
              isChecked={settings.notificationsEnabled}
              onChange={handleNotificationsChange}
              colorScheme="brand"
            />
          </HStack>
        </FormControl>
        
        <FormControl isDisabled={!settings.notificationsEnabled}>
          <HStack justify="space-between">
            <FormLabel mb={0}>启用邮件通知</FormLabel>
            <Switch 
              isChecked={settings.emailNotifications}
              onChange={handleEmailNotificationsChange}
              colorScheme="brand"
            />
          </HStack>
        </FormControl>
        
        {/* 语言设置 */}
        <Heading size="md" mt={4} mb={2}>语言设置</Heading>
        
        <FormControl>
          <FormLabel>界面语言</FormLabel>
          <Select 
            value={settings.language} 
            onChange={(e) => updateSettings({ language: e.target.value })}
            bg="#1a1a1a"
            borderColor="whiteAlpha.300"
          >
            <option value="zh-CN">简体中文</option>
            <option value="en-US">English (US)</option>
          </Select>
        </FormControl>
      </VStack>
    </Box>
  );
};

export default ThemeSettings; 