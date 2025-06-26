import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log('User is authenticated, redirecting to dashboard');
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSignIn = async () => {
    console.log('Attempting sign in for:', email);
    
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Sign in error:', error);
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('Email ou mot de passe invalide. Veuillez vérifier vos identifiants et réessayer.');
      } else if (error.message.includes('Email not confirmed')) {
        throw new Error('Veuillez vérifier votre email et cliquer sur le lien de confirmation avant de vous connecter.');
      } else {
        throw error;
      }
    }
    
    console.log('Sign in successful:', data.user?.email);
    
    toast({
      title: t('welcomeBack'),
      description: t('signInSuccess'),
    });
  };

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      throw new Error('Les mots de passe ne correspondent pas.');
    }

    if (password.length < 6) {
      throw new Error('Le mot de passe doit contenir au moins 6 caractères.');
    }

    console.log('Attempting sign up for:', email);
    
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    
    if (error) {
      console.error('Sign up error:', error);
      if (error.message.includes('User already registered')) {
        throw new Error('Un compte avec cette adresse email existe déjà. Veuillez vous connecter.');
      } else {
        throw error;
      }
    }
    
    console.log('Sign up successful:', data.user?.email);
    
    toast({
      title: 'Compte créé avec succès',
      description: 'Vous pouvez maintenant vous connecter avec vos identifiants.',
    });

    // Switch to sign-in mode after successful registration
    setIsSignUp(false);
    setPassword('');
    setConfirmPassword('');
    setFullName('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        await handleSignUp();
      } else {
        await handleSignIn();
      }
    } catch (error: any) {
      console.error('Auth form error:', error);
      toast({
        title: isSignUp ? 'Erreur lors de la création du compte' : t('signInError'),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setPassword('');
    setConfirmPassword('');
    setFullName('');
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{isSignUp ? 'Créer un compte' : t('signIn')}</CardTitle>
        <CardDescription>
          {isSignUp 
            ? 'Créez votre compte pour commencer'
            : t('authCredentials')
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="fullName">Nom complet</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Entrez votre nom complet"
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">{t('email')}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder={t('enterEmail')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t('password')}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder={t('enterPassword')}
              minLength={6}
            />
          </div>
          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirmez votre mot de passe"
                minLength={6}
              />
            </div>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading 
              ? (isSignUp ? 'Création du compte...' : t('signingIn'))
              : (isSignUp ? 'Créer un compte' : t('signIn'))
            }
          </Button>
        </form>
        
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={toggleMode}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            {isSignUp 
              ? 'Vous avez déjà un compte ? Se connecter'
              : 'Pas de compte ? Créer un compte'
            }
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthForm;