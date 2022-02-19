import cors from 'cors';
import { Router } from 'express';

import rollRouter from './rollRouter';
import userRouter from './userRouter';

const router = Router();
router.use(cors());
router.use('/user', userRouter);
router.use('/roll', rollRouter);
export default router;
