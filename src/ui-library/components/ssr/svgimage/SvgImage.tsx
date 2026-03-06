import { getSvgByName } from "../../../../utils/getSvgByName.ts";

export interface IconProps extends React.HTMLAttributes<HTMLImageElement> {
    image: string;
    imageWidth?: number;
    imageHeight?: number;
    classNames?: string;
}

export const SvgImage = (
    {
        image,
        imageWidth,
        imageHeight,
        classNames,
        ...props
    }: IconProps) => {

        return (
            <img 
                src={getSvgByName(`${image}`)}
                width={imageWidth}
                height={imageHeight}
                alt={`${image} image`}
                {...props}
            />
        );
    };