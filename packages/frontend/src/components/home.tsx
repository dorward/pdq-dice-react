import React from 'react';
import { H1, Button, Intent, Spinner } from '@blueprintjs/core';

const Home = () => {
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
