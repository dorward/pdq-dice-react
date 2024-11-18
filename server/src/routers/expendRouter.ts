import { Router } from 'express';

import { sendDiscordExpendNotification } from '../discord/sendDiscordMessage';
import filterCharacterIdentityFromUser from '../model/filterCharacterIdentityFromUser';
import { ExpendRequestBody, ExpendResponseBody } from '../types';
import authHelper from '../util/authHelper';

const router = Router();

router.get('/', (_req, res) => {
    res.send('This is the entry point for api/expend');
});

router.post('/:id/:code', async (req, res) => {
    const user = await authHelper(req.params.code, req.params.id, res);
    if (!user) return; // Status code already sent by helper

    const { characterId, extraName } = req.body as ExpendRequestBody;
    const expendFor = filterCharacterIdentityFromUser(user, characterId);

    // Compile the result
    const response: ExpendResponseBody = {
        expendFor,
        extraName,
    };
    sendDiscordExpendNotification(user, response);
    res.json(response);
});

export default router;
