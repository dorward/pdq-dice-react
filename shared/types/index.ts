export type Sheet = {
	sheet: Character;
};
export type Character = {
	name: string;
	player: string;
	motivation: string;
	origin: string;
	heropoints: Heropoints;
	qualities: Attribute[];
	powers: Attribute[];
};
export type Heropoints = {
	max: number;
	current: number;
};

export type Value = 'MSTR' | 'EXP' | 'GD' | 'AVG' | 'GONE';

export type Attribute = {
	name: string;
	value: Value;
	notes?: string;
};

type Avatar = string | null;

export type Channel = {
	id: string;
	name: string;
	guild: string;
	avatar: Avatar;
};

export type User = {
	avatar: Avatar;
	channel: Channel;
	characters: Character[];
	code: string;
	nickname: string;
	userId: string;
	userTag: string;
};

export type Store = {
	[discordId: string]: User;
};

export type PossibleUser = null | Error | User;

export type UserData = {
	addCharacter: {
		fromYAML: (yaml: string) => void;
		fromBlank: () => void;
	};
};
