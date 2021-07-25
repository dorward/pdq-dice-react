import { Callout, H2, Icon } from '@blueprintjs/core';
import React from 'react';
import SimpleDice from './simple-dice';

type Props = {
	showWelcome: boolean;
};

const NoCharacter = ({ showWelcome }: Props) => {
	return (
		<>
			<div className="character-sheet">
				<H2>Roll some dice</H2>
				<SimpleDice />
			</div>

			{showWelcome && (
				<Callout title="Hi!" icon="info-sign" intent="primary" className="tiny">
					<p>
						Welcome to PDQ Dice. It looks like you don't have any characters set up yet. You'll need to create one
						before you can do much with this app. Click the <Icon icon="new-person" title="New character" />
						symbol in the tabs above to get started.
					</p>
				</Callout>
			)}
		</>
	);
};

export default NoCharacter;
