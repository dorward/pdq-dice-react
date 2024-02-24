import { Extra } from '../../types';
import Expend from './expend';

const Count = ({ extra }: { extra: Extra }) => {
	const { count } = extra;
	if (!count || count === '∞') {
		return null;
	}
	if (count === 0) {
		return '×0';
	}
	return (
		<>
			×{count} <Expend {...extra} />
		</>
	);
};

export default Count;
