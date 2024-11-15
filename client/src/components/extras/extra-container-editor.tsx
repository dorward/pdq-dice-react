import { HTMLSelect, Label } from '@blueprintjs/core';
import { ExtraUpdateValue } from '../../types';
import { updateInventoryItem } from '../../data/edit-mode-slice';
import { ExtraContainerProps } from './types';
import ExtraEditName from './controls/extra-edit-name';
import { ExtendedMenu } from './controls/extended-menu';
import ExtraEditLocation from './controls/extra-edit-tree-location';

const ExtraContainerEditor = ({
    containers,
    contents,
    dispatch,
    extra,
}: ExtraContainerProps) => {
    return (
        <div className="extra-tree-row edit-mode container" role="group">
            <ExtraEditName extra={extra} />
            <ExtendedMenu>
                <ExtraEditLocation extra={extra} containers={containers} />
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
            </ExtendedMenu>
        </div>
    );
};

export default ExtraContainerEditor;
