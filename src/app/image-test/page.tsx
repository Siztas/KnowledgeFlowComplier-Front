"use client";

import { Box, VStack, Heading, Text, SimpleGrid, Container, Button } from "@chakra-ui/react";
import { useState } from "react";
import EnhancedImage from "@/components/EnhancedImage";
import { processImagePath } from "@/utils/imagePathProcessor";
import { mockArticles } from "@/utils/mockData";

/**
 * 图片路径测试页面
 * 用于测试各种图片路径处理情况
 */
export default function ImageTest() {
  const [publicPathPrefix, setPublicPathPrefix] = useState("");
  const [debugOutput, setDebugOutput] = useState<string[]>([]);
  
  // 测试图片路径
  const testPaths = [
    // 根目录图片
    "http://localhost:3000/image_2.png",
    // 子文件夹图片
    "http://localhost:3000/1505.05798v1/images/image_2.png",
    "http://localhost:3000/papers/1505.05798v1/images/image_2.png",
    // 本地文件路径
    "D:\\images\\test.png",
    "C:\\Users\\Public\\Pictures\\Sample Pictures\\test.jpg",
    // 无效路径
    "invalid_path.jpg",
    // 从模拟数据中提取的图片路径
    ...mockArticles.map(article => article.imageUrl).filter(Boolean) as string[]
  ];
  
  // 处理调试输出
  const logOutput = (message: string) => {
    setDebugOutput(prev => [...prev, message]);
  };
  
  // 处理图片处理测试
  const runTest = () => {
    setDebugOutput([]);
    logOutput("开始图片路径处理测试...");
    
    testPaths.forEach(path => {
      if (!path) return;
      
      try {
        const processedPath = processImagePath(path);
        logOutput(`原始路径: ${path}`);
        logOutput(`处理后路径: ${processedPath}`);
        logOutput("-------------------");
      } catch (error) {
        logOutput(`处理路径出错: ${path}`);
        logOutput(`错误信息: ${error}`);
        logOutput("-------------------");
      }
    });
    
    logOutput("测试完成");
  };
  
  return (
    <Container maxW="1200px" p={6}>
      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="xl">图片路径处理测试</Heading>
        
        <Button colorScheme="blue" onClick={runTest}>
          运行路径处理测试
        </Button>
        
        <Box p={4} bg="gray.700" borderRadius="md" overflowX="auto">
          <Heading size="md" mb={4}>调试输出</Heading>
          <VStack align="flex-start" spacing={1}>
            {debugOutput.length > 0 ? (
              debugOutput.map((line, index) => (
                <Text key={index} fontSize="sm" fontFamily="monospace" whiteSpace="pre-wrap">
                  {line}
                </Text>
              ))
            ) : (
              <Text color="gray.400">点击上方按钮运行测试...</Text>
            )}
          </VStack>
        </Box>
        
        <Heading as="h2" size="lg" mt={8}>图片渲染测试</Heading>
        <Text>
          测试不同图片路径的渲染结果，包括根目录图片、子文件夹图片和本地图片等。
        </Text>
        
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
          {testPaths.map((path, index) => (
            <Box key={index} bg="gray.800" p={4} borderRadius="md">
              <Text mb={2} fontSize="sm" fontFamily="monospace" noOfLines={1} color="gray.300">
                {path}
              </Text>
              <EnhancedImage 
                src={path} 
                alt={`测试图片 ${index + 1}`}
                displayMode="card"
                h="200px"
                w="100%"
              />
            </Box>
          ))}
        </SimpleGrid>
        
        <Heading as="h2" size="lg" mt={8}>文章图片测试</Heading>
        <Text>
          测试文章图片的渲染效果。
        </Text>
        
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
          {mockArticles.map((article, index) => (
            <Box key={article.id} bg="gray.800" p={4} borderRadius="md">
              <Text fontWeight="bold" mb={2}>{article.title}</Text>
              <Text mb={2} fontSize="sm" fontFamily="monospace" noOfLines={1} color="gray.300">
                {article.imageUrl}
              </Text>
              <EnhancedImage 
                src={article.imageUrl} 
                alt={article.title}
                displayMode="card"
                h="200px"
                w="100%"
              />
            </Box>
          ))}
        </SimpleGrid>
      </VStack>
    </Container>
  );
} 