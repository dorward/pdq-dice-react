import { Tree, TreeEventHandler, TreeNodeInfo } from '@blueprintjs/core';
import useCharacter from '../../data/useCharacter';
import { Extra } from '../../types';
import Item from './extras-tree-play-item';
import { openOrCloseInventoryContainer } from '../../data/user-slice';
import { useDispatch } from 'react-redux';
import { useCallback } from 'react';

const sortInventory = (a: TreeNodeInfo<Extra>, b: TreeNodeInfo<Extra>) => {
	if (a.childNodes && !b.childNodes) return -1;
	if (!a.childNodes && b.childNodes) return 1;
	return a.nodeData.name.localeCompare(b.nodeData.name);
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
	const dispatch = useDispatch();
	const { character } = useCharacter();
	const { inventory } = character;
	const treeData = convertFlatToTreeData(inventory);
	const onNodeCollapse: TreeEventHandler<Extra> = useCallback(inventory => {
		dispatch(
			openOrCloseInventoryContainer({
				characterId: character.id,
				containerId: inventory.nodeData.id,
				expand: false,
			})
		);
	}, []);
	const onNodeExpand: TreeEventHandler<Extra> = useCallback(inventory => {
		dispatch(
			openOrCloseInventoryContainer({
				characterId: character.id,
				containerId: inventory.nodeData.id,
				expand: true,
			})
		);
	}, []);
	return <Tree contents={treeData} onNodeExpand={onNodeExpand} onNodeCollapse={onNodeCollapse} />;
};

export default ExtrasTreePlay;
