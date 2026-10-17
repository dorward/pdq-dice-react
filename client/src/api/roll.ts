import { queryClient } from './query-client';
import { attributeValues, countsThatDoNotReduce } from '../consts';
import { updateLastRoll } from '../data/last-roll-slice';
import store from '../data/redux-store';
import { markLoading, setResult, setRollError } from '../data/results-slice';
import {
    selectCharacter,
    spendInventoryItem,
    setBennies,
    spendBenny,
} from '../data/user-slice';
import { selectBennyUse, useBenny } from '../data/roll-slice';
import { selectCharacterId, selectWhoami } from '../data/whoami-slice';
import { SkillCheckRequestBody } from '../types';
import axios from 'axios';
import { parseMaxBennyValue } from '../util/parseMaxBennyValue';

const getBase = () => {
    const API_URL = import.meta.env.VITE_API_URL;
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
    try {
        const response = await axios.post(url, data);
        if (rollType === 'Luck roll') {
            void queryClient.invalidateQueries({ queryKey: ['luck-rolls'] });
        }
        const result = response.data.result;
        store.dispatch(setResult(response.data));
        return result;
    } catch (error) {
        console.error({ error });
        store.dispatch(setRollError('The roll could not be completed. Please try again.'));
    }
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
    void queryClient.invalidateQueries({ queryKey: ['skill-checks'] });
    return response.data;
};

export const resetBennies = async () => {
    const { auth, url } = getBase();
    const state = store.getState();
    const max = selectCharacter(state).bennies.max;
    const [defaultBennies, diceBonus] = parseMaxBennyValue(max);
    const body = {
        defaultBennies,
        diceBonus,
        rollType: 'Benny Roll',
    };
    const response = await axios.post(url, { ...auth, ...body });
    const { data } = response;
    const { total } = data;
    const payload = setBennies({ characterId: auth.characterId, bennies: total });
    store.dispatch(payload);
};

export const skillCheck = async ({ isUsingBenny }: SkillCheckProps = {}) => {
    let body: SkillCheckRequestBody;
    let inventoryToSpend: { characterId: string; extraId: string }[] = [];

    if (isUsingBenny) {
        const state = store.getState();
        if (state.results.loading || !selectBennyUse(state)) return;
        store.dispatch(markLoading());
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
        inventoryToSpend = character.inventory
            .filter(
                (item) =>
                    selected[item.id] &&
                    typeof item.count === 'number' &&
                    !countsThatDoNotReduce.includes(item.count),
            )
            .map((item) => ({ characterId: character.id, extraId: item.id }));
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
    }

    const { auth, url } = getBase();
    const data = { ...auth, ...body, isUsingBenny: Boolean(isUsingBenny) };

    try {
        const response = await axios.post(url, data);
        const {
            data: { result },
        } = response;
        void queryClient.invalidateQueries({ queryKey: ['skill-checks'] });
        inventoryToSpend.forEach((item) => store.dispatch(spendInventoryItem(item)));
        if (isUsingBenny) {
            store.dispatch(spendBenny(auth.characterId));
            store.dispatch(useBenny());
        }
        if (!isUsingBenny) store.dispatch(updateLastRoll(body));
        store.dispatch(setResult(response.data));
        return result;
    } catch (error) {
        console.error({ error });
        store.dispatch(
            setRollError(
                isUsingBenny
                    ? 'The reroll could not be completed. Your Benny has not been spent. Please try again.'
                    : 'The roll could not be completed. Your inventory has not been consumed. Please try again.',
            ),
        );
    }
};
