import { Icon } from "@/ui-library/components/ssr/icon/Icon";
import type { FC } from "react";
import styles from './RatingStars.module.css';

export interface RatingStarsProps {
    rating: number;
    onRatingChange?: (rating: number) => void;
    size?: number;
    readonly?: boolean;
}

export const RatingStars: FC<RatingStarsProps> = ({ 
    rating, 
    onRatingChange, 
    size = 24,
    readonly = false 
}) => {
    const stars = [1, 2, 3, 4, 5];

    const handleStarClick = (starValue: number) => {
        if (!readonly && onRatingChange) {
            onRatingChange(starValue);
        }
    };

    return (
        <div className={styles.container}>
            {stars.map((star) => (
                <button
                    key={star}
                    type="button"
                    className={`${styles.star} ${readonly ? styles.readonly : ''}`}
                    onClick={() => handleStarClick(star)}
                    disabled={readonly}
                    aria-label={`Rate ${star} stars`}
                >
                    <Icon
                        icon={star <= rating ? 'star' : 'star-outline'}
                        iconWidth={size}
                        iconHeight={size}
                        iconColor={star <= rating ? '#F4A43A' : '#E4E7EC'}
                    />
                </button>
            ))}
        </div>
    );
};
