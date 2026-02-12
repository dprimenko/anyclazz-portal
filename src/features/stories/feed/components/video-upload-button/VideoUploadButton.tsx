import { type FC, useState } from 'react';
import { VideoUploadModal } from '../video-upload-modal';
import { Button } from '@/ui-library/shared/button';
import { Icon } from '@/ui-library/components/ssr/icon/Icon';
import { useTranslations } from '@/i18n';
import type { Story } from '../../hooks/useBunnyUpload';

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

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        className="gap-2"
      >
        <Icon icon="upload-cloud" iconWidth={20} iconHeight={20} />
        {t('video.upload_new')}
      </Button>

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
