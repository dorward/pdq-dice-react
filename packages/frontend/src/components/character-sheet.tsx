import React, { useState, useEffect } from 'react';
import { Character, UserData } from '../types';
import { H2, H3 } from '@blueprintjs/core';
import Attributes from './attributes';

type Props = {
	character: Character;
};

const CharacterSheet = ({ character }: Props) => {
	return (
		<>
			<div className="character-sheet">
				<H2>{character.name}</H2>
				<Attributes title="Standard Qualities" attributes={character.qualities} />
				<Attributes title="Powers" attributes={character.powers} />
			</div>
		</>
	);
};

export default CharacterSheet;
