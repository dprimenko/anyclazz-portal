import classNames from "classnames";
import styles from "./Avatar.module.css";
import { Icon } from "../icon/Icon";
import { useMemo } from "react";

export interface AvatarProps {
    src?: string;
    alt?: string;
    size?: number;
    text?: string;
    hasVerifiedBadge?: boolean;
    hasOutline?: boolean;
}

const DEFAULT_SIZE = 40;

export function Avatar({ src, alt, size = DEFAULT_SIZE, text, hasVerifiedBadge, hasOutline }: AvatarProps) {
    const avatarContainer = classNames(
        'relative rounded-full',
        styles['avatar__container'],
        {
            [styles['avatar__container--outlined']]: hasOutline
        }
    );
    
    const avatarContent = classNames(
        'rounded-full w-full h-full',
        styles['avatar__content']
    );

    const verifiedBadgeSize = useMemo(() => size * 0.25, [size]);

    return (
        <div className={avatarContainer} style={{width: `${size}px`, height: `${size}px`}}>
            <div className={avatarContent}>
                {src && <img src={src} alt={alt} className="rounded-full w-full h-full object-cover" />}
            </div>
            {hasVerifiedBadge && (
                <div className="absolute bottom-[1px] right-[1px] z-10">
                    <Icon icon="verified" iconWidth={verifiedBadgeSize} iconHeight={verifiedBadgeSize} />
                </div>
            )}  
        </div>
    );
}