"use client";

import { useState, useCallback, KeyboardEvent, useEffect, useRef, InputHTMLAttributes, ForwardedRef, forwardRef } from "react";
import { Box, Input, InputGroup, InputRightElement, IconButton, Flex, List, ListItem, Text, InputProps } from "@chakra-ui/react";
import { SearchIcon, CloseIcon, TimeIcon } from "@chakra-ui/icons";
import { motion, AnimatePresence } from "framer-motion";

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionList = motion(List);
const MotionListItem = motion(ListItem);

interface SearchBarProps {
  onSearch: (query: string) => void;
  onClear: () => void;
  isSearching: boolean;
}

// 创建一个包裹Input的组件来防止水合错误
const HydrationSafeInput = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return (
    <Box suppressHydrationWarning>
      <Input {...props} ref={ref} />
    </Box>
  );
});

HydrationSafeInput.displayName = 'HydrationSafeInput';

const SearchBar = ({ onSearch, onClear, isSearching }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);
  
  // 从localStorage加载搜索历史
  useEffect(() => {
    const history = localStorage.getItem("search-history");
    if (history) {
      try {
        setSearchHistory(JSON.parse(history));
      } catch (e) {
        console.error("Failed to parse search history:", e);
      }
    }
  }, []);
  
  // 处理搜索提交
  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      // 保存到搜索历史
      const newHistory = [
        searchQuery.trim(), 
        ...searchHistory.filter(h => h !== searchQuery.trim())
      ].slice(0, 5); // 最多保存5条
      
      setSearchHistory(newHistory);
      localStorage.setItem("search-history", JSON.stringify(newHistory));
      
      onSearch(searchQuery.trim());
      setShowHistory(false);
    }
  }, [searchQuery, onSearch, searchHistory]);
  
  // 处理按键事件（回车搜索）
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    } else if (e.key === "Escape") {
      setShowHistory(false);
    } else if (e.key === "ArrowDown" && showHistory && searchHistory.length > 0) {
      // 可以通过键盘浏览历史
      const historyItems = historyRef.current?.querySelectorAll('[role="button"]');
      if (historyItems && historyItems.length > 0) {
        (historyItems[0] as HTMLElement).focus();
      }
    }
  }, [handleSearch, showHistory, searchHistory]);
  
  // 处理清除搜索
  const handleClear = useCallback(() => {
    setSearchQuery("");
    onClear();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [onClear]);
  
  // 处理搜索历史项点击
  const handleHistoryItemClick = useCallback((query: string) => {
    setSearchQuery(query);
    onSearch(query);
    setShowHistory(false);
  }, [onSearch]);
  
  // 处理点击外部以关闭历史下拉框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        historyRef.current && 
        !historyRef.current.contains(event.target as Node) &&
        inputRef.current && 
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowHistory(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  return (
    <MotionBox
      position="relative"
      w="100%"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      suppressHydrationWarning
    >
      <InputGroup size="md" suppressHydrationWarning>
        <HydrationSafeInput
          ref={inputRef}
          placeholder="搜索文章..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          bg="#1a1a1a"
          color="white"
          borderColor={isFocused ? "brand.400" : "whiteAlpha.300"}
          _hover={{ borderColor: "brand.400" }}
          _focus={{ borderColor: "brand.500", boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)" }}
          borderRadius="full"
          onFocus={() => {
            setIsFocused(true);
            // 只有当有历史记录且输入框为空时显示历史
            if (searchHistory.length > 0) {
              setShowHistory(true);
            }
          }}
          onBlur={() => setIsFocused(false)}
          pr="22rem"
          height="40px"
          spellCheck="false"
          data-ms-editor="true"
          suppressHydrationWarning
        />
        
        {/* 清除按钮 */}
        {searchQuery && (
          <InputRightElement right="2.5rem" h="full" suppressHydrationWarning>
            <IconButton
              aria-label="清除搜索"
              icon={<CloseIcon boxSize={3} />}
              size="sm"
              variant="ghost"
              colorScheme="whiteAlpha"
              onClick={handleClear}
              _hover={{ bg: "whiteAlpha.200" }}
              _active={{ bg: "whiteAlpha.300" }}
              suppressHydrationWarning
            />
          </InputRightElement>
        )}
        
        {/* 搜索按钮 */}
        <InputRightElement right="0" h="full" suppressHydrationWarning>
          <IconButton
            aria-label="搜索"
            icon={<SearchIcon />}
            size="sm"
            colorScheme="brand"
            onClick={handleSearch}
            borderRadius="full"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            as={motion.button}
            suppressHydrationWarning
          />
        </InputRightElement>
      </InputGroup>
      
      {/* 搜索历史下拉框 */}
      <AnimatePresence>
        {showHistory && searchHistory.length > 0 && (
          <MotionBox
            ref={historyRef}
            position="absolute"
            top="calc(100% + 5px)"
            left="0"
            right="0"
            bg="#1a1a1a"
            borderRadius="md"
            boxShadow="0 4px 8px rgba(0,0,0,0.3)"
            zIndex="dropdown"
            overflow="hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            suppressHydrationWarning
          >
            <MotionList spacing={0} suppressHydrationWarning>
              {searchHistory.map((query, index) => (
                <MotionListItem
                  key={index}
                  p={3}
                  cursor="pointer"
                  _hover={{ bg: "whiteAlpha.100" }}
                  borderBottom={index < searchHistory.length - 1 ? "1px solid" : "none"}
                  borderColor="whiteAlpha.100"
                  onClick={() => handleHistoryItemClick(query)}
                  display="flex"
                  alignItems="center"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleHistoryItemClick(query);
                    if (e.key === 'ArrowDown' && index < searchHistory.length - 1) {
                      const items = historyRef.current?.querySelectorAll('[role="button"]');
                      if (items && items[index + 1]) (items[index + 1] as HTMLElement).focus();
                    }
                    if (e.key === 'ArrowUp') {
                      if (index > 0) {
                        const items = historyRef.current?.querySelectorAll('[role="button"]');
                        if (items && items[index - 1]) (items[index - 1] as HTMLElement).focus();
                      } else {
                        inputRef.current?.focus();
                      }
                    }
                  }}
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                >
                  <TimeIcon mr={2} color="whiteAlpha.600" />
                  <Text color="white">{query}</Text>
                </MotionListItem>
              ))}
            </MotionList>
          </MotionBox>
        )}
      </AnimatePresence>
      
      {/* 搜索中或有结果的提示 */}
      {isSearching && searchQuery && (
        <MotionFlex
          position="absolute"
          top="calc(100% + 5px)"
          right="10px"
          px={3}
          py={1}
          bg="brand.500"
          color="white"
          borderRadius="md"
          align="center"
          fontSize="xs"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <Box>搜索中...</Box>
        </MotionFlex>
      )}
    </MotionBox>
  );
};

export default SearchBar; 