export const Space = ({ size, direction }: { size?: number; direction?: "horizontal" | "vertical" }) => {
	return (
		<div {...(size ? { style: { [direction === "horizontal" ? "width" : "height"]: `${size}px` } } : {})} />
	);
};
