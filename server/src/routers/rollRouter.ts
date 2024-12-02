import { Router } from 'express';

import sendDiscordMessage from '../discord/sendDiscordMessage';
import { E_UNSUPPORTED_DICE_FORMAT } from '../errors';
import filterCharacterIdentityFromUser from '../model/filterCharacterIdentityFromUser';
import { SkillCheckRequestBody, SkillCheckResponseBody } from '../types';
import authHelper from '../util/authHelper';
import measureSuccess from '../util/measureSuccess';
import roll from '../util/roll';
import recordHighLowRoll from '../model/recordHighLowRoll';
import recordSkillRoll from '../model/recordSkillRoll';
import recordD6Roll from '../model/recordD6Roll';

const router = Router();

router.get('/', (_req, res) => {
    res.send('This is the entry point for api/roll');
});

router.post('/:id/:code', async (req, res) => {
    const user = await authHelper(req.params.code, req.params.id, res);
    if (!user) return; // Status code already sent by helper

    // Get Character
    const { characterId } = req.body;
    const rollFor = filterCharacterIdentityFromUser(user, characterId);

    // Calculate result
    const {
        dice,
        high,
        bonuses = [],
        description,
        rollType,
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
