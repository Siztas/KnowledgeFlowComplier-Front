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
  useToast
} from '@chakra-ui/react';
import { EmailIcon, LockIcon, AtSignIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();
  const toast = useToast();
  
  const { register, isLoading, error, clearError, isAuthenticated } = useAuthStore();

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

  const validateForm = () => {
    if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      toast({
        title: '请填写完整信息',
        description: '所有字段都不能为空',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    if (username.length < 3) {
      toast({
        title: '用户名太短',
        description: '用户名至少需要3个字符',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: '邮箱格式不正确',
        description: '请输入有效的邮箱地址',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    if (password.length < 6) {
      toast({
        title: '密码太短',
        description: '密码至少需要6个字符',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    if (password !== confirmPassword) {
      toast({
        title: '密码不匹配',
        description: '两次输入的密码不一致',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const success = await register(username, email, password);
    if (success) {
      toast({
        title: '注册成功',
        description: `欢迎加入，${username}！`,
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
              创建您的账户
            </Text>
          </VStack>

          {/* 注册表单 */}
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
                    <AtSignIcon color="whiteAlpha.600" />
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

                {/* 邮箱输入 */}
                <InputGroup size="lg">
                  <InputLeftElement pointerEvents="none">
                    <EmailIcon color="whiteAlpha.600" />
                  </InputLeftElement>
                  <Input
                    type="email"
                    placeholder="邮箱地址"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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

                {/* 确认密码输入 */}
                <InputGroup size="lg">
                  <InputLeftElement pointerEvents="none">
                    <LockIcon color="whiteAlpha.600" />
                  </InputLeftElement>
                  <Input
                    type="password"
                    placeholder="确认密码"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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

                {/* 注册按钮 */}
                <Button
                  type="submit"
                  colorScheme="brand"
                  size="lg"
                  w="full"
                  isLoading={isLoading}
                  loadingText="注册中..."
                  _hover={{ transform: "translateY(-1px)", boxShadow: "lg" }}
                  transition="all 0.2s"
                >
                  创建账户
                </Button>

                {/* 分割线 */}
                <Flex w="full" align="center">
                  <Box flex="1" h="1px" bg="whiteAlpha.300" />
                  <Text mx={4} color="whiteAlpha.600" fontSize="sm">
                    或
                  </Text>
                  <Box flex="1" h="1px" bg="whiteAlpha.300" />
                </Flex>

                {/* 登录链接 */}
                <Text color="whiteAlpha.700" textAlign="center">
                  已有账户？{' '}
                  <Link
                    color="brand.400"
                    href="/login"
                    _hover={{ color: "brand.300", textDecoration: "underline" }}
                    fontWeight="medium"
                  >
                    立即登录
                  </Link>
                </Text>

                {/* 注册提示 */}
                <Box
                  w="full"
                  p={4}
                  bg="whiteAlpha.50"
                  borderRadius="md"
                  borderWidth={1}
                  borderColor="whiteAlpha.200"
                >
                  <Text color="whiteAlpha.800" fontSize="sm" fontWeight="medium" mb={2}>
                    注册要求:
                  </Text>
                  <Text color="whiteAlpha.600" fontSize="xs">
                    • 用户名至少3个字符<br />
                    • 有效的邮箱地址<br />
                    • 密码至少6个字符
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