import { Router } from 'express'
import { getLoginPage, getMe, getRegistrationPage, logout, postLogin, postRegister } from '../controllers/authControllers.js'

const router = Router()

router.get('/register', getRegistrationPage)
router.post('/register', postRegister)

router.get('/login', getLoginPage)
router.post("/login", postLogin)

router.get("/logout", logout)

router.route("/me").get(getMe)

export default router