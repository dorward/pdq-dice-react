import React from 'react';
import { H1 } from '@blueprintjs/core';
import Goo from 'gooey-react';

const Home = () => {
	return (
		<div className="v-center">
			<main className="tiny">
				<H1>PDQ Dice</H1>
				<Goo>
					<svg width="192" height="192" className="goo">
						<g>
							<circle cx="34%" cy="34%" fill="orchid" r="32" />
							<circle cx="66%" cy="66%" fill="mediumorchid" r="32" />
						</g>
					</svg>
				</Goo>
				<p>
					To login, visit a Discord channel where the bot is active and type <kbd>login</kbd>. Then click the link in
					the DM the bot will send you.
				</p>
			</main>
		</div>
	);
};

export default Home;
