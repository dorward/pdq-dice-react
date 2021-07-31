import { Props as AttributesProps } from './attributes/types';
import { Character } from '../types';
import { FormGroup, InputGroup } from '@blueprintjs/core';
import { selectEditingCharacter } from '../data/edit-mode-slice';
import { useSelector } from 'react-redux';
import Attributes from './attributes';
import CharacterHeader from './character-header';
import CharacterMenu from './character-menu';
import Extras from './extras';
import React, { useState } from 'react';
import SkillCheck from './skill-check';

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
	const characterToEdit = useSelector(selectEditingCharacter);
	const character = characterToEdit || characterProp;
	const [description, setDescription] = useState('');
	const descriptionId = `${character.id}-description`;
	return (
		<>
			<div className="character-sheet">
				<CharacterMenu character={character} />
				<CharacterHeader name={character.name} />
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
								onChange={e => setDescription(e.currentTarget.value)}
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
