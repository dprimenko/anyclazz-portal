import { type FC, useState, useCallback, useEffect } from 'react';
import { FileUpload } from '@/ui-library/components/file-upload';
import { Icon } from '@/ui-library/components/ssr/icon/Icon';
import { useTranslations } from '@/i18n';

export interface PresentationVideoUploadProps {
  videoUrl?: string | null;
  videoStatus?: 'processing' | 'ready' | 'failed' | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
}

const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500MB

export const PresentationVideoUpload: FC<PresentationVideoUploadProps> = ({
  videoUrl,
  videoStatus,
  onChange,
  disabled = false,
}) => {
  const t = useTranslations();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [isLocallyRemoved, setIsLocallyRemoved] = useState(false);

  // Resetear cuando hay un nuevo videoUrl
  useEffect(() => {
    if (videoUrl) {
      setIsLocallyRemoved(false);
    }
  }, [videoUrl]);

  const handleVideoSelect = useCallback((file: File) => {
    setVideoFile(file);
    setIsLocallyRemoved(false);
    
    // Crear preview del video
    const url = URL.createObjectURL(file);
    setVideoPreview(url);
    
    // Notificar al padre con el archivo
    onChange(file);
  }, [onChange]);

  const handleRemoveVideo = () => {
    // Limpiar estado local inmediatamente
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }
    setVideoFile(null);
    setVideoPreview(null);
    setIsLocallyRemoved(true);
    
    // Notificar al padre que se eliminó
    onChange(null);
  };

  // Mostrar video existente o preview local, pero no si fue eliminado localmente
  const displayVideoUrl = isLocallyRemoved ? null : (videoPreview || videoUrl);

  if (displayVideoUrl) {
    return (
      <div className="flex flex-col gap-3 p-4 border border-neutral-200 rounded-xl bg-neutral-50">
        <div className="relative">
          <video
            src={displayVideoUrl}
            controls
            className="w-full max-h-[400px] rounded-lg bg-black"
          />
          {videoStatus === 'processing' && (
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-[1] bg-black opacity-80 text-white flex items-center justify-center rounded-lg">
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span className="text-sm font-medium">{t('video.upload.processing')}</span>
              </div>
            </div>
          )}
        </div>
        <button
          onClick={handleRemoveVideo}
          className="flex items-center justify-center gap-2 px-4 py-2 border border-neutral-300 bg-white text-neutral-700 text-sm font-medium rounded-md cursor-pointer transition-all self-start hover:bg-neutral-100 hover:border-neutral-400 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={disabled || videoStatus === 'processing'}
        >
          <Icon icon="trash" iconWidth={16} iconHeight={16} />
          {t('video.upload.remove_video')}
        </button>
      </div>
    );
  }

  return (
    <FileUpload
      accept="video/mp4,video/quicktime,video/x-msvideo"
      maxSize={MAX_VIDEO_SIZE}
      recommendedSize={t('video.upload.video_format')}
      onFileSelect={handleVideoSelect}
      label={t('video.upload.upload_video')}
      description={t('video.upload.drag_drop')}
      icon="upload-cloud"
      disabled={disabled}
    />
  );
};
