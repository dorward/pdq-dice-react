import { Button, HTMLTable, Icon } from '@blueprintjs/core';
import { Props } from './types';
import { addQuality } from '../../data/edit-mode-slice';
import { useDispatch } from 'react-redux';
import AttributeEditRow from './attribute-edit-row';
import React from 'react';

const AttributesEdit = ({ attributes, title, character, isWoundable = false }: Props) => {
	const dispatch = useDispatch();

	return (
		<>
			<HTMLTable className="attributes edit">
				<thead>
					<tr>
						<th>
							{title}{' '}
							<Button
								className="add"
								onClick={() => dispatch(addQuality(title === 'Standard Qualities' ? 'quality' : 'power'))}>
								<Icon icon="add" title="Add Extra" htmlTitle="Add Extra" />
							</Button>
						</th>
						<th>Level</th>
						<th>Wounds</th>
					</tr>
				</thead>
				<tbody>
					{attributes.map(attribute => (
						<AttributeEditRow key={attribute.name} {...{ attribute, character, isWoundable }} />
					))}
				</tbody>
			</HTMLTable>
		</>
	);
};

export default AttributesEdit;
