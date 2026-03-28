// Custom channel header using stream-chat-react context hooks
import { use, type FC } from 'react';
import { useChannelStateContext, useChatContext } from 'stream-chat-react';
import { Avatar } from '@/ui-library/components/ssr/avatar/Avatar';
import { Text } from '@/ui-library/components/ssr/text/Text';
import { Button } from '@/ui-library/components/ssr/button/Button';
import { useTranslations } from '@/i18n';

export const ChatHeader: FC = () => {
	const { channel } = useChannelStateContext();
	const { client } = useChatContext();

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

	return (
		<div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-neutral-200)] bg-white shrink-0">
			{/* Left: user info */}
			<div className="flex items-center gap-3 min-w-0">
                <div className="flex items-center">
                    <div className="flex items-center gap-3">
                        <Avatar src={userImage} size={56} alt={userName} />
                        <div className="flex flex-col gap-[2px]">
                            <a href={isTeacher ? `/teacher/${userId}` : '#'}>
                                <Text size="text-lg" weight="semibold" colorType="primary" underline>{userName}</Text>
                            </a>
                            {/* {!isTeacher && <Text size="text-sm" colorType="tertiary">{t('common.teacher_of', { subject: displayPerson.subject.name[lang || 'en'] })}</Text>} */}
                            {isTeacher && <Text size="text-sm" colorType="tertiary">{"Teacher"}</Text>}
                            {!isTeacher && <Text size="text-sm" colorType="tertiary">{t('common.student')}</Text>}
                        </div>
                    </div>
                </div>
				<div className="flex flex-col gap-1 min-w-0">
					{/* <div className="flex items-center gap-2 flex-wrap">
						{userId && isTeacher ? (
							<a href={`/teacher/${userId}`}>
								<Text
									size="text-sm"
									weight="semibold"
									colorType="primary"
									className="underline truncate"
								>
									{userName}
								</Text>
							</a>
						) : (
							<Text size="text-sm" weight="semibold" colorType="primary" className="truncate">
								{userName}
							</Text>
						)}
						<Chip
							size="sm"
							rounded
							bgColor={isOnline ? '#ECFDF3' : '#F2F4F7'}
							textColor={isOnline ? '#067647' : '#667085'}
							borderColor={isOnline ? '#ABEFC6' : '#D0D5DD'}
						>
							{isOnline ? '● Online' : '○ Offline'}
						</Chip>
					</div> */}
					{isTeacher && (
						<Text size="text-xs" colorType="tertiary">
							Teacher
						</Text>
					)}
				</div>
			</div>

			{/* Right: actions */}
			<div className="flex items-center gap-2 shrink-0 ml-4">
				<Button icon="heart-outline" size="sm" colorType="secondary" />
				{userId && isTeacher && (
					<Button
						label="View profile"
						size="sm"
						colorType="secondary"
						onClick={() => {
							window.location.href = `/teacher/${userId}`;
						}}
					/>
				)}
				{userId && isTeacher && (
					<Button
						icon="calendar-plus"
						label="Schedule lesson"
						size="sm"
						colorType="primary"
						onClick={() => {
							window.location.href = `/teacher/${userId}`;
						}}
					/>
				)}
			</div>
		</div>
	);
};
