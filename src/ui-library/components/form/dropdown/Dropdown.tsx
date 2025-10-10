import { useState, type HTMLAttributes, type ReactNode } from 'react';
import type { ColorType } from '../../../shared/constants';
import classNames from 'classnames';
import styles from './Dropdown.module.css';
import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { Icon } from '../../ssr/icon/Icon';

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
        'px-4 py-2.5 rounded-lg control control--input text-base data-[headlessui-state~="open"]:text-lg',
		styles.dropdown,
		{ [styles['w-full']]: fullWidth },
		className
	);

	return (
		<Listbox value={selected} onChange={setSelected}>
			<div className="relative mt-2">
				<ListboxButton className={classes}>
					<span className={classNames("col-start-1 row-start-1 truncate pr-6", {"font-medium": selected})}>{selected ? selected.name : 'Select an option'}</span>
				<Icon
					icon="chevron-down"
					aria-hidden="true"
					className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4 dark:text-gray-400"
				/>
				</ListboxButton>

				<ListboxOptions
				transition
				className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg outline-1 outline-black/5 data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm dark:bg-gray-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10"
				>
				{people.map((person) => (
					<ListboxOption
					key={person.id}
					value={person}
					className="group relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden dark:text-white dark:data-focus:bg-indigo-500"
					>
						<span className="block truncate font-normal group-data-selected:font-semibold">{person.name}</span>
					</ListboxOption>
				))}
				</ListboxOptions>
			</div>
		</Listbox>
	);
};
