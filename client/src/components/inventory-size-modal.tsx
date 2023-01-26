import { useState } from 'react';
import { Button, Card, Overlay, Intent, InputGroup } from '@blueprintjs/core';
import { useDispatch } from 'react-redux';
import { updateExtra, promptExtraCount } from '../data/edit-mode-slice';

type Props = { id: string };

const InventorySizeModal = ({ id }: Props) => {
	const dispatch = useDispatch();
	const [count, setCount] = useState('10');

	const save = async () => {
		const data = { id, count: +count };
		dispatch(updateExtra(data));
		dispatch(promptExtraCount({ id: undefined }));
	};

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
					<InputGroup
						id="inventory-count"
						type="number"
						value={count}
						autoFocus
						onChange={e => {
							setCount(e.target.value);
						}}
					/>
					<Button onClick={save} intent={Intent.PRIMARY}>
						Save
					</Button>
				</Card>
			</div>
		</Overlay>
	);
};

export default InventorySizeModal;
