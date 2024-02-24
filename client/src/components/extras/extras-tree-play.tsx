import { Checkbox, Tree, TreeNodeInfo } from '@blueprintjs/core';
import useCharacter from '../../data/useCharacter';
import { Extra, ExtraContainer } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import Expend from './expend';

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
	const { name, count } = extra;

	console.log(name, extra);

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
				<Checkbox style={{ display: 'inline' }}>{name}</Checkbox> <Count extra={extra} />
			</span>{' '}
			<span className="bonus">{bonus}</span>
		</span>
	);
};

const convertFlatToTreeData = (oldExtras: Extra[]): TreeNodeInfo<Extra>[] => {
	// On the first pass we create extras for locations and update the location data to point to them
	const updateLocationDataOnExtras = (extras: Extra[]) => {
		const locations: ExtraContainer[] = [];

		const createLocation = (name: string): ExtraContainer => {
			console.log('Creating location: ', name);
			const id = uuidv4();
			const extra: ExtraContainer = {
				id,
				name,
				location: '',
				isExpanded: true,
				count: null,
				value: null,
				capacity: 0,
			};
			locations.push(extra);
			return extra;
		};

		const onMe: ExtraContainer = createLocation('About my person');

		const updatedExtras = extras.map(extra => {
			const updated = { ...extra };
			updated.location = extra.location.trim();
			if (extra.location === '') {
				updated.location = onMe.id;
			} else {
				const location = locations.find(l => l.name === extra.location) ?? createLocation(extra.location);
				updated.location = location.id;
			}
			return updated;
		});

		const allExtras: Extra[] = updatedExtras.concat(locations);
		return allExtras;
	};

	const extras = updateLocationDataOnExtras(oldExtras);

	// On the second pass we create TreeNodeInfo objects from the extras - these include rendered data so we can0t keep them in the data store
	const flat: TreeNodeInfo<Extra>[] = extras.map(extra => {
		if ('isExpanded' in extra) {
			return {
				id: extra.id,
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
			label: <Item extra={extra} />,
			nodeData: extra,
			icon: extra.count === 0 ? 'cube' : null,
		};
	});

	console.log(JSON.stringify(extras, null, 2));

	// In the third pass we arrange the TreeNodeInfo objects into a hierarchy
	const tree: TreeNodeInfo<Extra>[] = [];
	flat.forEach(node => {
		const { location } = node.nodeData;
		const container = location ? flat.find(n => n.id === location).childNodes : tree;
		container.push(node);
	});

	// In the fourth pass, we sort the child nodes of each section alphabetically but with containers first
	tree.sort(sortInventory);
	flat.forEach(extra => extra.childNodes?.sort(sortInventory));

	console.log(tree);

	return tree;
};

const ExtrasTreePlay = () => {
	const { character } = useCharacter();
	const { extras } = character;
	const treeData = convertFlatToTreeData(extras);
	return <Tree contents={treeData} />;
};

export default ExtrasTreePlay;
