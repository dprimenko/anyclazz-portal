import styles from "./TextWithIcon.module.css";
import { Text, type TextProps } from "../text/Text.tsx";
import { getSvgByName } from "../../../../utils/getSvgByName.ts";

export interface TextWithIconProps extends TextProps {
    icon: string;
    iconSize?: number;
}

export const TextWithIcon = (
    {
        icon,
        iconSize,
        ...props
    }: TextWithIconProps) => {

        return (
            <div className={styles["text-with-icon"]} {...props}>
                <div className={styles["text-with-icon__icon"]} dangerouslySetInnerHTML={{ __html: getSvgByName(icon) }}></div>
                <Text {...props as TextProps}>{props.children}</Text>
            </div>
        );
    };