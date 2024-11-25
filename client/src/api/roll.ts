import { attributeValues, countsThatDoNotReduce } from '../consts';
import { updateLastRoll } from '../data/last-roll-slice';
import store from '../data/redux-store';
import { markLoading, setResult, markClear } from '../data/results-slice';
import { selectCharacter, spendInventoryItem, setUserError } from '../data/user-slice';
import { selectCharacterId, selectWhoami } from '../data/whoami-slice';
import { SkillCheckRequestBody } from '../types';
import axios from 'axios';

const getBase = () => {
    const API_URL = process.env.API_URL;
    const whoami = selectWhoami(store.getState());
    const characterId = selectCharacterId(store.getState());

    const url = `${API_URL}roll/${whoami.userId}/${whoami.code}/`;
    const auth = { characterId };
    return { auth, url };
};

type D6Params = {
    high?: boolean;
};

export const d6 = async ({ high }: D6Params) => {
    store.dispatch(markLoading());
    const [rollType, description] =
        typeof high === 'undefined' ? ['d6', undefined] : [`Luck roll`, high ? 'High' : 'Low'];
    const { auth, url } = getBase();
    const data = {
        ...auth,
        dice: '1d6',
        high,
        rollType,
        description,
    };
    const response = await axios.post(url, data);
    const result = response.data.result;
    store.dispatch(setResult(response.data));
    return result;
};

type SkillCheckProps = {
    isUsingBenny?: boolean;
};

type SimpleSkillCheckProps = {
    description: string;
    modifier: number;
};

export const simpleSkillCheck = async ({ description, modifier }: SimpleSkillCheckProps) => {
    const { auth, url } = getBase();

    const body: SkillCheckRequestBody = {
        dice: '2d6',
        bonuses: [
            {
                name: 'Modifiers',
                value: modifier,
            },
        ],
        description,
        rollType: 'Skill Check',
    };
    const response = await axios.post(url, { ...auth, ...body });
    return response.data;
};

export const skillCheck = async ({ isUsingBenny }: SkillCheckProps = {}) => {
    let body: SkillCheckRequestBody;

    if (isUsingBenny) {
        body = store.getState().lastRoll.roll;
    } else {
        const { selected, description, circumstance } = store.getState().roll;
        store.dispatch(markLoading());
        const character = selectCharacter(store.getState());
        const qualityBonuses = [...character.qualities, ...character.powers]
            .filter((attribute) => selected[attribute.id])
            .map((attribute) => {
                const value =
                    attributeValues[
                        attributeValues.findIndex((value) => value[0] === attribute.value) +
                            (attribute.wounds || 0)
                    ][1];
                return {
                    name: attribute.name,
                    value,
                };
            });
        const extraBonuses = character.inventory
            .filter((item) => selected[item.id] && item.count !== 0)
            .map((item) => ({
                name: item.name,
                value: item.value,
            }));
        character.inventory
            .filter((item) => selected[item.id] && !countsThatDoNotReduce.includes(item.count))
            .forEach((item) => {
                store.dispatch(
                    spendInventoryItem({ characterId: character.id, extraId: item.id }),
                );
            });
        const circumstanceBonus = circumstance.value
            ? [{ name: circumstance.name, value: circumstance.value }]
            : [];

        const bonuses = [...qualityBonuses, ...extraBonuses, ...circumstanceBonus];

        body = {
            dice: '2d6',
            bonuses,
            description,
            rollType: 'Skill Check',
        };
        store.dispatch(updateLastRoll(body));
    }

    const { auth, url } = getBase();
    const data = { ...auth, ...body };

    try {
        const response = await axios.post(url, data);
        const {
            data: { result },
        } = response;
        store.dispatch(setResult(response.data));
        return result;
    } catch (error) {
        console.error({ error });
        store.dispatch(markClear());
        store.dispatch(
            setUserError('There was an unexpected error. Try logging in using Discord again.'),
        );
    }
};
