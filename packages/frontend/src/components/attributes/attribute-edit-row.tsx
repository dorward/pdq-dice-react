import React from 'react';
import { attributeValues } from '../../consts';
import classnames from 'classnames';
import { RowProps } from './types';
import { QualityValue } from '../../types';
import { HTMLSelect } from '@blueprintjs/core';
import { updateQuality } from '../../data/edit-mode-slice';
import { useDispatch } from 'react-redux';

const AttributeEditRow = ({ attribute, character, isWoundable, attributeState }: RowProps) => {
	const dispatch = useDispatch();
	return (
		<tr key={attribute.name} className={classnames({ wounded: Boolean(attribute.wounds) })}>
			<td key="label">{attribute.name}</td>
			<td>
				<HTMLSelect
					value={attribute.value}
					options={attributeValues.map(v => v[0])}
					onChange={e =>
						dispatch(
							updateQuality({
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
