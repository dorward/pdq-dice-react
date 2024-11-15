import { Collapse, Icon } from '@blueprintjs/core';
import { useCallback, useState } from 'react';

export const ExtendedMenu = ({ children }: React.PropsWithChildren) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = useCallback(() => setIsOpen((open) => !open), []);

    return (
        <>
            <button className="extra-tree-edit-menu-toggle" onClick={toggle}>
                <Icon icon={isOpen ? 'menu-open' : 'menu'} title={isOpen ? 'Close' : 'Open'} />
            </button>
            <Collapse keepChildrenMounted isOpen={isOpen} className="extended-menu">
                {children}
            </Collapse>
        </>
    );
};

export default ExtendedMenu;
