import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    res.send('PDQ Dice API server.');
});

export default router;
