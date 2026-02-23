import { Button } from '../button/Button';
import { Text } from '../text/Text';
import type { ColorType } from '../../../shared/constants';

export interface EmptyStateProps {
    title: string;
    description: string;
    buttonLabel?: string;
    buttonIcon?: string;
    onClickAction?: () => void;
    buttonColorType?: ColorType;
    children?: React.ReactNode;
}

export const EmptyState = ({
    title,
    description,
    buttonLabel,
    buttonIcon,
    onClickAction,
    buttonColorType = 'primary',
    children
}: EmptyStateProps) => {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <Text 
                textLevel="h3" 
                size="text-lg" 
                weight="semibold" 
                colorType="primary" 
                className="mb-2"
            >
                {title}
            </Text>
            <Text 
                size="text-sm" 
                colorType="tertiary" 
                className="mb-6 max-w-md"
                textalign="center"
            >
                {description}
            </Text>
            {buttonLabel && !children && onClickAction && (
                <Button 
                    label={buttonLabel}
                    icon={buttonIcon}
                    colorType={buttonColorType}
                    onClick={onClickAction}
                />
            )}
            {children}
        </div>
    );
};
