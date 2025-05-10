"use client";

import { Box, Heading, Flex, useTheme, Text } from "@chakra-ui/react";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { ChevronRightIcon } from "@chakra-ui/icons";
import ShelfDroppable from "./ShelfDroppable";
import RagQueryUI from "./RagQueryUI";
import { useSidebarStore, SidebarType } from "@/store/sidebarStore";
import OriginalSidebar from "./OriginalSidebar";
import { useState, useEffect } from "react";

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

// 侧栏内容动画变体 - 改为上下翻动卡片效果
const sidebarContentVariants = {
  enter: (direction: number) => ({
    y: direction > 0 ? '100%' : '-100%',
    opacity: 0,
    rotateX: direction > 0 ? 45 : -45, // 添加X轴旋转角度
    transformOrigin: direction > 0 ? 'top' : 'bottom', // 根据方向设置变换原点
    perspective: 1200, // 增加3D视角感
    scale: 0.8,
    zIndex: 0
  }),
  center: {
    y: 0,
    opacity: 1,
    rotateX: 0,
    scale: 1,
    zIndex: 1,
    transition: {
      y: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1.0] },
      opacity: { duration: 0.3, ease: "easeInOut" },
      rotateX: { duration: 0.4, ease: "easeOut" },
      scale: { duration: 0.4, ease: "easeOut" }
    },
  },
  exit: (direction: number) => ({
    y: direction < 0 ? '100%' : '-100%',
    opacity: 0,
    rotateX: direction < 0 ? 45 : -45, // 添加X轴旋转角度
    transformOrigin: direction < 0 ? 'top' : 'bottom', // 根据方向设置变换原点
    perspective: 1200, // 增加3D视角感
    scale: 0.8,
    zIndex: 0,
    transition: {
      y: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1.0] },
      opacity: { duration: 0.2, ease: "easeInOut" },
      rotateX: { duration: 0.4, ease: "easeIn" },
      scale: { duration: 0.3, ease: "easeIn" }
    },
  }),
};

// 返回按钮组件
const BackButton = ({ onClick }: { onClick: () => void }) => (
  <MotionBox
    position="absolute"
    top="10px"
    left="50%"
    transform="translateX(-50%)"
    width="50px"
    height="5px"
    bg="#333"
    borderRadius="full"
    cursor="pointer"
    onClick={onClick}
    whileHover={{ scale: 1.2, backgroundColor: "#555" }}
    whileTap={{ scale: 0.9 }}
    zIndex={300}
  />
);

// 书架侧栏内容组件
const BookshelfContent = () => {
  const { setActiveSidebar } = useSidebarStore();
  
  return (
    <Flex direction="column" width="100%" height="100%" align="center" px={0}>
      <BackButton onClick={() => setActiveSidebar('original')} />
      <Heading size="md" color="white" mb={6} mt={6} textAlign="center" width="90%">我的书架</Heading>
      <Box 
        flex="1 1 auto" 
        overflow="hidden" 
        width="100%" 
        px={0}
        display="flex" 
        justifyContent="center"
        alignItems="flex-start"
      >
        <ShelfDroppable />
      </Box>
    </Flex>
  );
};

// 收藏侧栏内容组件
const FavoritesContent = () => {
  const { setActiveSidebar } = useSidebarStore();
  
  return (
    <Flex direction="column" width="100%" height="100%" align="center" px={0}>
      <BackButton onClick={() => setActiveSidebar('original')} />
      <Heading size="md" color="white" mb={6} mt={6} textAlign="center" width="90%">我的收藏</Heading>
      <Box flex="1" width="100%" display="flex" justifyContent="center" px={0}>
        <Box p={4} borderRadius="md" bg="#1a1a1a" textAlign="center" width="90%" maxWidth="200px" mx="auto">
          暂无收藏内容
        </Box>
      </Box>
    </Flex>
  );
};

