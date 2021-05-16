import React, { useState, useEffect } from 'react';
import { Tab, Tabs, Icon } from '@blueprintjs/core';
import { Character, UserData } from '../types';
import EditCharacter from './edit-character';
import CharacterSheet from './character-sheet';

type Props = {
	characters: Character[];
	userData: UserData;
};

const Characters = ({ characters, userData }: Props) => {
	return (
		<>
			<Tabs>
				{characters.map(character => (
					<Tab
						id={character.name.replace(/\s/g, '')}
						title={character.name}
						panel={<CharacterSheet character={character} />}
					/>
				))}
				<Tab id="new-character-page" panel={<EditCharacter userData={userData} />}>
					<Icon icon="new-person" />
				</Tab>
			</Tabs>
		</>
	);
};

export default Characters;
