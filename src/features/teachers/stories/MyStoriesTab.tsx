
import type { Story } from '@/features/stories/feed/domain/types';
import { useTranslations } from '@/i18n';
import { VideoUploadButton } from '@/features/stories/feed/components/video-upload-button';
import { Text } from '@/ui-library/components/ssr/text/Text';
import { Divider } from '@/ui-library/components/ssr/divider/Divider';
import { TeacherStoriesList } from './TeacherStoriesList';
import { publish } from '@/features/shared/services/domainEventsBus';
import { VideoUploadEvents } from '@/features/stories/feed/components/video-upload-modal/domain/events';


export interface MyStoriesTabProps {
  teacherId: string;
  accessToken: string;
  countryIso2: string;
  cityIso2?: string;
}

export function MyStoriesTab({ teacherId, accessToken, countryIso2, cityIso2 }: MyStoriesTabProps) {
  const t = useTranslations();
  
  const handleVideoUploaded = (story: Story) => {
    publish(VideoUploadEvents.SUCCESS_UPLOAD_VIDEO, story);
  };

  return (
    <div className="mt-6 flex flex-col">
      {/* Header */}
        <div className="flex flex-col gap-[2px]">
            <Text size="text-lg" weight="semibold" colorType="primary">
                {t('teacher-profile.my_stories')}
            </Text>
            <Text size="text-md" colorType="tertiary">
                {t('teacher-profile.my_stories_description')}
            </Text>
        </div>

        <Divider margin={24} />

        <div className="flex flex-col md:flex-row gap-4 md:flex-grow-[0.25]">
            <div className="flex flex-col gap-1 w-[312px]">
                <Text textLevel="h3" size="text-md" weight="semibold" colorType="primary">
                    {t('teacher-profile.add_video')} <span className="text-[#F4A43A]">*</span>
                </Text>
                <Text size="text-sm" colorType="tertiary">
                    {t('teacher-profile.add_video_description')}
                </Text>
            </div>

            <div>
                <VideoUploadButton
                    accessToken={accessToken}
                    teacherId={teacherId}
                    countryIso2={countryIso2}
                    cityIso2={cityIso2}
                    onVideoUploaded={handleVideoUploaded}
                />
            </div>
        </div>

        <Divider margin={24} />

        <TeacherStoriesList teacherId={teacherId} accessToken={accessToken} />
    </div>
  );
}
