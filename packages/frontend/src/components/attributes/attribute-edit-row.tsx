import React from 'react';
import { attributeValues } from '../../consts';
import classnames from 'classnames';
import { RowProps } from './types';
import { HTMLSelect } from '@blueprintjs/core';

const AttributeEditRow = ({ attribute, character, isWoundable, attributeState }: RowProps) => {
	return (
		<tr key={attribute.name} className={classnames({ wounded: Boolean(attribute.wounds) })}>
			<td key="label">{attribute.name}</td>
			<td>
				<HTMLSelect value={attribute.value} options={attributeValues.map(v => v[0])} />
			</td>
			<td>{attribute.wounds}</td>
		</tr>
	);
};

export default AttributeEditRow;
