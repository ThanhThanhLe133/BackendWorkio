import * as controllers from '../../controllers/index.js'
import express from 'express'
import { verifyTokenAdmin } from "../../middleWares/verify_token.js";

const router = express.Router()

router.use(verifyTokenAdmin)

router.get('/profile', controllers.getAdminProfile)
router.put('/profile/edit', controllers.updateAdminProfile)

export default router