import { Router } from 'express';
import * as userController from "@controllers/user.controller"

const router = Router();

router.post('/create', userController.createUser);
router.get('/getAll', userController.getUsers);
router.put('/update/:id', userController.updateUser);
router.delete('/delete/:id', userController.deleteUser);

export default router;