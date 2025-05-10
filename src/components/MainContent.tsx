"use client";

import { useState } from "react";
import { Box, SimpleGrid, Text, Image, Heading, useDisclosure } from "@chakra-ui/react";
import { motion } from "framer-motion";

// 示例文章数据
interface Article {
  id: string;
  title: string;
  imageUrl: string;
  content: string;
}

const sampleArticles: Article[] = [
  {
    id: "1",
    title: "深度学习在自然语言处理中的最新进展",
    imageUrl: "https://images.unsplash.com/photo-1526378800651-c32d170fe6f8?q=80&w=1000",
    content: "深度学习技术在自然语言处理领域取得了显著进展。本文总结了最新的研究成果和应用案例，包括大型语言模型、多模态学习和跨语言迁移学习等方向。"
  },
  {
    id: "2",
    title: "图神经网络在推荐系统中的应用",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000",
    content: "本文探讨了图神经网络如何改进传统的推荐系统。通过建模用户-物品交互的图结构，图神经网络能够捕捉复杂的关系模式，提高推荐准确性和多样性。"
  },
  {
    id: "3",
    title: "强化学习在自动驾驶中的应用挑战",
    imageUrl: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1000",
    content: "强化学习为自动驾驶技术提供了新的解决方案，但同时也面临着安全性、泛化能力和样本效率等挑战。本文分析了这些挑战并提出了可能的解决思路。"
  },
  {
    id: "4",
    title: "联邦学习：保护隐私的分布式机器学习范式",
    imageUrl: "https://images.unsplash.com/photo-1516192518150-0d8fee5425e3?q=80&w=1000",
    content: "联邦学习允许多个参与方在不共享原始数据的情况下共同训练机器学习模型，从而解决了数据隐私保护的问题。本文介绍了联邦学习的基本原理、技术挑战和最新进展。"
  },
  {
    id: "5",
    title: "量子机器学习：未来计算的新前沿",
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000",
    content: "量子计算与机器学习的结合开创了量子机器学习这一新兴领域。本文讨论了量子机器学习算法的理论基础、潜在优势以及当前的实验进展。"
  },
];

// 动画变体
const variants = {
  card: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.3 }
  },
  fullArticle: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
    transition: { duration: 0.3 }
  }
};

const MotionBox = motion(Box);

const MainContent = () => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  
  const handleCardClick = (article: Article) => {
    setSelectedArticle(article);
  };
  
  const handleClose = () => {
    setSelectedArticle(null);
  };

  return (
    <Box>
      {/* 文章全文显示 */}
      {selectedArticle && (
        <MotionBox
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="white"
          zIndex="10"
          p={8}
          overflow="auto"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={variants.fullArticle}
          onClick={handleClose}
        >
          <Box maxW="800px" mx="auto">
            <Image 
              src={selectedArticle.imageUrl} 
              alt={selectedArticle.title}
              w="100%"
              h="300px"
              objectFit="cover"
              borderRadius="md"
              mb={6}
            />
            <Heading mb={4}>{selectedArticle.title}</Heading>
            <Text fontSize="lg" lineHeight="tall">
              {selectedArticle.content}
            </Text>
          </Box>
        </MotionBox>
      )}

      {/* 文章卡片网格 */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
        {sampleArticles.map((article) => (
          <MotionBox
            key={article.id}
            bg="white"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="md"
            cursor="pointer"
            onClick={() => handleCardClick(article)}
            whileHover={{ y: -5, boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.1)" }}
            initial="initial"
            animate="animate"
            variants={variants.card}
          >
            <Image 
              src={article.imageUrl} 
              alt={article.title}
              w="100%"
              h="200px"
              objectFit="cover"
            />
            <Box p={4}>
              <Heading size="md" mb={2}>
                {article.title}
              </Heading>
            </Box>
          </MotionBox>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default MainContent; 