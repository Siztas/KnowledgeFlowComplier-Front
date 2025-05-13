"use client";

import {
  Box,
  Button,
  Flex,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Textarea,
  Text,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Select,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { mockArticles, mockRagResponses } from "@/utils/mockData";

interface MockDataEditorProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 模拟数据编辑器组件
 * 允许在应用中直接编辑模拟数据
 */
const MockDataEditor: React.FC<MockDataEditorProps> = ({ isOpen, onClose }) => {
  const [articlesData, setArticlesData] = useState("");
  const [ragResponsesData, setRagResponsesData] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<string>("0");
  const [currentArticleData, setCurrentArticleData] = useState("");
  const toast = useToast();

  // 初始化编辑器内容
  useEffect(() => {
    if (isOpen) {
      setArticlesData(JSON.stringify(mockArticles, null, 2));
      setRagResponsesData(JSON.stringify(mockRagResponses.presetAnswers, null, 2));
      setSelectedArticle("0");
      setCurrentArticleData(JSON.stringify(mockArticles[0], null, 2));
    }
  }, [isOpen]);

  // 选择文章处理
  const handleArticleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const index = parseInt(e.target.value);
    setSelectedArticle(e.target.value);
    if (mockArticles[index]) {
      setCurrentArticleData(JSON.stringify(mockArticles[index], null, 2));
    }
  };

  // 更新单篇文章
  const handleSaveArticle = () => {
    try {
      const articleIndex = parseInt(selectedArticle);
      const updatedArticle = JSON.parse(currentArticleData);
      
      // 更新localStorage中的数据
      const storedArticles = [...mockArticles];
      storedArticles[articleIndex] = updatedArticle;
      
      localStorage.setItem("mock_articles", JSON.stringify(storedArticles));
      
      toast({
        title: "文章已更新",
        description: "需要刷新页面以查看更改",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "保存失败",
        description: "JSON格式错误，请检查语法",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // 更新所有文章
  const handleSaveAllArticles = () => {
    try {
      const updatedArticles = JSON.parse(articlesData);
      localStorage.setItem("mock_articles", JSON.stringify(updatedArticles));
      
      toast({
        title: "所有文章已更新",
        description: "需要刷新页面以查看更改",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "保存失败",
        description: "JSON格式错误，请检查语法",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // 更新RAG回答
  const handleSaveRagResponses = () => {
    try {
      const updatedResponses = JSON.parse(ragResponsesData);
      localStorage.setItem("mock_rag_responses", JSON.stringify(updatedResponses));
      
      toast({
        title: "RAG回答已更新",
        description: "需要刷新页面以查看更改",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "保存失败",
        description: "JSON格式错误，请检查语法",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // 重置所有更改
  const handleReset = () => {
    localStorage.removeItem("mock_articles");
    localStorage.removeItem("mock_rag_responses");
    
    toast({
      title: "数据已重置",
      description: "所有更改已恢复为默认值，请刷新页面",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>编辑模拟数据</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Tabs variant="enclosed" colorScheme="blue">
            <TabList>
              <Tab>单篇文章</Tab>
              <Tab>所有文章</Tab>
              <Tab>RAG回答</Tab>
            </TabList>

            <TabPanels>
              {/* 单篇文章编辑 */}
              <TabPanel>
                <FormControl mb={4}>
                  <FormLabel>选择文章</FormLabel>
                  <Select value={selectedArticle} onChange={handleArticleSelect}>
                    {mockArticles.map((article, index) => (
                      <option key={article.id} value={index}>
                        {article.title}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <Textarea
                  value={currentArticleData}
                  onChange={(e) => setCurrentArticleData(e.target.value)}
                  height="500px"
                  fontFamily="monospace"
                />

                <Button mt={4} colorScheme="blue" onClick={handleSaveArticle}>
                  保存文章
                </Button>
              </TabPanel>

              {/* 所有文章编辑 */}
              <TabPanel>
                <Text mb={4} color="gray.500">
                  在下面编辑所有文章数据（JSON格式）
                </Text>

                <Textarea
                  value={articlesData}
                  onChange={(e) => setArticlesData(e.target.value)}
                  height="500px"
                  fontFamily="monospace"
                />

                <Button mt={4} colorScheme="blue" onClick={handleSaveAllArticles}>
                  保存所有文章
                </Button>
              </TabPanel>

              {/* RAG回答编辑 */}
              <TabPanel>
                <Text mb={4} color="gray.500">
                  在下面编辑RAG预设回答（JSON格式）
                </Text>

                <Textarea
                  value={ragResponsesData}
                  onChange={(e) => setRagResponsesData(e.target.value)}
                  height="500px"
                  fontFamily="monospace"
                />

                <Button mt={4} colorScheme="blue" onClick={handleSaveRagResponses}>
                  保存RAG回答
                </Button>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="red" mr={3} onClick={handleReset}>
            重置所有数据
          </Button>
          <Button variant="ghost" onClick={onClose}>
            关闭
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

/**
 * 模拟数据编辑器按钮组件
 * 用于打开模拟数据编辑器
 */
export const MockDataEditorButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        position="fixed"
        bottom="20px"
        right="20px"
        zIndex={1000}
        colorScheme="blue"
        onClick={onOpen}
        size="sm"
        opacity={0.7}
        _hover={{ opacity: 1 }}
      >
        编辑模拟数据
      </Button>

      <MockDataEditor isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default MockDataEditor; 