import { Button, Menu, MenuItem } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import React from 'react';

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
			<Popover2
				interactionKind="click"
				minimal={false}
				placement="bottom"
				content={<Dropdown />}
				renderTarget={({ ref, ...targetProps }) => (
					<Button {...targetProps} elementRef={ref}>
						<Label userTag={userTag} nickname={nickname} />
						<img src={avatar} height={32} width={32} />
					</Button>
				)}
			/>
		</div>
	);
};

export default UserMenu;
