import { Icon, Tab, Tabs } from '@blueprintjs/core';
import { User } from '../types';
import { exitEditMode } from '../data/edit-mode-slice';
import { selectUser } from '../data/user-slice';
import { setCharacterId } from '../data/whoami-slice';
import { useDispatch, useSelector } from 'react-redux';
import CharacterSheet from './character-sheet';
import NewCharacter from './new-character';
import NoCharacter from './no-character';
import React from 'react';

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
				<Tab id="simple-dice" panel={<NoCharacter showWelcome={characters.length === 0} />}>
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
				<Tab id="new-character-page" panel={<NewCharacter />}>
					<Icon icon="new-person" title="New character" />
				</Tab>
			</Tabs>
		</>
	);
};

export default Characters;
