import { HTMLSelect, Label } from '@blueprintjs/core';
import { ExtraUpdateValue } from '../../types';
import { updateInventoryItem } from '../../data/edit-mode-slice';
import { extraValues } from '../../types';
import { ExtraItemProps } from './types';
import ExtraEditName from './controls/extra-edit-name';
import ExtendedMenu from './controls/extended-menu';
import ExtraEditLocation from './controls/extra-edit-tree-location';

const ExtraItemEditor = ({ containers, dispatch, extra, extraCountValues }: ExtraItemProps) => {
    return (
        <div className="extra-tree-row edit-mode item" role="group">
            <ExtraEditName extra={extra} />
            <ExtendedMenu>
                <ExtraEditLocation extra={extra} containers={containers} />
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
            </ExtendedMenu>
        </div>
    );
};

export default ExtraItemEditor;
