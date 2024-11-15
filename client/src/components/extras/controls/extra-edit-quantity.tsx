import { HTMLSelect, Label } from '@blueprintjs/core';
import { updateInventoryItem } from '../../../data/edit-mode-slice';
import {
    EditExtraItemProps,
    extraCountValues as defaultExtraCountValues,
} from '../../../types';
import { useDispatch } from 'react-redux';
import { useCallback, useMemo } from 'react';

const ExtraEditQuantity = ({ extra }: EditExtraItemProps) => {
    const dispatch = useDispatch();

    const extraCountValues = useMemo(() => {
        if (!extra.count) {
            return defaultExtraCountValues;
        }
        const included =
            defaultExtraCountValues.findIndex(
                (count) => count.toString() === extra.count.toString(),
            ) >= 0;
        if (included) {
            return defaultExtraCountValues;
        }
        const customExtraCountValues = [...defaultExtraCountValues];
        customExtraCountValues.pop();
        customExtraCountValues.push(extra.count, 'Other');
        return customExtraCountValues;
    }, [extra.count]);

    const onChange = useCallback<React.ComponentProps<typeof HTMLSelect>['onChange']>(
        (e) => {
            const count = e.target.value;
            if (count === extraCountValues[extraCountValues.length - 1]) {
                // dispatch(promptExtraCount({ id: extra.id }));
                return;
            }

            const data = { id: extra.id, count };
            dispatch(updateInventoryItem(data));
        },
        [dispatch, extra.id, extraCountValues],
    );

    return (
        <Label>
            <span>Quantity</span>
            <HTMLSelect
                className="extra-tree-edit-count"
                value={extra.count ?? '∞'}
                options={extraCountValues}
                onChange={onChange}
            />
        </Label>
    );
};

export default ExtraEditQuantity;
