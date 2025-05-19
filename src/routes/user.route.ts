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
router.put('/auth/update-password', middleware.authUser, userController.updatePassword);

// Avatar
router.post('/avatar/upload', middleware.authUser, upload.single('image'), imgurController.uploadAvatar)
router.delete('/avatar/delete', middleware.authUser, imgurController.deleteAvatar)

// History
router.post('/history/create', historyController.createHistory);
router.get('/history/:userId/media/:mediaId', historyController.getHistoryEntry);
router.get('/history/:userId', historyController.getUserHistory);
router.get('/history/media/:mediaId', historyController.getMediaHistory);
router.patch('/history/:userId/media/:mediaId', historyController.updateHistory);
router.delete('/history/:userId/media/:mediaId', historyController.deleteHistory);

// Favorite
router.post('/favorite/create', favoriteController.createFavorite);
router.get('/favorite/:userId/content/:contentId', favoriteController.getFavorite);
router.get('/favorite/:userId', favoriteController.getUserFavorites);
router.get('/favorite/content/:contentId', favoriteController.getContentFavorites);
router.delete('/favorite/:userId/content/:contentId', favoriteController.deleteFavorite);

export default router;
