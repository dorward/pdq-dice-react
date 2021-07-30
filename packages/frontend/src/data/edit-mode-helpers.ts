/* eslint-disable @typescript-eslint/no-explicit-any */
type Named = {
	id: string;
	name: string;
};

type Valued = {
	id: string;
	value: any;
};

export const mutateName = (array: Named[], id: string, name: string): Named[] => {
	const index = array.findIndex(item => item.id === id);
	if (index === -1) return array;
	array[index] = { ...array[index], name };
	return array;
};

export const mutateValue = (array: Valued[], id: string, value: any): Valued[] => {
	const index = array.findIndex(item => item.id === id);
	if (index === -1) return array;
	array[index] = { ...array[index], value };
	return array;
};
