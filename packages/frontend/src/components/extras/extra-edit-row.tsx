import { FormGroup, HTMLSelect, InputGroup } from '@blueprintjs/core';
import { RowProps } from './types';
import { updateExtra } from '../../data/edit-mode-slice';
import { useDispatch } from 'react-redux';

import React from 'react';

const extraValues = [0, 1, 2, 3, 4, 5, 6];

const ExtraEditRow = ({ extra }: RowProps) => {
	const dispatch = useDispatch();

	return (
		<tr key={extra.id}>
			<td key="label">
				<FormGroup>
					<InputGroup
						id={`input-${extra.id}`}
						value={extra.name}
						onChange={e => {
							const data = { id: extra.id, name: e.target.value };
							dispatch(updateExtra(data));
						}}
					/>
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

export default ExtraEditRow;
