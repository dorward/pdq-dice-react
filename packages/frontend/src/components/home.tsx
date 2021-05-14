import React from 'react';
import { H1, Button, Intent, Spinner } from '@blueprintjs/core';
import { PossibleUser } from '../types';

type Props = {
	user: PossibleUser;
};

const Home = ({ user }: Props) => {
	return (
		<main className="tiny">
			<H1>PDQ Dice</H1>
			<p>
				To login, visit a Discord channel where the bot is active and type <kbd>login</kbd>. <br /> Then click the link
				in the DM the bot will send you.
			</p>
		</main>
	);
};

export default Home;
