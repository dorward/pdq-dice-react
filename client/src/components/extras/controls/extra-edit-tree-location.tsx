import { HTMLSelect, Label } from '@blueprintjs/core';
import { updateInventoryItem } from '../../../data/edit-mode-slice';
import { Extra, ExtraContainer, isExtraContainer } from '../../../types';
import { useDispatch } from 'react-redux';
import findDescendants from '../find-descendants';
import { useMemo } from 'react';

type ExtraEditLocationProps = {
    extra: Extra;
    containers: ExtraContainer[];
};

const ExtraEditLocation = ({ extra, containers }: ExtraEditLocationProps) => {
    const dispatch = useDispatch();

    const descendants = useMemo(
        () =>
            isExtraContainer(extra)
                ? [extra.id, ...findDescendants(extra, containers).map((extra) => extra.id)]
                : [extra.id],
        [containers, extra],
    );

    return (
        <Label>
            <span>Location</span>
            <HTMLSelect
                className="extra-tree-edit-location"
                value={extra.location}
                onChange={(e) => {
                    const data = { id: extra.id, location: e.target.value };
                    dispatch(updateInventoryItem(data));
                }}
            >
                <option key="top-level" label="🔝" value="" />;
                {containers
                    .filter(({ id }) => !descendants.includes(id))
                    .map(({ id, name }) => (
                        <option key={id} label={name} value={id} />
                    ))}
            </HTMLSelect>
        </Label>
    );
};

export default ExtraEditLocation;
