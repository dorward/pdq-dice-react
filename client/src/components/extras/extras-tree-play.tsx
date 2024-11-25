import { Button, Icon, Tree, TreeEventHandler, TreeNodeInfo } from '@blueprintjs/core';
import useCharacter from '../../data/useCharacter';
import { Extra, ExtraContainer, isExtraContainer } from '../../types';
import Item from './extras-tree-play-item';
import { openOrCloseInventoryContainer } from '../../data/user-slice';
import { useDispatch } from 'react-redux';
import { openOrCloseEditModeInventoryContainer } from '../../data/edit-mode-slice';
import { addInventoryItem } from '../../data/edit-mode-slice';

const sortInventory = (a: TreeNodeInfo<Extra>, b: TreeNodeInfo<Extra>) => {
    if (a.childNodes && !b.childNodes) return -1;
    if (!a.childNodes && b.childNodes) return 1;
    return a.nodeData.name.localeCompare(b.nodeData.name);
};

const convertFlatToTreeData = (
    extras: Extra[],
    editMode: boolean,
    containers: ExtraContainer[],
): TreeNodeInfo<Extra>[] => {
    // On the first pass, we count how many items are in each container
    const quantity = extras.reduce<Record<ExtraContainer['id'], number>>(
        (counterRecord, extra) => {
            if (extra.location) {
                counterRecord[extra.location] ??= 0;
                counterRecord[extra.location] +=
                    typeof extra.count === 'number' ? extra.count : 1;
            }
            return counterRecord;
        },
        {},
    );

    // On the second pass we create TreeNodeInfo objects from the extras - these include rendered data so we can't keep them in the data store
    const flat: TreeNodeInfo<Extra>[] = extras.map((extra) => {
        if (isExtraContainer(extra)) {
            return {
                id: extra.id,
                key: extra.id,
                label: (
                    <Item
                        extra={extra}
                        editMode={editMode}
                        containers={containers}
                        contents={quantity[extra.id] ?? 0}
                    />
                ),
                nodeData: extra,
                icon: extra.isExpanded ? 'folder-open' : 'folder-close',
                childNodes: [] as TreeNodeInfo<Extra>[],
                isExpanded: extra.isExpanded,
                hasCaret: true,
            };
        }
        return {
            id: extra.id,
            key: extra.id,
            label: <Item extra={extra} editMode={editMode} containers={containers} />,
            nodeData: extra,
            icon: extra.count === 0 && editMode === false ? 'cube' : null,
        };
    });

    // In the third pass we arrange the TreeNodeInfo objects into a hierarchy
    const tree: TreeNodeInfo<Extra>[] = [];
    flat.forEach((node) => {
        const { location } = node.nodeData;
        const container = location ? flat.find((n) => n.id === location).childNodes : tree;
        container.push(node);
    });

    // In the fourth pass, we sort the child nodes of each section alphabetically but with containers first
    tree.sort(sortInventory);
    flat.forEach((extra) => extra.childNodes?.sort(sortInventory));

    return tree;
};

const ExtrasTreePlay = () => {
    const dispatch = useDispatch();
    const { character, characterToEdit } = useCharacter();
    const char = characterToEdit ?? character;
    const editMode = Boolean(characterToEdit);
    const folderToggle = editMode
        ? openOrCloseEditModeInventoryContainer
        : openOrCloseInventoryContainer;

    const onNodeCollapse: TreeEventHandler<Extra> = (inventory) => {
        dispatch(
            folderToggle({
                characterId: char.id,
                containerId: inventory.nodeData.id,
                expand: false,
            }),
        );
    };

    const onNodeExpand: TreeEventHandler<Extra> = (inventory) => {
        dispatch(
            folderToggle({
                characterId: char.id,
                containerId: inventory.nodeData.id,
                expand: true,
            }),
        );
    };

    const { inventory } = char;
    const containers = inventory.filter(isExtraContainer);
    const treeData = convertFlatToTreeData(inventory, editMode, containers);

    return (
        <>
            {editMode ? (
                <div>
                    <Button
                        className="add"
                        onClick={() => dispatch(addInventoryItem({ isContainer: false }))}
                    >
                        <Icon icon="add" title="Add Item" htmlTitle="Add Item" />
                    </Button>
                    <Button
                        className="add"
                        onClick={() => dispatch(addInventoryItem({ isContainer: true }))}
                    >
                        <Icon
                            icon="folder-new"
                            title="Add Container"
                            htmlTitle="Add Container"
                        />
                    </Button>
                </div>
            ) : null}
            <Tree
                contents={treeData}
                onNodeExpand={onNodeExpand}
                onNodeCollapse={onNodeCollapse}
            />
        </>
    );
};

export default ExtrasTreePlay;
