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

const people = [
  { id: 1, name: 'Wade Cooper' },
  { id: 2, name: 'Arlene Mccoy' },
  { id: 3, name: 'Devon Webb' },
  { id: 4, name: 'Tom Cook' },
  { id: 5, name: 'Tanya Fox' },
  { id: 6, name: 'Hellen Schmidt' },
  { id: 7, name: 'Caroline Schultz' },
  { id: 8, name: 'Mason Heaney' },
  { id: 9, name: 'Claudie Smitham' },
  { id: 10, name: 'Emil Schaefer' },
]

type Person = typeof people[0];

export const Dropdown = ({
	prepend,
    label,
    className,
    fullWidth = false,
	onChange,
	...props
}: DropdownProps) => {
	const [selected, setSelected] = useState<Person | undefined>()

    const classes = classNames(
        'px-4 py-2.5 rounded-lg control control--input text-base focus:bg-red-500',
		styles.dropdown,
		{ [styles['w-full']]: fullWidth },
		className
	);

	return (
		<Select>
			<SelectTrigger className={classes}>
				<SelectValue placeholder="Select a fruit" />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
				<SelectLabel>Fruits</SelectLabel>
				<SelectItem value="apple">Apple</SelectItem>
				<SelectItem value="banana">Banana</SelectItem>
				<SelectItem value="blueberry">Blueberry</SelectItem>
				<SelectItem value="grapes">Grapes</SelectItem>
				<SelectItem value="pineapple">Pineapple</SelectItem>
				</SelectGroup>
			</SelectContent>
		</Select>
	);
};
