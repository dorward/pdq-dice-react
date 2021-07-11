import React from 'react';
import { Tab, Tabs, Icon } from '@blueprintjs/core';
import { User } from '../types';
import EditCharacter from './edit-character';
import CharacterSheet from './character-sheet';
import { selectUser } from '../data/user-slice';
import { useSelector } from 'react-redux';

// TODO: Make the tabs controlled after giving each character a unique id. Use
// that throughout when we need to determine which character is active.

const Characters = () => {
	const { characters } = useSelector(selectUser) as User;

	return (
		<>
			<Tabs>
				{characters.map(character => (
					<Tab
						id={character.id}
						title={character.name}
						key={character.id}
						panel={<CharacterSheet character={character} />}
					/>
				))}
				<Tab id="new-character-page" panel={<EditCharacter />}>
					<Icon icon="new-person" />
				</Tab>
			</Tabs>
		</>
	);
};

export default Characters;
