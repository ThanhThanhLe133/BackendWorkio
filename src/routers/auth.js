import * as controllers from '../controllers/index.js'
import express from 'express'

const router = express.Router()
router.post('/register', controllers.register)
router.post('/login', controllers.login)
router.post('/refresh-token', controllers.refreshTokenController)

export default router; 