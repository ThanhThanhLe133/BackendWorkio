import * as controllers from '../../controllers/index.js'
import express from 'express'

const router = express.Router()
router.post('/create-recruiter', controllers.createRecruiter)
export default router; 