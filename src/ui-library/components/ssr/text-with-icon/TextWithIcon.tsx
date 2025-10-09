import styles from "./TextWithIcon.module.css";
import { Text, type TextProps } from "../text/Text.tsx";
import { Icon } from "../icon/Icon.tsx";

export interface TextWithIconProps extends TextProps {
    icon: string;
    iconColor?: string;
    iconWidth?: number;
    iconHeight?: number;
}

export const TextWithIcon = (
    {
        icon,
        iconWidth,
        iconHeight,
        ...props
    }: TextWithIconProps) => {

        return (
            <div className={styles["text-with-icon"]} {...props}>
                <div className={styles["text-with-icon__icon"]}>
                    <Icon icon={icon} iconWidth={iconWidth} iconHeight={iconHeight} />
                </div>
                <Text {...props as TextProps}>{props.children}</Text>
            </div>
        );
    };