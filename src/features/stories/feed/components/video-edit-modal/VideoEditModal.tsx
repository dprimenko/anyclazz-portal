import { type FC, useState } from 'react';
import { Modal } from '@/ui-library/components/modal/Modal';
import { FileUpload } from '@/ui-library/components/file-upload';
import { Label } from '@/ui-library/shared/label';
import { Icon } from '@/ui-library/components/ssr/icon/Icon';
import { useTranslations } from '@/i18n';
import { Button } from '@/ui-library/components/ssr/button/Button';
import { Text } from '@/ui-library/components/ssr/text/Text';
import type { Story } from '../../domain/types';
import { ApiStoryRepository } from '../../infrastructure/ApiStoryRepository';

export interface VideoEditModalProps {
  story: Story;
  onClose: () => void;
  onSuccess?: () => void;
  accessToken: string;
  teacherId: string;
}

const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500MB
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

export const VideoEditModal: FC<VideoEditModalProps> = ({
  story,
  onClose,
  onSuccess,
  accessToken,
  teacherId,
}) => {
  const t = useTranslations();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [description, setDescription] = useState(story.description || '');
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(story.thumbnailUrl);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const repository = new ApiStoryRepository();

  const handleVideoSelect = (file: File) => {
    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setVideoPreview(url);
  };

  const handleCoverSelect = (file: File) => {
    setCoverImage(file);
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
    if (coverPreview && coverPreview !== story.thumbnailUrl) {
      URL.revokeObjectURL(coverPreview);
    }
    setCoverImage(null);
    setCoverPreview(null);
  };

  const handleUpdate = async () => {
    if (!description.trim()) return;

    setIsUpdating(true);
    setError(null);

    try {
      await repository.updateStory({
        token: accessToken,
        storyId: story.id,
        teacherId,
        video: videoFile || undefined,
        description: description.trim(),
        thumbnail: coverImage || undefined,
      });

      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating story');
    } finally {
      setIsUpdating(false);
    }
  };

  const isValid = description.trim().length > 0;

  return (
    <Modal onClose={onClose} width={480}>
      <div className="flex flex-col bg-white w-full md:max-h-[90vh] h-full md:h-auto overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between p-6 flex-shrink-0 md:border-b-0">
          <div>
            <Text textLevel="h2" colorType='primary' size='text-md' weight='semibold'>{t('video.edit.title')}</Text>
            <Text textLevel="p" colorType='tertiary' size='text-sm'>{t('video.edit.subtitle')}</Text>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 border-none bg-transparent text-neutral-600 cursor-pointer rounded-md transition-all hover:bg-neutral-100 hover:text-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isUpdating}
          >
            <Icon icon="close" iconColor="#A4A7AE" iconWidth={24} iconHeight={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 overflow-y-auto flex flex-col gap-6 pb-6 md:pb-0">
          {/* Video Upload (optional) */}
          <div className="flex flex-col gap-2">
            <Label>{t('video.edit.replace_video')}</Label>
            {!videoFile ? (
              <>
                {!videoPreview && story.videoUrl && (
                  <video
                    src={story.videoUrl}
                    controls
                    className="w-full max-h-[300px] rounded-lg bg-black mb-2"
                  />
                )}
                <FileUpload
                  accept="video/mp4,video/quicktime,video/x-msvideo"
                  maxSize={MAX_VIDEO_SIZE}
                  recommendedSize={t('video.upload.video_format')}
                  onFileSelect={handleVideoSelect}
                  label={t('video.upload.upload_video')}
                  description={t('video.upload.drag_drop')}
                  icon="upload-cloud"
                  disabled={isUpdating}
                />
              </>
            ) : (
              <div className="flex flex-col gap-3 p-4 border border-neutral-200 rounded-xl bg-neutral-50">
                <video
                  src={videoPreview || undefined}
                  controls
                  className="w-full max-h-[400px] rounded-lg bg-black"
                />
                <button
                  onClick={handleRemoveVideo}
                  className="flex items-center justify-center gap-2 px-4 py-2 border border-neutral-300 bg-white text-neutral-700 text-sm font-medium rounded-md cursor-pointer transition-all self-start hover:bg-neutral-100 hover:border-neutral-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isUpdating}
                >
                  <Icon icon="trash" iconWidth={16} iconHeight={16} />
                  {t('video.upload.remove_video')}
                </button>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-[var(--color-neutral-900)] mb-3">
              {t('video.upload.description_label')} <span className="text-[var(--color-primary-700)]">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('video.upload.description_placeholder')}
              rows={6}
              disabled={isUpdating}
              className="w-full px-4 py-3 rounded-lg border-2 border-[var(--color-neutral-300)] bg-white text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)] focus:outline-none focus:border-[var(--color-primary-700)] transition-colors resize-none"
            />
          </div>

          {/* Cover Image Upload (optional) */}
          <div className="flex flex-col gap-2">
            <Label>{t('video.upload.cover_label')}</Label>
            {!coverImage && !coverPreview ? (
              <FileUpload
                accept="image/jpeg,image/png"
                maxSize={MAX_IMAGE_SIZE}
                recommendedSize={t('video.upload.image_format')}
                onFileSelect={handleCoverSelect}
                label={t('video.upload.upload_video')}
                description={t('video.upload.drag_drop')}
                icon="image"
                disabled={isUpdating}
              />
            ) : (
              <div className="flex flex-col gap-3 p-4 border border-neutral-200 rounded-xl bg-neutral-50">
                <img
                  src={coverPreview || undefined}
                  alt="Cover preview"
                  className="w-full max-h-[300px] object-contain rounded-lg bg-neutral-100"
                />
                <button
                  onClick={handleRemoveCover}
                  className="flex items-center justify-center gap-2 px-4 py-2 border border-neutral-300 bg-white text-neutral-700 text-sm font-medium rounded-md cursor-pointer transition-all self-start hover:bg-neutral-100 hover:border-neutral-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isUpdating}
                >
                  <Icon icon="trash" iconWidth={16} iconHeight={16} />
                  {t('video.upload.remove_image')}
                </button>
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-500 rounded-lg text-red-500 text-sm font-medium">
              <Icon icon="alert-circle" iconWidth={16} iconHeight={16} />
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-row-reverse p-4 md:p-6 border-t border-neutral-200 flex-shrink-0" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
          <Button
            onClick={handleUpdate}
            disabled={!isValid || isUpdating}
            colorType="primary"
            size="lg"
            label={isUpdating ? t('video.edit.updating') : t('video.edit.update')}
          />
        </div>
      </div>
    </Modal>
  );
};
