import React from 'react';
import { H2 } from '@blueprintjs/core';
import SimpleDice from './simple-dice';

const NoCharacter = () => {
	return (
		<>
			<div className="character-sheet">
				<H2>Roll some dice</H2>
				<SimpleDice />
			</div>
		</>
	);
};

export default NoCharacter;
