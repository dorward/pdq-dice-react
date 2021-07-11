import React from 'react';
import { Attribute, Character } from '../types';
import { Icon } from '@blueprintjs/core';
import { applyWound, healWound } from '../data/user-slice';
import { useDispatch } from 'react-redux';

type AttributeStateProps = {
	firstBought: number;
	firstUnwounded: number;
	index: number;
	name: string;
	character: Character;
	attribute: Attribute;
	isWoundable: boolean;
};

const AttributeState = ({
	firstBought,
	firstUnwounded,
	index,
	name,
	character,
	attribute,
	isWoundable,
}: AttributeStateProps) => {
	const dispatch = useDispatch();
	if (index < firstBought) return <Icon icon="ban-circle" color="#BFCCD6" />;
	if (isWoundable && index >= firstBought && index === firstUnwounded - 1)
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
	if (index === firstUnwounded) {
		if (isWoundable) {
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
		}
		return <Icon icon="tick-circle" color="green" />;
	}
	return <Icon icon="tick-circle" />;
};

export default AttributeState;
