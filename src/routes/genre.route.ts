import { Router } from 'express';
import * as genreController from "@controllers/genre.controller"

const router = Router();

router.post('/', genreController.createGenre);
router.get('/list', genreController.getAllGenres);
router.get('/:id', genreController.getGenreById);
router.get('/slug/:slug', genreController.getGenreBySlug);
router.patch('/:id', genreController.updateGenre);
router.delete('/:id', genreController.deleteGenre);


export default router;