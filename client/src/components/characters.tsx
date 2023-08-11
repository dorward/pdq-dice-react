import { Icon, Tab, Tabs } from '@blueprintjs/core';
import { exitEditMode } from '../data/edit-mode-slice';
import { selectCharacterId, setCharacterId } from '../data/whoami-slice';
import { selectCharacters } from '../data/user-slice';
import { useDispatch, useSelector } from 'react-redux';
import CharacterSheet from './character-sheet';
import NewCharacter from './new-character';
import NoCharacter from './no-character';
import pickCharacter, { NEW_CHARACTER_PAGE, SIMPLE_DICE_PAGE } from '../data/pickCharacter';

const Characters = () => {
	const dispatch = useDispatch();
	const characters = useSelector(selectCharacters).filter(character => !character.hidden);
	const selectedId = useSelector(selectCharacterId);
	const id = pickCharacter(selectedId, characters);

	return (
		<>
			<Tabs
				className="character-tabs"
				onChange={id => {
					dispatch(exitEditMode());
					dispatch(setCharacterId(id as string));
				}}
				selectedTabId={id}
				large
				renderActiveTabPanelOnly>
				<Tab id={SIMPLE_DICE_PAGE} panel={<NoCharacter showWelcome={characters.length === 0} />}>
					<Icon icon="random" id="random" title="Dice rolling" />
				</Tab>
				{characters.map(character => (
					<Tab
						id={character.id}
						key={character.id}
						title={character.codeName || character.name || '❓'}
						panel={<CharacterSheet character={character} />}
					/>
				))}
				<Tab id={NEW_CHARACTER_PAGE} panel={<NewCharacter />}>
					<Icon icon="new-person" title="New character" />
				</Tab>
			</Tabs>
		</>
	);
};

export default Characters;
