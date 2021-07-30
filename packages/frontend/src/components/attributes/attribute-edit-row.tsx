import { FormGroup, HTMLSelect, InputGroup } from '@blueprintjs/core';
import { QualityValue } from '../../types';
import { RowProps } from './types';
import { attributeValues } from '../../consts';
import { updateAttribute } from '../../data/edit-mode-slice';
import { useDispatch } from 'react-redux';
import React from 'react';
import classnames from 'classnames';

const options = ['DEL', ...attributeValues.map(v => v[0])];

const AttributeEditRow = ({ attribute }: RowProps) => {
	const dispatch = useDispatch();
	return (
		<tr key={attribute.id} className={classnames({ wounded: Boolean(attribute.wounds) })}>
			<td key="label">
				{' '}
				<FormGroup>
					<InputGroup
						id={`input-${attribute.id}`}
						value={attribute.name}
						onChange={e => {
							const data = { id: attribute.id, name: e.target.value };
							dispatch(updateAttribute(data));
						}}
					/>
				</FormGroup>
			</td>
			<td>
				<HTMLSelect
					value={attribute.value}
					options={options}
					onChange={e =>
						dispatch(
							updateAttribute({
								id: attribute.id,
								value: e.target.value as QualityValue,
							})
						)
					}
				/>
			</td>
			<td>{attribute.wounds}</td>
		</tr>
	);
};

export default AttributeEditRow;
