import { Icon, Tab, Tabs } from '@blueprintjs/core';
import { exitEditMode } from '../data/edit-mode-slice';
import { selectCharacterId, setCharacterId } from '../data/whoami-slice';
import { selectCharacters } from '../data/user-slice';
import { useDispatch, useSelector } from 'react-redux';
import CharacterSheet from './character-sheet';
import NewCharacter from './new-character';
import NoCharacter from './no-character';
import type { Character } from '../types';

const NEW_CHARACTER_PAGE = 'new-character-page';
const SIMPLE_DICE_PAGE = 'simple-dice';
const extraPages = [NEW_CHARACTER_PAGE, SIMPLE_DICE_PAGE];

const pickCharacter = (id: string, characters: Character[]) => {
	console.log('ID', id);
	const defaultId = characters[0]?.id || NEW_CHARACTER_PAGE;
	if (!id) return defaultId;
	if (extraPages.includes(id)) return id;
	const matchedCharacter = characters.find(character => character.id === id);
	if (matchedCharacter) {
		return matchedCharacter.id;
	}
	return defaultId;
};

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
						title={character.codeName || 'Missing Code Name'}
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
