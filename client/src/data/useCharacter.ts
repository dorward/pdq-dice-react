import { useSelector } from 'react-redux';
import { selectCharacter } from './whoami-slice';
import { SelectedExtra, selectEditingCharacter } from './edit-mode-slice';
import { Character } from '../types';

type Ret = {
	character: Character;
	characterToEdit?: Character & SelectedExtra;
};

const useCharacter = (): Ret => {
	const characterToEdit = useSelector(selectEditingCharacter);
	const character = useSelector(selectCharacter);
	return { character, characterToEdit };
};

export default useCharacter;
