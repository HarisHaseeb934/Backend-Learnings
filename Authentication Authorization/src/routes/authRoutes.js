import { Router } from 'express'
import { getLoginPage, getMe, getProfilePage, getRegistrationPage, logout, postLogin, postRegister } from '../controllers/authControllers.js'

const router = Router()

router.get('/register', getRegistrationPage)
router.post('/register', postRegister)

router.get('/login', getLoginPage)
router.post("/login", postLogin)

router.get("/logout", logout)

router.route("/me").get(getMe)

router.route("/profile").get(getProfilePage)

export default router