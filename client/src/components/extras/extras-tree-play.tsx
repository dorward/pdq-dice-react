import { Checkbox, Tree, TreeNodeInfo } from '@blueprintjs/core';
import useCharacter from '../../data/useCharacter';
import { Extra } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import Expend from './expend';

// type InventoryEntityBase = {
// 	id: string;
// 	label: string;
// 	inside?: string;
// };

// type InventoryItem = InventoryEntityBase & {
// 	isContainer: false;
// };

// type InventoryContainer = InventoryEntityBase & {
// 	isContainer: true;
// 	isExpanded: boolean;
// };

// type InventoryEntity = InventoryItem | InventoryContainer;

// const flatData: InventoryEntity[] = [
// 	{
// 		id: 'a',
// 		label: 'Bag of Holding',
// 		isContainer: true,
// 		isExpanded: true,
// 	},
// 	{
// 		id: 'b',
// 		label: 'Rations',
// 		isContainer: false,
// 		inside: 'a',
// 	},
// 	{
// 		id: 'c',
// 		label: 'Sword',
// 		isContainer: false,
// 	},
// 	{
// 		id: 'd',
// 		label: 'Stone',
// 		isContainer: false,
// 	},
// 	{
// 		id: 'f',
// 		label: 'Another Bag',
// 		isContainer: true,
// 		isExpanded: true,
// 	},
// 	{
// 		id: 'e',
// 		label: 'Headband of intellect',
// 		isContainer: false,
// 		inside: 'f',
// 	},
// ];

// type TreeNodeInfoExtended = TreeNodeInfo & Pick<InventoryEntity, 'inside'>;

// const sortInventory = (a: TreeNodeInfo<Extra>, b: TreeNodeInfo<Extra>) => {
// 	if (a.childNodes && !b.childNodes) return -1;
// 	if (!a.childNodes && b.childNodes) return 1;
// 	return a.nodeData.name.localeCompare(b.nodeData.name);
// };

type ItemProps = {
	extra: Extra;
};

const Count = ({ extra }: { extra: Extra }) => {
	const { count } = extra;
	if (count === '∞') {
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
	const { name, count } = extra;

	const bonus = new Intl.NumberFormat('en-GB', {
		signDisplay: 'exceptZero',
	}).format(extra.value);

	if (count === 0) {
		return (
			<div className="extra-tree-row">
				<span>{name} '×0'</span> <span className="bonus">{bonus}</span>
			</div>
		);
	}
	return (
		<div className="extra-tree-row">
			<span>
				<Checkbox style={{ display: 'inline' }}>{name}</Checkbox> <Count extra={extra} />
			</span>{' '}
			<span className="bonus">{bonus}</span>
		</div>
	);
};

const convertFlatToTreeData = (extras: Extra[]): TreeNodeInfo<Extra>[] => {
	// In the long run a lot of this transformation will need to be done on the original data.
	// Doing it client side will let me test it though
	//
	// Maybe a one short API call to loop over all characters on all users in the database as a migration?
	//
	// Make that a stand-alone script?

	// On the first pass we add a lot of data and duplicate the originals
	// to ensure this function has no side effects.
	const basicTreeNodeInfo: TreeNodeInfo<Extra>[] = extras.map(extra => {
		const node: TreeNodeInfo<Extra> = {
			id: extra.id,
			label: <Item extra={extra} />,
			icon: extra.count === 0 ? 'cube' : undefined,
			//children: ...
			nodeData: { ...extra },
		};

		return node;
	});

	console.log(basicTreeNodeInfo);

	const createLocation = (name: string): TreeNodeInfo<Extra> => {
		const id = uuidv4();
		const node: TreeNodeInfo<Extra> = {
			id,
			label: name,
			icon: 'folder-close',
			isExpanded: true,
			nodeData: {
				id,
				name,
				location: '',
				value: 0,
				isExpanded: true,
			},
		};
		basicTreeNodeInfo.push(node);
		hierarchicalTreeNodeInfo.push(node);
		return node;
	};

	// On the second pass we assign child nodes based on the location data
	const hierarchicalTreeNodeInfo: TreeNodeInfo<Extra>[] = [];
	basicTreeNodeInfo.forEach(node => {
		const location = node.nodeData.location.trim();
		if (!location) {
			hierarchicalTreeNodeInfo.push(node);
			return;
		}
		const parent =
			basicTreeNodeInfo.find(potential => potential.nodeData.name === location) || createLocation(location);
		parent.childNodes ??= [];
		parent.childNodes.push(node);
		node.nodeData.location = parent.nodeData.id;
	});

	return hierarchicalTreeNodeInfo;

	// const nodes: TreeNodeInfoExtended[] = extras.map(item => {
	// 	const { isContainer, ...rest } = item;
	// 	const node: TreeNodeInfoExtended = { ...rest };
	// 	if (isContainer) {
	// 		node.hasCaret = true;
	// 		if (node.isExpanded) {
	// 			node.icon = 'folder-open';
	// 		} else {
	// 			node.icon = 'folder-close';
	// 		}
	// 	} else {
	// 		node.hasCaret = false;
	// 		node.icon = 'cube';
	// 	}
	// 	return node;
	// });
	// On the second pass we modify the newly created nodes
	// nodes.forEach(node => {
	// 	if (node.inside) {
	// 		const container = nodes.find(possibleContainer => possibleContainer.id === node.inside);
	// 		if (!container) {
	// 			// TODO: Create one
	// 			throw new Error('Could not find parent');
	// 		}
	// 		// TODO: Guard against recursion
	// 		container.childNodes ??= [];
	// 		container.childNodes.push(node);
	// 	} else {
	// 		treeData.push(node);
	// 	}
	// });
	// // On the third pass, we sort the child nodes of each collection
	// treeData.sort(sortInventory);
	// nodes.forEach(node => {
	// 	node.childNodes?.sort(sortInventory);
	// });
	// // Finally return the data
	// return treeData;
};

const ExtrasTreePlay = () => {
	const { character } = useCharacter();
	const { extras } = character;
	const treeData = convertFlatToTreeData(extras);
	return <Tree contents={treeData} />;
};

export default ExtrasTreePlay;
