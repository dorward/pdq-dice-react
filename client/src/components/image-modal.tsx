import { useRef, useState } from 'react';
import { Button, Card, Slider, Overlay, Intent } from '@blueprintjs/core';
import AvatarEditor from 'react-avatar-editor';
import updateAvatar from '../api/update-avatar';
import { LoadingOverlay } from './loading';
import { useDispatch } from 'react-redux';
import { updateAvatar as updateAvatarAction } from '../data/edit-mode-slice';

type Props = { url: string; clear: () => void };

const ImageModal = ({ url, clear }: Props) => {
	const dispatch = useDispatch();
	const editor = useRef(null);
	const [uploading, setUploading] = useState(false);
	const [scale, setScale] = useState(1.2);

	const save = async () => {
		if (editor.current) {
			const image = editor?.current?.getImage().toDataURL();
			if (image) {
				setUploading(true);
				const url = await updateAvatar({ image });
				dispatch(updateAvatarAction(url));
				clear();
			}
		}
	};

	if (uploading) {
		return <LoadingOverlay />;
	}

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
					<AvatarEditor image={url} ref={editor} width={250} height={250} border={50} scale={scale} />

					<Slider
						className="avatar-editor-scale"
						min={0.1}
						max={5}
						labelValues={[0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]}
						value={scale}
						onChange={setScale}
						stepSize={0.1}
					/>

					<Button onClick={save} intent={Intent.PRIMARY}>
						Save
					</Button>
				</Card>
			</div>
		</Overlay>
	);
};

export default ImageModal;
