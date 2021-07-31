import { Checkbox } from '@blueprintjs/core';
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
			<td key="label" className="bonus-name">
				<label className="attribute-row-label">
					<Checkbox checked={checked} onChange={onChange}>
						{extra.name}
					</Checkbox>
				</label>
			</td>
			<td>{extra.value}</td>
		</tr>
	);
};

export default ExtraPlayRow;
