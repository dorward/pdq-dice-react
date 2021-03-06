/* eslint-disable @typescript-eslint/no-explicit-any */
type Named = {
	id: string;
	name: string;
};

type Valued = {
	id: string;
	value: any;
};

type Locationed = {
	id: string;
	value: any;
};

type Counted = { id: string; count?: any };

export const mutateName = <T extends Named>(array: T[], id: string, name: string): T[] => {
	const index = array.findIndex(item => item.id === id);
	if (index === -1) return array;
	array[index] = { ...array[index], name };
	return array;
};

export const mutateValue = <T extends Valued>(array: T[], id: string, value: any): T[] => {
	const index = array.findIndex(item => item.id === id);
	if (index === -1) return array;
	array[index] = { ...array[index], value };
	return array;
};

export const mutateLocation = <T extends Locationed>(array: T[], id: string, location: any): T[] => {
	const index = array.findIndex(item => item.id === id);
	if (index === -1) return array;
	array[index] = { ...array[index], location };
	return array;
};

export const mutateCount = <T extends Counted>(array: T[], id: string, count: any): T[] => {
	const index = array.findIndex(item => item.id === id);
	if (index === -1) return array;
	array[index] = { ...array[index], count };
	return array;
};
