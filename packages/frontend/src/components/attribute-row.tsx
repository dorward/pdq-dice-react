import React from 'react';
import { Attribute } from '../types';
import { Icon } from '@blueprintjs/core';
import { attributeValues } from '../consts';
import { applyWound } from '../data/user-slice';
import { useDispatch } from 'react-redux';

export type RowProps = {
	attribute: Attribute;
};

const AttributeRow = ({ attribute }: RowProps) => {
	const dispatch = useDispatch();
	const attributeValue = attributeValues.filter(value => value[0] === attribute.value)[0][1];
	return (
		<tr key={attribute.name}>
			<td key="label">
				<label>
					<input type="checkbox" name={attribute.name} value="use" /> {attribute.name}
				</label>
			</td>
			{attributeValues.map(([name, score]) => (
				<td key={name}>
					{score < attributeValue && <Icon icon="tick-circle" />}
					{score === attributeValue && (
						<Icon
							tabIndex={0}
							role="button"
							aria-label={`Apply wound to ${attribute.name}`}
							icon="tick-circle"
							color="green"
							onClick={() => {
								console.log('Apply wound');
								dispatch(applyWound(attribute.name));
							}}
						/>
					)}
					{score > attributeValue && <Icon icon="ban-circle" color="#BFCCD6" />}
				</td>
			))}
		</tr>
	);
};

export default AttributeRow;
