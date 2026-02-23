import type { FC } from 'react';
import { Spinner } from '@/ui-library/shared/spinner';
import { Text } from '@/ui-library/components/ssr/text/Text';
import { cn } from '@/lib/utils';

export interface ProgressIndicatorProps {
  /**
   * Size of the spinner
   * @default 'lg'
   */
  size?: 'sm' | 'default' | 'lg' | 'xl';
  
  /**
   * Loading message to display
   * @default 'Loading...'
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
  message = 'Loading...',
  showMessage = true,
  variant = 'default',
  className,
  centered = true,
}) => {
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
          {message}
        </Text>
      )}
    </div>
  );
};
