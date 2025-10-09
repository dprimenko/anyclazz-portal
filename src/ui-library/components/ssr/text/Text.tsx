import type { ColorType, TextSizeType, TextWeightType } from "../../../shared/constants.ts";
import type { TextAlignmentType, TextLevel } from "./types.ts";
import classNames from "classnames";
import styles from "./Text.module.css";
import type { ReactNode } from "react";

export interface TextProps {
    textalign?: TextAlignmentType;
    color?: ColorType;
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
        color = 'secondary',
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
            { [styles.primary]: color === 'primary' },
            { [styles.secondary]: color === 'secondary' },
            { [styles.tertiary]: color === 'tertiary' },

     
            {'text-2xl' : size === 'display-xs'},
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

        return (
            <div className={classes} {...props}>
                {children}
            </div>
        );
    };