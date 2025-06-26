import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAudioOverview = (notebookId?: string) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<string | null>(null);
  const [isAutoRefreshing, setIsAutoRefreshing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Set up realtime subscription for notebook updates
  useEffect(() => {
    if (!notebookId) return;

    const channel = supabase
      .channel('notebook-audio-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notebooks',
          filter: `id=eq.${notebookId}`
        },
        (payload) => {
          console.log('Notebook updated:', payload);
          const newData = payload.new as any;
          
          if (newData.audio_overview_generation_status) {
            setGenerationStatus(newData.audio_overview_generation_status);
            
            if (newData.audio_overview_generation_status === 'completed' && newData.audio_overview_url) {
              setIsGenerating(false);
              toast({
                title: "Audio Overview Ready!",
                description: "Your deep dive conversation is ready to play!",
              });
              
              // Invalidate queries to refresh the UI
              queryClient.invalidateQueries({ queryKey: ['notebooks'] });
            } else if (newData.audio_overview_generation_status === 'failed') {
              setIsGenerating(false);
              toast({
                title: "Generation Failed",
                description: "Failed to generate audio overview. Please try again.",
                variant: "destructive",
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [notebookId, toast, queryClient]);

  const generateAudioOverview = useMutation({
    mutationFn: async (notebookId: string) => {
      setIsGenerating(true);
      setGenerationStatus('generating');
      
      try {
        // Mettre à jour directement le statut dans la base de données
        const { error: updateError } = await supabase
          .from('notebooks')
          .update({
            audio_overview_generation_status: 'generating'
          })
          .eq('id', notebookId);
          
        if (updateError) {
          console.error('Error updating notebook status:', updateError);
          throw updateError;
        }
        
        // Appeler l'Edge Function pour démarrer la génération audio
        const { data, error } = await supabase.functions.invoke('generate-audio-overview', {
          body: { notebookId }
        });

        if (error) {
          console.error('Error starting audio generation:', error);
          throw error;
        }

        return data;
      } catch (error) {
        console.error('Failed to start audio generation:', error);
        
        // En cas d'erreur, on met à jour le statut pour éviter de bloquer l'interface
        const { error: updateError } = await supabase
          .from('notebooks')
          .update({
            audio_overview_generation_status: 'failed'
          })
          .eq('id', notebookId);
          
        if (updateError) {
          console.error('Error updating notebook status after failure:', updateError);
        }
        
        throw error;
      }
    },
    onSuccess: (data, notebookId) => {
      console.log('Audio generation started successfully:', data);
      
      // Afficher un toast pour informer l'utilisateur
      toast({
        title: "Génération audio démarrée",
        description: "La génération de l'aperçu audio a commencé. Cela peut prendre quelques minutes.",
      });
    },
    onError: (error) => {
      console.error('Audio generation failed to start:', error);
      setIsGenerating(false);
      setGenerationStatus(null);
      
      toast({
        title: "Failed to Start Generation",
        description: error.message || "Failed to start audio generation. Please try again.",
        variant: "destructive",
      });
    }
  });

  const refreshAudioUrl = useMutation({
    mutationFn: async (notebookId: string) => {
      setIsAutoRefreshing(true);

      const { data, error } = await supabase.functions.invoke('refresh-audio-url', {
        body: { notebookId }
      });

      if (error) {
        console.error('Error refreshing audio URL:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      console.log('Audio URL refreshed successfully:', data);
      // Invalidate queries to refresh the UI with new URL
      queryClient.invalidateQueries({ queryKey: ['notebooks'] });
      
      setIsAutoRefreshing(false);
      
      toast({
        title: "URL Audio Actualisée",
        description: "L'URL de l'audio a été actualisée avec succès.",
      });
    },
    onError: (error) => {
      console.error('Failed to refresh audio URL:', error);
      setIsAutoRefreshing(false);
      toast({
        title: "Failed to Refresh URL",
        description: "Unable to refresh the audio URL. Please try again.",
        variant: "destructive",
      });
    }
  });

  const checkAudioExpiry = (expiresAt: string | null): boolean => {
    if (!expiresAt) return true;
    return new Date(expiresAt) <= new Date();
  };

  const autoRefreshIfExpired = async (notebookId: string, expiresAt: string | null) => {
    if (checkAudioExpiry(expiresAt) && !isAutoRefreshing && !refreshAudioUrl.isPending) {
      console.log('Audio URL expired, auto-refreshing...');
      try {
        await refreshAudioUrl.mutateAsync(notebookId);
      } catch (error) {
        console.error('Auto-refresh failed:', error);
      }
    }
  };

  return {
    generateAudioOverview: generateAudioOverview.mutate,
    refreshAudioUrl: refreshAudioUrl.mutate,
    autoRefreshIfExpired,
    isGenerating: isGenerating || generateAudioOverview.isPending,
    isAutoRefreshing,
    generationStatus,
    checkAudioExpiry,
  };
};