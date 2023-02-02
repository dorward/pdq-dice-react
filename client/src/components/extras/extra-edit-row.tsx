import { Button, Card, ControlGroup, HTMLSelect, InputGroup, MenuItem, Overlay, Slider } from '@blueprintjs/core';
import { ItemRenderer, Suggest2 } from '@blueprintjs/select';
import type { ExtraUpdateValue } from '../../types';
import type { RowProps } from './types';
import { updateExtra, selectLocations, promptExtraCount, moveSomeExtra } from '../../data/edit-mode-slice';
import { useDispatch, useSelector } from 'react-redux';
import React, { useMemo, useState } from 'react';
import { extraValues, extraCountValues as defaultExtraCountValues } from '../../types';

const renderLocation: ItemRenderer<string> = (location, { handleClick, modifiers }) => {
	if (!modifiers.matchesPredicate) {
		return null;
	}
	return (
		<MenuItem
			active={modifiers.active}
			key={location}
			onClick={handleClick}
			text={'• ' + renderLocationValue(location)}
		/>
	);
};

const renderLocationValue = (location: string) => (location === blankLocation ? '' : location);

export const renderCreateLocationOption = (
	query: string,
	active: boolean,
	handleClick: React.MouseEventHandler<HTMLElement>
) => (
	<MenuItem icon="add" text={`Create "${query}"`} active={active} onClick={handleClick} shouldDismissPopover={false} />
);

const blankLocation = '* Default';
type SimpleTransferAmount = number | '∞';
const simpleTransferAmount: SimpleTransferAmount[] = [undefined, 0, 1, '∞'];
const defaultMoveData = { count: 0, location: '' };

const ExtraEditRow = ({ extra }: RowProps) => {
	const dispatch = useDispatch();

	const locations = [blankLocation, ...useSelector(selectLocations)];

	const extraCountValues = useMemo(() => {
		if (!extra.count) {
			return defaultExtraCountValues;
		}
		const included = defaultExtraCountValues.findIndex(count => count.toString() === extra.count.toString()) >= 0;
		if (included) {
			return defaultExtraCountValues;
		}
		const customExtraCountValues = [...defaultExtraCountValues];
		customExtraCountValues.pop();
		customExtraCountValues.push(extra.count, 'Other');
		return customExtraCountValues;
	}, [extra.count]);

	const [moveData, setMoveData] = useState(defaultMoveData);

	return (
		<tr key={extra.id}>
			<td key="label">
				<ControlGroup fill={true}>
					<InputGroup
						id={`input-${extra.id}`}
						value={extra.name}
						onChange={e => {
							const data = { id: extra.id, name: e.target.value };
							dispatch(updateExtra(data));
						}}
					/>
					<Suggest2
						onItemSelect={where => {
							const location = where === blankLocation ? '' : where;
							const data = { id: extra.id, location };
							if (simpleTransferAmount.includes(extra.count))
								return dispatch(moveSomeExtra({ ...data, count: extra.count }));
							setMoveData({ count: 1, location });
						}}
						activeItem={extra.location}
						selectedItem={extra.location}
						items={locations}
						createNewItemFromQuery={renderLocationValue}
						inputValueRenderer={renderLocationValue}
						itemRenderer={renderLocation}
						createNewItemRenderer={renderCreateLocationOption}
						inputProps={{ placeholder: '' }}
					/>
					<Overlay isOpen={Boolean(moveData.count)}>
						<div className="v-center">
							<Card interactive={true} elevation={1} className="h-center">
								<p>Moving {extra.name}.</p>
								<Slider
									min={1}
									max={typeof extra.count === 'number' ? extra.count : 1}
									value={moveData.count}
									onChange={count => setMoveData({ ...moveData, count })}
								/>
								<Button
									onClick={() => {
										dispatch(moveSomeExtra({ id: extra.id, ...moveData }));
										setMoveData(defaultMoveData);
									}}>
									Move {moveData.count}
								</Button>
								<Button
									onClick={() => {
										dispatch(moveSomeExtra({ id: extra.id, location: moveData.location, count: extra.count }));
										setMoveData(defaultMoveData);
									}}>
									Move all
								</Button>
							</Card>
						</div>
					</Overlay>
					<HTMLSelect
						value={extra.count ?? '∞'}
						options={extraCountValues}
						onChange={e => {
							const count = e.target.value;
							if (count === extraCountValues[extraCountValues.length - 1]) {
								dispatch(promptExtraCount({ id: extra.id }));
								return;
							}

							const data = { id: extra.id, count };
							dispatch(updateExtra(data));
						}}
					/>
				</ControlGroup>
			</td>
			<td>
				<HTMLSelect
					value={extra.value}
					options={extraValues}
					onChange={e => {
						const value = e.target.value;
						const data = { id: extra.id, value: value === 'DEL' ? value : +value } as ExtraUpdateValue;
						dispatch(updateExtra(data));
					}}
				/>
			</td>
		</tr>
	);
};

export default ExtraEditRow;
