import { checkEmailExits, createUser } from "../services/authServices.js"

export const getRegistrationPage = async(req, res) => {
    res.render('auth/register')
}
export const getLoginPage = async(req, res) => {
    // const isLoggedIn = req.cookies.isLoggedIn
    // console.log(isLoggedIn)
    res.render('auth/login')
}
export const postLogin = async(req, res) => {
    // res.cookie('isLoggedIn', true)
    res.redirect("/")
}
export const getRegisterPage = async(req, res) => {
    // const isLoggedIn = req.cookies.isLoggedIn
    // console.log(isLoggedIn)
    res.render('auth/register')
}
export const postRegister = async(req, res) => {
    // res.cookie('isLoggedIn', true)

    const {name, email, password} = req.body;

    const userExits = await checkEmailExits(email)

    if(userExits) return res.redirect("/register")

    const register = await createUser({name, email, password})
    res.redirect("/login")
}