"use client";

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Spinner, Flex, Text } from '@chakra-ui/react';
import { useAuthStore } from '@/store/authStore';

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // 检查认证状态
    if (!isAuthenticated) {
      // 如果未登录，重定向到登录页
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // 如果未认证，显示加载页面
  if (!isAuthenticated) {
    return (
      <Box bg="black" minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <Flex direction="column" align="center" justify="center">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="whiteAlpha.200"
            color="brand.500"
            size="xl"
            mb={4}
          />
          <Text color="white" fontSize="lg">
            正在检查登录状态...
          </Text>
        </Flex>
      </Box>
    );
  }

  // 如果已认证，渲染受保护的内容
  return <>{children}</>;
} 