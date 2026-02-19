import { useState, useCallback } from 'react';
import { ApiTeacherRepository } from '@/features/teachers/infrastructure/ApiTeacherRepository';

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UseTeacherVideoUploadParams {
  accessToken: string;
  teacherId: string;
}

export function useTeacherVideoUpload({ accessToken, teacherId }: UseTeacherVideoUploadParams) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress>({ loaded: 0, total: 0, percentage: 0 });
  const [error, setError] = useState<string | null>(null);
  
  const repository = new ApiTeacherRepository();

  /**
   * Subir video de presentación del profesor
   * El backend se encarga de subirlo a Bunny.net y devuelve el videoId
   */
  const uploadVideo = useCallback(async (videoFile: File): Promise<string | null> => {
    setIsUploading(true);
    setError(null);
    setProgress({ loaded: 0, total: 0, percentage: 0 });

    try {
      // Simular progreso durante la subida
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev.percentage >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return {
            loaded: prev.loaded + 10,
            total: 100,
            percentage: prev.percentage + 10,
          };
        });
      }, 300);

      // Llamar al endpoint de actualización del profesor con el video
      // El backend debe manejar el archivo videoPresentation y subirlo a Bunny
      await repository.updateTeacher({
        token: accessToken,
        teacherId,
        data: {
          videoPresentation: videoFile as any, // Se enviará como File en FormData
        },
      });

      clearInterval(progressInterval);
      setProgress({ loaded: 100, total: 100, percentage: 100 });
      setIsUploading(false);
      
      // El backend devuelve el teacher actualizado con el nuevo videoId
      return 'video-uploaded-successfully';
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      setIsUploading(false);
      return null;
    }
  }, [accessToken, teacherId, repository]);

  return {
    uploadVideo,
    isUploading,
    progress,
    error,
  };
}
