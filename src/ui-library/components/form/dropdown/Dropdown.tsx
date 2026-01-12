import { type HTMLAttributes, type ReactNode } from 'react';
import type { ColorType } from '@/ui-library/shared/constants';
import classNames from 'classnames';
import styles from './Dropdown.module.css';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Icon } from '@/ui-library/components/ssr/icon/Icon';

export interface DropdownItem {
  value: string;
  label: string;
  renderItem?: (item: DropdownItem, isSelected: boolean) => ReactNode;
}

export interface DropdownProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
	prepend?: ReactNode;
    fullWidth?: boolean;
    label?: string;
	colorType?: ColorType;
    placeholder?: string;
    items?: DropdownItem[];
    value?: string;
	onChange?: (value: string) => void;
}

export const Dropdown = ({
	prepend,
    label,
    className,
    fullWidth = false,
    placeholder,
    items = [],
    value,
	onChange,
	...props
}: DropdownProps) => {
    const classes = classNames(
        { 'w-full': fullWidth },
		className
	);

	const selectedItem = items.find(item => item.value === value);
	const displayValue = selectedItem ? selectedItem.label : undefined;

	return (
		<Select value={value} onValueChange={onChange}>
			<SelectTrigger prefix={prepend} className={classes}>
				<SelectValue 
					placeholder={placeholder}
					className={selectedItem ? 'text-[var(--color-neutral-900)]' : 'text-[var(--color-neutral-400)]'}
				>
					{displayValue || placeholder}
				</SelectValue>
			</SelectTrigger>
			<SelectContent className="max-h-[300px] overflow-y-auto">
				<SelectGroup>
				{items.map((item) => {
                    const isSelected = value === item.value;
                    return (
                        <SelectItem key={item.value} value={item.value} textValue={item.label}>
                            {item.renderItem ? (
                                item.renderItem(item, isSelected)
                            ) : (
                                <div className="flex items-center justify-between w-full">
                                    <span>{item.label}</span>
                                    {isSelected && <Icon icon="check" iconWidth={16} iconHeight={16} className="text-[var(--color-primary-700)]" />}
                                </div>
                            )}
                        </SelectItem>
                    );
                })}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
};
