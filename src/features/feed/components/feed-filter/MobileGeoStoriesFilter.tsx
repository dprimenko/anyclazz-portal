import './styles.scss';
import type { DropdownOptionProps } from "../../../../ui-library/components/dropdown/types";
import { CaretLeftIcon } from '@phosphor-icons/react';
import { Dropdown } from '../../../../ui-library/components/dropdown';
import { useCallback, useState, type ChangeEvent } from 'react';
import { useThemeContext } from '../../../../ui-library/themes';

export interface GeoStoriesFilterProps {
    items: DropdownOptionProps[];
    onSelected: (item: DropdownOptionProps) => void;
	onClose: () => void;
}

export const MobileGeoStoriesFilter = ({ items, onSelected, onClose }: GeoStoriesFilterProps) => {
	const { theme } = useThemeContext();
	const [value, setValue] = useState<string>('');

	const handleValueChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		setValue(event.target.value);

		const selectedItem = items.find((item) => item.value === event.target.value);
		if (!selectedItem) return;
		onSelected(selectedItem);
		onClose();
	}, []);

	return (
		<div className="mobile-geostories-filter__container">
            <div className="mobile-geostories-filter__header">
                <div className="mobile-geostories-filter__header-back-button">
                    <CaretLeftIcon color={theme.colors.neutral[900]} size={24} onClick={onClose} />
                </div>
                <span className="mobile-geostories-filter__header-title">Filtros</span>
            </div>
            <div className="mobile-geostories-filter__content">
                <>
                    <Dropdown label="Categoría" items={items} value={value} onChange={handleValueChange} />
                </>
            </div>
        </div>
	);
};