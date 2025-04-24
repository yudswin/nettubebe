import { Router } from 'express';
import * as mediaController from "@controllers/media.controller"
// import * as middleware from "@middleware/auth"
import multer from 'multer';


const router = Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1024 * 1024 * 500 // 500MB limit
    }
});
router.post('/upload', upload.single('video'), mediaController.uploadVideo)


export default router;