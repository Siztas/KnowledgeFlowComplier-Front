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
import { isLocalPath, extractFilename, setPublicImagePrefix, tryMapToPublicUrl } from "@/utils/imagePathProcessor";
import { PUBLIC_IMAGE_PATH } from "@/utils/env";

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
  const [publicPath, setPublicPath] = useState(PUBLIC_IMAGE_PATH);
  const [testImagePath, setTestImagePath] = useState("");
  const [mappedImageUrl, setMappedImageUrl] = useState("");
  const toast = useToast();

  // 初始化编辑器内容
  useEffect(() => {
    if (isOpen) {
      setArticlesData(JSON.stringify(mockArticles, null, 2));
      setRagResponsesData(JSON.stringify(mockRagResponses.presetAnswers, null, 2));
      setSelectedArticle("0");
      setCurrentArticleData(JSON.stringify(mockArticles[0], null, 2));
      setPublicPath(localStorage.getItem("mock_public_image_path") || PUBLIC_IMAGE_PATH);
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

  // 更新公共路径前缀
  const handleSavePublicPath = () => {
    try {
      if (publicPath) {
        localStorage.setItem("mock_public_image_path", publicPath);
        setPublicImagePrefix(publicPath);
        
        toast({
          title: "公共路径已更新",
          description: "需要刷新页面以查看更改",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        localStorage.removeItem("mock_public_image_path");
        setPublicImagePrefix("");
        
        toast({
          title: "公共路径已清除",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "保存失败",
        description: "路径格式错误",
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
              <Tab>图片设置</Tab>
            </TabList>

            <TabPanels>
              {/* 单篇文章编辑 */}
              <TabPanel>
                <FormControl mb={2}>
                  <FormLabel>选择文章</FormLabel>
                  <Select value={selectedArticle} onChange={handleArticleSelect}>
                    {mockArticles.map((article, index) => (
                      <option key={article.id} value={index}>
                        {article.title}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                
                <Text mb={4} fontSize="sm" color="yellow.500">
                  提示：可以在 imageUrl 字段中使用本地文件路径，前端会自动识别并处理。
                  {currentArticleData.includes('"imageUrl"') && isLocalPath(JSON.parse(currentArticleData).imageUrl) && (
                    <Box>
                      <Text mt={1} fontWeight="bold">本地路径已识别：</Text>
                      <Text fontSize="xs" bg="blackAlpha.300" p={1} borderRadius="md" fontFamily="monospace">
                        {JSON.parse(currentArticleData).imageUrl}
                      </Text>
                      <Text mt={1}>文件名：<b>{extractFilename(JSON.parse(currentArticleData).imageUrl)}</b></Text>
                    </Box>
                  )}
                </Text>

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
                <Text mb={2} color="gray.500">
                  在下面编辑所有文章数据（JSON格式）
                </Text>
                
                <Text mb={4} fontSize="sm" color="yellow.500">
                  提示：imageUrl可以使用本地文件路径（例如：D:\images\file.jpg 或 ./images/file.jpg），
                  系统会自动处理并在界面上显示占位图片。
                </Text>

                <Box mb={4} p={3} bg="blackAlpha.200" borderRadius="md">
                  <Text fontSize="sm" fontWeight="bold" mb={2}>本地文件路径支持格式：</Text>
                  <Text fontSize="sm" fontFamily="monospace">• Windows: D:\path\to\image.jpg</Text>
                  <Text fontSize="sm" fontFamily="monospace">• 相对路径: ./images/photo.png</Text>
                  <Text fontSize="sm" fontFamily="monospace">• 绝对路径: /images/background.jpg</Text>
                </Box>

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
              
              {/* 图片设置 */}
              <TabPanel>
                <Box mb={6}>
                  <Heading size="md" mb={4}>本地图片路径映射</Heading>
                  
                  <Text mb={4} color="gray.500">
                    设置公共图片路径前缀，将本地图片路径转换为可访问的URL。
                    例如：如果设置为"http://localhost:3000/"，则"D:\images\pic.jpg"将映射为"http://localhost:3000/images/pic.jpg"
                  </Text>
                  
                  <FormControl mb={4}>
                    <FormLabel>公共路径前缀</FormLabel>
                    <Flex>
                      <Textarea 
                        value={publicPath} 
                        onChange={(e) => setPublicPath(e.target.value)}
                        placeholder="http://localhost:3000/"
                        mr={2}
                        height="80px"
                        fontFamily="monospace"
                      />
                      <Button 
                        onClick={handleSavePublicPath}
                        colorScheme="blue"
                        alignSelf="flex-end"
                      >
                        应用
                      </Button>
                    </Flex>
                  </FormControl>
                  
                  {/* 图片路径测试工具 */}
                  <Box mb={6}>
                    <FormControl>
                      <FormLabel>路径映射测试工具</FormLabel>
                      <Textarea 
                        placeholder="输入一个本地路径，例如：D:\images\avatar.jpg 或 ./public/img/logo.png"
                        height="60px"
                        fontFamily="monospace"
                        value={testImagePath}
                        onChange={(e) => {
                          const path = e.target.value.trim();
                          setTestImagePath(path);
                          
                          if (path && isLocalPath(path)) {
                            const mappedUrl = tryMapToPublicUrl(path);
                            setMappedImageUrl(mappedUrl || "");
                          } else {
                            setMappedImageUrl("");
                          }
                        }}
                      />
                      <Box 
                        mt={2} 
                        p={2} 
                        bg="gray.700" 
                        color="white" 
                        borderRadius="md" 
                        fontFamily="monospace"
                        fontSize="sm"
                      >
                        {mappedImageUrl 
                          ? `映射结果: ${mappedImageUrl}` 
                          : testImagePath 
                            ? "未设置公共路径前缀，无法映射" 
                            : "映射结果会显示在这里"}
                      </Box>
                      
                      {mappedImageUrl && (
                        <Box mt={4}>
                          <Text mb={2} fontSize="sm" fontWeight="bold">图片预览</Text>
                          <Box 
                            borderWidth={1} 
                            borderColor="gray.400" 
                            borderRadius="md" 
                            overflow="hidden"
                            maxW="400px"
                          >
                            <img 
                              src={mappedImageUrl} 
                              alt="图片预览"
                              style={{ 
                                width: '100%', 
                                maxHeight: '200px', 
                                objectFit: 'contain',
                                background: '#f0f0f0'
                              }}
                              onError={(e) => {
                                e.currentTarget.src = "https://via.placeholder.com/400x200?text=加载失败";
                                e.currentTarget.style.background = "#ff000020";
                                toast({
                                  title: "图片加载失败",
                                  description: "请检查路径是否正确、文件是否存在",
                                  status: "error",
                                  duration: 3000,
                                  isClosable: true,
                                });
                              }}
                              onLoad={() => {
                                toast({
                                  title: "图片加载成功",
                                  description: "图片路径映射正确",
                                  status: "success",
                                  duration: 3000,
                                  isClosable: true,
                                });
                              }}
                            />
                          </Box>
                          <Text mt={2} fontSize="xs" color="gray.500">
                            如果图片没有显示，请检查文件是否存在于正确的位置。
                          </Text>
                        </Box>
                      )}
                    </FormControl>
                  </Box>
                  
                  <Box p={4} bg="blackAlpha.200" borderRadius="md">
                    <Text fontSize="sm" fontWeight="bold" mb={2}>使用说明：</Text>
                    <Text fontSize="sm">1. 设置公共路径后，本地图片路径将映射到该路径下，子文件夹结构会保留</Text>
                    <Text fontSize="sm">2. 支持的路径格式和映射结果：</Text>
                    <Box ml={4} mt={1} fontFamily="monospace" fontSize="xs">
                      <Text>• D:\images\avatar.jpg → http://localhost:3000/images/avatar.jpg</Text>
                      <Text>• /home/user/pics/icon.png → http://localhost:3000/home/user/pics/icon.png</Text>
                      <Text>• ./public/img/logo.svg → http://localhost:3000/public/img/logo.svg</Text>
                      <Text>• ../assets/bg.webp → http://localhost:3000/assets/bg.webp</Text>
                    </Box>
                    <Text fontSize="sm" mt={2}>3. 图片文件需要实际存在于相应的公共目录，例如：</Text>
                    <Box ml={4} mt={1} fontFamily="monospace" fontSize="xs">
                      <Text>• ./public/images/photo.jpg → 对应 /public/images/photo.jpg</Text>
                      <Text>• D:\pics\avatar.png → 对应 /public/pics/avatar.png</Text>
                    </Box>
                    <Text fontSize="sm" mt={2}>4. 清空路径可以恢复使用占位图显示</Text>
                  </Box>
                </Box>
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