import type { FC } from 'react';
import { Button } from '@/ui-library/components/ssr/button/Button';
import { useSaveTeacher } from '../../hooks/useSaveTeacher';

interface TeacherActionButtonsProps {
  teacherId: string;
  accessToken: string;
  initialSavedAt?: string | null;
}

export const TeacherActionButtons: FC<TeacherActionButtonsProps> = ({
  teacherId,
  accessToken,
  initialSavedAt,
}) => {
  const { isSaved, isLoading, toggleSave } = useSaveTeacher({
    teacherId,
    token: accessToken,
    initialSavedAt,
    onError: (error) => {
      console.error('Error toggling save teacher:', error);
    },
  });

  const handleChatClick = () => {
    window.location.href = `/messages/${teacherId}`;
  };

  return (
    <>
      <Button
        colorType="secondary"
        size="lg"
        icon={isSaved ? 'heart-filled' : 'heart-outline'}
        onClick={toggleSave}
        disabled={isLoading}
        highlighted={isSaved}
      />
      <Button
        colorType="secondary"
        size="lg"
        icon="chat"
        onClick={handleChatClick}
      />
    </>
  );
};
