import { Checkbox } from '@blueprintjs/core';
import { RowProps } from './types';
import { attributeValues } from '../../consts';
import { selectSelected, toggleSelected } from '../../data/roll-slice';
import { useDispatch, useSelector } from 'react-redux';
import AttributeState from './attribute-state';

import classnames from 'classnames';

const AttributeRow = ({ attribute, character, isWoundable }: RowProps) => {
	const dispatch = useDispatch();
	const selectedAttributes = useSelector(selectSelected);

	const firstBought = attributeValues.findIndex(value => value[0] === attribute.value);
	const firstUnwounded = firstBought + attribute.wounds;

	const checked = !!selectedAttributes[attribute.id];
	const onChange = () => dispatch(toggleSelected(attribute.id));

	return (
		<tr key={attribute.name} className={classnames({ wounded: Boolean(attribute.wounds) })}>
			<td key="label" className="bonus-name">
				<Checkbox checked={checked} onChange={onChange}>
					{attribute.name}
				</Checkbox>
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
