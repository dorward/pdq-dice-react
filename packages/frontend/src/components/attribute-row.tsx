import React from 'react';
import { Attribute } from '../types';
import { Icon } from '@blueprintjs/core';
import { attributeValues } from '../consts';

export type RowProps = {
	attribute: Attribute;
};

const AttributeRow = ({ attribute }: RowProps) => {
	console.log({ attribute });
	const attributeValue = attributeValues.filter(value => value[0] === attribute.value)[0][1];

	return (
		<tr>
			<td>
				<label>
					<input type="checkbox" name={attribute.name} value="use" /> {attribute.name}
				</label>
			</td>
			{attributeValues.map(([_name, score]) => {
				if (score < attributeValue) {
					return (
						<td>
							<Icon icon="tick-circle" />
						</td>
					);
				}
				if (score === attributeValue) {
					return (
						<td>
							<Icon icon="tick-circle" color="green" />
						</td>
					);
				}
				return <td><Icon icon="ban-circle" color="#BFCCD6" /></td>;
			})}
		</tr>
	);
};

export default AttributeRow;
