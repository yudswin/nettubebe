import { Router } from 'express';
import * as personController from '@controllers/person.controller';
import * as personDepartmentController from '@controllers/personDepartment.controller'

const router = Router();

router.post('/', personController.createPerson);
router.get('/list', personController.getAllPersons);
router.get('/:id', personController.getPersonById);
router.get('/slug/:slug', personController.getPersonBySlug);
router.patch('/:id', personController.updatePerson);
router.delete('/:id', personController.deletePerson);

// Search
router.get('/v1/search', personController.searchPerson);

router.post('/:id/departments', personDepartmentController.addDepartmentsToPerson);
router.get('/:id/departments', personDepartmentController.getPersonDepartments);
router.delete('/:id/departments', personDepartmentController.removeDepartmentsFromPerson);
router.put('/:id/departments', personDepartmentController.setPersonDepartments);

export default router;