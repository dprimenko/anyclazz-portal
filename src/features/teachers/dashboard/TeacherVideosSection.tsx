import { type FC } from 'react';
import { VideoUploadButton } from '@/features/stories/feed/components';
import { Text } from '@/ui-library/components/ssr/text/Text';
import { Card } from '@/ui-library/components/ssr/card/Card';
import { useTranslations } from '@/i18n';
import styles from './TeacherVideosSection.module.css';

export interface TeacherVideosSectionProps {
  // bunnyConfig ya no es necesario - todo se maneja en el backend
  teacherId: string;
  accessToken: string;
}

export const TeacherVideosSection: FC<TeacherVideosSectionProps> = ({
  teacherId,
  accessToken,
}) => {
  const t = useTranslations();

  const handleVideoUploaded = async (videoData: {
    videoId: string;
    videoUrl: string;
    description: string;
    thumbnailUrl?: string;
  }) => {
    try {
      // Guardar el video en el backend
      const response = await fetch('/api/teacher/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          teacherId,
          ...videoData,
        }),
      });

      if (response.ok) {
        console.log('Video saved successfully');
        // Aquí podrías recargar la lista de videos
        // o actualizar el estado local
      }
    } catch (error) {
      console.error('Error saving video:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <Text textLevel="h3" size="text-xl" weight="semibold" colorType="primary">
            My Videos
          </Text>
          <Text size="text-sm" colorType="tertiary">
            Share videos to inspire your students
          </Text>
        </div>
        <VideoUploadButton
          onVideoUploaded={handleVideoUploaded}
        />
      </div>

      {/* Aquí irían los videos existentes */}
      <div className={styles.videosGrid}>
        {/* Placeholder para cuando no hay videos */}
        <Card className={styles.emptyState}>
          <div className={styles.emptyContent}>
            <Text size="text-md" colorType="tertiary" textalign="center">
              You haven't uploaded any videos yet. Share your first video to connect with students!
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
};
