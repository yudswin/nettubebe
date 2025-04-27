import { Router } from 'express';
import userRouter from "@routes/user.route"
import mediaRouter from "@routes/media.route"
import streamRouter from "@routes/stream.route"

const router = Router();

router.use('/api/user', userRouter);
// router.use('/api/media', mediaRouter)
// router.use('/api/', streamRouter);

export const routes = router;
