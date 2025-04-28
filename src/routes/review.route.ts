import express from 'express';
import * as reviewController from '@controllers/review.controller';

const router = express.Router();

router.post('/', reviewController.createReview);
router.get('/', reviewController.getAllReviews);
router.get('/:id', reviewController.getReview);
router.get('/user/:userId', reviewController.getUserReviews);
router.get('/content/:contentId', reviewController.getContentReviews);
router.patch('/:id', reviewController.updateReview);
router.delete('/:id', reviewController.deleteReview);

export default router;