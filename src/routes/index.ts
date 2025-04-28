import { Router } from 'express';
import userRouter from "@routes/user.route"
import mediaRouter from "@routes/media.route"
import streamRouter from "@routes/stream.route"
import genreRouter from "@routes/genre.route"
import countryRouter from "@routes/country.route"

const router = Router();

router.use('/api/user', userRouter);
router.use('/api/media', mediaRouter)
router.use('/v1/', streamRouter);
router.use('/content/genre', genreRouter)
router.use('/content/country', countryRouter)
// router.use('/content/department', departmentRouter)


export const routes = router;
