import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
    res.send('PDQ Dice API server.');
});

export default router;
