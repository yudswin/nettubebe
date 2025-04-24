// routes/stream.routes.ts
import { Router } from 'express';
import * as streamController from '@controllers/stream.controller';

const router = Router();

router.get('/stream/:videoId', streamController.getStreamingUrls);
router.get('/manifest/:videoId', streamController.proxyManifest);

export default router;