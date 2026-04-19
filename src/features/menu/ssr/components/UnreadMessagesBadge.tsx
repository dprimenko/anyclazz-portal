import { useEffect, useState } from 'react';
import type { StreamChat } from 'stream-chat';
import { useUnreadCount } from '@/features/chat/hooks/useUnreadCount';
import { initStreamChatClient } from '@/features/chat/infrastructure/streamClient';
import { Text } from '@/ui-library/components/ssr/text/Text';

interface UnreadMessagesBadgeProps {
  accessToken: string;
  userId: string;
}

export function UnreadMessagesBadge({ accessToken, userId }: UnreadMessagesBadgeProps) {
  const [client, setClient] = useState<StreamChat | null>(null);
  const unreadCount = useUnreadCount(client);

  useEffect(() => {
    if (!accessToken) return;

    let isMounted = true;

    const connectClient = async () => {
      try {
        const streamClient = await initStreamChatClient(accessToken);
        
        if (isMounted) {
          setClient(streamClient);
        }
      } catch (error) {
        console.error('Error connecting Stream Chat for badge:', error);
      }
    };

    connectClient();

    return () => {
      isMounted = false;
      setClient(null);
    };
  }, [accessToken]);

  if (!unreadCount || unreadCount === 0) return null;

  return (
    <span className="flex items-center justify-center min-w-[24px] h-[24px] px-1.5 border border-[#E9EAEB] bg-[#F9F9F9] rounded-full">
        <Text colorType='secondary' size='text-xs' weight='medium'>
            {unreadCount > 99 ? '99+' : unreadCount}
        </Text>
    </span>
  );
}
