import classNames from "classnames";
import styles from "./Avatar.module.css";
import { Icon } from "../icon/Icon";
import { useState } from "react";

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
    const [imageError, setImageError] = useState(false);
    
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
        const parts = name.trim().split(' ').filter(part => part.length > 0);
        
        if (parts.length === 0) return '?';
        if (parts.length === 1) {
            return parts[0].slice(0, 2).toUpperCase();
        }
        // Si hay 2 o más palabras, tomar primera letra de la primera y última
        return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    };

    const shouldShowImage = src && src.trim() !== '' && !imageError;

    return (
        <div className={avatarContainer} style={{width: `${size}px`, minWidth: `${size}px`, height: `${size}px`, minHeight: `${size}px`}}>
            <div className={avatarContent}>
                {shouldShowImage ? (
                    <img 
                        src={src} 
                        alt={alt} 
                        className="rounded-full w-full h-full object-cover" 
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="w-full h-full rounded-full bg-[var(--color-primary-200)] flex items-center justify-center text-[var(--color-primary-700)] font-semibold" style={{fontSize: `${size * 0.4}px`}}>
                        {getInitials(alt)}
                    </div>
                )}
            </div>
            {hasVerifiedBadge && (
                <div className="absolute bottom-[1px] right-[1px] z-9">
                    <Icon icon="verified" iconWidth={verifiedBadgeSize} iconHeight={verifiedBadgeSize} />
                </div>
            )}  
        </div>
    );
}