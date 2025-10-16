import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import cn from "classnames";
import style from "./RectangleSelectionGroup.module.css";
import { useMemo } from "react";

export interface RectangleSelectionGroupItem {
    id: string;
    children: React.ReactNode;
}

interface DefaultClassNames {
    item?: string;
    container?: string;
}

export interface RectangleSelectionGroupProps extends React.HTMLAttributes<HTMLDivElement> {
    items: RectangleSelectionGroupItem[];
    value?: string;
    cnn?: DefaultClassNames;
    onValueChange: (value: string) => void;
}

export function RectangleSelectionGroup({items, value, cnn, onValueChange}: RectangleSelectionGroupProps) {
    const defaultClassNames: DefaultClassNames = {
        container: cn("flex flex-col gap-3"),
        item: cn(
            "flex-1 items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors",
            style["rectangle-group-item"]
        )
    }

    const overrideClassNames = useMemo(() => ({
        ...defaultClassNames,
        ...cnn
    }), [cnn]);

    return (
        <RadioGroup value={value} onValueChange={onValueChange}>
            <div className={overrideClassNames.container}>
                {items.map((item) => (
                    <div
                        key={item.id}
                        className={overrideClassNames.item}
                        onClick={() => onValueChange(item.id)}
                    >
                        <div className="flex items-center gap-3 w-full">
                            <RadioGroupItem className={style["rectangle-group-item__radio"]} value={item.id} id={item.id} />
                            {item.children}
                        </div>
                    </div>
                ))}
            </div>
        </RadioGroup>
    );
}