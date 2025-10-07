export function findItemAndMoveToFirstPosition<T>(array: T[], value: string, valueToCompare: keyof T): T[] {
	const index = array.findIndex((i: T) => i[valueToCompare] === value);
	if (index < 0 || index >= array.length) {
		return array;
	}
	const [foundItem] = array.splice(index, 1);
	array.unshift(foundItem);
	return array;
}