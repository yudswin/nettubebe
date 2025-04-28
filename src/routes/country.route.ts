import { Router } from 'express';
import * as countryController from "@controllers/country.controller"

const router = Router();

router.post('/', countryController.createCountry);
router.get('/list', countryController.getAllCountries);
router.get('/:id', countryController.getCountryById);
router.get('/code/:code', countryController.getCountryByCode);
router.get('/slug/:slug', countryController.getCountryBySlug);
router.patch('/:id', countryController.updateCountry);
router.delete('/:id', countryController.deleteCountry);


export default router;