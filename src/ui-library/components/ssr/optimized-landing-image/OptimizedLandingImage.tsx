import { getImageUrl } from '@/utils/getImageUrl';
import bookingPreview1 from '@/assets/images/landing/booking-preview-1.png';
import bookingPreview2 from '@/assets/images/landing/booking-preview-2.svg'; // Temporal: mantener SVG hasta tener PNG
import growingPreview from '@/assets/images/landing/growing-preview.png';

export interface OptimizedImageProps extends React.HTMLAttributes<HTMLImageElement> {
    image: 'booking-preview-1' | 'booking-preview-2' | 'growing-preview';
    imageWidth?: number;
    imageHeight?: number;
    classNames?: string;
}

const imageMap = {
    'booking-preview-1': bookingPreview1,
    'booking-preview-2': bookingPreview2, // Temporal
    'growing-preview': growingPreview
};

export const OptimizedLandingImage = (
    {
        image,
        imageWidth,
        imageHeight,
        classNames,
        ...props
    }: OptimizedImageProps) => {
    
    const imageSrc = imageMap[image];
    const imageUrl = getImageUrl(imageSrc);

    return (
        <img 
            src={imageUrl}
            width={imageWidth}
            height={imageHeight}
            alt={`${image} image`}
            loading="lazy"
            className={classNames}
            {...props}
        />
    );
};