// 研究热榜侧栏内容组件
const TrendingContent = () => {
  const { setActiveSidebar } = useSidebarStore();
  
  return (
    <Flex direction="column" width="100%" height="100%" align="center" px={0}>
      <BackButton onClick={() => setActiveSidebar('original')} />
      <Heading size="md" color="white" mb={6} mt={6} textAlign="center" width="90%">研究热榜</Heading>
      <Box flex="1" width="100%" display="flex" justifyContent="center" px={0}>
        <Box p={4} borderRadius="md" bg="#1a1a1a" textAlign="center" width="90%" maxWidth="200px" mx="auto">
          正在获取热榜数据...
        </Box>
      </Box>
    </Flex>
  );
};

// 设置侧栏内容组件
const SettingsContent = () => {
  const { setActiveSidebar } = useSidebarStore();
  
  return (
    <Flex direction="column" width="100%" height="100%" align="center" px={0}>
      <BackButton onClick={() => setActiveSidebar('original')} />
      <Heading size="md" color="white" mb={6} mt={6} textAlign="center" width="90%">设置</Heading>
      <Box flex="1" width="100%" display="flex" justifyContent="center" px={0}>
        <Box p={4} borderRadius="md" bg="#1a1a1a" textAlign="center" width="90%" maxWidth="200px" mx="auto">
          设置内容将在后续版本中提供
        </Box>
      </Box>
    </Flex>
  );
};

// 获取方向值，用于动画
const getDirection = (current: SidebarType, previous: SidebarType | null): number => {
  if (!previous || previous === 'original') return 1;
  if (current === 'original') return -1;
  
  // 添加更多方向判断逻辑，使不同菜单项之间有不同的动画方向
  const sidebarOrder = ['original', 'bookshelf', 'favorites', 'trending', 'settings'];
  const currentIndex = sidebarOrder.indexOf(current);
  const previousIndex = previous ? sidebarOrder.indexOf(previous) : -1;
  
  if (currentIndex > previousIndex) return 1; // 向下翻动
  if (currentIndex < previousIndex) return -1; // 向上翻动
  
  return 0;
};

// 判断是否应显示展开按钮
const shouldShowExpandButton = (sidebarType: SidebarType): boolean => {
  return sidebarType !== 'original';
};

// 根据侧栏类型获取展开内容
const getExpandedContent = (sidebarType: SidebarType) => {
  switch (sidebarType) {
    case 'bookshelf':
      return (
        <Box p={4} maxW="100%" overflowX="hidden">
          <Heading size="md" mb={4} color="white">书架文章RAG查询</Heading>
          <RagQueryUI />
        </Box>
      );
    case 'favorites':
      return (
        <Box p={4} maxW="100%" overflowX="hidden">
          <Heading size="md" mb={4} color="white">收藏内容分析</Heading>
          <Text color="white" mb={4}>
            基于您的收藏文章，我们生成了以下主题分布：
          </Text>
          <Box bg="#1a1a1a" p={4} borderRadius="md" color="whiteAlpha.800">
            <Text mb={2}>• 深度学习：45%</Text>
            <Text mb={2}>• 机器学习：30%</Text>
            <Text mb={2}>• 自然语言处理：15%</Text>
            <Text>• 其他主题：10%</Text>
          </Box>
        </Box>
      );
    case 'trending':
      return (
        <Box p={4} maxW="100%" overflowX="hidden">
          <Heading size="md" mb={4} color="white">热门研究动态</Heading>
          <Box bg="#1a1a1a" p={4} borderRadius="md" mb={3} color="white">
            <Heading size="sm" mb={2} color="brand.300">大型语言模型最新突破</Heading>
            <Text fontSize="sm">最近一周内，大型语言模型领域有3项重大突破，影响因子均超过10。</Text>
          </Box>
          <Box bg="#1a1a1a" p={4} borderRadius="md" mb={3} color="white">
            <Heading size="sm" mb={2} color="brand.300">多模态学习研究热点</Heading>
            <Text fontSize="sm">视觉-语言预训练模型成为本月引用量最高的研究方向。</Text>
          </Box>
          <Box bg="#1a1a1a" p={4} borderRadius="md" color="white">
            <Heading size="sm" mb={2} color="brand.300">前沿算法性能对比</Heading>
            <Text fontSize="sm">最新发布的5种强化学习算法在标准测试中的表现对比数据。</Text>
          </Box>
        </Box>
      );
    case 'settings':
      return (
        <Box p={4} maxW="100%" overflowX="hidden">
          <Heading size="md" mb={4} color="white">系统设置</Heading>
          <Text color="whiteAlpha.800" mb={6}>
            在这里您可以调整应用的显示和功能设置。
          </Text>
          <Box bg="#1a1a1a" p={4} borderRadius="md" mb={4} color="white">
            <Text fontWeight="bold" mb={2}>主题与界面</Text>
            <Text fontSize="sm" color="whiteAlpha.700">
              对应用的外观、配色和布局进行个性化设置。
            </Text>
          </Box>
          <Box bg="#1a1a1a" p={4} borderRadius="md" mb={4} color="white">
            <Text fontWeight="bold" mb={2}>数据与隐私</Text>
            <Text fontSize="sm" color="whiteAlpha.700">
              管理您的数据使用和隐私偏好设置。
            </Text>
          </Box>
          <Box bg="#1a1a1a" p={4} borderRadius="md" color="white">
            <Text fontWeight="bold" mb={2}>账户设置</Text>
            <Text fontSize="sm" color="whiteAlpha.700">
              更新您的账户信息和订阅设置。
            </Text>
          </Box>
        </Box>
      );
    default:
      return <RagQueryUI />;
  }
};

