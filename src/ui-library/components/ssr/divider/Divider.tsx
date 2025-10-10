import classNames from "classnames";
import styles from "./Divider.module.css";

export const Divider = ({ margin, dotted }: { margin?: number, dotted?: boolean }) => {

	const classes = classNames(
		styles.divider,
		{ [styles['divider--dotted']]: dotted }
	);

	return (
		<div className={classes} {...(margin ? { style: { margin: `${margin}px 0` } } : {})} />
	);
};
