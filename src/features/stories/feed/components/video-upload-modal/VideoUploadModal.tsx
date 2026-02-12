import { type FC, useState } from 'react';
import { Modal } from '@/ui-library/components/modal/Modal';
import { FileUpload } from '@/ui-library/components/file-upload';
import { Textarea } from '@/ui-library/shared/textarea';
import { Label } from '@/ui-library/shared/label';
import { Button } from '@/ui-library/shared/button';
import { Icon } from '@/ui-library/components/ssr/icon/Icon';
import { useBunnyUpload, type Story } from '../../hooks/useBunnyUpload';
import { useTranslations } from '@/i18n';
import styles from './VideoUploadModal.module.css';

export interface VideoUploadModalProps {
  onClose: () => void;
  onSuccess?: (story: Story) => void;
  accessToken: string;
  teacherId: string;
}

const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500MB
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

export const VideoUploadModal: FC<VideoUploadModalProps> = ({
  onClose,
  onSuccess,
  accessToken,
  teacherId,
}) => {
  const t = useTranslations();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const { uploadStory, isUploading, progress, error } = useBunnyUpload({ accessToken, teacherId });

  const handleVideoSelect = (file: File) => {
    setVideoFile(file);
    
    // Crear preview del video
    const url = URL.createObjectURL(file);
    setVideoPreview(url);
  };

  const handleCoverSelect = (file: File) => {
    setCoverImage(file);
    
    // Crear preview de la imagen
    const url = URL.createObjectURL(file);
    setCoverPreview(url);
  };

  const handleRemoveVideo = () => {
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }
    setVideoFile(null);
    setVideoPreview(null);
  };

  const handleRemoveCover = () => {
    if (coverPreview) {
      URL.revokeObjectURL(coverPreview);
    }
    setCoverImage(null);
    setCoverPreview(null);
  };

  const handlePublish = async () => {
    if (!videoFile || !description.trim()) return;

    // Subir story con todo incluido
    const story = await uploadStory({
      video: videoFile,
      description: description.trim(),
      title: title || undefined,
      thumbnail: coverImage || undefined,
    });

    if (story) {
      // Notificar éxito
      onSuccess?.(story);
      onClose();
    }
  };

  const isValid = videoFile !== null && description.trim().length > 0;

  return (
    <Modal onClose={onClose} width={600}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>{t('video.upload.title')}</h2>
            <p className={styles.subtitle}>
              {t('video.upload.subtitle')}
            </p>
          </div>
          <button
            onClick={onClose}
            className={styles.closeButton}
            disabled={isUploading}
          >
            <Icon icon="x" iconWidth={20} iconHeight={20} />
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Video Upload */}
          <div className={styles.field}>
            {!videoFile ? (
              <FileUpload
                accept="video/mp4,video/quicktime,video/x-msvideo"
                maxSize={MAX_VIDEO_SIZE}
                recommendedSize={t('video.upload.video_format')}
                onFileSelect={handleVideoSelect}
                label={t('video.upload.upload_video')}
                description={t('video.upload.drag_drop')}
                icon="upload-cloud"
                disabled={isUploading}
              />
            ) : (
              <div className={styles.preview}>
                <video
                  src={videoPreview || undefined}
                  controls
                  className={styles.videoPreview}
                />
                <button
                  onClick={handleRemoveVideo}
                  className={styles.removeButton}
                  disabled={isUploading}
                >
                  <Icon icon="trash" iconWidth={16} iconHeight={16} />
                  {t('video.upload.remove_video')}
                </button>
              </div>
            )}
          </div>

          {/* Description */}
          <div className={styles.field}>
            <Label htmlFor="description">
              {t('video.upload.description_label')} <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('video.upload.description_placeholder')}
              rows={4}
              disabled={isUploading}
            />
          </div>

          {/* Cover Image Upload */}
          <div className={styles.field}>
            <Label>{t('video.upload.cover_label')}</Label>
            {!coverImage ? (
              <FileUpload
                accept="image/jpeg,image/png"
                maxSize={MAX_IMAGE_SIZE}
                recommendedSize={t('video.upload.image_format')}
                onFileSelect={handleCoverSelect}
                label={t('video.upload.upload_video')}
                description={t('video.upload.drag_drop')}
                icon="image"
                disabled={isUploading}
              />
            ) : (
              <div className={styles.preview}>
                <img
                  src={coverPreview || undefined}
                  alt="Cover preview"
                  className={styles.imagePreview}
                />
                <button
                  onClick={handleRemoveCover}
                  className={styles.removeButton}
                  disabled={isUploading}
                >
                  <Icon icon="trash" iconWidth={16} iconHeight={16} />
                  {t('video.upload.remove_image')}
                </button>
              </div>
            )}
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className={styles.progressContainer}>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
              <p className={styles.progressText}>
                {t('video.upload.uploading')} {progress.percentage}%
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className={styles.error}>
              <Icon icon="alert-circle" iconWidth={16} iconHeight={16} />
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <Button
            onClick={handlePublish}
            disabled={!isValid || isUploading}
            className="w-full"
          >
            {isUploading ? t('video.upload.publishing') : t('video.upload.publish')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
