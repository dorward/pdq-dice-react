import React, { useState } from 'react';
import { Character, SelectedAttributes, RollData } from '../types';
import { FormGroup, InputGroup, Button, Icon } from '@blueprintjs/core';
import Attributes from './attributes';
import SimpleDice from './simple-dice';
import SkillCheck from './skill-check';
import { useDispatch, useSelector } from 'react-redux';
import { editCharacter, selectEditingCharacter } from '../data/edit-mode-slice';
import { finishEditing } from '../data/helpers';
import CharacterHeader from './character-header';

type Props = {
	character: Character;
};

const CharacterSheet = ({ character: characterProp }: Props) => {
	const dispatch = useDispatch();
	const characterToEdit = useSelector(selectEditingCharacter);
	const character = characterToEdit || characterProp;
	const attributeState = useState<SelectedAttributes>({});
	const [description, setDescription] = useState('');
	const descriptionId = `${character.id}-description`;
	const options: RollData = { attributeState, description };
	return (
		<>
			<div className="character-sheet">
				<CharacterHeader name={character.name} />
				<div className="character-menu">
					<SimpleDice options={options} />
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
				<Attributes
					title="Standard Qualities"
					attributes={character.qualities}
					character={character}
					isWoundable
					attributeState={attributeState}
				/>
				<Attributes
					title="Powers"
					attributes={character.powers}
					character={character}
					attributeState={attributeState}
				/>
				<div className="controls">
					<FormGroup label="Description of roll" labelFor={descriptionId}>
						<InputGroup
							placeholder="What action are you rolling"
							id={descriptionId}
							value={description}
							onChange={e => setDescription(e.currentTarget.value)}
						/>
					</FormGroup>
					<SkillCheck options={options} />
				</div>
			</div>
		</>
	);
};

export default CharacterSheet;
