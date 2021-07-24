export type Sheet = {
	sheet: Character;
};
export type Character = {
	name: string;
	id: string;
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

export type QualityValue = 'MSTR' | 'EXP' | 'GD' | 'AVG' | 'GONE';

export type Attribute = {
	name: string;
	id: string;
	value: QualityValue;
	notes?: string;
	wounds: number;
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

export type SelectedAttributes = Record<string, boolean>;

type AttributeState = [SelectedAttributes, (x: SelectedAttributes) => void];

export type RollData = {
	attributeState: AttributeState;
	description: string;
};

export type SkillCheckBonus = {
	name: string;
	value: number;
};

export type SkillCheckRequestBody = {
	dice: '1d6' | '2d6';
	high?: boolean;
	bonuses?: SkillCheckBonus[];
	description?: string;
};

export type SkillCheckResponseBody = {
	results: SkillCheckBonus[];
	total: number;
	success?: boolean;
	description?: string;
};
