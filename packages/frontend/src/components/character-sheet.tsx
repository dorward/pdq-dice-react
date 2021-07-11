import React from 'react';
import { Character } from '../types';
import { H2 } from '@blueprintjs/core';
import Attributes from './attributes';
import SimpleDice from './simple-dice';

type Props = {
	character: Character;
};

const CharacterSheet = ({ character }: Props) => {
	return (
		<>
			<div className="character-sheet">
				<H2>{character.name}</H2>
				<SimpleDice />
				<Attributes title="Standard Qualities" attributes={character.qualities} character={character} isWoundable />
				<Attributes title="Powers" attributes={character.powers} character={character} />
			</div>
		</>
	);
};

export default CharacterSheet;
