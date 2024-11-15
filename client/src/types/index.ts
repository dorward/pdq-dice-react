export const extraValues = ['DEL', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const extraCountValues = ['∞', 0, 1, 2, 3, 4, 5, '>5'];

export type Sheet = {
    sheet: Character;
};

export type Character = {
    avatar?: Avatar;
    bennies: Bennies;
    codeName: string;
    extras: Extra[]; // deprecated
    inventory: Extra[];
    hidden?: boolean;
    id: string;
    motivation: string;
    name: string;
    origin: string;
    player: string;
    powers: Attribute[];
    qualities: Attribute[];
    background?: string;
};

export type Bennies = {
    max: string;
    current: number;
};

export type QualityValue = 'MSTR' | 'EXP' | 'GD' | 'AVG' | 'PR' | 'GONE';

export type ExtraBase = {
    name: string;
    id: string;
    location: string;
};

export type ExtraItem = ExtraBase & {
    count: '∞' | number;
    value: number;
};

export type ExtraContainer = ExtraBase & {
    isExpanded: boolean;
    count: null;
    value: null;
    capacity: '∞' | number;
};

export type EditExtraProps = {
    extra: Extra;
};

export type EditExtraItemProps = {
    extra: ExtraItem;
};

export type EditExtraContainerProps = {
    extra: ExtraContainer;
};

export type Extra = ExtraItem | ExtraContainer;

export const isExtraContainer = (extra: Extra): extra is ExtraContainer =>
    'isExpanded' in extra;

export type ExtraSortOrder = 'name' | 'location';

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
    rolls?: [number, number?];
};

export type DiceRollBonus = SkillCheckBonus & {
    rolls: [number, number?];
};

export type SkillCheckRequestBody = {
    dice: '1d6' | '2d6';
    high?: boolean;
    bonuses?: SkillCheckBonus[];
    rollType: string;
    description?: string;
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
        avatar: string;
    };
};

export type AttributeUpdateName = {
    id: string;
    name: string;
};

export type AttributeUpdateNotes = {
    id: string;
    notes: string;
};

export type AttributeUpdateValue = {
    id: string;
    value: 'DEL' | QualityValue;
};

export type AttributeUpdate = AttributeUpdateName | AttributeUpdateValue | AttributeUpdateNotes;

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

export type ExtraUpdateCapacity = {
    id: string;
    capacity: ExtraContainer['capacity'];
};

export type SelectExtra = {
    id: string;
};

export type ExtraPartialMove = {
    id: string;
    location: string;
    count: number | '∞';
};

export type ExtraUpdate =
    | ExtraUpdateName
    | ExtraUpdateValue
    | ExtraUpdateLocation
    | ExtraUpdateCount
    | ExtraUpdateCapacity;

export const isAttributeUpdateValue = (data: AttributeUpdate): data is AttributeUpdateValue =>
    'value' in data;

export const isExtraUpdateValue = (data: ExtraUpdate): data is ExtraUpdateValue =>
    'value' in data;

export const isExtraUpdateLocation = (data: ExtraUpdate): data is ExtraUpdateLocation =>
    'location' in data;
