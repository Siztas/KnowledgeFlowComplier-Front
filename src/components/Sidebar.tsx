"use client";

import { Box, Heading, IconButton } from "@chakra-ui/react";
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import ShelfDroppable from "./ShelfDroppable";

const MotionBox = motion(Box);

const Sidebar = () => {
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
      
      <ShelfDroppable />

      {isExpanded && (
        <Box mt={8} p={4} borderTop="1px solid" borderColor="gray.200">
          <Heading size="md" mb={4}>RAG问答</Heading>
          <Box 
            p={4}
            borderWidth={1}
            borderRadius="md"
            bg="gray.50"
          >
            <Box color="gray.500" fontStyle="italic">
              请先将文章添加到书架，然后在此处进行问答...
            </Box>
          </Box>
        </Box>
      )}
    </MotionBox>
  );
};

export default Sidebar; 