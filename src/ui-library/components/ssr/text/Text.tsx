import type { ColorType, TextSizeType, TextWeightType } from "../../../shared/constants.ts";
import type { TextAlignmentType, TextLevel } from "./types.ts";
import classNames from "classnames";
import styles from "./Text.module.css";
import type { ReactNode } from "react";
import { createElement } from "react";

export interface TextProps {
    textalign?: TextAlignmentType;
    color?: string;
    colorType?: ColorType;
    weight?: TextWeightType;
    size?: TextSizeType;
    uppercase?: boolean;
    underline?: boolean;
    textLevel?: TextLevel;
    children?: ReactNode;
    className?: string;
}

export const Text = (
    {
        size = 'text-md',
        color,
        colorType = 'secondary',
        weight = 'regular',
        textalign = 'left',
        uppercase = false,
        underline = false,
        textLevel = 'p',
        children,
        className,
        ...props
    }: TextProps) => {
        const classes = classNames(
            { [styles.accent]: colorType === 'accent' },
            { [styles.primary]: colorType === 'primary' },
            { [styles.secondary]: colorType === 'secondary' },
            { [styles.tertiary]: colorType === 'tertiary' },
            { [styles.quaternary]: colorType === 'quaternary' },

     
            {'text-xl lg:text-2xl' : size === 'display-xs'},
            {'text-2xl' : size === 'text-2xl'},
            {'text-xl' : size === 'text-xl'},
            {'text-lg' : size === 'text-lg'},
            {'text-base' : size === 'text-md'},
            {'text-sm' : size === 'text-sm'},
            {'text-xs' : size === 'text-xs'},

            {'text-left' : textalign === 'left'},
            {'text-center' : textalign === 'center'},
            {'text-right' : textalign === 'right'},
            {'font-normal' : weight === 'regular'},
            {'font-medium' : weight === 'medium'},
            {'font-semibold' : weight === 'semibold'},
            {'uppercase' : uppercase},
            {'underline underline-offset-4' : underline},
            className
        );

        return createElement(
            textLevel,
            { className: classes, style: { ...(color ? { color } : {}) }, ...props },
            children
        );
    };