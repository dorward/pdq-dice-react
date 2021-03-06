import { PossibleUser, Sheet, User } from '../types';
import { useState } from 'react';
import yaml from 'js-yaml';

const useUser = () => {
	const [user, setUser] = useState<PossibleUser>(null);

	const getUser = (): User => {
		if (!user) throw new Error('No user');
		if (user instanceof Error) throw user;
		return user;
	};

	const addCharacter = {
		fromYAML: (input: string) => {
			const parsed = yaml.load(input) as Sheet | null;
			if (!parsed)
				throw new Error('The YAML file could not be parsed. Something is probably wrong with the format of it.');
			const character = parsed.sheet;
			const user = getUser();
			const newUser: User = { ...user, characters: [...user.characters, character] };
			setUser(newUser);
		},
		fromBlank: () => {
			console.log('Not yet implemented');
		},
	} as const;

	const userData = { addCharacter } as const;

	return { user, setUser, userData };
};

export default useUser;
