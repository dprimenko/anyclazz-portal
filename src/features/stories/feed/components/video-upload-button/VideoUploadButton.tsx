import { type FC, useEffect, useState } from 'react';
import { VideoUploadModal } from '../video-upload-modal';
import { useTranslations } from '@/i18n';
import type { Story } from '../../hooks/useBunnyUpload';
import { Button } from '@/ui-library/components/ssr/button/Button';
import { subscribe, unsubscribe } from '@/features/shared/services/domainEventsBus';
import { VideoUploadEvents } from '../video-upload-modal/domain/events';

export interface VideoUploadButtonProps {
  onVideoUploaded?: (story: Story) => void;
  accessToken: string;
  teacherId: string;
}

export const VideoUploadButton: FC<VideoUploadButtonProps> = ({
  onVideoUploaded,
  accessToken,
  teacherId,
}) => {
  const t = useTranslations();
  const [showModal, setShowModal] = useState(false);

  const handleSuccess = (story: Story) => {
    console.log('Story uploaded successfully:', story);
    onVideoUploaded?.(story);
    setShowModal(false);
  };

  useEffect(() => {
    const openModal = () => setShowModal(true);
    subscribe(VideoUploadEvents.OPEN_VIDEO_UPLOAD_MODAL, openModal);
    
    return () => {
      unsubscribe(VideoUploadEvents.OPEN_VIDEO_UPLOAD_MODAL, openModal);
    };
  }, []);

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        colorType="primary"
        className="gap-2"
        size='lg'
        label={t('video.upload_new')}
      />

      {showModal && (
        <VideoUploadModal
          onClose={() => setShowModal(false)}
          onSuccess={handleSuccess}
          accessToken={accessToken}
          teacherId={teacherId}
        />
      )}
    </>
  );
};
