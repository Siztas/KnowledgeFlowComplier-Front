"use client";

import {
  Box,
  Flex,
  Text,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  IconButton,
  useToast
} from '@chakra-ui/react';
import { ChevronDownIcon, SettingsIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

export default function UserProfile() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const toast = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: '已退出登录',
      description: '您已成功退出账户',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    router.push('/login');
  };

  if (!user) {
    return null;
  }

  // 获取用户头像的初始字母
  const getInitials = (username: string) => {
    return username.charAt(0).toUpperCase();
  };

  return (
    <Box>
      <Menu>
        <MenuButton
          as={Box}
          cursor="pointer"
          _hover={{ transform: "scale(1.05)" }}
          transition="all 0.2s"
        >
          <Flex align="center" gap={2}>
            <Avatar
              size="sm"
              name={user.username}
              bg="brand.500"
              color="white"
              fontWeight="bold"
            />
            <Box display={{ base: "none", md: "block" }}>
              <Text color="white" fontSize="sm" fontWeight="medium">
                {user.username}
              </Text>
            </Box>
            <ChevronDownIcon color="whiteAlpha.700" boxSize={4} />
          </Flex>
        </MenuButton>

        <MenuList bg="gray.800" borderColor="whiteAlpha.200" minW="200px">
          {/* 用户信息 */}
          <Box px={3} py={2}>
            <Text color="white" fontWeight="bold" fontSize="sm">
              {user.username}
            </Text>
            <Text color="whiteAlpha.600" fontSize="xs">
              {user.email}
            </Text>
          </Box>

          <MenuDivider borderColor="whiteAlpha.200" />

          {/* 菜单项 */}
          <MenuItem
            bg="transparent"
            color="white"
            _hover={{ bg: "whiteAlpha.100" }}
            icon={<SettingsIcon />}
          >
            账户设置
          </MenuItem>

          <MenuItem
            bg="transparent"
            color="white"
            _hover={{ bg: "whiteAlpha.100" }}
            icon={<ExternalLinkIcon />}
          >
            帮助与支持
          </MenuItem>

          <MenuDivider borderColor="whiteAlpha.200" />

          {/* 登出 */}
          <MenuItem
            bg="transparent"
            color="red.300"
            _hover={{ bg: "red.900", color: "red.200" }}
            onClick={handleLogout}
          >
            退出登录
          </MenuItem>
        </MenuList>
      </Menu>
    </Box>
  );
} 