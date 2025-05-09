import { Router } from 'express';
import * as castController from "@controllers/cast.controller"

const router = Router();

router.post('/:contentId', castController.addCastsToContent);
router.get('/:contentId', castController.getCastsForContent);
router.get('/v1/:personId/', castController.getContentForCast);
router.delete('/:contentId', castController.removeCastsFromContent);
router.put('/:contentId', castController.setCastsForContent);

export default router;