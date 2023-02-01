import { Checkbox } from '@blueprintjs/core';
import { RowProps } from './types';
import { selectSelected, toggleSelected } from '../../data/roll-slice';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

const ExtraPlayRow = ({ extra, isOpen, remoteInventory }: RowProps) => {
	const dispatch = useDispatch();
	const selectedExtras = useSelector(selectSelected);
	const checked = !!selectedExtras[extra.id];
	const onChange = () => dispatch(toggleSelected(extra.id));

	const count = extra.count !== undefined && extra.count !== '∞' ? `(×${extra.count})` : null;

	const bonus = new Intl.NumberFormat('en-GB', {
		signDisplay: 'exceptZero',
	}).format(extra.value);

	return (
		<tr key={extra.id} className={classNames({ isOpen, remoteInventory })}>
			<td key="label" className="bonus-name">
				<Checkbox checked={checked} onChange={onChange} disabled={extra.count === 0}>
					{extra.name} {count}
				</Checkbox>
			</td>
			<td>{bonus}</td>
		</tr>
	);
};

export default ExtraPlayRow;
