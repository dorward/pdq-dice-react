import type { Character } from '../types';

export const NEW_CHARACTER_PAGE = 'new-character-page';
export const SIMPLE_DICE_PAGE = 'simple-dice';
const extraPages = [NEW_CHARACTER_PAGE, SIMPLE_DICE_PAGE];

const pickCharacter = (id: string | undefined, characters: Character[]) => {
	const defaultId = characters[0]?.id || NEW_CHARACTER_PAGE;
	if (!id) return defaultId;
	if (extraPages.includes(id)) return id;
	const matchedCharacter = characters.find(character => character.id === id);
	if (matchedCharacter) {
		return matchedCharacter.id;
	}
	return defaultId;
};

export default pickCharacter;
