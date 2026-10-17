import { Button, Callout, Menu, MenuItem, PopoverNext } from '@blueprintjs/core';
import { logout } from '../data/logout';
import { useRef, useState } from 'react';
import { LoadingOverlay } from './loading';

type Props = {
    userTag?: string;
    nickname?: string;
    avatar?: string;
};

const Dropdown = ({ onLogout }: { onLogout: () => void }) => {
    return (
        <Menu>
            <MenuItem icon="log-out" text="Logout" onClick={onLogout} />
            <MenuItem icon="floppy-disk" text="Export data" />
        </Menu>
    );
};

const Label = ({ userTag, nickname }: Props) => {
    if (userTag && nickname)
        return (
            <span>
                {userTag}
                <br />({nickname})
            </span>
        );
    if (userTag) return <span>userTag</span>;
    if (nickname) return <span>nickname</span>;
    return <></>;
};

const UserMenu = ({ userTag, nickname, avatar }: Props) => {
    const pending = useRef(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const [error, setError] = useState('');
    const onLogout = async () => {
        if (pending.current) return;
        pending.current = true;
        setLoggingOut(true);
        setError('');
        try {
            await logout();
        } catch {
            setError(
                'Logout could not complete because your changes could not be saved. You are still logged in. Export your unsaved characters before reloading.',
            );
        } finally {
            pending.current = false;
            setLoggingOut(false);
        }
    };
    return (
        <div className="userMenu">
            {loggingOut && <LoadingOverlay />}
            {error && (
                <Callout role="alert" intent="danger" title="Logout failed">
                    {error}
                </Callout>
            )}
            <PopoverNext
                shouldReturnFocusOnClose={false}
                interactionKind="click"
                placement="bottom"
                content={<Dropdown onLogout={onLogout} />}
            >
                <Button>
                    <Label userTag={userTag} nickname={nickname} />
                    <img src={avatar} height={32} width={32} />
                </Button>
            </PopoverNext>
        </div>
    );
};

export default UserMenu;
