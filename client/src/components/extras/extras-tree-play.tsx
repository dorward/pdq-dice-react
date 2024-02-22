import { Tree, TreeNodeInfo } from '@blueprintjs/core';

type InventoryEntityBase = {
	id: string;
	label: string;
	inside?: string;
};

type InventoryItem = InventoryEntityBase & {
	isContainer: false;
};

type InventoryContainer = InventoryEntityBase & {
	isContainer: true;
	isExpanded: boolean;
};

type InventoryEntity = InventoryItem | InventoryContainer;

const flatData: InventoryEntity[] = [
	{
		id: 'a',
		label: 'Bag of Holding',
		isContainer: true,
		isExpanded: true,
	},
	{
		id: 'b',
		label: 'Rations',
		isContainer: false,
		inside: 'a',
	},
	{
		id: 'c',
		label: 'Sword',
		isContainer: false,
	},
	{
		id: 'd',
		label: 'Stone',
		isContainer: false,
	},
	{
		id: 'f',
		label: 'Another Bag',
		isContainer: true,
		isExpanded: true,
	},
	{
		id: 'e',
		label: 'Headband of intellect',
		isContainer: false,
		inside: 'f',
	},
];

type TreeNodeInfoExtended = TreeNodeInfo & Pick<InventoryEntity, 'inside'>;

const sortInventory = (a: TreeNodeInfoExtended, b: TreeNodeInfoExtended) => {
	if (a.childNodes && !b.childNodes) return -1;
	if (!a.childNodes && b.childNodes) return 1;
	return a.label.toString().localeCompare(b.label.toString());
};

const convertFlatToTreeData = (flat: InventoryEntity[]): TreeNodeInfoExtended[] => {
	// On the first pass we add a lot of data and duplicate the originals
	// to ensure this function has no side effects.
	const nodes: TreeNodeInfoExtended[] = flat.map(item => {
		const { isContainer, ...rest } = item;
		const node: TreeNodeInfoExtended = { ...rest };
		if (isContainer) {
			node.hasCaret = true;
			if (node.isExpanded) {
				node.icon = 'folder-open';
			} else {
				node.icon = 'folder-close';
			}
		} else {
			node.hasCaret = false;
			node.icon = 'cube';
		}
		return node;
	});
	// On the second pass we modify the newly created nodes
	const treeData: TreeNodeInfoExtended[] = [];
	nodes.forEach(node => {
		if (node.inside) {
			const container = nodes.find(possibleContainer => possibleContainer.id === node.inside);
			if (!container) {
				// TODO: Create one
				throw new Error('Could not find parent');
			}
			// TODO: Guard against recursion
			container.childNodes ??= [];
			container.childNodes.push(node);
		} else {
			treeData.push(node);
		}
	});
	// On the third pass, we sort the child nodes of each collection
	treeData.sort(sortInventory);
	nodes.forEach(node => {
		node.childNodes?.sort(sortInventory);
	});
	// Finally return the data
	return treeData;
};

const treeData = convertFlatToTreeData(flatData);

const ExtrasTreePlay = () => {
	return <Tree contents={treeData} />;
};

export default ExtrasTreePlay;
