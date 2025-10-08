import styles from "./Divider.module.css";

export const Divider = ({ margin }: { margin?: number }) => {
	return (
		<div className={styles.divider} {...(margin ? { style: { margin: `${margin}px 0` } } : {})} />
	);
};
