import { useState, type HTMLAttributes, type ReactNode } from 'react';
import type { ColorType } from '@/ui-library/shared/constants';
import classNames from 'classnames';
import styles from './Dropdown.module.css';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Icon } from '@/ui-library/components/ssr/icon/Icon';

export interface DropdownProps extends HTMLAttributes<HTMLSelectElement> {
	prepend?: ReactNode;
    fullWidth?: boolean;
    label?: string;
	colorType?: ColorType;
	onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const items = [
  { value: "1", label: 'Wade Cooper' },
  { value: "2", label: 'Arlene Mccoy' },
  { value: "3", label: 'Devon Webb' },
  { value: "4", label: 'Tom Cook' },
  { value: "5", label: 'Tanya Fox' },
  { value: "6", label: 'Hellen Schmidt' },
  { value: "7", label: 'Caroline Schultz' },
  { value: "8", label: 'Mason Heaney' },
  { value: "9", label: 'Claudie Smitham' },
  { value: "10", label: 'Emil Schaefer' },
]

export const Dropdown = ({
	prepend,
    label,
    className,
    fullWidth = false,
	onChange,
	...props
}: DropdownProps) => {
	const [selected, setSelected] = useState()

    const classes = classNames(
        'px-4 py-2.5 rounded-lg control control--input text-base',
		styles.dropdown,
		{ 'w-full': fullWidth },
		className
	);

	return (
		<Select>
			<SelectTrigger className={classes}>
				<SelectValue placeholder="Any price" />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
				{items.map((item) => (
					<SelectItem key={item.value} value={item.value}>
						{item.label}
					</SelectItem>
				))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
};
