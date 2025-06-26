"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  VStack,
  Heading,
  Input,
  Button,
  Text,
  Link,
  Alert,
  AlertIcon,
  Flex,
  InputGroup,
  InputLeftElement,
  Icon,
  useToast
} from '@chakra-ui/react';
import { EmailIcon, LockIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const toast = useToast();
  
  const { login, isLoading, error, clearError, isAuthenticated } = useAuthStore();

  // 如果已经登录，重定向到主页
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  // 清除错误信息
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      toast({
        title: '请填写完整信息',
        description: '用户名和密码都不能为空',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const success = await login(username, password);
    if (success) {
      toast({
        title: '登录成功',
        description: `欢迎回来，${username}！`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      router.push('/');
    }
  };

  return (
    <Box bg="black" minH="100vh" display="flex" alignItems="center" justifyContent="center">
      <Container maxW="md" centerContent>
        <MotionVStack
          spacing={8}
          w="full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Logo和标题 */}
          <VStack spacing={4}>
            <MotionBox
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Heading 
                size="2xl" 
                color="white" 
                textAlign="center"
                bgGradient="linear(to-r, brand.400, brand.600)"
                bgClip="text"
              >
                KFC-Web
              </Heading>
            </MotionBox>
            <Text color="whiteAlpha.700" textAlign="center" fontSize="lg">
              登录到您的账户
            </Text>
          </VStack>

          {/* 登录表单 */}
          <MotionBox
            w="full"
            bg="whiteAlpha.100"
            p={8}
            borderRadius="xl"
            borderWidth={1}
            borderColor="whiteAlpha.200"
            backdropFilter="blur(10px)"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <form onSubmit={handleSubmit}>
              <VStack spacing={6}>
                {/* 错误提示 */}
                {error && (
                  <Alert status="error" borderRadius="md" bg="red.900" color="white">
                    <AlertIcon color="red.300" />
                    {error}
                  </Alert>
                )}

                {/* 用户名输入 */}
                <InputGroup size="lg">
                  <InputLeftElement pointerEvents="none">
                    <EmailIcon color="whiteAlpha.600" />
                  </InputLeftElement>
                  <Input
                    placeholder="用户名"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    bg="whiteAlpha.100"
                    color="white"
                    borderColor="whiteAlpha.300"
                    _hover={{ borderColor: "whiteAlpha.400" }}
                    _focus={{
                      borderColor: "brand.500",
                      boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
                    }}
                    _placeholder={{ color: "whiteAlpha.500" }}
                  />
                </InputGroup>

                {/* 密码输入 */}
                <InputGroup size="lg">
                  <InputLeftElement pointerEvents="none">
                    <LockIcon color="whiteAlpha.600" />
                  </InputLeftElement>
                  <Input
                    type="password"
                    placeholder="密码"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    bg="whiteAlpha.100"
                    color="white"
                    borderColor="whiteAlpha.300"
                    _hover={{ borderColor: "whiteAlpha.400" }}
                    _focus={{
                      borderColor: "brand.500",
                      boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
                    }}
                    _placeholder={{ color: "whiteAlpha.500" }}
                  />
                </InputGroup>

                {/* 登录按钮 */}
                <Button
                  type="submit"
                  colorScheme="brand"
                  size="lg"
                  w="full"
                  isLoading={isLoading}
                  loadingText="登录中..."
                  _hover={{ transform: "translateY(-1px)", boxShadow: "lg" }}
                  transition="all 0.2s"
                >
                  登录
                </Button>

                {/* 分割线 */}
                <Flex w="full" align="center">
                  <Box flex="1" h="1px" bg="whiteAlpha.300" />
                  <Text mx={4} color="whiteAlpha.600" fontSize="sm">
                    或
                  </Text>
                  <Box flex="1" h="1px" bg="whiteAlpha.300" />
                </Flex>

                {/* 注册链接 */}
                <Text color="whiteAlpha.700" textAlign="center">
                  还没有账户？{' '}
                  <Link
                    color="brand.400"
                    href="/register"
                    _hover={{ color: "brand.300", textDecoration: "underline" }}
                    fontWeight="medium"
                  >
                    立即注册
                  </Link>
                </Text>

                {/* 演示账户提示 */}
                <Box
                  w="full"
                  p={4}
                  bg="whiteAlpha.50"
                  borderRadius="md"
                  borderWidth={1}
                  borderColor="whiteAlpha.200"
                >
                  <Text color="whiteAlpha.800" fontSize="sm" fontWeight="medium" mb={2}>
                    演示账户:
                  </Text>
                  <Text color="whiteAlpha.600" fontSize="xs">
                    用户名: demo / 密码: demo123<br />
                    用户名: test / 密码: test123
                  </Text>
                </Box>
              </VStack>
            </form>
          </MotionBox>
        </MotionVStack>
      </Container>
    </Box>
  );
} 