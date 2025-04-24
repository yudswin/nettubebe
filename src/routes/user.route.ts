import { Router } from 'express';
import * as userController from "@controllers/user.controller"
import * as imgurController from "@controllers/imgur.controller"
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

router.post('/media/upload', middleware.authUser, upload.single('image'), imgurController.uploadAvatar)

export default router;