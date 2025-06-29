import { Router } from 'express';
import * as departmentController from "@controllers/department.controller"

const router = Router();

router.post('/', departmentController.createDepartment);
router.get('/list', departmentController.getAllDepartments);
router.get('/:id', departmentController.getDepartmentById);
router.get('/slug/:slug', departmentController.getDepartmentBySlug);
router.patch('/:id', departmentController.updateDepartment);
router.delete('/:id', departmentController.deleteDepartment);

router.get('/v1/search', departmentController.searchDepartment)

export default router;