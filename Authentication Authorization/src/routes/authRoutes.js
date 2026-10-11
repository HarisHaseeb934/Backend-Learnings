import { Router } from 'express'
import { getLoginPage, getRegistrationPage, postLogin, postRegister } from '../controllers/authControllers.js'

const router = Router()

router.get('/register', getRegistrationPage)
router.post('/register', postRegister)

router.get('/login', getLoginPage)
router.post("/login", postLogin)

export default router