import type { Dispatch } from '@reduxjs/toolkit';
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
    dispatch: Dispatch;
    id: string;
    location: string;
    name: string;
};

export type ExtraContainerProps = ExtraEditorProps & {
    contents: number;
    extra: ExtraContainer;
};

export type ExtraItemProps = ExtraEditorProps & {
    extra: ExtraItem;
    extraCountValues: (string | number)[];
};
