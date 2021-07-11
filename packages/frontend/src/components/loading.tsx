import React from 'react';
import Goo from 'gooey-react';

const Loading = () => (
	<Goo>
		<svg width="192" height="192" className="goo">
			<g>
				<circle cx="34%" cy="34%" fill="orchid" r="32" />
				<circle cx="66%" cy="66%" fill="mediumorchid" r="32" />
			</g>
		</svg>
	</Goo>
);

export default Loading;
