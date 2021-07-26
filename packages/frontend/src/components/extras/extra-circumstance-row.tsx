import { FormGroup, HTMLSelect, InputGroup } from '@blueprintjs/core';
import { selectCircumstance, updateCircumstance } from '../../data/roll-slice';
import { useDispatch, useSelector } from 'react-redux';
import React from 'react';
import extraValues from './consts';

const ExtraCircumstanceRow = () => {
	const dispatch = useDispatch();
	const extra = useSelector(selectCircumstance);

	return (
		<tr key="circumstance-bonus">
			<td key="label">
				<FormGroup inline label="Circumstance bonus" labelFor={`input-${extra.id}`}>
					<InputGroup
						id={`input-${extra.id}`}
						value={extra.name}
						onChange={e => {
							const data = { id: extra.id, name: e.target.value };
							dispatch(updateCircumstance(data));
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
						dispatch(updateCircumstance(data));
					}}
				/>
			</td>
		</tr>
	);
};

export default ExtraCircumstanceRow;
