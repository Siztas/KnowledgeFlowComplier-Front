"use client";

import { useState, useCallback, KeyboardEvent } from "react";
import { Box, Input, InputGroup, InputRightElement, IconButton, Flex } from "@chakra-ui/react";
import { SearchIcon, CloseIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

interface SearchBarProps {
  onSearch: (query: string) => void;
  onClear: () => void;
  isSearching: boolean;
}

const SearchBar = ({ onSearch, onClear, isSearching }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  
  // 处理搜索提交
  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  }, [searchQuery, onSearch]);
  
  // 处理按键事件（回车搜索）
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  }, [handleSearch]);
  
  // 处理清除搜索
  const handleClear = useCallback(() => {
    setSearchQuery("");
    onClear();
  }, [onClear]);
  
  return (
    <MotionBox
      position="relative"
      w="100%"
      maxW="800px"
      mx="auto"
      mt={6}
      mb={6}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <InputGroup>
        <Input
          placeholder="搜索文章..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          size="lg"
          bg="#1a1a1a"
          color="white"
          borderColor="whiteAlpha.300"
          _hover={{ borderColor: "brand.400" }}
          _focus={{ borderColor: "brand.500", boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)" }}
          borderRadius="full"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          pr="5rem"
        />
        
        {/* 清除按钮 */}
        {searchQuery && (
          <InputRightElement right="3.5rem" h="full">
            <IconButton
              aria-label="清除搜索"
              icon={<CloseIcon />}
              size="sm"
              variant="ghost"
              colorScheme="whiteAlpha"
              onClick={handleClear}
              _hover={{ bg: "whiteAlpha.200" }}
              _active={{ bg: "whiteAlpha.300" }}
            />
          </InputRightElement>
        )}
        
        {/* 搜索按钮 */}
        <InputRightElement right="0.5rem" h="full">
          <IconButton
            aria-label="搜索"
            icon={<SearchIcon />}
            size="md"
            colorScheme="brand"
            onClick={handleSearch}
            borderRadius="full"
          />
        </InputRightElement>
      </InputGroup>
      
      {/* 搜索中或有结果的提示 */}
      {isSearching && searchQuery && (
        <MotionFlex
          position="absolute"
          top="100%"
          right="10px"
          mt={2}
          px={4}
          py={2}
          bg="brand.500"
          color="white"
          borderRadius="md"
          align="center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <Box fontSize="sm">搜索：{searchQuery}</Box>
          <IconButton
            aria-label="清除"
            icon={<CloseIcon boxSize={3} />}
            size="xs"
            variant="ghost"
            ml={2}
            onClick={handleClear}
          />
        </MotionFlex>
      )}
    </MotionBox>
  );
};

export default SearchBar; 