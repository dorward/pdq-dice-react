import { HTMLSelect, Label } from '@blueprintjs/core';
import { updateInventoryItem } from '../../../data/edit-mode-slice';
import type { EditExtraContainerProps } from '../../../types';
import { useDispatch } from 'react-redux';
import { useCallback, useMemo } from 'react';

const ExtraEditCapacity = ({ extra }: EditExtraContainerProps) => {
    const dispatch = useDispatch();

    const options = useMemo(() => {
        return (
            <>
                <option key="top-level" label="∞" value="∞" />;
                {new Array(21)
                    .fill(true)
                    .map((_value, index) => {
                        return <option key={index} label={`${index}`} value={index} />;
                    })
                    .slice(1)}
            </>
        );
    }, []);

    const onChange = useCallback<React.ComponentProps<typeof HTMLSelect>['onChange']>(
        (e) => {
            const { value } = e.target;
            const capacity: '∞' | number = value === '∞' ? value : parseInt(value, 10);
            const data = { id: extra.id, capacity };
            dispatch(updateInventoryItem(data));
        },
        [dispatch, extra.id],
    );

    return (
        <Label>
            <span>Capacity</span>
            <HTMLSelect
                title="Capacity"
                className="extra-tree-edit-capacity"
                value={extra.capacity}
                onChange={onChange}
            >
                {options}
            </HTMLSelect>
        </Label>
    );
};

export default ExtraEditCapacity;
