import { Router } from 'express';
import authHelper from '../util/authHelper';
import filterCharacterIdentityFromUser from '../model/filterCharacterIdentityFromUser';
import getRecentSkillChecks from '../model/getRecentSkillChecks';
import getLuckRolls from '../model/getLuckRolls';

const router = Router();

router.get('/:id/:code/:characterId/skill-checks', async (req, res) => {
    const { id, code, characterId } = req.params;
    const user = await authHelper(code, id, res);
    if (!user) return;
    if (!user.characters.some((character) => character.id === characterId)) {
        return res.sendStatus(404);
    }
    const pageParam = req.query.page ?? '1';
    const page = Number(pageParam);
    if (
        typeof pageParam !== 'string' ||
        !/^[1-9]\d*$/.test(pageParam) ||
        !Number.isSafeInteger(page) ||
        page > Math.floor(Number.MAX_SAFE_INTEGER / 10)
    ) {
        return res.status(400).json({ error: 'Page must be a positive integer.' });
    }
    const { name } = filterCharacterIdentityFromUser(user, characterId);
    const checks = await getRecentSkillChecks(user.userId, characterId, name, page);
    res.set('Cache-Control', 'no-store').json(checks);
});

router.get('/:id/:code/:characterId/luck-rolls', async (req, res) => {
    const { id, code, characterId } = req.params;
    const user = await authHelper(code, id, res);
    if (!user) return;
    if (!user.characters.some((character) => character.id === characterId)) {
        return res.sendStatus(404);
    }
    const { name } = filterCharacterIdentityFromUser(user, characterId);
    const rolls = await getLuckRolls(user.userId, characterId, name);
    res.set('Cache-Control', 'no-store').json(rolls);
});

export default router;
