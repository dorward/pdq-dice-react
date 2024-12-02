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
            characterName: rollFor.name,
            seekingHigh: Boolean(high),
            success: Boolean(success),
            roll: diceResult.value,
        });
    } else if (rollType === 'Skill Check') {
        recordSkillRoll({
            characterName: rollFor.name,
            description: `${description}`,
            bonus: bonuses.reduce((acc, cur) => {
                return acc + +cur.value;
            }, 0),
            roll: diceResult.value,
            total,
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
