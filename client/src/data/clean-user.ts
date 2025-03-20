import { User, Character, Extra, ExtraContainer } from '../types';
import { v4 as uuidv4 } from 'uuid';
import cleanCount from './cleanCount';

const cleanUser = (user: User) => {
    user.characters ??= [];
    user.characters.forEach((character) => cleanCharacter(character));
    return user;
};

const updateLocationDataOnExtras = (extras: Extra[]) => {
    const locations: ExtraContainer[] = [];

    const createLocation = (name: string): ExtraContainer => {
        console.log('Creating location: ', name);
        const id = uuidv4();
        const extra: ExtraContainer = {
            id,
            name,
            location: '',
            isExpanded: true,
            count: null,
            value: null,
            capacity: 0,
        };
        locations.push(extra);
        return extra;
    };

    const onMe: ExtraContainer = createLocation('About my person');

    const updatedExtras = extras.map((extra) => {
        const updated = { ...extra };
        updated.location = extra.location.trim();
        if (extra.location === '') {
            updated.location = onMe.id;
        } else {
            const location =
                locations.find((l) => l.name === extra.location) ??
                createLocation(extra.location);
            updated.location = location.id;
        }
        return updated;
    });

    const allExtras: Extra[] = updatedExtras.concat(locations);
    return allExtras;
};

const addId = (value: { id?: string }, force: boolean) => {
    if (force) {
        value.id = uuidv4();
    } else {
        value.id ??= uuidv4();
    }
};

export const cleanCharacter = (character: Character, freshIds = false) => {
    addId(character, freshIds);
    [...character.qualities, ...character.powers].forEach((attribute) => {
        addId(attribute, freshIds);
        attribute.wounds ??= 0;
    });
    character.extras ??= [];
    character.extras.forEach((extra) => {
        addId(extra, freshIds);
        extra.location ??= '';
        extra.count = cleanCount(extra.count);
    });
    character.bennies ??= { current: 3, max: '3' };
    if (!character.inventory) {
        console.log('Updating inventory for ', character.name || character.codeName);
        character.inventory = updateLocationDataOnExtras(character.extras);
    } else {
        // Generate new IDs for the location section to ensure imports don't create duplicates
        const inventoryIdMap = new Map<string, string>();
        character.inventory.forEach((item) => {
            if (item.id) {
                const freshId = uuidv4();
                inventoryIdMap.set(item.id, freshId);
                item.id = freshId;
            }
        });
        character.inventory.forEach((item) => {
            if (item.location) {
                item.location = inventoryIdMap.get(item.location);
            }
        });
    }
};

export default cleanUser;
