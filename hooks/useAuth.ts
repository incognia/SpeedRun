import { useAuth as useAuthContext } from '@/components/providers/AuthProvider';

export const useAuth = () => {
  return useAuthContext();
};
