import { Attribute, Character } from '../../types';

export type Props = {
	attributes: Attribute[];
	title: string;
	character: Character;
	isWoundable?: boolean;
};

export type RowProps = {
	attribute: Attribute;
	character: Character;
	isWoundable: boolean;
};
