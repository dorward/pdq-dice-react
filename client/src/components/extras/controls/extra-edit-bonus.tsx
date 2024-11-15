import { HTMLSelect, Label } from '@blueprintjs/core';
import { updateInventoryItem } from '../../../data/edit-mode-slice';
import { EditExtraProps, extraValues, ExtraUpdateValue } from '../../../types';
import { useDispatch } from 'react-redux';
import { useCallback } from 'react';

const ExtraEditBonus = ({ extra }: EditExtraProps) => {
    const dispatch = useDispatch();

    const onChange = useCallback<React.ComponentProps<typeof HTMLSelect>['onChange']>(
        (e) => {
            const value = e.target.value;
            const data: ExtraUpdateValue = {
                id: extra.id,
                value: value === 'DEL' ? value : +value,
            };
            dispatch(updateInventoryItem(data));
        },
        [dispatch, extra.id],
    );

    return (
        <Label>
            <span>Bonus</span>
            <HTMLSelect
                className="extra-tree-edit-bonus"
                value={extra.value}
                options={extraValues}
                onChange={onChange}
            />
        </Label>
    );
};

export default ExtraEditBonus;
