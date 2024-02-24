import { useSelector } from 'react-redux';
import { selectCharacter } from './whoami-slice';
import { Character } from '../types';

type Ret = {
	character: Character;
};

const useCharacter = (): Ret => {
	const character = useSelector(selectCharacter);
	return { character };
};

export default useCharacter;
