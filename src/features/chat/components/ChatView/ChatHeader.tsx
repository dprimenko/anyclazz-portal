// Custom channel header using stream-chat-react context hooks
import { type FC, useState, useEffect } from 'react';
import { useChannelStateContext, useChatContext } from 'stream-chat-react';
import { Avatar } from '@/ui-library/components/ssr/avatar/Avatar';
import { Text } from '@/ui-library/components/ssr/text/Text';
import { Button } from '@/ui-library/components/ssr/button/Button';
import { useTranslations } from '@/i18n';
import { Chip } from '@/ui-library/components/ssr/chip/Chip';
import { Modal } from '@/ui-library/components/modal/Modal';
import { BookingCreator } from '@/features/bookings/components/booking-creator/BookingCreator';
import { ApiTeacherRepository } from '@/features/teachers/infrastructure/ApiTeacherRepository';
import type { Teacher } from '@/features/teachers/domain/types';
import { Icon } from '@/ui-library/components/ssr/icon/Icon';
import { useIsMobile } from '@/ui-library/hooks/useIsMobile';

const teacherRepository = new ApiTeacherRepository();

interface ChatHeaderProps {
	accessToken: string;
	onBack?: () => void;
}

export const ChatHeader: FC<ChatHeaderProps> = ({ accessToken, onBack }) => {
	const { channel } = useChannelStateContext();
	const { client } = useChatContext();
	const isMobile = useIsMobile();

	const otherMember = Object.values(channel.state.members).find(
		(m) => m.user?.id !== client.userID
	);

	const otherUser = otherMember?.user;
	const userName = otherUser?.name || 'User';
	const userImage = otherUser?.image as string | undefined;
	const isOnline = otherUser?.online || false;
	const userId = otherUser?.id;
	const isTeacher = (otherUser as any)?.anyclazz_role === 'teacher';
	const t = useTranslations();

	const [teacher, setTeacher] = useState<Teacher | null>(null);
	const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

	useEffect(() => {
		if (!isTeacher || !userId || !accessToken) return;
		teacherRepository.getTeacher({ token: accessToken, teacherId: userId })
			.then(setTeacher)
			.catch(() => setTeacher(null));
	}, [isTeacher, userId, accessToken]);

	return (
		<div className="flex flex-col md:flex-row md:items-center md:justify-between px-4 md:px-6 py-3 md:py-4 border-b border-[var(--color-neutral-200)] bg-white shrink-0 gap-3 md:gap-2 w-full">
			{/* Left: user info */}
			<div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                {/* Back button — mobile only */}
                {onBack && (
                    <button
                        onClick={onBack}
                        className="flex md:hidden items-center justify-center shrink-0 w-8 h-8 rounded-full hover:bg-[var(--color-neutral-100)] transition-colors"
                        aria-label={t('chat.back_to_conversations')}
                    >
                        <Icon icon="chevron-left" iconWidth={20} iconHeight={20} />
                    </button>
                )}
				<Avatar src={userImage} size={isMobile ? 40 : 56} alt={userName} />
				<div className="flex flex-col gap-[2px] min-w-0">
					<div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
						<a href={isTeacher ? `/teacher/${userId}` : '#'}>
							<Text size="text-base" weight="semibold" colorType="primary" underline className="leading-tight">{userName}</Text>
						</a>
						<Chip
							size="sm"
							rounded
							bgColor={isOnline ? '#ECFDF3' : '#F2F4F7'}
							textColor={isOnline ? '#067647' : '#667085'}
							borderColor={isOnline ? '#ABEFC6' : '#D0D5DD'}
						>
							{isOnline ? t('chat.online') : t('chat.offline')}
						</Chip>
					</div>
					{isTeacher && <Text size="text-sm" colorType="tertiary">{t('common.teacher')}</Text>}
					{!isTeacher && <Text size="text-sm" colorType="tertiary">{t('common.student')}</Text>}
				</div>
			</div>

			{/* Right: actions */}
			<div className="flex items-center gap-1.5 md:gap-2 shrink-0">
				{/* View profile — icon only on mobile, label on desktop */}
				{userId && isTeacher && (
					<Button
						label={t('teachers.view-profile')}
						size="sm"
						colorType="secondary"
                        fullWidth={isMobile}
						onClick={() => { window.location.href = `/teacher/${userId}`; }}
					/>
				)}

				{/* Schedule lesson — icon only on mobile, icon+label on desktop */}
				{userId && isTeacher && teacher && (
					<Button
						icon="calendar-plus"
                        iconColor='#FDD7A5'
						label={t('teachers.book-lesson')}
						size="sm"
						colorType="primary"
                        fullWidth={isMobile}
						onClick={() => setIsBookingModalOpen(true)}
					/>
				)}
			</div>

			{isBookingModalOpen && teacher && (
				<Modal width={700} height={700} onClose={() => setIsBookingModalOpen(false)}>
					<BookingCreator teacher={teacher} accessToken={accessToken}
						onClose={() => setIsBookingModalOpen(false)} />
				</Modal>
			)}
		</div>
	);
};

