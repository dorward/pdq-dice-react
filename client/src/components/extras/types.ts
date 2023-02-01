import { Extra } from '../../types';

export type Props = {
	extras: Extra[];
};

export type RowProps = {
	extra: Extra;
	isOpen?: boolean;
	remoteInventory?: boolean;
};
