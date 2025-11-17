import * as controllers from '../../controllers/index.js'
import express from 'express'
import { verifyToken } from "../../middleWares/verify_token.js";
import multer from 'multer'

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) return cb(null, true);
        cb(new Error('Only image files are allowed'));
    },
});

const router = express.Router()

router.use(verifyToken);
router.put('/', controllers.updateCandidateProfile)
router.put('/avatar', upload.single('avatar'), controllers.updateCandidateAvatar)

export default router;
