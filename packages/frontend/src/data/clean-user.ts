import { User, Character } from '../types';
import { v4 as uuidv4 } from 'uuid';

const cleanUser = (user: User) => {
	user.characters ??= [];
	user.characters.forEach(cleanCharacter);
	return user;
};

export const cleanCharacter = (character: Character) => {
	character.id ??= uuidv4();
	[...character.qualities, ...character.powers].forEach(attribute => {
		attribute.id ??= uuidv4();
		attribute.wounds ??= 0;
	});
	character.extras ??= [];
	character.extras.forEach(extra => {
		extra.id ??= uuidv4();
		extra.location ??= '';
	});
	character.bennies ??= { current: 3, max: '3' };
};

export default cleanUser;
