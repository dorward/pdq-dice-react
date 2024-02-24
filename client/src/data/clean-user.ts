import { User, Character, Extra, ExtraContainer } from '../types';
import { v4 as uuidv4 } from 'uuid';
import cleanCount from './cleanCount';

const cleanUser = (user: User) => {
	user.characters ??= [];
	user.characters.forEach(cleanCharacter);
	return user;
};

const updateLocationDataOnExtras = (extras: Extra[]) => {
	const locations: ExtraContainer[] = [];

	const createLocation = (name: string): ExtraContainer => {
		console.log('Creating location: ', name);
		const id = uuidv4();
		const extra: ExtraContainer = {
			id,
			name,
			location: '',
			isExpanded: true,
			count: null,
			value: null,
			capacity: 0,
		};
		locations.push(extra);
		return extra;
	};

	const onMe: ExtraContainer = createLocation('About my person');

	const updatedExtras = extras.map(extra => {
		const updated = { ...extra };
		updated.location = extra.location.trim();
		if (extra.location === '') {
			updated.location = onMe.id;
		} else {
			const location = locations.find(l => l.name === extra.location) ?? createLocation(extra.location);
			updated.location = location.id;
		}
		return updated;
	});

	const allExtras: Extra[] = updatedExtras.concat(locations);
	return allExtras;
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
		extra.count = cleanCount(extra.count);
	});
	character.bennies ??= { current: 3, max: '3' };
	if (!character.inventory) {
		console.log('Updating invenstory for ', character.name || character.codeName);
		character.inventory = updateLocationDataOnExtras(character.extras);
	}
};

export default cleanUser;
