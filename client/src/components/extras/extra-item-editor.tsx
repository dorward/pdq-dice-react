import { ExtraItemProps } from './types';
import ExtraEditName from './controls/extra-edit-name';
import ExtendedMenu from './controls/extended-menu';
import ExtraEditLocation from './controls/extra-edit-tree-location';
import ExtraEditQuantity from './controls/extra-edit-quantity';
import ExtraEditBonus from './controls/extra-edit-bonus';

const ExtraItemEditor = ({ containers, extra }: ExtraItemProps) => {
    return (
        <div className="extra-tree-row edit-mode item" role="group">
            <ExtraEditName extra={extra} />
            <ExtendedMenu>
                <ExtraEditLocation extra={extra} containers={containers} />
                <ExtraEditQuantity extra={extra} />
                <ExtraEditBonus extra={extra} />
            </ExtendedMenu>
        </div>
    );
};

export default ExtraItemEditor;
