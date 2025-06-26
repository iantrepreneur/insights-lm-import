import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

export const useLogout = () => {
  const { signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const logout = async () => {
    try {
      await signOut();
      
      toast({
        title: t('signedOut'),
        description: t('signedOutSuccess')
      });
      
      // Redirect to auth page
      navigate('/auth', { replace: true });
      
    } catch (error: any) {
      console.error('Logout error:', error);
      
      // Even if there's an error, redirect to auth page
      toast({
        title: t('signedOut'),
        description: t('signedOutLocally'),
        variant: "default"
      });
      
      navigate('/auth', { replace: true });
    }
  };

  return { logout };
};