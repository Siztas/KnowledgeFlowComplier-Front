"use client";

import { Box, Text, IconButton } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { ShelfArticle } from "@/types/article";
import { useArticleStore } from "@/store/articleStore";
import { motion, AnimatePresence } from "framer-motion";
import EnhancedImage from "./EnhancedImage";

interface ShelfArticleCardProps {
  article: ShelfArticle;
}

const MotionBox = motion(Box);

const ShelfArticleCard = ({ article }: ShelfArticleCardProps) => {
  const { id, title, imageUrl } = article;
  const removeFromShelf = useArticleStore((state) => state.removeFromShelf);

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeFromShelf(id);
  };

  return (
    <AnimatePresence>
      <MotionBox
        layout
        initial={{ opacity: 0, x: -20, height: 0 }}
        animate={{ opacity: 1, x: 0, height: "100px" }}
        exit={{ opacity: 0, x: 20, height: 0 }}
        transition={{ 
          type: "spring",
          stiffness: 500,
          damping: 30,
          opacity: { duration: 0.2 }
        }}
        borderWidth={1}
        borderColor="whiteAlpha.200"
        borderRadius="md"
        overflow="hidden"
        bg="card.bg"
        boxShadow="dark-sm"
        _hover={{ 
          boxShadow: "dark-md",
          transform: "translateY(-2px)",
          borderColor: "whiteAlpha.300"
        }}
        cursor="pointer"
        position="relative"
        whileHover={{ scale: 1.02 }}
      >
        <IconButton
          aria-label="从书架中移除"
          icon={<CloseIcon />}
          size="xs"
          position="absolute"
          top="5px"
          right="5px"
          zIndex={2}
          onClick={handleRemove}
          opacity={0.7}
          bg="blackAlpha.600"
          color="white"
          _hover={{ opacity: 1, bg: "red.500", color: "white" }}
          transition="all 0.2s"
        />
        <Box h="60px" overflow="hidden">
          <EnhancedImage
            src={imageUrl}
            alt={title}
            displayMode="thumbnail"
            height="60px"
            width="100%"
          />
        </Box>
        <Box p={2}>
          <Text 
            fontSize="sm" 
            fontWeight="medium" 
            overflow="hidden" 
            textOverflow="ellipsis" 
            whiteSpace="nowrap"
            color="white"
          >
            {title}
          </Text>
        </Box>
      </MotionBox>
    </AnimatePresence>
  );
};

export default ShelfArticleCard; 