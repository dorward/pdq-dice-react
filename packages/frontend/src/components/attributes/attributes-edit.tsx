import { HTMLTable } from '@blueprintjs/core';
import { Props } from './types';
import AttributeEditRow from './attribute-edit-row';
import React from 'react';

const AttributesEdit = ({ attributes, title, character, attributeState, isWoundable = false }: Props) => {
	return (
		<>
			<HTMLTable className="attributes edit">
				<thead>
					<tr>
						<th>{title}</th>
						<th>Level</th>
						<th>Wounds</th>
					</tr>
				</thead>
				<tbody>
					{attributes.map(attribute => (
						<AttributeEditRow key={attribute.name} {...{ attribute, character, isWoundable, attributeState }} />
					))}
				</tbody>
			</HTMLTable>
		</>
	);
};

export default AttributesEdit;
