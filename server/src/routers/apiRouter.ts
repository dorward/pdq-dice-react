import cors from 'cors';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';

import rollRouter from './rollRouter';
import expendRouter from './expendRouter';
import userRouter from './userRouter';

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
});

const router = Router();
router.use(limiter);
router.use(cors());
router.use('/user', userRouter);
router.use('/roll', rollRouter);
router.use('/expend', expendRouter);
export default router;
