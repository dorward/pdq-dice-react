export const extraValues = ['DEL', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const extraCountValues = ['∞', 0, 1, 2, 3, 4, 5, '>5'];

export type Sheet = {
    sheet: Character;
};

export type Character = {
    name: string;
    codeName: string;
    id: string;
    avatar?: Avatar;
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
    count?: '∞' | number;
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
    rolls: [number, number?];
};

export type DiceRollBonus = SkillCheckBonus & {
    rolls: [number, number?];
};

export type CharacterIdentity = {
    name: string;
    avatar: Avatar;
};

export type ExpendRequestBody = {
    characterId: string;
    extraName: string;
};

export type SkillCheckRequestBody = {
    dice: '1d6' | '2d6';
    high?: boolean;
    bonuses?: SkillCheckBonus[];
    rollType: string;
    description?: string;
    isUsingBenny?: boolean;
};

export type BennyRollRequestBody = {
    defaultBennies: number;
    diceBonus: string;
    rollType: 'Benny Roll';
};

export type ExpendResponseBody = {
    expendFor: CharacterIdentity;
    extraName: string;
};

export type SkillCheckResponseBody = {
    results: SkillCheckBonus[];
    diceResult: SkillCheckBonus;
    total: number;
    success?: boolean;
    description?: string;
    rollType: string;
    rollFor: {
        name: string;
        avatar: Avatar;
    };
};

export type BennyRollResponseBody = {
    defaultBennies: number;
    diceCount: number;
    total: number;
    rollType: 'Benny Reset';
    diceResult: number[];
    rollFor: {
        name: string;
        avatar: Avatar;
    };
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
    value: (typeof extraValues)[number];
};

export type ExtraUpdateLocation = {
    id: string;
    location: string;
};

export type ExtraUpdateCount = {
    id: string;
    count: (typeof extraCountValues)[number];
};

export type SelectExtra = {
    id: string;
};

export type ExtraUpdate =
    | ExtraUpdateName
    | ExtraUpdateValue
    | ExtraUpdateLocation
    | ExtraUpdateCount;

export const isAttributeUpdateValue = (data: AttributeUpdate): data is AttributeUpdateValue =>
    'value' in data;

export const isExtraUpdateValue = (data: ExtraUpdate): data is ExtraUpdateValue =>
    'value' in data;

export const isExtraUpdateLocation = (data: ExtraUpdate): data is ExtraUpdateLocation =>
    'location' in data;

export type StatisticsSkillCheck = {
    id?: number;
    userId: string;
    eventTime?: Date;
    characterName: string;
    benny: boolean;
    bonus: number;
    bonuses: SkillCheckBonus[];
    description: string;
    roll: number;
    total: number;
};

export type StatisticsHighLow = {
    id?: number;
    userId: string;
    eventTime?: Date;
    characterName: string;
    roll: number;
    seekingHigh: boolean;
    success: boolean;
};

export type StatisticsD6 = {
    id?: number;
    userId: string;
    eventTime?: Date;
    characterName: string;
    roll: number;
};
