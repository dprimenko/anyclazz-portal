import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import classNames from "classnames";
import style from "./RectangleSelectionGroup.module.css";

export interface RectangleSelectionGroupItem {
    id: string;
    children: React.ReactNode;
}

export interface RectangleSelectionGroupProps extends React.HTMLAttributes<HTMLDivElement> {
    items: RectangleSelectionGroupItem[];
    value: string;
    onValueChange: (value: string) => void;
}

export function RectangleSelectionGroup({items, value, className, onValueChange}: RectangleSelectionGroupProps) {
    return (
        <RadioGroup value={value} onValueChange={onValueChange}>
            <div className={classNames("flex flex-col gap-3", className)}>
                {items.map((item) => (
                    <div
                        key={item.id}
                        className={classNames(
                            "flex-1 flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors",
                            style["rectangle-group-item"]
                        )}
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