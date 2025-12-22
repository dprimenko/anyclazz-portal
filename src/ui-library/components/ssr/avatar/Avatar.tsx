import classNames from "classnames";
import styles from "./Avatar.module.css";
import { Icon } from "../icon/Icon";

export interface AvatarProps {
    src?: string;
    alt?: string;
    size?: number;
    text?: string;
    hasVerifiedBadge?: boolean;
    hasOutline?: boolean;
}

const DEFAULT_SIZE = 40;

export function Avatar({ src, alt, size = DEFAULT_SIZE, hasVerifiedBadge, hasOutline }: AvatarProps) {
    const avatarContainer = classNames(
        'relative rounded-full',
        styles['avatar__container'],
        {
            [styles['avatar__container--outlined']]: hasOutline
        }
    );
    
    const avatarContent = classNames(
        'rounded-full w-full h-full flex items-center justify-center',
        styles['avatar__content']
    );

    const verifiedBadgeSize = size * 0.25;
    
    // Obtener iniciales del nombre
    const getInitials = (name?: string) => {
        if (!name) return '?';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    };

    return (
        <div className={avatarContainer} style={{width: `${size}px`, minWidth: `${size}px`, height: `${size}px`, minHeight: `${size}px`}}>
            <div className={avatarContent}>
                {src ? (
                    <img src={src} alt={alt} className="rounded-full w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold" style={{fontSize: `${size * 0.4}px`}}>
                        {getInitials(alt)}
                    </div>
                )}
            </div>
            {hasVerifiedBadge && (
                <div className="absolute bottom-[1px] right-[1px] z-10">
                    <Icon icon="verified" iconWidth={verifiedBadgeSize} iconHeight={verifiedBadgeSize} />
                </div>
            )}  
        </div>
    );
}