import { ExtraContainerProps } from './types';
import ExtraEditName from './controls/extra-edit-name';
import { ExtendedMenu } from './controls/extended-menu';
import ExtraEditLocation from './controls/extra-edit-tree-location';
import ExtraEditCapacity from './controls/extra-edit-capacity';
import ExtraEditDelete from './controls/extra-edit-delete';

const ExtraContainerEditor = ({ containers, contents, extra }: ExtraContainerProps) => {
    return (
        <div className="extra-tree-row edit-mode container" role="group">
            <ExtraEditName extra={extra} />
            <ExtendedMenu>
                <ExtraEditLocation extra={extra} containers={containers} />
                <ExtraEditCapacity extra={extra} />
                <ExtraEditDelete extra={extra} contents={contents} />
            </ExtendedMenu>
        </div>
    );
};

export default ExtraContainerEditor;
