import { Character } from '../types';
import { v4 as uuidv4 } from 'uuid';
import randomName from './random-name';

const blankCharacter = (): Character => {
	return {
		name: randomName(),
		id: uuidv4(),
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
