import React from 'react';
import { Attribute, Character } from '../types';
import { Icon } from '@blueprintjs/core';
import { attributeValues } from '../consts';
import { applyWound, healWound } from '../data/user-slice';
import { useDispatch } from 'react-redux';

export type RowProps = {
	attribute: Attribute;
	character: Character;
};

type AttributeStateProps = {
	firstBought: number;
	firstUnwounded: number;
	index: number;
	name: string;
	character: Character;
	attribute: Attribute;
};

const AttributeState = ({ firstBought, firstUnwounded, index, name, character, attribute }: AttributeStateProps) => {
	const dispatch = useDispatch();
	if (index < firstBought) return <Icon icon="ban-circle" color="#BFCCD6" />;
	if (index >= firstBought && index === firstUnwounded - 1)
		return (
			<Icon
				icon="tint"
				color="red"
				tabIndex={0}
				role="button"
				aria-label={`Heal wound on ${attribute.name}`}
				onClick={() => {
					dispatch(
						healWound({
							characterId: character.id,
							attributeId: attribute.id,
						})
					);
				}}
			/>
		);
	if (index >= firstBought && index < firstUnwounded) return <Icon icon="tint" color="black" />;
	if (index === firstUnwounded)
		return (
			<Icon
				tabIndex={0}
				role="button"
				aria-label={`Apply wound to ${attribute.name}`}
				icon="tick-circle"
				color="green"
				onClick={() => {
					dispatch(
						applyWound({
							characterId: character.id,
							attributeId: attribute.id,
						})
					);
				}}
			/>
		);
	if (index > firstUnwounded) return <Icon icon="tick-circle" />;
	return null;
};

const AttributeRow = ({ attribute, character }: RowProps) => {
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
					<AttributeState {...{ firstBought, firstUnwounded, index, name, character, attribute }} />
				</td>
			))}
		</tr>
	);
};

export default AttributeRow;
