import { Router } from 'express'
import { getChangePasswordPage, getEditProfile, getEditProfilePage, getLoginPage, getMe, getProfilePage, getRegistrationPage, getVerifyEmailPage, logout, postChangePassword, postLogin, postRegister, resendVerificationLink, verifyEmailToken } from '../controllers/authControllers.js'

const router = Router()

router.get('/register', getRegistrationPage)
router.post('/register', postRegister)

router.get('/login', getLoginPage)
router.post("/login", postLogin)

router.get("/logout", logout)

router.route("/me").get(getMe)

router.route("/profile").get(getProfilePage)

router.route("/resend-verification").get(getVerifyEmailPage)

router.route('/resend-verification-link').post(resendVerificationLink)

router.route('/verify-email-token').get(verifyEmailToken)

router.route('/edit-profile').get(getEditProfilePage).post(getEditProfile)

router.route('/change-password').get(getChangePasswordPage).post(postChangePassword)

export default router