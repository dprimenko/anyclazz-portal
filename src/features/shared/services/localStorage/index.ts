export const get = <T>(field: string): T|undefined => {
	const result = window.localStorage.getItem(field);
	return result && result !== 'undefined' ? JSON.parse(result) : undefined;
};

export const set = <T>(field: string, data: T) => {
	window.localStorage.setItem(field, JSON.stringify(data));
};

export const remove = (field: string) => {
	window.localStorage.removeItem(field);
};