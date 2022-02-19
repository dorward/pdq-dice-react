import { Router } from 'express';

import sendDiscordMessage from '../discord/sendDiscordMessage';
import {
    E_BAD_CODE,
    E_NOT_FOUND,
    E_UNEXPECTED_ERROR,
    E_UNSUPPORTED_DICE_FORMAT,
} from '../errors';
import filterCharacterIdentityFromUser from '../model/filterCharacterIdentityFromUser';
import getUserByCodeAndId from '../model/getUserByCodeAndId';
import { SkillCheckRequestBody, SkillCheckResponseBody } from '../types';
import authHelper from '../util/authHelper';
import measureSuccess from '../util/measureSuccess';
import roll from '../util/roll';

const router = Router();

router.get('/', (req, res) => {
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
