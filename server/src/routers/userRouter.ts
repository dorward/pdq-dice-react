import { Router } from 'express';

import { E_BAD_CODE, E_NOT_FOUND } from '../errors';
import addOrUpdateUser from '../model/addOrUpdateUser';
import getUserByCode from '../model/getUserByCode';
import authHelper from '../util/authHelper';
import saveDataUrl from '../util/saveDataUrl';

const router = Router();

router.get('/', (req, res) => {
    res.send('This is the entry point for api/user');
});

router.get('/:code', async (req, res) => {
    try {
        const user = await getUserByCode(req.params.code);
        if (user === E_NOT_FOUND) {
            return res.status(404).send('Could not find a user with that code');
        }
        return res.json(user);
    } catch (e) {
        console.error(e);
        res.status(500).send('Something went wrong');
    }
});

router.post('/:id/:code', async (req, res) => {
    try {
        await addOrUpdateUser(req.params.id, req.params.code, req.body);
        res.status(204).send();
    } catch (e) {
        if (e instanceof Error && e.message === E_BAD_CODE) {
            return res.sendStatus(401);
        }
        console.log(e);
        res.sendStatus(500);
    }
});

router.post('/:id/:code/avatar', async (req, res) => {
    const { code, id: userId } = req.params;
    const user = await authHelper(code, userId, res);
    if (!user) return; // Status code already sent by helper
    const { image: dataUrl } = req.body;
    const image = await saveDataUrl(dataUrl);
    if (!image) return res.sendStatus(400);
    res.json(image);
});

export default router;
