import { Extra, ExtraContainer, ExtraItem } from '../../types';

export type Props = {
    extras: Extra[];
};

export type RowProps = {
    extra: Extra;
    isOpen?: boolean;
    remoteInventory?: boolean;
};

export type ExtraEditorProps = {
    containers: ExtraContainer[];
    location: string;
};

export type ExtraContainerProps = ExtraEditorProps & {
    contents: number;
    extra: ExtraContainer;
};

export type ExtraItemProps = ExtraEditorProps & {
    extra: ExtraItem;
};
