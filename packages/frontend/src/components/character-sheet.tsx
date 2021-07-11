import React from 'react';
import { Character } from '../types';
import { H2 } from '@blueprintjs/core';
import Attributes from './attributes';

type Props = {
	character: Character;
};

const CharacterSheet = ({ character }: Props) => {
	return (
		<>
			<div className="character-sheet">
				<H2>{character.name}</H2>
				<Attributes title="Standard Qualities" attributes={character.qualities} character={character} />
				<Attributes title="Powers" attributes={character.powers} character={character} />
			</div>
		</>
	);
};

export default CharacterSheet;
