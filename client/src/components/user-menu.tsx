import { Button, Menu, MenuItem, Popover } from '@blueprintjs/core';

type Props = {
	userTag?: string;
	nickname?: string;
	avatar?: string;
};

const Dropdown = () => {
	return (
		<Menu>
			<MenuItem icon="log-out" text="Logout" />
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
	return (
		<div className="userMenu">
			<Popover interactionKind="click" minimal={false} placement="bottom" content={<Dropdown />}>
				<Button>
					<Label userTag={userTag} nickname={nickname} />
					<img src={avatar} height={32} width={32} />
				</Button>
			</Popover>
		</div>
	);
};

export default UserMenu;
