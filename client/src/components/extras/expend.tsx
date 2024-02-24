import { Button, Icon } from '@blueprintjs/core';
import { useDispatch } from 'react-redux';
import { spendExtra } from '../../data/user-slice';
import { selectCharacterId } from '../../data/whoami-slice';
import { useSelector } from 'react-redux';
import { expend } from '../../api/expend';
import { Extra } from '../../types';

type Props = { extraId: string; extraName: string } | Extra;

// TODO get rid of the OR part of this and just pass an extra.
const Expend = (props: Props) => {
	let extraName: string;
	let extraId: string;
	if ('id' in props) {
		extraName = props.name;
		extraId = props.id;
	} else {
		extraName = props.extraName;
		extraId = props.extraId;
	}
	const dispatch = useDispatch();
	const title = `Expend one`;
	const characterId = useSelector(selectCharacterId);

	return (
		<Button
			minimal
			style={{ marginLeft: '6px' }}
			onClick={e => {
				e.stopPropagation();
				expend(extraName);
				dispatch(
					spendExtra({
						characterId,
						extraId,
					})
				);
			}}>
			<Icon icon="remove" title={title} htmlTitle={title} style={{ display: 'inline-block' }} />
		</Button>
	);
};

export default Expend;
