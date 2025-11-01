import * as controllers from '../../controllers/index.js'
import express from 'express'

const router = express.Router()
router.post('/create-candidate', controllers.createCandidate)
export default router; 