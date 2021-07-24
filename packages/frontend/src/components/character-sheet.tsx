import React, { useState } from 'react';
import { Character, SelectedAttributes, RollData } from '../types';
import { H2, FormGroup, InputGroup } from '@blueprintjs/core';
import Attributes from './attributes';
import SimpleDice from './simple-dice';
import SkillCheck from './skill-check';

type Props = {
	character: Character;
};

const CharacterSheet = ({ character }: Props) => {
	const attributeState = useState<SelectedAttributes>({});
	const [description, setDescription] = useState('');
	const descriptionId = `${character.id}-description`;
	const options: RollData = { attributeState, description };
	return (
		<>
			<div className="character-sheet">
				<H2>{character.name}</H2>
				<SimpleDice options={options} />
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
					<FormGroup label="Description" labelFor={descriptionId}>
						<InputGroup id={descriptionId} value={description} onChange={e => setDescription(e.currentTarget.value)} />
					</FormGroup>
					<SkillCheck options={options} />
				</div>
			</div>
		</>
	);
};

export default CharacterSheet;
