"use client";

import { Box, Text, Flex } from "@chakra-ui/react";
import { BsBookHalf } from "react-icons/bs";
import { motion } from "framer-motion";

const MotionFlex = motion(Flex);

const Logo = () => {
  return (
    <MotionFlex
      align="center"
      ml={4}
      mt={4}
      cursor="pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Box
        bg="brand.500"
        borderRadius="md"
        p={2}
        display="flex"
        alignItems="center"
        justifyContent="center"
        mr={2}
        boxSize="40px"
      >
        <BsBookHalf size={24} color="white" />
      </Box>
      <Text
        fontWeight="bold"
        fontSize="xl"
        bgGradient="linear(to-r, brand.300, brand.500)"
        bgClip="text"
      >
        KFC
      </Text>
    </MotionFlex>
  );
};

export default Logo; 