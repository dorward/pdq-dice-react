import { InputGroup, HTMLSelect, Icon, Collapse, Label } from '@blueprintjs/core';
import { ExtraUpdateValue } from '../../types';
import { updateInventoryItem } from '../../data/edit-mode-slice';
import { extraValues } from '../../types';
import { useCallback, useState } from 'react';
import { ExtraItemProps } from './types';

const ExtraItemEditor = ({
    containers,
    dispatch,
    extra,
    extraCountValues,
    id,
    location,
    name,
}: ExtraItemProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = useCallback(() => setIsOpen((open) => !open), []);

    return (
        <div className="extra-tree-row edit-mode item" role="group">
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
                        {containers.map((container) => {
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
                    <span>Quantity</span>

                    <HTMLSelect
                        className="extra-tree-edit-count"
                        value={extra.count ?? '∞'}
                        options={extraCountValues}
                        onChange={(e) => {
                            const count = e.target.value;
                            if (count === extraCountValues[extraCountValues.length - 1]) {
                                // dispatch(promptExtraCount({ id: extra.id }));
                                return;
                            }

                            const data = { id: extra.id, count };
                            dispatch(updateInventoryItem(data));
                        }}
                    />
                </Label>

                <Label>
                    <span>Bonus</span>
                    <HTMLSelect
                        className="extra-tree-edit-bonus"
                        value={extra.value}
                        options={extraValues}
                        onChange={(e) => {
                            const value = e.target.value;
                            const data = {
                                id: extra.id,
                                value: value === 'DEL' ? value : +value,
                            } as ExtraUpdateValue;
                            dispatch(updateInventoryItem(data));
                        }}
                    />
                </Label>
            </Collapse>
        </div>
    );
};

export default ExtraItemEditor;
