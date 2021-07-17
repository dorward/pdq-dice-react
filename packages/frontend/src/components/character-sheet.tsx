import React, { useState } from 'react';
import { Character, SelectedAttributes } from '../types';
import { H2 } from '@blueprintjs/core';
import Attributes from './attributes';
import SimpleDice from './simple-dice';
import SkillCheck from './skill-check';

type Props = {
	character: Character;
};

const CharacterSheet = ({ character }: Props) => {
	const attributeState = useState<SelectedAttributes>({});

	return (
		<>
			<div className="character-sheet">
				<H2>{character.name}</H2>
				<SimpleDice />
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
				<SkillCheck attributeState={attributeState} />
			</div>
		</>
	);
};

export default CharacterSheet;
