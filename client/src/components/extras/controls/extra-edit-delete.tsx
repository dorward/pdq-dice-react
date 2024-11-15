import { HTMLSelect, Label } from '@blueprintjs/core';
import { updateInventoryItem } from '../../../data/edit-mode-slice';
import type { EditExtraContainerProps, ExtraUpdateValue } from '../../../types';
import { useDispatch } from 'react-redux';
import { useCallback } from 'react';

type ExtraEditCapacityProps = EditExtraContainerProps & {
    contents: number;
};

const ExtraEditDelete = ({ extra, contents }: ExtraEditCapacityProps) => {
    const dispatch = useDispatch();

    const onChange = useCallback<React.ComponentProps<typeof HTMLSelect>['onChange']>(
        (e) => {
            const value = e.target.value;
            if (value === 'DEL') {
                const data: ExtraUpdateValue = {
                    id: extra.id,
                    value,
                };
                dispatch(updateInventoryItem(data));
            }
        },
        [dispatch, extra.id],
    );

    return (
        <Label>
            <span>Delete</span>
            <HTMLSelect
                title={
                    contents > 0
                        ? 'Containers with contents cannot be deleted'
                        : 'Delete this container'
                }
                className="extra-tree-edit-bonus delete-feature-for-container"
                value="Keep"
                options={['Keep', contents > 0 ? 'Has Contents' : 'DEL']}
                onChange={onChange}
            />
        </Label>
    );
};

export default ExtraEditDelete;
