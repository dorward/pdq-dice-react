import { Request, Response, Router } from 'express';

import sendDiscordMessage, { sendBennyRollDiscordMessage } from '../discord/sendDiscordMessage';
import { E_UNSUPPORTED_DICE_FORMAT } from '../errors';
import filterCharacterIdentityFromUser from '../model/filterCharacterIdentityFromUser';
import {
    BennyRollRequestBody,
    BennyRollResponseBody,
    SkillCheckRequestBody,
    SkillCheckResponseBody,
    User,
} from '../types';
import authHelper from '../util/authHelper';
import measureSuccess from '../util/measureSuccess';
import roll from '../util/roll';
import recordHighLowRoll from '../model/recordHighLowRoll';
import recordSkillRoll from '../model/recordSkillRoll';
import recordD6Roll from '../model/recordD6Roll';
import d6 from '../util/d6';

const router = Router();

router.get('/', (_req, res) => {
    res.send('This is the entry point for api/roll');
});

const isDiceFormat = /^\+(\d+)d6/;

const bennyRoll = async (
    req: Request,
    res: Response,
    user: User,
    rollFor: BennyRollResponseBody['rollFor'],
) => {
    const { defaultBennies, diceBonus } = req.body as BennyRollRequestBody;
    const diceCount = +(diceBonus.match(isDiceFormat)?.[1] ?? '0');
    if (diceCount > 4) {
        throw new Error('Dice count too high');
    }
    const diceResult = Array(diceCount).fill(d6());
    const total = diceResult.reduce((acc, cur) => acc + cur, defaultBennies);
    const response: BennyRollResponseBody = {
        rollFor,
        defaultBennies,
        diceCount,
        diceResult,
        total,
        rollType: 'Benny Reset',
    };
    sendBennyRollDiscordMessage(user, response);
    res.json(response);
};

router.post('/:id/:code', async (req, res) => {
    const user = await authHelper(req.params.code, req.params.id, res);
    if (!user) return; // Status code already sent by helper
    // Get Character
    const { characterId, rollType } = req.body;
    const rollFor = filterCharacterIdentityFromUser(user, characterId);

    // This is sufficiently different to be farmed out to a bespoke function
    if (req.body.rollType === 'Benny Roll') {
        return await bennyRoll(req, res, user, rollFor);
    }

    // Calculate result
    const {
        dice,
        high,
        bonuses = [],
        description,
        isUsingBenny,
    } = req.body as SkillCheckRequestBody;

    const diceResult = roll(dice);
    if (diceResult === E_UNSUPPORTED_DICE_FORMAT) return res.sendStatus(400);
    const success = measureSuccess({ high, roll: diceResult.rolls[0] });
    const results = [diceResult, ...bonuses];
    const total = results.reduce((acc, cur) => {
        return acc + +cur.value;
    }, 0);

    if (rollType === 'Luck roll') {
        recordHighLowRoll({
            userId: user.userId,
            characterName: rollFor.name,
            seekingHigh: Boolean(high),
            success: Boolean(success),
            roll: diceResult.value,
        });
    } else if (rollType === 'Skill Check') {
        recordSkillRoll({
            userId: user.userId,
            characterName: rollFor.name,
            description: `${description}`,
            bonus: bonuses.reduce((acc, cur) => {
                return acc + +cur.value;
            }, 0),
            bonuses,
            roll: diceResult.value,
            benny: Boolean(isUsingBenny),
            total,
        });
    } else if (rollType === 'd6') {
        recordD6Roll({
            userId: user.userId,
            characterName: rollFor.name,
            roll: diceResult.value,
        });
    } else {
        console.log(`${rollType} is not recorded`);
    }

    // Compile the result
    const response: SkillCheckResponseBody = {
        results,
        total,
        success,
        description,
        rollFor,
        rollType,
        diceResult,
    };
    sendDiscordMessage(user, response);
    res.json(response);
});

export default router;
