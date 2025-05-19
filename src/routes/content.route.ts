import express from 'express';
import * as contentController from '@controllers/content.controller';
import * as contentGenreController from '@controllers/contentGenre.controller'
import * as contentCountryController from '@controllers/contentCountry.controller'

const router = express.Router();

router.post('/', contentController.createContent);
router.get('/list', contentController.getAllContents);
router.get('/:id', contentController.getContentById);
router.get('/slug/:slug', contentController.getContentBySlug);
router.patch('/:id', contentController.updateContent);
router.delete('/:id', contentController.deleteContent);

// Search
router.get('/v1/search', contentController.searchContents);

// Browse
router.get('/v1/browse', contentController.browseContents);


// Genres
router.post('/:contentId/genres', contentGenreController.addGenresToContent);
router.get('/:contentId/genres', contentGenreController.getGenresForContent);
router.delete('/:contentId/genres', contentGenreController.removeGenresFromContent);
router.put('/:contentId/genres', contentGenreController.setGenresForContent);

// Countries
router.post('/:contentId/countries', contentCountryController.addCountriesToContent);
router.get('/:contentId/countries', contentCountryController.getCountriesForContent);
router.delete('/:contentId/countries', contentCountryController.removeCountriesFromContent);
router.put('/:contentId/countries', contentCountryController.setCountriesForContent);


export default router;