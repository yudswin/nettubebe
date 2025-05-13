import { Router } from 'express';
import * as collectionContentController from '@controllers/collectionContent.controller';
import * as collectionController from '@controllers/collection.controller';

const router = Router();

router.post('/', collectionController.createCollection);
router.get('/list', collectionController.getAllCollections);
router.get('/:id', collectionController.getCollectionById);
router.get('/slug/:slug', collectionController.getCollectionBySlug);
router.patch('/:id', collectionController.updateCollection);
router.delete('/:id', collectionController.deleteCollection);

// CollectionContent 
router.post('/:collectionId/content/:contentId', collectionContentController.addContentToCollection);
router.get('/:collectionId/contents', collectionContentController.getCollectionContents);
router.put('/:collectionId/content/:contentId/rank', collectionContentController.updateContentRank);
router.delete('/:collectionId/content/:contentId', collectionContentController.removeContentFromCollection);

export default router;
