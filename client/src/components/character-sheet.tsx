import { Props as AttributesProps } from './attributes/types';
import { Character } from '../types';
import { FormGroup, InputGroup } from '@blueprintjs/core';
import { selectEditingCharacter } from '../data/edit-mode-slice';
import Attributes from './attributes';
import CharacterHeader from './character-header';
import CharacterMenu from './character-menu';
import Extras from './extras';

import SkillCheck from './skill-check';
import { selectDescription, updateDescription } from '../data/roll-slice';
import { useDispatch, useSelector } from 'react-redux';

type Props = {
	character: Character;
};

const qualities = {
	title: 'Standard Qualities',
	dataSource: 'qualities' as AttributesProps['dataSource'],
	isWoundable: true,
};

const powers = {
	title: 'Powers',
	dataSource: 'powers' as AttributesProps['dataSource'],
	isWoundable: false,
};

const CharacterSheet = ({ character: characterProp }: Props) => {
	const dispatch = useDispatch();
	const characterToEdit = useSelector(selectEditingCharacter);
	const character = characterToEdit || characterProp;
	const description = useSelector(selectDescription);
	const descriptionId = `${character.id}-description`;
	return (
		<>
			<div className="character-sheet">
				<CharacterMenu character={character} />
				<CharacterHeader name={character.name} avatar={character.avatar} />
				<Attributes {...{ ...qualities, character }} />
				<Attributes {...{ ...powers, character }} />
				<Extras extras={character.extras} />
				{!characterToEdit && (
					<div className="controls">
						<FormGroup label="Description of roll" labelFor={descriptionId}>
							<InputGroup
								placeholder="What action are you rolling?"
								id={descriptionId}
								value={description}
								onChange={e => dispatch(updateDescription(e.currentTarget.value))}
							/>
						</FormGroup>
						<SkillCheck />
					</div>
				)}
			</div>
		</>
	);
};

export default CharacterSheet;
