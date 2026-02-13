import { type FC, useState } from 'react';
import { VideoUploadModal } from '../video-upload-modal';
import { useTranslations } from '@/i18n';
import type { Story } from '../../hooks/useBunnyUpload';
import { Button } from '@/ui-library/components/ssr/button/Button';

export interface VideoUploadButtonProps {
  onVideoUploaded?: (story: Story) => void;
  accessToken: string;
  teacherId: string;
  countryIso2: string;
  cityIso2?: string;
}

export const VideoUploadButton: FC<VideoUploadButtonProps> = ({
  onVideoUploaded,
  accessToken,
  teacherId,
  countryIso2,
  cityIso2,
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
          countryIso2={countryIso2}
          cityIso2={cityIso2}
        />
      )}
    </>
  );
};
