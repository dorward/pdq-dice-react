import { User } from '../types';
import { v4 as uuidv4 } from 'uuid';

const cleanUser = (user: User) => {
	user.characters ??= [];
	user.characters.forEach(character => {
		character.id ??= uuidv4();
		[...character.qualities, ...character.powers].forEach(attribute => {
			attribute.id ??= uuidv4();
			attribute.wounds ??= 0;
		});
		character.extras ??= [];
		character.extras.forEach(extra => (extra.id ??= uuidv4()));
	});
	return user;
};

export default cleanUser;
