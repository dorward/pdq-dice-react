import React from 'react';
import { Tab, Tabs, Icon } from '@blueprintjs/core';
import { User } from '../types';
import EditCharacter from './edit-character';
import CharacterSheet from './character-sheet';
import { selectUser } from '../data/user-slice';
import { setCharacterId } from '../data/whoami-slice';
import NoCharacter from './no-character';
import { useDispatch, useSelector } from 'react-redux';
import { exitEditMode } from '../data/edit-mode-slice';

const Characters = () => {
	const dispatch = useDispatch();
	const { characters } = useSelector(selectUser) as User;
	return (
		<>
			<Tabs
				onChange={id => {
					dispatch(exitEditMode());
					dispatch(setCharacterId(id as string));
				}}
				large
				renderActiveTabPanelOnly>
				<Tab id="simple-dice" panel={<NoCharacter />}>
					<Icon icon="random" id="random" title="Dice rolling" />
				</Tab>
				{characters.map(character => (
					<Tab
						id={character.id}
						key={character.id}
						title={character.name}
						panel={<CharacterSheet character={character} />}
					/>
				))}
				<Tab id="new-character-page" panel={<EditCharacter />}>
					<Icon icon="new-person" title="New character" />
				</Tab>
			</Tabs>
		</>
	);
};

export default Characters;
