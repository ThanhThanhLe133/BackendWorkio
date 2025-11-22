import * as controllers from '../../controllers/index.js';
import express from 'express';
import { verifyTokenAdmin } from '../../middleWares/verify_token.js';

const router = express.Router();

router.use(verifyTokenAdmin);

router.post('/', controllers.createEducationCenter);
router.get('/', controllers.getAllEducationCenters);
router.get('/:id', controllers.getEducationCenterById);
router.put('/:id', controllers.updateEducationCenter);
router.delete('/:id', controllers.deleteEducationCenter);

export default router;
