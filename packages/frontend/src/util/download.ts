import yaml from 'js-yaml';
import type { Character } from '../types';

type SaveData = {
	filename: string;
	data: string;
	contentType?: string;
};

type SaveYaml = {
	filename: string;
	data: any;
};

export const save = ({ filename, data, contentType = 'text/plain' }: SaveData) => {
	const blob = new Blob([data], { type: contentType });
	const element = window.document.createElement('a');
	const objectURL = window.URL.createObjectURL(blob);
	element.href = objectURL;
	element.download = filename;
	document.body.appendChild(element);
	element.click();
	setTimeout(() => {
		document.body.removeChild(element);
		window.URL.revokeObjectURL(objectURL);
	}, 50);
};

export const saveYaml = ({ filename, data }: SaveYaml) => {
	const text = yaml.dump(data);
	save({ filename, data: text, contentType: 'text/yaml' });
};

export const saveCharacterAsYaml = (internal: Character) => {
	const character = removeIds(internal);
	saveYaml({ filename: `${character.name}.yml`, data: character });
};

const removeIds = (input: any): any => {
	if (Array.isArray(input)) return input.map(removeIds);
	if (typeof input === 'object')
		return Object.entries(input).reduce((accumulator, currentValue): Record<string, any> => {
			const [key, value] = currentValue;
			if (key === 'id') return accumulator;
			accumulator[key] = removeIds(value);
			return accumulator;
		}, {} as Record<string, any>);
	return input;
};
