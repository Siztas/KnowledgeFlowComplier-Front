import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  error: string | null;
}

interface AuthActions {
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

// 模拟用户数据库
const mockUsers: Array<Omit<User, 'id' | 'createdAt'> & { password: string }> = [
  { username: 'demo', email: 'demo@example.com', password: 'demo123' },
  { username: 'test', email: 'test@example.com', password: 'test123' }
];

// 模拟登录API
const mockLogin = async (username: string, password: string): Promise<User | null> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const user = mockUsers.find(u => u.username === username && u.password === password);
  if (user) {
    return {
      id: Math.random().toString(36).substring(7),
      username: user.username,
      email: user.email,
      createdAt: new Date()
    };
  }
  return null;
};

// 模拟注册API
const mockRegister = async (username: string, email: string, password: string): Promise<User | null> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 检查用户名是否已存在
  if (mockUsers.find(u => u.username === username)) {
    throw new Error('用户名已存在');
  }
  
  // 检查邮箱是否已存在
  if (mockUsers.find(u => u.email === email)) {
    throw new Error('邮箱已被注册');
  }
  
  // 添加到模拟数据库
  const newUser = { username, email, password };
  mockUsers.push(newUser);
  
  return {
    id: Math.random().toString(36).substring(7),
    username,
    email,
    createdAt: new Date()
  };
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      isAuthenticated: false,
      isLoading: false,
      user: null,
      error: null,

      // 登录
      login: async (username: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const user = await mockLogin(username, password);
          if (user) {
            set({ 
              isAuthenticated: true, 
              user, 
              isLoading: false,
              error: null 
            });
            return true;
          } else {
            set({ 
              isLoading: false, 
              error: '用户名或密码错误' 
            });
            return false;
          }
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : '登录失败' 
          });
          return false;
        }
      },

      // 注册
      register: async (username: string, email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const user = await mockRegister(username, email, password);
          if (user) {
            set({ 
              isAuthenticated: true, 
              user, 
              isLoading: false,
              error: null 
            });
            return true;
          }
          return false;
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : '注册失败' 
          });
          return false;
        }
      },

      // 登出
      logout: () => {
        set({ 
          isAuthenticated: false, 
          user: null, 
          error: null 
        });
      },

      // 清除错误
      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated, 
        user: state.user 
      }),
    }
  )
); 