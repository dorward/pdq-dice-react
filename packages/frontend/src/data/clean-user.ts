import { User } from '../types';
import { v4 as uuidv4 } from 'uuid';

const cleanUser = (user: User) => {
	let cleaned = false;

	if (!user.characters) user.characters = [];
	user.characters.forEach(character => {
		if (!character.id) {
			character.id = uuidv4();
			cleaned = true;
		}
		[...character.qualities, ...character.powers].forEach(attribute => {
			if (!attribute.id) {
				attribute.id = uuidv4();
				cleaned = true;
			}
			if (typeof attribute.wounds === 'undefined') {
				attribute.wounds = 0;
				cleaned = true;
			}
		});
	});

	return { user, cleaned };
};

export default cleanUser;
