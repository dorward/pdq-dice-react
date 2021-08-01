export type Sheet = {
	sheet: Character;
};

export type Character = {
	name: string;
	id: string;
	player: string;
	motivation: string;
	origin: string;
	bennies: Bennies;
	qualities: Attribute[];
	extras: Extra[];
	powers: Attribute[];
	hidden?: boolean;
};

export type Bennies = {
	max: string;
	current: number;
};

export type QualityValue = 'MSTR' | 'EXP' | 'GD' | 'AVG' | 'GONE';

export type Extra = {
	name: string;
	id: string;
	value: number;
	location: string;
};

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

export type AttributeUpdateName = {
	id: string;
	name: string;
};

export type AttributeUpdateValue = {
	id: string;
	value: 'DEL' | QualityValue;
};

export type AttributeUpdate = AttributeUpdateName | AttributeUpdateValue;

export type ExtraUpdateName = {
	id: string;
	name: string;
};

export type ExtraUpdateValue = {
	id: string;
	value: 'DEL' | number;
};

export type ExtraUpdateLocation = {
	id: string;
	location: string;
};

export type ExtraUpdate = ExtraUpdateName | ExtraUpdateValue | ExtraUpdateLocation;

export const isAttributeUpdateValue = (data: AttributeUpdate): data is AttributeUpdateValue => 'value' in data;

export const isExtraUpdateValue = (data: ExtraUpdate): data is ExtraUpdateValue => 'value' in data;

export const isExtraUpdateLocation = (data: ExtraUpdate): data is ExtraUpdateLocation => 'location' in data;
