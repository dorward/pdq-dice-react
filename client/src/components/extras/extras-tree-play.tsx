import { Checkbox, Tree, TreeNodeInfo } from '@blueprintjs/core';
import useCharacter from '../../data/useCharacter';
import { Extra } from '../../types';
import Expend from './expend';
import { useDispatch, useSelector } from 'react-redux';
import { selectSelected, toggleSelected } from '../../data/roll-slice';

const sortInventory = (a: TreeNodeInfo<Extra>, b: TreeNodeInfo<Extra>) => {
	if (a.childNodes && !b.childNodes) return -1;
	if (!a.childNodes && b.childNodes) return 1;
	return a.nodeData.name.localeCompare(b.nodeData.name);
};

type ItemProps = {
	extra: Extra;
};

const Count = ({ extra }: { extra: Extra }) => {
	const { count } = extra;
	if (!count || count === '∞') {
		return null;
	}
	if (count === 0) {
		return '×0';
	}
	return (
		<>
			×{count} <Expend {...extra} />
		</>
	);
};

const Item = ({ extra }: ItemProps) => {
	const dispatch = useDispatch();
	const selectedExtras = useSelector(selectSelected);
	const checked = !!selectedExtras[extra.id];
	const onChange = () => dispatch(toggleSelected(extra.id));

	const { name, count } = extra;

	const bonus = new Intl.NumberFormat('en-GB', {
		signDisplay: 'exceptZero',
	}).format(extra.value);

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

const convertFlatToTreeData = (extras: Extra[]): TreeNodeInfo<Extra>[] => {
	// On the first pass we create TreeNodeInfo objects from the extras - these include rendered data so we can0t keep them in the data store
	const flat: TreeNodeInfo<Extra>[] = extras.map(extra => {
		if ('isExpanded' in extra) {
			return {
				id: extra.id,
				key: extra.id,
				label: <Item extra={extra} />,
				nodeData: extra,
				icon: extra.isExpanded ? 'folder-open' : 'folder-close',
				childNodes: [],
				isExpanded: extra.isExpanded,
				hasCaret: true,
			};
		}
		return {
			id: extra.id,
			key: extra.id,
			label: <Item extra={extra} />,
			nodeData: extra,
			icon: extra.count === 0 ? 'cube' : null,
		};
	});

	// In the second pass we arrange the TreeNodeInfo objects into a hierarchy
	const tree: TreeNodeInfo<Extra>[] = [];
	flat.forEach(node => {
		const { location } = node.nodeData;
		const container = location ? flat.find(n => n.id === location).childNodes : tree;
		container.push(node);
	});

	// In the third pass, we sort the child nodes of each section alphabetically but with containers first
	tree.sort(sortInventory);
	flat.forEach(extra => extra.childNodes?.sort(sortInventory));

	return tree;
};

const ExtrasTreePlay = () => {
	const { character } = useCharacter();
	const { inventory } = character;
	const treeData = convertFlatToTreeData(inventory);
	console.log({ treeData });
	return <Tree contents={treeData} />;
};

export default ExtrasTreePlay;
