import { useMemo } from 'react';

export const useTextFirstLetters = (text: string) => {
	return useMemo(() => {
		if (!text) {
			return '';
		}

		const textParts = text.split(' ').filter(part => part !== '');

		if (textParts.length === 0) {
			return '';
		}

		const firstNameInitial = textParts[0][0].toUpperCase();
		const lastNameInitial = textParts.length > 1 ? textParts[1][0].toUpperCase() : '';

		return lastNameInitial ? `${firstNameInitial}${lastNameInitial}` : firstNameInitial;
	}, [text]);
};