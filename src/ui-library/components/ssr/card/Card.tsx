import classNames from "classnames";
import styles from "./Card.module.css";

export function Card({children, className, bgColor}: {children: React.ReactNode, className?: string, bgColor?: string}) {

    const cnn = classNames(
        'rounded-xl',
        styles.card,
        ...className ? [className] : []
    );

    return <div className={cnn} style={{ backgroundColor: bgColor }}>{children}</div>;
}