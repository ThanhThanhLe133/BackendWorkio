import * as controllers from '../../controllers/index.js'
import express from 'express'

const router = express.Router()
router.post('/create-admin', controllers.accountAdmin)

export default router; 