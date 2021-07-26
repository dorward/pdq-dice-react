import { HTMLSelect } from '@blueprintjs/core';
import { QualityValue } from '../../types';
import { RowProps } from './types';
import { attributeValues } from '../../consts';
import { updateQuality } from '../../data/edit-mode-slice';
import { useDispatch } from 'react-redux';
import React from 'react';
import classnames from 'classnames';

const AttributeEditRow = ({ attribute }: RowProps) => {
	const dispatch = useDispatch();
	return (
		<tr key={attribute.id} className={classnames({ wounded: Boolean(attribute.wounds) })}>
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
