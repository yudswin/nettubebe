import { Router } from 'express';
import * as mediaController from "@controllers/media.controller"
import * as middleware from "@middleware/auth"
import multer from 'multer';

const router = Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1024 * 1024 * 500 // 500MB limit
    }
});
router.post('/upload/:contentId', upload.single('video'), mediaController.uploadVideo)
router.get('/:contentId', mediaController.getMediaByContent)
router.get('/record/:mediaId', middleware.authDev, mediaController.getVideoRecord)
router.put('/update/:mediaId', middleware.authDev, mediaController.updateRecord)
router.delete('/delete/:mediaId', middleware.authDev, mediaController.deleteMedia)


export default router;