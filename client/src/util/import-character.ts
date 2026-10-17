import { load } from 'js-yaml';
import { attributeValues } from '../consts';
import { cleanCharacter } from '../data/clean-user';
import type { Attribute, Character, Extra } from '../types';

const invalid = (path: string): never => {
    throw new Error(`Invalid character document: ${path}.`);
};
const object = (value: unknown, path: string): Record<string, unknown> => {
    if (!value || typeof value !== 'object' || Array.isArray(value))
        invalid(`${path} must be an object`);
    return value as Record<string, unknown>;
};
const text = (value: unknown, path: string, fallback?: string): string => {
    if (value === undefined && fallback !== undefined) return fallback;
    if (typeof value !== 'string') invalid(`${path} must be text`);
    return value as string;
};
const number = (value: unknown, path: string): number => {
    if (typeof value !== 'number' || !Number.isFinite(value))
        invalid(`${path} must be a finite number`);
    return value as number;
};
const quantity = (value: unknown, path: string): number | '∞' => {
    if (value === '∞') return value;
    const result = number(value, path);
    if (!Number.isSafeInteger(result) || result < 0)
        invalid(`${path} must be a nonnegative integer or ∞`);
    return result;
};
const list = <T>(
    value: unknown,
    path: string,
    convert: (item: unknown, path: string) => T,
): T[] => {
    if (!Array.isArray(value)) invalid(`${path} must be a list`);
    return (value as unknown[]).map((item, index) => convert(item, `${path}[${index}]`));
};
const attribute = (value: unknown, path: string): Attribute => {
    const item = object(value, path);
    if (!attributeValues.some(([rank]) => rank === item.value))
        invalid(`${path}.value is not a recognised rank`);
    const wounds = number(item.wounds ?? 0, `${path}.wounds`);
    if (!Number.isSafeInteger(wounds) || wounds < 0)
        invalid(`${path}.wounds must be a nonnegative integer`);
    return {
        id: '',
        name: text(item.name, `${path}.name`),
        value: item.value as Attribute['value'],
        wounds,
        ...(item.notes === undefined ? {} : { notes: text(item.notes, `${path}.notes`) }),
    };
};
const extra = (value: unknown, path: string, legacy = false): Extra => {
    const item = object(value, path);
    const base = {
        id: legacy ? '' : text(item.id, `${path}.id`),
        name: text(item.name, `${path}.name`),
        location: text(item.location, `${path}.location`, ''),
    };
    if ('isExpanded' in item) {
        if (typeof item.isExpanded !== 'boolean' || item.count !== null || item.value !== null)
            invalid(`${path} has invalid folder fields`);
        return {
            ...base,
            count: null,
            value: null,
            isExpanded: item.isExpanded as boolean,
            capacity: quantity(item.capacity, `${path}.capacity`),
        };
    }
    let count = item.count;
    if (legacy) {
        count ??= '∞';
        if (typeof count === 'string' && /^\d+$/.test(count)) count = Number(count);
    }
    return {
        ...base,
        count: quantity(count, `${path}.count`),
        value: number(item.value, `${path}.value`),
    };
};

export const importCharacter = (input: string, format: 'yaml' | 'json' = 'yaml'): Character => {
    let parsed: unknown;
    try {
        parsed = format === 'json' ? JSON.parse(input) : load(input);
    } catch {
        throw new Error(`The file contains invalid ${format.toUpperCase()}.`);
    }
    const document = object(parsed, 'document');
    const sheet = 'sheet' in document ? object(document.sheet, 'sheet') : document;
    const character: Character = {
        id: '',
        name: text(sheet.name, 'name', ''),
        codeName: text(sheet.codeName, 'codeName', ''),
        player: text(sheet.player, 'player', ''),
        motivation: text(sheet.motivation, 'motivation', ''),
        origin: text(sheet.origin, 'origin', ''),
        qualities: list(sheet.qualities, 'qualities', attribute),
        powers: list(sheet.powers, 'powers', attribute),
        extras: list(sheet.extras ?? [], 'extras', (item, path) => extra(item, path, true)),
        inventory: undefined,
        bennies: { current: 3, max: '3' },
    };
    for (const field of ['background', 'avatar'] as const) {
        if (sheet[field] !== undefined) {
            if (field === 'avatar' && sheet[field] === null) character.avatar = null;
            else character[field] = text(sheet[field], field);
        }
    }
    if (sheet.hidden !== undefined) {
        if (typeof sheet.hidden !== 'boolean') invalid('hidden must be true or false');
        character.hidden = sheet.hidden as boolean;
    }
    if (sheet.bennies !== undefined) {
        const bennies = object(sheet.bennies, 'bennies');
        const current = quantity(bennies.current, 'bennies.current');
        if (current === '∞') invalid('bennies.current must be an integer');
        const max = text(bennies.max, 'bennies.max');
        if (!/^\d+(?:\+[0-4]d6)?$/.test(max))
            invalid('bennies.max must be a number optionally followed by +0d6 to +4d6');
        character.bennies = { current: current as number, max };
    }
    if (sheet.inventory !== undefined) {
        const inventory = list(sheet.inventory, 'inventory', extra);
        const byId = new Map(inventory.map((item) => [item.id, item]));
        if (byId.size !== inventory.length || inventory.some((item) => !item.id))
            invalid('inventory IDs must be present and unique');
        for (const item of inventory) {
            const seen = new Set([item.id]);
            let location = item.location;
            while (location) {
                const parent = byId.get(location);
                if (!parent || !('isExpanded' in parent))
                    invalid('inventory locations must refer to folders');
                if (seen.has(location))
                    invalid('inventory folders cannot contain themselves or form a cycle');
                seen.add(location);
                location = parent.location;
            }
        }
        character.inventory = inventory;
    }
    cleanCharacter(character, true);
    return character;
};
