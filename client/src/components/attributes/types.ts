import { Attribute, Character } from '../../types';

export type Props = {
	title: string;
	character: Character;
	isWoundable?: boolean;
	dataSource: 'powers' | 'qualities';
};

export type RowProps = {
	attribute: Attribute;
	character: Character;
	isWoundable: boolean;
	dataSource: Props['dataSource'];
};
