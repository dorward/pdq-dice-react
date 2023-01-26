import { Icon, Tab, Tabs } from '@blueprintjs/core';
import { exitEditMode } from '../data/edit-mode-slice';
import { selectCharacterId, setCharacterId } from '../data/whoami-slice';
import { selectCharacters } from '../data/user-slice';
import { useDispatch, useSelector } from 'react-redux';
import CharacterSheet from './character-sheet';
import NewCharacter from './new-character';
import NoCharacter from './no-character';

const Characters = () => {
	const dispatch = useDispatch();
	const characters = useSelector(selectCharacters).filter(character => !character.hidden);
	const id = useSelector(selectCharacterId) || 'new-character-page';
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
