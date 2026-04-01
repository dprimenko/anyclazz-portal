import type { FC } from 'react';
import { Spinner } from '@/ui-library/shared/spinner';
import { Text } from '@/ui-library/components/ssr/text/Text';
import { cn } from '@/lib/utils';
import { useTranslations } from '@/i18n';

export interface ProgressIndicatorProps {
  /**
   * Size of the spinner
   * @default 'lg'
   */
  size?: 'sm' | 'default' | 'lg' | 'xl';
  
  /**
   * Loading message to display. Defaults to the translated 'Loading' string.
   */
  message?: string;
  
  /**
   * Whether to show the message
   * @default true
   */
  showMessage?: boolean;
  
  /**
   * Color variant
   * @default 'default'
   */
  variant?: 'default' | 'secondary' | 'muted' | 'white';
  
  /**
   * Additional CSS classes for the container
   */
  className?: string;
  
  /**
   * Whether to center the indicator
   * @default true
   */
  centered?: boolean;
}

export const ProgressIndicator: FC<ProgressIndicatorProps> = ({
  message,
  showMessage = true,
  variant = 'default',
  className,
  centered = true,
}) => {
  const t = useTranslations();
  const displayMessage = message ?? t('common.loading');
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-3',
        centered && 'justify-center min-h-[200px]',
        className
      )}
    >
      <Spinner variant={variant} />
      {showMessage && (
        <Text 
          size="text-lg" 
          colorType={variant === 'white' ? 'primary' : 'secondary'}
          weight='semibold'
        >
          {displayMessage}
        </Text>
      )}
    </div>
  );
};
