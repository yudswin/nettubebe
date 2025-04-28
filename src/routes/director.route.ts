import { Router } from 'express';
import * as directorController from "@controllers/director.controller"

const router = Router();

router.post('/:contentId', directorController.addDirectorsToContent);
router.get('/:contentId', directorController.getDirectorsForContent);
router.delete('/:contentId', directorController.removeDirectorsFromContent);
router.put('/:contentId', directorController.setDirectorsForContent);

export default router;