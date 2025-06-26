"use client";

import { 
  Box, 
  Heading, 
  Flex,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { useArticleStore } from "@/store/articleStore";

const RagQueryUI = () => {
  const shelfArticles = useArticleStore((state) => state.shelfArticles);

  return (
    <Box bg="black" minHeight="100vh" p={4}>
      <Flex justifyContent="center" alignItems="center" mb={4}>
        <Heading size="md" color="white">RAG问答</Heading>
      </Flex>
      
      {shelfArticles.length === 0 && (
        <Alert status="info" mb={4} borderRadius="md" bg="blackAlpha.800" borderColor="whiteAlpha.200">
          <AlertIcon color="blue.300" />
          <Box flex="1">
            <AlertTitle color="white">提示</AlertTitle>
            <AlertDescription display="block" color="whiteAlpha.800">
              RAGFlow聊天窗口已嵌入，您可以直接与AI助手对话。
            </AlertDescription>
          </Box>
        </Alert>
      )}
      
      {/* RAGFlow iframe */}
      <Box 
        borderWidth={1} 
        borderRadius="md" 
        bg="black"
        height="600px" 
        borderColor="whiteAlpha.200"
        overflow="hidden"
      >
        <iframe
          src="http://127.0.0.1/chat/share?shared_id=3f8ee1d6308911f0b7174215f2af5ad3&from=agent&auth=gzNjk4MzdhMzA4ZTExZjBhNjA5NDIxNW&visible_avatar=1&locale=zh"
          style={{
            width: '100%', 
            height: '100%', 
            minHeight: '600px',
            border: 'none',
            backgroundColor: 'black'
          }}
        />
      </Box>
    </Box>
  );
};

export default RagQueryUI; 