import { Button, Card, Intent, Overlay } from '@blueprintjs/core';
import React from 'react';

// type Error = {
// 	name: string;
// 	fileSizeTooLarge: boolean;
// 	fileSizeTooSmall: boolean;
// 	imageHeightTooBig: boolean;
// };

type Props = {
	clear: () => void;
};

const UploadError = ({ clear }: Props) => {
	// const dispatch = useDispatch();

	return (
		<Overlay
			autoFocus
			enforceFocus
			onClose={() => {
				/* Clear state */
			}}
			isOpen={true}>
			<div className="v-center">
				<Card interactive={true} elevation={1} className="h-center results">
					<h2>Error</h2>
					<p>
						Something is wrong with the image you selected. Pick one that is at least 50×50 and no more than 1600×1600
						and smaller than 50Mb.
					</p>
					<Button onClick={clear} intent={Intent.PRIMARY}>
						OK
					</Button>
				</Card>
			</div>
		</Overlay>
	);
};

export default UploadError;
