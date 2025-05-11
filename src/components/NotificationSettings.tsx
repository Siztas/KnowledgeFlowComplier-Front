"use client";

import { 
  Box, 
  VStack, 
  Heading, 
  FormControl, 
  FormLabel, 
  Switch, 
  HStack, 
  Text,
  Divider,
  useToast,
  Badge
} from "@chakra-ui/react";
import { useSettingsStore } from "@/store/settingsStore";
import { useEffect } from "react";

const NotificationSettings = () => {
  const { settings, updateSettings, settingsError } = useSettingsStore();
  const toast = useToast();
  
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
  
  // 处理通知设置变更
  const handleNotificationsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSettings({ notificationsEnabled: e.target.checked });
    
    // 如果禁用了通知，同时禁用邮件通知
    if (!e.target.checked) {
      updateSettings({ emailNotifications: false });
    }
  };
  
  // 处理邮件通知变更
  const handleEmailNotificationsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSettings({ emailNotifications: e.target.checked });
  };
  
  return (
    <Box>
      <VStack spacing={6} align="stretch">
        <Heading size="md" mb={2}>通知设置</Heading>
        
        {/* 主要通知开关 */}
        <FormControl>
          <HStack justify="space-between">
            <Box>
              <FormLabel mb={0}>启用应用内通知</FormLabel>
              <Text fontSize="sm" color="whiteAlpha.600">
                接收新文章、热门研究等应用内通知
              </Text>
            </Box>
            <Switch 
              isChecked={settings.notificationsEnabled}
              onChange={handleNotificationsChange}
              colorScheme="brand"
              size="lg"
            />
          </HStack>
        </FormControl>
        
        <Divider borderColor="whiteAlpha.300" />
        
        {/* 邮件通知设置 */}
        <FormControl isDisabled={!settings.notificationsEnabled}>
          <HStack justify="space-between">
            <Box>
              <FormLabel mb={0}>启用邮件通知</FormLabel>
              <Text fontSize="sm" color="whiteAlpha.600">
                将重要通知发送到您的邮箱
              </Text>
            </Box>
            <Switch 
              isChecked={settings.emailNotifications}
              onChange={handleEmailNotificationsChange}
              colorScheme="brand"
              size="lg"
              isDisabled={!settings.notificationsEnabled}
            />
          </HStack>
        </FormControl>
        
        {/* 通知类型设置 */}
        <Heading size="sm" mt={2} mb={3}>
          通知类型
          {!settings.notificationsEnabled && (
            <Badge ml={2} colorScheme="red" variant="subtle">已禁用</Badge>
          )}
        </Heading>
        
        {/* 新文章通知 */}
        <FormControl isDisabled={!settings.notificationsEnabled}>
          <HStack justify="space-between">
            <Box>
              <FormLabel mb={0} fontSize="sm">新文章推送</FormLabel>
              <Text fontSize="xs" color="whiteAlpha.600">
                当有符合您兴趣的新文章时通知您
              </Text>
            </Box>
            <Switch 
              defaultChecked 
              colorScheme="brand"
              isDisabled={!settings.notificationsEnabled}
            />
          </HStack>
        </FormControl>
        
        {/* 热门研究通知 */}
        <FormControl isDisabled={!settings.notificationsEnabled}>
          <HStack justify="space-between">
            <Box>
              <FormLabel mb={0} fontSize="sm">热门研究提醒</FormLabel>
              <Text fontSize="xs" color="whiteAlpha.600">
                当有研究成果进入热榜时通知您
              </Text>
            </Box>
            <Switch 
              defaultChecked 
              colorScheme="brand"
              isDisabled={!settings.notificationsEnabled}
            />
          </HStack>
        </FormControl>
        
        {/* 系统通知 */}
        <FormControl isDisabled={!settings.notificationsEnabled}>
          <HStack justify="space-between">
            <Box>
              <FormLabel mb={0} fontSize="sm">系统通知</FormLabel>
              <Text fontSize="xs" color="whiteAlpha.600">
                接收系统更新、维护等重要通知
              </Text>
            </Box>
            <Switch 
              defaultChecked 
              colorScheme="brand"
              isDisabled={!settings.notificationsEnabled}
            />
          </HStack>
        </FormControl>
        
        <Divider borderColor="whiteAlpha.300" mt={2} />
        
        {/* 通知频率设置 */}
        <Heading size="sm" mb={3}>
          通知频率
          {!settings.notificationsEnabled && (
            <Badge ml={2} colorScheme="red" variant="subtle">已禁用</Badge>
          )}
        </Heading>
        
        <Text fontSize="sm" color="whiteAlpha.600" mb={4}>
          当前设置为：实时接收所有通知
          <br />
          <Text as="span" fontSize="xs" color="whiteAlpha.400">
            可在完整设置面板中调整通知频率和时间
          </Text>
        </Text>
      </VStack>
    </Box>
  );
};

export default NotificationSettings; 