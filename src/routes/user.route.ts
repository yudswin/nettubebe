import { Router } from 'express';
import * as userController from "@controllers/user.controller"
import * as middleware from "@middleware/auth"

const router = Router();

router.post('/create', userController.createUser);
router.put('/update/:id', userController.updateUser);
router.delete('/delete/:id', userController.deleteUser);

router.post('/auth/register', userController.createUser);
router.post('/auth/login', userController.login);
router.get('/getAll', middleware.authDev, userController.getUsers);
router.get('/me', middleware.authUser, userController.getSelf);


export default router;