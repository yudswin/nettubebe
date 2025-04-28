import express from 'express';
import * as contentController from '@controllers/content.controller';

const router = express.Router();

router.post('/', contentController.createContent);
router.get('/list', contentController.getAllContents);
router.get('/:id', contentController.getContentById);
router.get('/slug/:slug', contentController.getContentBySlug);
router.patch('/:id', contentController.updateContent);
router.delete('/:id', contentController.deleteContent);

export default router;