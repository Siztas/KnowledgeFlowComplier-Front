"use client";

import { Box, Heading, VStack, Text, IconButton } from "@chakra-ui/react";
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

interface SavedArticle {
  id: string;
  title: string;
  imageUrl: string;
}

const MotionBox = motion(Box);

const Sidebar = () => {
  const [savedArticles, setSavedArticles] = useState<SavedArticle[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <MotionBox 
      p={4} 
      h="100%" 
      animate={{ width: isExpanded ? "100vw" : "300px" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      position="relative"
    >
      <Heading size="md" mb={6} display="flex" justifyContent="space-between">
        我的书架
        <IconButton
          aria-label="展开/收起书架"
          size="sm"
          onClick={toggleExpand}
        >
          {isExpanded ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Heading>
      
      {savedArticles.length === 0 ? (
        <Box 
          h="80%" 
          display="flex" 
          alignItems="center" 
          justifyContent="center"
          borderWidth={2}
          borderStyle="dashed"
          borderColor="gray.300"
          borderRadius="md"
        >
          <Text color="gray.500">
            将文章拖放到此处收藏
          </Text>
        </Box>
      ) : (
        <VStack gap={4} alignItems="stretch">
          {savedArticles.map(article => (
            <Box 
              key={article.id}
              borderWidth={1}
              borderRadius="md"
              overflow="hidden"
              bg="white"
              boxShadow="sm"
              _hover={{ boxShadow: "md" }}
              cursor="pointer"
              h="100px"
            >
              <Box 
                bgImage={`url(${article.imageUrl})`}
                backgroundSize="cover"
                backgroundPosition="center"
                h="60px"
              />
              <Box p={2}>
                <Text fontSize="sm" fontWeight="medium" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
                  {article.title}
                </Text>
              </Box>
            </Box>
          ))}
        </VStack>
      )}

      {isExpanded && (
        <Box mt={8} p={4} borderTop="1px solid" borderColor="gray.200">
          <Heading size="md" mb={4}>RAG问答</Heading>
          <Text color="gray.600" mb={4}>
            基于您收藏的文章进行知识问答
          </Text>
          <Box 
            p={4}
            borderWidth={1}
            borderRadius="md"
            bg="gray.50"
          >
            <Text color="gray.500" fontStyle="italic">
              请先将文章添加到书架，然后在此处进行问答...
            </Text>
          </Box>
        </Box>
      )}
    </MotionBox>
  );
};

export default Sidebar; 