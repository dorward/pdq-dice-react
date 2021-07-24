import React from 'react';
import { RowProps } from './types';
import { HTMLSelect, FormGroup, InputGroup } from '@blueprintjs/core';
import { updateExtra } from '../../data/edit-mode-slice';
import { useDispatch } from 'react-redux';

const extraValues = [0, 1, 2, 3, 4, 5, 6];

const AttributeEditRow = ({ extra }: RowProps) => {
	const dispatch = useDispatch();

	return (
		<tr key={extra.name}>
			<td key="label">
				<FormGroup>
					<InputGroup id={`input-${extra.id}`} value={extra.name} />
				</FormGroup>
			</td>
			<td>
				<HTMLSelect
					value={extra.value}
					options={extraValues}
					onChange={e => {
						const data = { id: extra.id, value: +e.target.value };
						// if (extra.id === 'circumstance')
						//     updateCircumstance(data);
						// else
						dispatch(updateExtra(data));
					}}
				/>
			</td>
		</tr>
	);
};

export default AttributeEditRow;
