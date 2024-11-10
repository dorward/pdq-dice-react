import { Checkbox, ControlGroup, InputGroup, HTMLSelect } from '@blueprintjs/core';
import { Extra, ExtraContainer, ExtraUpdateValue, isExtraContainer } from '../../types';
import { useDispatch, useSelector } from 'react-redux';
import { selectSelected, toggleSelected } from '../../data/roll-slice';
import Count from './extras-tree-play-count';
import { extraValues, extraCountValues as defaultExtraCountValues } from '../../types';
import { useMemo } from 'react';
import { updateInventoryItem } from '../../data/edit-mode-slice';
import CapacityFlag from './capacity-flag';

type ItemProps = {
	extra: Extra;
	editMode: boolean;
	containers: ExtraContainer[];
	contents?: number;
};

const findDescendants = (extra: ExtraContainer, containers: ExtraContainer[]): ExtraContainer[] => {
	const children = containers.filter(possible => possible.location === extra.id);
	const deeper = children.flatMap(child => findDescendants(child, containers));
	return children.concat(deeper);
};

const Item = ({ extra, editMode, containers, contents }: ItemProps) => {
	const dispatch = useDispatch();
	const selectedExtras = useSelector(selectSelected);
	const checked = !!selectedExtras[extra.id];
	const onChange = () => dispatch(toggleSelected(extra.id));

	const { id, name, count, location } = extra;
	const isContainer = isExtraContainer(extra);

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

	const bonus = new Intl.NumberFormat('en-GB', {
		signDisplay: 'exceptZero',
	}).format(extra.value);

	if (editMode) {
		if (isContainer) {
			const descendants = [extra.id, ...findDescendants(extra, containers).map(extra => extra.id)];
			return (
				<div className="extra-tree-row edit-mode container">
					<ControlGroup fill>
						<InputGroup
							className="extra-tree-edit-name"
							id={`inventory-name-${id}`}
							value={name}
							onChange={e => {
								const data = { id: extra.id, name: e.target.value };
								dispatch(updateInventoryItem(data));
							}}
						/>
						<HTMLSelect
							className="extra-tree-edit-location"
							value={location}
							onChange={e => {
								const data = { id: extra.id, location: e.target.value };
								dispatch(updateInventoryItem(data));
							}}>
							<option key="top-level" label="🔝" value="" />;
							{containers
								.filter(container => !descendants.includes(container.id))
								.map(container => {
									// TODO guard against recursion!
									return <option key={container.id} label={container.name} value={container.id} />;
								})}
						</HTMLSelect>{' '}
						<HTMLSelect
							title="Maximum capacity"
							className="extra-tree-edit-capacity"
							value={extra.capacity}
							onChange={e => {
								const { value } = e.target;
								const capacity: '∞' | number = value === '∞' ? value : parseInt(value, 10);
								const data = { id: extra.id, capacity };
								dispatch(updateInventoryItem(data));
							}}>
							<option key="top-level" label="∞" value="∞" />;
							{new Array(21)
								.fill(true)
								.map((_value, index) => {
									return <option key={index} label={`${index}`} value={index} />;
								})
								.slice(1)}
						</HTMLSelect>
						<HTMLSelect
							title={contents > 0 ? 'Containers with contents cannot be deleted' : 'Delete this container'}
							className="extra-tree-edit-bonus delete-feature-for-container"
							value="Keep"
							options={['Keep', contents > 0 ? 'Has Contents' : 'DEL']}
							onChange={e => {
								const value = e.target.value;
								if (value === 'DEL') {
									const data = { id: extra.id, value } as ExtraUpdateValue;
									dispatch(updateInventoryItem(data));
								}
							}}
						/>
					</ControlGroup>
				</div>
			);
		}
		return (
			<div className="extra-tree-row edit-mode">
				<ControlGroup>
					<InputGroup
						className="extra-tree-edit-name"
						id={`inventory-name-${id}`}
						value={name}
						onChange={e => {
							const data = { id: extra.id, name: e.target.value };
							dispatch(updateInventoryItem(data));
						}}
					/>

					<HTMLSelect
						className="extra-tree-edit-location"
						value={location}
						onChange={e => {
							const data = { id: extra.id, location: e.target.value };
							dispatch(updateInventoryItem(data));
						}}>
						<option key="top-level" label="🔝" value="" />;
						{containers.map(container => {
							// TODO guard against recursion!
							return <option key={container.id} label={container.name} value={container.id} />;
						})}
					</HTMLSelect>

					<HTMLSelect
						className="extra-tree-edit-count"
						value={extra.count ?? '∞'}
						options={extraCountValues}
						onChange={e => {
							const count = e.target.value;
							if (count === extraCountValues[extraCountValues.length - 1]) {
								// dispatch(promptExtraCount({ id: extra.id }));
								return;
							}

							const data = { id: extra.id, count };
							dispatch(updateInventoryItem(data));
						}}
					/>

					<HTMLSelect
						className="extra-tree-edit-bonus"
						value={extra.value}
						options={extraValues}
						onChange={e => {
							const value = e.target.value;
							const data = { id: extra.id, value: value === 'DEL' ? value : +value } as ExtraUpdateValue;
							dispatch(updateInventoryItem(data));
						}}
					/>
				</ControlGroup>
			</div>
		);
	}

	const capacityNode = `Contains ${contents} out of ${'capacity' in extra ? extra.capacity : 'xxx'}`;

	if (count === null) {
		return (
			<span className="extra-tree-row" title={capacityNode}>
				<span>{name} </span> <CapacityFlag contents={contents} extra={extra} />
			</span>
		);
	}

	if (count === 0) {
		return (
			<span className="extra-tree-row">
				<span>{name} ×0</span>
				<CapacityFlag contents={contents} extra={extra} />
				<span className="bonus">{bonus}</span>
			</span>
		);
	}
	return (
		<span className="extra-tree-row">
			<span>
				<Checkbox checked={checked} onChange={onChange} style={{ display: 'inline' }}>
					{name}
				</Checkbox>{' '}
				<Count extra={extra} />
			</span>{' '}
			<CapacityFlag contents={contents} extra={extra} />
			<span className="bonus">{bonus}</span>
		</span>
	);
};

export default Item;
