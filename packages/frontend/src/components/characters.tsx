import React, { useState, useEffect } from 'react';
import { Tab, Tabs, Icon } from '@blueprintjs/core';
import { User } from '../types';
import EditCharacter from './edit-character';
import CharacterSheet from './character-sheet';
import { set as setUser, selectUser } from '../data/user-slice';
import { useSelector, useDispatch } from 'react-redux';

const Characters = () => {
	const { characters } = useSelector(selectUser) as User;

	return (
		<>
			<Tabs>
				{characters.map(character => (
					<Tab
						id={character.name.replace(/\s/g, '')}
						title={character.name}
						key={character.name}
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
