import { H1 } from '@blueprintjs/core';
import Loading from './loading';
import React from 'react';

const Home = () => {
	return (
		<div className="v-center">
			<main className="tiny">
				<H1>PDQ Dice</H1>
				<Loading />
				<p>
					To login, visit a Discord channel where the bot is active and type <kbd>login</kbd>. Then click the link in
					the DM the bot will send you.
				</p>
			</main>
		</div>
	);
};

export default Home;
