"use client";

import { 
  Box, 
  VStack, 
  Heading, 
  FormControl, 
  FormLabel, 
  Tag,
  TagLabel,
  TagCloseButton,
  Input,
  Button,
  HStack,
  Text,
  useToast,
  Flex,
  Checkbox,
  CheckboxGroup
} from "@chakra-ui/react";
import { useState, useRef } from "react";
import { useSettingsStore } from "@/store/settingsStore";

// 预设的主题标签
const PRESET_TOPICS = [
  "深度学习", "机器学习", "自然语言处理", "计算机视觉", 
  "强化学习", "图神经网络", "联邦学习", "量子计算",
  "大型语言模型", "多模态学习", "自监督学习", "知识图谱"
];

const ContentPreferences = () => {
  const { settings, updateSettings, settingsError } = useSettingsStore();
  const toast = useToast();
  
  // 本地状态
  const [newTopic, setNewTopic] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  
  // 确保settings中有topics和excludedTopics数组
  const topics = settings.contentPreferences?.topics || [];
  const excludedTopics = settings.contentPreferences?.excludedTopics || [];
  
  // 添加感兴趣的主题
  const addTopic = () => {
    if (!newTopic.trim()) return;
    
    // 检查是否已经存在
    if (topics.includes(newTopic.trim())) {
      toast({
        title: "主题已存在",
        description: "该主题已在您的兴趣列表中",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    // 如果在排除列表中，先移除
    let newExcludedTopics = [...excludedTopics];
    if (excludedTopics.includes(newTopic.trim())) {
      newExcludedTopics = excludedTopics.filter((topic: string) => topic !== newTopic.trim());
    }
    
    // 更新设置
    updateSettings({
      contentPreferences: {
        topics: [...topics, newTopic.trim()],
        excludedTopics: newExcludedTopics
      }
    });
    
    // 清空输入框
    setNewTopic("");
    if (inputRef.current) inputRef.current.focus();
  };
  
  // 移除感兴趣的主题
  const removeTopic = (topicToRemove: string) => {
    updateSettings({
      contentPreferences: {
        topics: topics.filter((topic: string) => topic !== topicToRemove),
        excludedTopics
      }
    });
  };
  
  // 添加排除的主题
  const addExcludedTopic = () => {
    if (!newTopic.trim()) return;
    
    // 检查是否已经存在
    if (excludedTopics.includes(newTopic.trim())) {
      toast({
        title: "主题已存在",
        description: "该主题已在您的排除列表中",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    // 如果在兴趣列表中，先移除
    let newTopics = [...topics];
    if (topics.includes(newTopic.trim())) {
      newTopics = topics.filter((topic: string) => topic !== newTopic.trim());
    }
    
    // 更新设置
    updateSettings({
      contentPreferences: {
        topics: newTopics,
        excludedTopics: [...excludedTopics, newTopic.trim()]
      }
    });
    
    // 清空输入框
    setNewTopic("");
    if (inputRef.current) inputRef.current.focus();
  };
  
  // 移除排除的主题
  const removeExcludedTopic = (topicToRemove: string) => {
    updateSettings({
      contentPreferences: {
        topics,
        excludedTopics: excludedTopics.filter((topic: string) => topic !== topicToRemove)
      }
    });
  };
  
  // 从预设中添加主题
  const addPresetTopic = (preset: string) => {
    // 如果已经在兴趣列表中，不做操作
    if (topics.includes(preset)) return;
    
    // 如果在排除列表中，先移除
    let newExcludedTopics = [...excludedTopics];
    if (excludedTopics.includes(preset)) {
      newExcludedTopics = excludedTopics.filter((topic: string) => topic !== preset);
    }
    
    // 更新设置
    updateSettings({
      contentPreferences: {
        topics: [...topics, preset],
        excludedTopics: newExcludedTopics
      }
    });
  };
  
  return (
    <Box>
      <VStack spacing={6} align="stretch">
        <Heading size="md" mb={2}>内容偏好设置</Heading>
        
        {/* 兴趣主题 */}
        <FormControl>
          <FormLabel>我感兴趣的主题</FormLabel>
          <HStack mb={3}>
            <Input
              ref={inputRef}
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              placeholder="输入主题标签"
              bg="#1a1a1a"
              borderColor="whiteAlpha.300"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTopic();
                }
              }}
            />
            <Button colorScheme="brand" onClick={addTopic}>
              添加
            </Button>
          </HStack>
          
          {/* 已选择的主题标签 */}
          <Flex wrap="wrap" gap={2} mb={4}>
            {topics.length > 0 ? (
              topics.map((topic: string) => (
                <Tag
                  key={topic}
                  size="md"
                  borderRadius="full"
                  variant="solid"
                  colorScheme="brand"
                  mb={2}
                >
                  <TagLabel>{topic}</TagLabel>
                  <TagCloseButton onClick={() => removeTopic(topic)} />
                </Tag>
              ))
            ) : (
              <Text fontSize="sm" color="whiteAlpha.600">
                尚未添加感兴趣的主题，添加后可获得更精准的推荐
              </Text>
            )}
          </Flex>
        </FormControl>
        
        {/* 排除主题 */}
        <FormControl>
          <FormLabel>我不感兴趣的主题</FormLabel>
          <HStack mb={3}>
            <Input
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              placeholder="输入要排除的主题"
              bg="#1a1a1a"
              borderColor="whiteAlpha.300"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addExcludedTopic();
                }
              }}
            />
            <Button colorScheme="red" onClick={addExcludedTopic}>
              排除
            </Button>
          </HStack>
          
          {/* 已排除的主题标签 */}
          <Flex wrap="wrap" gap={2} mb={4}>
            {excludedTopics.length > 0 ? (
              excludedTopics.map((topic: string) => (
                <Tag
                  key={topic}
                  size="md"
                  borderRadius="full"
                  variant="solid"
                  colorScheme="red"
                  mb={2}
                >
                  <TagLabel>{topic}</TagLabel>
                  <TagCloseButton onClick={() => removeExcludedTopic(topic)} />
                </Tag>
              ))
            ) : (
              <Text fontSize="sm" color="whiteAlpha.600">
                尚未添加排除主题，添加后可过滤不感兴趣的内容
              </Text>
            )}
          </Flex>
        </FormControl>
        
        {/* 推荐主题 */}
        <Box mt={4}>
          <Heading size="sm" mb={3}>推荐主题</Heading>
          <Flex wrap="wrap" gap={2}>
            {PRESET_TOPICS.map(preset => (
              <Tag
                key={preset}
                size="md"
                borderRadius="full"
                variant="outline"
                colorScheme={topics.includes(preset) ? "brand" : "gray"}
                cursor="pointer"
                onClick={() => addPresetTopic(preset)}
                mb={2}
              >
                <TagLabel>{preset}</TagLabel>
              </Tag>
            ))}
          </Flex>
        </Box>
      </VStack>
    </Box>
  );
};

export default ContentPreferences; 