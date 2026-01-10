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
    colorType?: 'primary' | 'default';
    onValueChange: (value: string) => void;
}

export function RectangleSelectionGroup({items, value, cnn, colorType = 'default', onValueChange}: RectangleSelectionGroupProps) {
    const defaultClassNames: DefaultClassNames = useMemo(() => ({
        container: cn("flex flex-col gap-3"),
        item: cn(
            "flex-1 items-center justify-between p-4 rounded-lg cursor-pointer transition-colors",
        )
    }), []);

    const overrideClassNames = useMemo(() => ({
        ...defaultClassNames,
        ...cnn
    }), [defaultClassNames, cnn]);

    return (
        <RadioGroup value={value} onValueChange={onValueChange}>
            <div className={overrideClassNames.container}>
                {items.map((item) => {
                    const isSelected = value === item.id;
                    const itemClassName = cn(
                        overrideClassNames.item,
                        colorType === 'default' && style["rectangle-group-item"],
                        colorType === 'primary' && isSelected && 'border-2 border-[#F4A43A] bg-[#FEF8F0]',
                        colorType === 'primary' && !isSelected && 'border border-[#E9EAEB] bg-white hover:border-[#D5D7DA]'
                    );
                    
                    return (
                        <label
                            key={item.id}
                            className={itemClassName}
                            htmlFor={item.id}
                        >
                            <div className="flex items-center gap-3 w-full">
                                <RadioGroupItem className={style["rectangle-group-item__radio"]} value={item.id} id={item.id} />
                                {item.children}
                            </div>
                        </label>
                    );
                })}
            </div>
        </RadioGroup>
    );
}