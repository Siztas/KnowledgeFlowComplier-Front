"use client";

import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useFavoriteStore } from "@/store/favoriteStore";
import { useArticleStore } from "@/store/articleStore";
// @ts-ignore - react-force-graph没有类型声明文件
import { ForceGraph2D } from "react-force-graph";

const ArticleGraph = () => {
  const { 
    favoriteArticles, 
    graphData, 
    isLoadingFavorites, 
    favoriteError, 
    loadFavorites
  } = useFavoriteStore();
  
  const { setSelectedArticle } = useArticleStore();
  const fgRef = useRef<any>(null);
  
  // 容器尺寸状态
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 加载收藏文章
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);
  
  // 监听容器大小变化
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };
    
    // 初始化尺寸
    updateDimensions();
    
    // 监听窗口大小变化
    window.addEventListener('resize', updateDimensions);
    
    // 清理函数
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);
  
  // 图谱初始化后缩放以适应屏幕
  useEffect(() => {
    if (fgRef.current && graphData.nodes.length > 0) {
      // 等待图谱渲染完成后缩放
      setTimeout(() => {
        fgRef.current.zoomToFit(400, 40);
      }, 500);
    }
  }, [graphData]);
  
  // 节点颜色
  const getNodeColor = (node: any) => {
    if (node.group === 'article') {
      return '#3182CE'; // 文章节点颜色
    } else if (node.group === 'author') {
      return '#38A169'; // 作者节点颜色
    }
    return '#718096'; // 默认颜色
  };
  
  // 连接线颜色
  const getLinkColor = (link: any) => {
    if (link.type === 'authored') {
      return '#38A169'; // 作者关系
    } else if (link.type === 'references') {
      return '#E53E3E'; // 引用关系
    }
    return '#718096'; // 默认颜色
  };
  
  // 处理节点点击
  const handleNodeClick = (node: any) => {
    if (node.group === 'article' && node.articleId) {
      const article = favoriteArticles.find(a => a.id === node.articleId);
      if (article) {
        setSelectedArticle(article);
      }
    }
  };
  
  // 加载中状态
  if (isLoadingFavorites) {
    return (
      <Flex justify="center" align="center" height="400px" width="100%">
        <Spinner size="xl" color="brand.500" thickness="4px" />
      </Flex>
    );
  }
  
  // 错误状态
  if (favoriteError) {
    return (
      <Box p={6} textAlign="center" color="red.400">
        <Text mb={4}>{favoriteError}</Text>
        <Text 
          cursor="pointer" 
          textDecoration="underline" 
          onClick={() => loadFavorites()}
        >
          点击重试
        </Text>
      </Box>
    );
  }
  
  // 空数据状态
  if (favoriteArticles.length === 0) {
    return (
      <Box p={6} textAlign="center" color="whiteAlpha.700">
        <Text>暂无收藏文章</Text>
        <Text mt={2} fontSize="sm">
          添加收藏文章后，将在此处显示文章关系图谱
        </Text>
      </Box>
    );
  }
  
  // 图谱数据为空
  if (graphData.nodes.length === 0) {
    return (
      <Box p={6} textAlign="center" color="whiteAlpha.700">
        <Text>正在生成关系图谱...</Text>
        <Spinner size="md" color="brand.500" mt={4} />
      </Box>
    );
  }
  
  return (
    <Box 
      ref={containerRef} 
      width="100%" 
      height="100%" 
      position="relative" 
      overflow="hidden"
      borderRadius="md"
      bg="#0a0a0a"
    >
      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        width={dimensions.width}
        height={dimensions.height}
        nodeRelSize={6}
        nodeVal={(node: any) => node.val}
        nodeLabel={(node: any) => node.name}
        nodeColor={getNodeColor}
        linkColor={getLinkColor}
        linkWidth={1}
        linkDirectionalParticles={2}
        linkDirectionalParticleWidth={1.5}
        onNodeClick={handleNodeClick}
        nodeCanvasObjectMode={() => 'after'}
        nodeCanvasObject={(node: any, ctx: any, globalScale: number) => {
          // 只为文章节点添加标签
          if (node.group === 'article') {
            const label = node.name;
            const fontSize = 12 / globalScale;
            ctx.font = `${fontSize}px Sans-Serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = 'white';
            
            // 背景
            const textWidth = ctx.measureText(label).width;
            const bckgDimensions = [textWidth + 8, fontSize + 4].map(n => n / globalScale);
            
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(
              node.x - bckgDimensions[0] / 2,
              node.y + 8 / globalScale,
              bckgDimensions[0],
              bckgDimensions[1]
            );
            
            // 文本
            ctx.fillStyle = 'white';
            ctx.fillText(label, node.x, node.y + (8 + fontSize / 2) / globalScale);
          }
        }}
      />
    </Box>
  );
};

export default ArticleGraph; 