import { Checkbox } from '@blueprintjs/core';
import { RowProps } from './types';
import { selectSelected, toggleSelected } from '../../data/roll-slice';
import { useDispatch, useSelector } from 'react-redux';

const ExtraPlayRow = ({ extra }: RowProps) => {
	const dispatch = useDispatch();
	const selectedExtras = useSelector(selectSelected);
	const checked = !!selectedExtras[extra.id];
	const onChange = () => dispatch(toggleSelected(extra.id));

	const count = extra.count !== undefined && extra.count !== '∞' ? `(×${extra.count})` : null;

	return (
		<tr key={extra.id}>
			<td key="label" className="bonus-name">
				<label className="attribute-row-label">
					<Checkbox checked={checked} onChange={onChange} disabled={extra.count === 0}>
						{extra.name} {count}
					</Checkbox>
				</label>
			</td>
			<td>{extra.value}</td>
		</tr>
	);
};

export default ExtraPlayRow;
