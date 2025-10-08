import type { ColorType, TextSizeType, TextWeightType } from "../../shared/constants.ts";
import type { TextAlignmentType, TextLevel } from "./types.ts";
import classNames from "classnames";

export interface TextProps extends HTMLDivElement {
    textalign?: TextAlignmentType;
    color?: ColorType;
    weight?: TextWeightType;
    size?: TextSizeType;
    uppercase?: boolean;
    textLevel?: TextLevel;
}

export const Text = (
    {
        textalign = 'left',
        color = 'tertiary',
        weight = 'regular',
        size = 'text-md',
        uppercase = false,
        textLevel = 'p',
        children,
        ...props
    }: TextProps) => {
        const classes = classNames(
            {'text-left' : textalign === 'left'},
            {'text-center' : textalign === 'center'},
            {'text-right' : textalign === 'right'},
        );

        return (
            <div className={classes} {...props}>
                {children}
            </div>
        );
    };