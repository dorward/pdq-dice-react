import React from 'react';
import { Attribute, Character, SelectedAttributes } from '../types';
import { attributeValues } from '../consts';
import AttributeState from './attribute-state';

export type RowProps = {
	attribute: Attribute;
	character: Character;
	isWoundable: boolean;
	attributeState: [SelectedAttributes, (x: SelectedAttributes) => void];
};

const AttributeRow = ({ attribute, character, isWoundable, attributeState }: RowProps) => {
	const firstBought = attributeValues.findIndex(value => value[0] === attribute.value);
	const firstUnwounded = firstBought + attribute.wounds;
	const [selectedAttributes, setSelected] = attributeState;
	const checked = !!selectedAttributes[attribute.id];
	const onChange = () => setSelected({ ...selectedAttributes, [attribute.id]: !checked });

	return (
		<tr key={attribute.name}>
			<td key="label">
				<label className="attribute-row-label">
					<input type="checkbox" name={attribute.name} value="use" checked={checked} onChange={onChange} />{' '}
					{attribute.name}
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
