import { Button, Icon } from '@blueprintjs/core';
import { useDispatch } from 'react-redux';
import { spendExtra } from '../../data/user-slice';
import { selectCharacterId } from '../../data/whoami-slice';
import { useSelector } from 'react-redux';
import { expend } from '../../api/expend';

type Props = { extraId: string; extraName: string };

const Expend = ({ extraId, extraName }: Props) => {
	const dispatch = useDispatch();
	const title = `Expend one`;
	const characterId = useSelector(selectCharacterId);

	return (
		<Button
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
			<Icon icon="remove" title={title} htmlTitle={title} />
		</Button>
	);
};

export default Expend;
