import { useState, useCallback } from 'react';
import { ApiStoryRepository } from '../infrastructure/ApiStoryRepository';
import type { Story } from '../domain/types';

// ============================================================================
// TYPES
// ============================================================================

export interface UploadStoryRequest {
  video: File;
  description: string;
  thumbnail?: File;
  locations?: Array<{
    countryIso2: string;
    cityIso2?: string;
  }>;
}

export type { Story };

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

// ============================================================================
// HOOK
// ============================================================================

export interface UseBunnyUploadParams {
  accessToken: string;
  teacherId: string;
}

export function useBunnyUpload({ accessToken, teacherId }: UseBunnyUploadParams) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress>({ loaded: 0, total: 0, percentage: 0 });
  const [error, setError] = useState<string | null>(null);
  const [uploadedStory, setUploadedStory] = useState<Story | null>(null);
  
  const repository = new ApiStoryRepository();

  /**
   * Subir story completa (video + thumbnail + metadata)
   * Usa el repositorio para hacer POST a /api/v1/stories
   */
  const uploadStory = useCallback(async (request: UploadStoryRequest): Promise<Story | null> => {
    setIsUploading(true);
    setError(null);
    setProgress({ loaded: 0, total: 0, percentage: 0 });
    setUploadedStory(null);

    try {
      const story = await repository.createStory(
        {
          token: accessToken,
          teacherId,
          video: request.video,
          description: request.description,
          thumbnail: request.thumbnail,
          locations: request.locations,
        },
        (percentage) => {
          setProgress({
            loaded: percentage,
            total: 100,
            percentage,
          });
        }
      );

      setProgress({ loaded: 100, total: 100, percentage: 100 });
      setUploadedStory(story);
      setIsUploading(false);
      
      return story;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      setIsUploading(false);
      return null;
    }
  }, [accessToken, repository]);

  return {
    uploadStory,
    isUploading,
    progress,
    error,
    uploadedStory,
  };
}
