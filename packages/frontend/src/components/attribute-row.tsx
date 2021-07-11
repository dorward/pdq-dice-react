import React from 'react';
import { Attribute, Character } from '../types';
import { attributeValues } from '../consts';
import AttributeState from './attribute-state';

export type RowProps = {
	attribute: Attribute;
	character: Character;
	isWoundable: boolean;
};

const AttributeRow = ({ attribute, character, isWoundable }: RowProps) => {
	const firstBought = attributeValues.findIndex(value => value[0] === attribute.value);
	const firstUnwounded = firstBought + attribute.wounds;

	return (
		<tr key={attribute.name}>
			<td key="label">
				<label>
					<input type="checkbox" name={attribute.name} value="use" /> {attribute.name}
				</label>
			</td>
			{attributeValues.map(([name], index) => (
				<td key={name}>
					<AttributeState {...{ firstBought, firstUnwounded, index, name, character, attribute, isWoundable }} />
				</td>
			))}
		</tr>
	);
};

export default AttributeRow;
