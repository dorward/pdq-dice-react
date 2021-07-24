import { Attribute, Character, SelectedAttributes } from '../../types';

export type Props = {
	attributes: Attribute[];
	title: string;
	character: Character;
	isWoundable?: boolean;
	attributeState: [SelectedAttributes, (x: SelectedAttributes) => void];
};

export type RowProps = {
	attribute: Attribute;
	character: Character;
	isWoundable: boolean;
	attributeState: [SelectedAttributes, (x: SelectedAttributes) => void];
};
