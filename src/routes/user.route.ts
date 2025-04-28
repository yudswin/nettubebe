import { Router } from 'express';
import * as userController from "@controllers/user.controller"
import * as imgurController from "@controllers/imgur.controller"
import * as historyController from "@controllers/history.controller"
import * as favoriteController from "@controllers/favorite.controller"
import * as middleware from "@middleware/auth"
import multer from 'multer';


const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.put('/update/:id', userController.updateUser);
router.delete('/delete/:id', userController.deleteUser);
router.post('/auth/register', userController.createUser);
router.post('/auth/login', userController.login);
router.get('/getAll', middleware.authDev, userController.getUsers);
router.get('/me', middleware.authUser, userController.getSelf);

// Avatar
router.post('/avatar/upload', middleware.authUser, upload.single('image'), imgurController.uploadAvatar)
router.delete('/avatar/delete', middleware.authUser, imgurController.deleteAvatar)

// History
router.post('/history', historyController.createHistory);
router.get('/:userId/media/:mediaId', historyController.getHistoryEntry);
router.get('/:userId', historyController.getUserHistory);
router.get('/media/:mediaId', historyController.getMediaHistory);
router.patch('/:userId/media/:mediaId', historyController.updateHistory);
router.delete('/:userId/media/:mediaId', historyController.deleteHistory);

// Favorite
router.post('/favorite', favoriteController.createFavorite);
router.get('/:userId/content/:contentId', favoriteController.getFavorite);
router.get('/:userId', favoriteController.getUserFavorites);
router.get('/content/:contentId', favoriteController.getContentFavorites);
router.delete('/:userId/content/:contentId', favoriteController.deleteFavorite);

export default router;
