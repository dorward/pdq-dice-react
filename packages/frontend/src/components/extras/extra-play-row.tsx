import { RowProps } from './types';
import { selectSelected, toggleSelected } from '../../data/roll-slice';
import { useDispatch, useSelector } from 'react-redux';
import React from 'react';

const ExtraPlayRow = ({ extra }: RowProps) => {
	const dispatch = useDispatch();
	const selectedExtras = useSelector(selectSelected);
	const checked = !!selectedExtras[extra.id];
	const onChange = () => dispatch(toggleSelected(extra.id));

	return (
		<tr key={extra.id}>
			<td key="label">
				<label className="attribute-row-label">
					<input type="checkbox" name={extra.name} value="use" checked={checked} onChange={onChange} /> {extra.name}
				</label>
			</td>
			<td>{extra.value}</td>
		</tr>
	);
};

export default ExtraPlayRow;
