import { Router } from 'express';
import userRouter from "@routes/user.route"
import mediaRouter from "@routes/media.route"
import streamRouter from "@routes/stream.route"
import genreRouter from "@routes/genre.route"
import countryRouter from "@routes/country.route"
import departmentRouter from "@routes/department.route"
import personRouter from "@routes/person.route"
import contentRouter from "@routes/content.route"

const router = Router();

router.use('/api/user', userRouter);
router.use('/api/media', mediaRouter)
router.use('/v1/', streamRouter);
router.use('/content', contentRouter)
router.use('/content/genre', genreRouter)
router.use('/content/country', countryRouter)
router.use('/content/department', departmentRouter)
router.use('/person', personRouter)


export const routes = router;
