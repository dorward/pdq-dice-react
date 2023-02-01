import { ControlGroup, HTMLSelect, InputGroup, MenuItem } from '@blueprintjs/core';
import { ItemRenderer, Suggest2 } from '@blueprintjs/select';
import type { ExtraUpdateValue } from '../../types';
import type { RowProps } from './types';
import { updateExtra, selectLocations, promptExtraCount } from '../../data/edit-mode-slice';
import { useDispatch, useSelector } from 'react-redux';
import React, { useMemo } from 'react';
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
							dispatch(updateExtra(data));
						}}
						activeItem={extra.location}
						defaultSelectedItem={extra.location}
						items={locations}
						createNewItemFromQuery={renderLocationValue}
						inputValueRenderer={renderLocationValue}
						itemRenderer={renderLocation}
						createNewItemRenderer={renderCreateLocationOption}
						inputProps={{ placeholder: '' }}
					/>
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