const Sidebar = () => {
  const { isExpanded, toggleExpand, activeSidebar } = useSidebarStore();
  const theme = useTheme();
  const [prevSidebar, setPrevSidebar] = useState<SidebarType | null>(null);
  
  // 从主题中获取颜色代码
  const sidebarColor = "#121212"; // sidebar.bg的颜色代码
  const sidebarHoverColor = "#1a1a1a"; // sidebar.hover的颜色代码
  
  // 跟踪侧栏状态变化以确定方向
  useEffect(() => {
    setPrevSidebar((prev) => {
      if (prev !== activeSidebar) {
        return prev;
      }
      return null;
    });
    
    const timer = setTimeout(() => {
      setPrevSidebar(activeSidebar);
    }, 500); // 延迟设置，以确保动画完成
    
    return () => clearTimeout(timer);
  }, [activeSidebar]);

  return (
    <Box position="relative" h="100%" zIndex="100">
      <MotionBox 
        p={0} // 移除所有内边距，让子组件控制自己的布局
        pt={2} // 仅保留顶部轻微内边距
        pb={2} // 保留底部轻微内边距
        h="100%" 
        animate={{ 
          width: isExpanded ? "calc(75vw)" : "260px", // 收起时与父容器宽度一致，展开时保留一定右侧空间
          zIndex: isExpanded ? 200 : 100
        }}
        transition={{ 
          duration: 0.4, 
          ease: [0.25, 0.1, 0.25, 1.0], // 使用cubic-bezier曲线，更平滑的动画
          type: "tween" 
        }}
        position="relative"
        display="flex"
        flexDirection="row" // 改为水平方向布局
        bg="sidebar.bg"
        boxShadow={isExpanded ? "dark-lg" : "md"}
        className="sidebar"
        ml={0}
        borderRadius="xl"
        overflow="hidden" // 确保内容不会溢出
      >
        {/* 左侧侧栏区域 - 固定宽度 */}
        <Flex 
          direction="column" 
          width="260px" 
          minWidth="260px"
          flexShrink={0} // 防止收缩
          flexBasis="260px" // 确保基础尺寸也是固定的
          borderRight={isExpanded ? "1px solid" : "none"}
          borderColor="whiteAlpha.200"
          position="relative"
          overflow="hidden" // 确保动画不会溢出
          pb={2} // 添加底部内边距
          px={0} // 移除水平内边距
          style={{ perspective: '1200px', WebkitPerspective: '1200px' }} // 添加3D视角
        >
          {/* 使用AnimatePresence和动态key实现侧栏切换动画 */}
          <AnimatePresence initial={false} mode="sync" custom={getDirection(activeSidebar, prevSidebar)}>
            <MotionFlex
              key={activeSidebar}
              custom={getDirection(activeSidebar, prevSidebar)}
              variants={sidebarContentVariants}
              initial="enter"
              animate="center"
              exit="exit"
              direction="column"
              width="100%"
              height="100%"
              align="center"
              justify="flex-start"
              px={0} // 移除水平内边距
              style={{ 
                transformStyle: 'preserve-3d', // 保持3D效果
                WebkitTransformStyle: 'preserve-3d', // 添加webkit前缀
                backfaceVisibility: 'hidden',  // 隐藏背面
                WebkitBackfaceVisibility: 'hidden', // 添加webkit前缀
                position: 'absolute',          // 绝对定位以叠加动画
                willChange: 'transform',        // 提示浏览器将使用硬件加速
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)'  // 添加阴影增强3D效果
              }}
            >
              {activeSidebar === 'original' && <OriginalSidebar />}
              {activeSidebar === 'bookshelf' && <BookshelfContent />}
              {activeSidebar === 'favorites' && <FavoritesContent />}
              {activeSidebar === 'trending' && <TrendingContent />}
              {activeSidebar === 'settings' && <SettingsContent />}
            </MotionFlex>
          </AnimatePresence>
        </Flex>
        
        {/* 右侧内容区域 - 仅在展开时显示，内容根据当前侧栏类型变化 */}
        {isExpanded && (
          <MotionBox
            flex="1"
            ml={6}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              delay: 0.1, 
              duration: 0.3,
              ease: "easeOut"
            }}
            overflowY="auto"
            overflowX="hidden"
            pr={4}
            maxW="calc(100% - 260px - 6rem)"
          >
            {getExpandedContent(activeSidebar)}
          </MotionBox>
        )}
      </MotionBox>

      {/* 半圆形展开按钮 - 仅在非原始侧栏时显示 */}
      <AnimatePresence>
        {shouldShowExpandButton(activeSidebar) && (
          <MotionBox
            position="absolute"
            right="-15px"
            top="50%"
            transform="translateY(-50%)"
            width="50px"
            height="100px"
            bg={sidebarColor}
            borderRightRadius="full"
            display="flex"
            alignItems="center"
            justifyContent="flex-start"
            paddingLeft="15px"
            cursor="pointer"
            onClick={toggleExpand}
            animate={{
              right: isExpanded ? "0px" : "-51px",
              transform: isExpanded ? "translateY(-50%) rotate(180deg)" : "translateY(-50%)",
              backgroundColor: isExpanded ? sidebarHoverColor : sidebarColor,
              opacity: 1
            }}
            initial={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 0.3,
              ease: "easeInOut"
            }}
            zIndex={300} // 提高z-index确保按钮始终可见
            boxShadow="0 0 15px rgba(0,0,0,0.4)"
            _hover={{
              bg: sidebarHoverColor,
              boxShadow: "0 0 20px rgba(0,0,0,0.5)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRightIcon color="white" boxSize={7} fontWeight="bold" />
          </MotionBox>
        )}
      </AnimatePresence>
      
      {/* 半透明背景 - 仅在展开时显示 */}
      {isExpanded && (
        <Box
          position="fixed"
          top={0}
          right={0}
          width="25vw" // 与展开宽度配合，确保保留5%右侧空间
          height="100vh"
          bg="rgba(0, 0, 0, 0.5)"
          zIndex={199} // 低于侧栏但高于内容区域
        />
      )}
    </Box>
  );
};

export default Sidebar; 