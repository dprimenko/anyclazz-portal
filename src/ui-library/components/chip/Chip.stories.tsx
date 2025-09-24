import { Chip } from "./Chip.tsx";
import { ChipProps } from "./types.ts";

const Example = ({
	label,
    $color,
    $bgColor,
	'data-testid': dataTestId,
	...props
}: ChipProps) => (
    <div
        style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
        }}
    >
        <Chip
            label={label}
            $color={$color}
            $bgColor={$bgColor}
            data-testid={dataTestId}
            {...props}
        />
    </div>
);

const meta = {
    title: "Common/Chip",
    component: Example
};

export default meta;

export const Normal = {
    args: {
        label: "Chip",
    },
};

export const Custom = {
    args: {
        label: "MAPFRE",
        $color: "#D81F04",
        $bgColor: "#FBE9E6",
    },
};
