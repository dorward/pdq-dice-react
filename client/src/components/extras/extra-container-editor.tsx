import { InputGroup, HTMLSelect, Collapse, Label, Icon } from '@blueprintjs/core';
import { ExtraUpdateValue } from '../../types';
import { useCallback, useState } from 'react';
import { updateInventoryItem } from '../../data/edit-mode-slice';
import findDescendants from './find-descendants';
import { ExtraContainerProps } from './types';

const ExtraContainerEditor = ({
    containers,
    contents,
    dispatch,
    extra,
    id,
    location,
    name,
}: ExtraContainerProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = useCallback(() => setIsOpen((open) => !open), []);

    const descendants = [
        extra.id,
        ...findDescendants(extra, containers).map((extra) => extra.id),
    ];

    return (
        <div className="extra-tree-row edit-mode container" role="group">
            <InputGroup
                className="extra-tree-edit-name"
                id={`inventory-name-${id}`}
                value={name}
                onChange={(e) => {
                    const data = { id: extra.id, name: e.target.value };
                    dispatch(updateInventoryItem(data));
                }}
            />
            <button className="extra-tree-edit-menu-toggle" onClick={toggle}>
                <Icon icon={isOpen ? 'menu-open' : 'menu'} title={isOpen ? 'Close' : 'Open'} />
            </button>
            <Collapse isOpen={isOpen} className="extended-menu">
                <Label>
                    <span>Location</span>
                    <HTMLSelect
                        className="extra-tree-edit-location"
                        value={location}
                        onChange={(e) => {
                            const data = { id: extra.id, location: e.target.value };
                            dispatch(updateInventoryItem(data));
                        }}
                    >
                        <option key="top-level" label="🔝" value="" />;
                        {containers
                            .filter((container) => !descendants.includes(container.id))
                            .map((container) => {
                                // TODO guard against recursion!
                                return (
                                    <option
                                        key={container.id}
                                        label={container.name}
                                        value={container.id}
                                    />
                                );
                            })}
                    </HTMLSelect>
                </Label>
                <Label>
                    <span>Capacity</span>
                    <HTMLSelect
                        title="Capacity"
                        className="extra-tree-edit-capacity"
                        value={extra.capacity}
                        onChange={(e) => {
                            const { value } = e.target;
                            const capacity: '∞' | number =
                                value === '∞' ? value : parseInt(value, 10);
                            const data = { id: extra.id, capacity };
                            dispatch(updateInventoryItem(data));
                        }}
                    >
                        <option key="top-level" label="∞" value="∞" />;
                        {new Array(21)
                            .fill(true)
                            .map((_value, index) => {
                                return <option key={index} label={`${index}`} value={index} />;
                            })
                            .slice(1)}
                    </HTMLSelect>
                </Label>
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
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value === 'DEL') {
                                const data = {
                                    id: extra.id,
                                    value,
                                } as ExtraUpdateValue;
                                dispatch(updateInventoryItem(data));
                            }
                        }}
                    />
                </Label>
            </Collapse>
        </div>
    );
};

export default ExtraContainerEditor;
