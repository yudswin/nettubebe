import { Router } from 'express';
import userRouter from "@routes/user.route"

const router = Router();

router.use('/api/users', userRouter);

export const routes = router;
