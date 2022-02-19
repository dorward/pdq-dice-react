import { E_UNSUPPORTED_DICE_FORMAT } from '../errors';
import { SkillCheckRequestBody } from '../types';
import d6 from '../util/d6';

const supportedDice = ['1d6', '2d6'];

type Dice = SkillCheckRequestBody['dice'];
type Rolls = [number, number?];
type Result = {
    name: string;
    value: number;
    rolls: Rolls;
};

type Return = typeof E_UNSUPPORTED_DICE_FORMAT | Result;

const roll = (dice: Dice): Return => {
    if (!supportedDice.includes(dice)) return E_UNSUPPORTED_DICE_FORMAT;
    if (dice === '1d6') {
        const rolls: Rolls = [d6()];
        return { name: 'Roll', value: rolls[0], rolls: rolls };
    } else {
        const rolls: Rolls = [d6(), d6()];
        return {
            name: `Roll (${rolls[0]} + ${rolls[1]})`,
            value: rolls[0] + (rolls[1] as number),
            rolls: rolls,
        };
    }
};

export default roll;
