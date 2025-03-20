import { ExtraContainer, ExtraItem } from '../../types';

type ExtraEditorProps = {
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
