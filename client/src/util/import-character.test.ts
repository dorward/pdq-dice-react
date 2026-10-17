import { expect, test } from 'vitest';
import { dump } from 'js-yaml';
import { importCharacter } from './import-character';
import type { Attribute, ExtraContainer } from '../types';

const character = {
    name: 'Hero',
    qualities: [{ name: 'Strong', value: 'GD' }],
    powers: [] as Attribute[],
};
const folder: ExtraContainer = {
    id: 'folder',
    name: 'Box',
    location: '',
    count: null,
    value: null,
    capacity: 10,
    isExpanded: true,
};
const item = { id: 'item', name: 'Potion', location: 'folder', count: 0, value: 1 };

test.each(['yaml', 'json'] as const)(
    '%s supports bare and wrapped characters and normalises older exports',
    (format) => {
        const encode = format === 'json' ? JSON.stringify : dump;
        for (const document of [character, { sheet: character }]) {
            const imported = importCharacter(encode(document), format);
            expect(imported).toMatchObject({
                name: 'Hero',
                codeName: '',
                player: '',
                bennies: { current: 3, max: '3' },
            });
            expect(imported.qualities[0]).toMatchObject({
                name: 'Strong',
                value: 'GD',
                wounds: 0,
            });
            expect(imported.id).toBeTruthy();
            expect(imported.qualities[0].id).toBeTruthy();
            expect(Array.isArray(imported.inventory)).toBe(true);
        }
    },
);

test.each(['yaml', 'json'] as const)(
    '%s validates inventory before generating consistent fresh IDs',
    (format) => {
        const source = { ...character, inventory: [folder, item] };
        const encoded = format === 'json' ? JSON.stringify(source) : dump(source);
        const first = importCharacter(encoded, format);
        const second = importCharacter(encoded, format);
        expect(first.inventory[0].id).not.toBe('folder');
        expect(first.inventory[0].id).not.toBe(second.inventory[0].id);
        expect(first.inventory[1]).toMatchObject({ location: first.inventory[0].id, count: 0 });
    },
);

test.each(['yaml', 'json'] as const)('%s rejects invalid character structures', (format) => {
    const encode = format === 'json' ? JSON.stringify : dump;
    const invalid = [
        null,
        [],
        'text',
        4,
        {},
        { sheet: null },
        { ...character, qualities: null },
        { ...character, powers: {} },
        { ...character, qualities: [{ name: 'Bad', value: 'INVALID' }] },
        { ...character, qualities: [{ name: 'Bad', value: 'GD', wounds: -1 }] },
        { ...character, name: {} },
        { ...character, bennies: { current: -1, max: '3' } },
        { ...character, inventory: [folder, { ...item, count: -1 }] },
        { ...character, inventory: [folder, { ...item, id: 'folder' }] },
        { ...character, inventory: [{ ...item, location: 'missing' }] },
        { ...character, inventory: [{ ...folder, location: 'folder' }] },
        { ...character, inventory: [folder, { ...item, location: 'item' }] },
        {
            ...character,
            inventory: [
                { ...folder, location: 'nested' },
                { ...folder, id: 'nested', location: 'folder' },
            ],
        },
    ];
    for (const document of invalid) {
        expect(() => importCharacter(encode(document), format)).toThrow(
            'Invalid character document',
        );
    }
});

test.each([
    ['yaml', 'sheet: ['],
    ['json', '{"sheet":'],
    ['json', 'name: Hero'],
] as const)('malformed %s produces an actionable parsing error', (format, input) => {
    expect(() => importCharacter(input, format)).toThrow(`invalid ${format.toUpperCase()}`);
});
