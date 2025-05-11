"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Box, 
  Input, 
  Button, 
  VStack, 
  Text, 
  Flex, 
  Heading, 
  Avatar, 
  Spinner,
  useToast,
  IconButton,
  Collapse,
  Badge,
  Tooltip,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton
} from "@chakra-ui/react";
import { DeleteIcon, WarningIcon } from "@chakra-ui/icons";
import { useArticleStore } from "@/store/articleStore";
import { motion, AnimatePresence } from "framer-motion";
import { useRagQuery, Message } from "@/hooks/useRagQuery";

const MotionBox = motion(Box);

const RagQueryUI = () => {
  const [query, setQuery] = useState("");
  const savedArticles = useArticleStore((state) => state.savedArticles);
  const fullArticles = useArticleStore((state) => state.articles);
  const toast = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [expandedSourceId, setExpandedSourceId] = useState<string | null>(null);

  // 获取完整的文章内容（包括内容）
  const articlesWithContent = savedArticles.map(saved => {
    const fullArticle = fullArticles.find(article => article.id === saved.id);
    return fullArticle || { 
      id: saved.id, 
      title: saved.title, 
      imageUrl: saved.imageUrl,
      content: "内容不可用" 
    };
  });

  // 使用RAG查询Hook
  const { 
    messages, 
    isLoading, 
    error, 
    submitQuery,
    clearMessages,
    hasDataset
  } = useRagQuery(articlesWithContent);

  // 处理查询提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    await submitQuery(query);
    setQuery("");
  };

  // 自动滚动到最新消息
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // 显示错误提示
  useEffect(() => {
    if (error.isError) {
      toast({
        title: "查询错误",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [error, toast]);

  // 切换源文档展开/收起
  const toggleSource = (id: string) => {
    setExpandedSourceId(expandedSourceId === id ? null : id);
  };

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Heading size="md" color="white">RAG问答</Heading>
        {messages.length > 0 && (
          <Tooltip label="清空对话">
            <IconButton
              aria-label="清空对话"
              icon={<DeleteIcon />}
              size="sm"
              onClick={clearMessages}
              variant="ghost"
              color="white"
            />
          </Tooltip>
        )}
      </Flex>
      
      {!hasDataset && (
        <Alert status="warning" mb={4} borderRadius="md">
          <AlertIcon as={WarningIcon} />
          <Box flex="1">
            <AlertTitle>未连接RAG服务</AlertTitle>
            <AlertDescription display="block">
              目前使用的是模拟回答。当后端RAG服务可用时，将自动连接。
            </AlertDescription>
          </Box>
          <CloseButton position="absolute" right="8px" top="8px" />
        </Alert>
      )}
      
      {/* 消息区域 */}
      <Box 
        borderWidth={1} 
        borderRadius="md" 
        p={4} 
        mb={4} 
        bg="sidebar.active" 
        height="450px" 
        overflowY="auto"
        borderColor="whiteAlpha.200"
      >
        {messages.length === 0 ? (
          <Flex 
            height="100%" 
            alignItems="center" 
            justifyContent="center" 
            flexDirection="column"
            color="whiteAlpha.700"
          >
            <Text mb={2}>基于您书架中的文章进行问答</Text>
            <Text fontSize="sm">您可以询问关于文章内容的问题</Text>
          </Flex>
        ) : (
          <VStack spacing={4} align="stretch">
            <AnimatePresence>
              {messages.map((message) => (
                <MotionBox 
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.3,
                    ease: "easeOut"
                  }}
                >
                  <Flex gap={2}>
                    <Avatar 
                      size="sm" 
                      name={message.type === 'user' ? "用户" : "助手"} 
                      bg={message.type === 'user' ? "brand.500" : "green.500"} 
                    />
                    <Box 
                      bg={message.type === 'user' ? "whiteAlpha.100" : "blackAlpha.300"} 
                      p={3} 
                      borderRadius="lg" 
                      maxW="90%"
                      width="100%"
                    >
                      <Text whiteSpace="pre-wrap" color="white">{message.content}</Text>
                      
                      {/* 加载指示器 */}
                      {message.isStreaming && (
                        <Spinner size="xs" ml={2} color="green.300" />
                      )}
                      
                      {/* 源文档引用 */}
                      {message.sources && message.sources.length > 0 && (
                        <Box mt={3} pt={2} borderTopWidth={1} borderColor="whiteAlpha.300">
                          <Text fontSize="xs" color="whiteAlpha.600" mb={1}>
                            参考来源:
                          </Text>
                          <VStack align="stretch" spacing={2}>
                            {message.sources.map((source) => (
                              <Box 
                                key={source.id}
                                p={2} 
                                borderRadius="md" 
                                bg="whiteAlpha.100"
                                cursor="pointer"
                                onClick={() => toggleSource(source.id)}
                                _hover={{ bg: "whiteAlpha.200" }}
                              >
                                <Flex justifyContent="space-between" alignItems="center">
                                  <Text fontSize="sm" fontWeight="medium" color="white">
                                    {source.title}
                                  </Text>
                                  <Badge colorScheme="green" variant="solid" bg="green.600">
                                    相关度: {Math.round(source.relevance * 100)}%
                                  </Badge>
                                </Flex>
                                
                                <Collapse in={expandedSourceId === source.id} animateOpacity>
                                  <Box mt={2} p={2} bg="blackAlpha.400" borderRadius="sm">
                                    <Text fontSize="sm" color="whiteAlpha.900">{source.content}</Text>
                                  </Box>
                                </Collapse>
                              </Box>
                            ))}
                          </VStack>
                        </Box>
                      )}
                    </Box>
                  </Flex>
                </MotionBox>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </VStack>
        )}
      </Box>
      
      {/* 查询输入 */}
      <form onSubmit={handleSubmit}>
        <Flex>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="输入问题..."
            bg="sidebar.active"
            color="white"
            borderColor="whiteAlpha.300"
            borderRadius="md"
            _hover={{
              borderColor: "whiteAlpha.400",
            }}
            _focus={{
              borderColor: "brand.500",
              boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
            }}
            mr={2}
            disabled={isLoading || (savedArticles.length === 0)}
          />
          <Button
            type="submit"
            colorScheme="brand"
            isLoading={isLoading}
            loadingText="查询中"
            disabled={!query.trim() || (savedArticles.length === 0)}
          >
            发送
          </Button>
        </Flex>
      </form>
      
      {savedArticles.length === 0 && (
        <Text fontSize="sm" color="red.300" mt={2}>
          请先添加文章到书架，才能使用RAG问答功能
        </Text>
      )}
    </Box>
  );
};

export default RagQueryUI; 