import { ControlGroup, HTMLSelect, InputGroup } from '@blueprintjs/core';
import { ExtraUpdateValue } from '../../types';
import { RowProps } from './types';
import { updateExtra } from '../../data/edit-mode-slice';
import { useDispatch } from 'react-redux';
import React from 'react';
import extraValues from './consts';

const ExtraEditRow = ({ extra }: RowProps) => {
	const dispatch = useDispatch();

	return (
		<tr key={extra.id}>
			<td key="label">
				<ControlGroup fill={true}>
					<InputGroup
						id={`input-${extra.id}`}
						value={extra.name}
						onChange={e => {
							const data = { id: extra.id, name: e.target.value };
							dispatch(updateExtra(data));
						}}
					/>
					<InputGroup
						id={`input-location-${extra.id}`}
						value={extra.location}
						placeholder="Location"
						onChange={e => {
							const data = { id: extra.id, location: e.target.value };
							dispatch(updateExtra(data));
						}}
					/>
				</ControlGroup>
			</td>
			<td>
				<HTMLSelect
					value={extra.value}
					options={extraValues}
					onChange={e => {
						const value = e.target.value;
						const data = { id: extra.id, value: value === 'DEL' ? value : +value } as ExtraUpdateValue;
						dispatch(updateExtra(data));
					}}
				/>
			</td>
		</tr>
	);
};

export default ExtraEditRow;
