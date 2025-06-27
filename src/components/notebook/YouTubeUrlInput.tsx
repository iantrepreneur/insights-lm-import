import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Youtube } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface YouTubeUrlInputProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (url: string) => void;
}

const YouTubeUrlInput = ({ open, onOpenChange, onSubmit }: YouTubeUrlInputProps) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    try {
      await onSubmit(url.trim());
      setUrl('');
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding YouTube source:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Youtube className="h-5 w-5 text-red-600" />
            <span>Ajouter une vidéo YouTube</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="youtube-url">URL YouTube</Label>
            <Input
              id="youtube-url"
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
            <p className="text-xs text-gray-500">
              Collez l'URL complète de la vidéo YouTube
            </p>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              {t('cancel')}
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={!url.trim() || isLoading}
            >
              {isLoading ? 'Ajout en cours...' : 'Ajouter la source'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default YouTubeUrlInput;