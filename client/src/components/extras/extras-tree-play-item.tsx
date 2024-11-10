import { Checkbox, ControlGroup, InputGroup, HTMLSelect } from '@blueprintjs/core';
import { Extra, ExtraContainer, ExtraUpdateValue, isExtraContainer } from '../../types';
import { useDispatch, useSelector } from 'react-redux';
import { selectSelected, toggleSelected } from '../../data/roll-slice';
import Count from './extras-tree-play-count';
import { extraValues, extraCountValues as defaultExtraCountValues } from '../../types';
import { useMemo } from 'react';
import { updateInventoryItem } from '../../data/edit-mode-slice';

type ItemProps = {
	extra: Extra;
	editMode: boolean;
	containers: ExtraContainer[];
};

const Item = ({ extra, editMode, containers }: ItemProps) => {
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
			return (
				<div className="extra-tree-row edit-mode container">
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
						<span className="padding"></span>
						{/* <ul>
						<li>{name}</li>
						<li>{location}</li>
						<li>Container: {isContainer}</li>
					</ul> */}
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

	if (count === null) {
		return (
			<span className="extra-tree-row">
				<span>{name} </span>
			</span>
		);
	}

	if (count === 0) {
		return (
			<span className="extra-tree-row">
				<span>{name} ×0</span> <span className="bonus">{bonus}</span>
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
			<span className="bonus">{bonus}</span>
		</span>
	);
};

export default Item;
