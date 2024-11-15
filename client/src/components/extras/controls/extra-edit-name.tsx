import { InputGroup } from '@blueprintjs/core';
import { updateInventoryItem } from '../../../data/edit-mode-slice';
import type { EditExtraProps } from '../../../types';
import { useDispatch } from 'react-redux';

const ExtraEditName = ({ extra }: EditExtraProps) => {
    const dispatch = useDispatch();

    return (
        <InputGroup
            className="extra-tree-edit-name"
            id={`inventory-name-${extra.id}`}
            value={extra.name}
            onChange={(e) => {
                const data = { id: extra.id, name: e.target.value };
                dispatch(updateInventoryItem(data));
            }}
        />
    );
};

export default ExtraEditName;
