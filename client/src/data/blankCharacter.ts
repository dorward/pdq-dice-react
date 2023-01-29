import { Character } from '../types';
import randomName from './random-name';

const blankCharacter = (id: string): Character => {
	return {
		name: randomName(),
		id,
		player: '',
		motivation: '',
		origin: '',
		bennies: { current: 3, max: '3' },
		qualities: [],
		extras: [],
		powers: [],
		codeName: '',
	};
};

export default blankCharacter;
