import { Props as AttributesProps } from './attributes/types';
import { Button, FormGroup, Icon, InputGroup } from '@blueprintjs/core';
import { Character } from '../types';
import { editCharacter, selectEditingCharacter } from '../data/edit-mode-slice';
import { finishEditing } from '../data/helpers';
import { useDispatch, useSelector } from 'react-redux';
import Attributes from './attributes';
import CharacterHeader from './character-header';
import Extras from './extras';
import React, { useState } from 'react';
import SimpleDice from './simple-dice';
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
	const dispatch = useDispatch();
	const characterToEdit = useSelector(selectEditingCharacter);
	const character = characterToEdit || characterProp;
	const [description, setDescription] = useState('');
	const descriptionId = `${character.id}-description`;
	return (
		<>
			<div className="character-sheet">
				<CharacterHeader name={character.name} />
				<div className="character-menu">
					<SimpleDice hasSkillButton />
					{characterToEdit ? (
						<Button onClick={finishEditing}>
							<Icon icon="floppy-disk" title="Save" htmlTitle="Save" />
						</Button>
					) : (
						<Button
							onClick={() => {
								console.log('edit');
								dispatch(editCharacter(character));
							}}>
							<Icon icon="edit" title="Edit" htmlTitle="Edit" />
						</Button>
					)}
				</div>
				<Attributes {...{ ...qualities, character }} />
				<Attributes {...{ ...powers, character }} />
				<Extras extras={character.extras} />
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
			</div>
		</>
	);
};

export default CharacterSheet;
