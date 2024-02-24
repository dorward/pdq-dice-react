import { Checkbox } from '@blueprintjs/core';
import { Extra } from '../../types';
import { useDispatch, useSelector } from 'react-redux';
import { selectSelected, toggleSelected } from '../../data/roll-slice';
import Count from './extras-tree-play-count';

type ItemProps = {
	extra: Extra;
};

const Item = ({ extra }: ItemProps) => {
	const dispatch = useDispatch();
	const selectedExtras = useSelector(selectSelected);
	const checked = !!selectedExtras[extra.id];
	const onChange = () => dispatch(toggleSelected(extra.id));

	const { name, count } = extra;

	const bonus = new Intl.NumberFormat('en-GB', {
		signDisplay: 'exceptZero',
	}).format(extra.value);

	if (count === null) {
		return (
			<span className="extra-tree-row">
				<span>{name} </span>
			</span>
		);
	}

	if (count === 0) {
		return (
			<span className="extra-tree-row">
				<span>{name} ×0</span> <span className="bonus">{bonus}</span>
			</span>
		);
	}
	return (
		<span className="extra-tree-row">
			<span>
				<Checkbox checked={checked} onChange={onChange} style={{ display: 'inline' }}>
					{name}
				</Checkbox>{' '}
				<Count extra={extra} />
			</span>{' '}
			<span className="bonus">{bonus}</span>
		</span>
	);
};

export default Item;
