import Goo from 'gooey-react';
import React from 'react';
import { Overlay, Card } from '@blueprintjs/core';

type Props = {
	small?: boolean;
};

const Loading = ({ small }: Props) => {
	if (small)
		return (
			<Goo composite style={{ height: '60px', width: '60px', position: 'relative' }}>
				<svg width="60" height="60" className="goo">
					<g>
						<circle cx="34%" cy="34%" fill="orchid" r="10" />
						<circle cx="66%" cy="66%" fill="mediumorchid" r="10" />
					</g>
				</svg>
			</Goo>
		);
	return (
		<Goo>
			<svg width="192" height="192" className="goo">
				<g>
					<circle cx="34%" cy="34%" fill="orchid" r="32" />
					<circle cx="66%" cy="66%" fill="mediumorchid" r="32" />
				</g>
			</svg>
		</Goo>
	);
};

export const LoadingOverlay = () => {
	return (
		<Overlay
			autoFocus
			enforceFocus
			onClose={() => {
				/* Clear state */
			}}
			isOpen={true}>
			<div className="v-center">
				<Card interactive={true} elevation={1} className="h-center">
					<Loading />
				</Card>
			</div>
		</Overlay>
	);
};

export default Loading;
