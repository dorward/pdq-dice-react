import { Character } from '../types';
import { v4 as uuidv4 } from 'uuid';
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
	};
};

export default blankCharacter;
