// Solution 1: Add authentication guard to components
import { isLoggedIn } from '@/utils/auth';
import { useRouter } from 'next/navigation';

export const useAuthGuard = () => {
  const router = useRouter();
  
  const checkAuth = async () => {
    const loggedIn = await isLoggedIn();
    if (!loggedIn) {
      console.warn('User not authenticated, redirecting to login');
      router.push('/login');
      return false;
    }
    return true;
  };
  
  return checkAuth;
};

// Usage in components:
const MyComponent = () => {
  const checkAuth = useAuthGuard();
  
  const handleApiCall = async () => {
    if (await checkAuth()) {
      // Make authenticated API call
      await api.getNovel('fefef');
    }
  };
}