import { User } from "../models/User.js";
import {
  checkEmailExits,
//   comparePassword,
  createUser,
  genrateToken,
//   hashPasswordGen,
} from "../services/authServices.js";

export const getLoginPage = async (req, res) => {
    res.render("auth/login");
};

export const postLogin = async (req, res) => {
    const { email, password } = req.body;
    
    const userExists = await checkEmailExits(email);

    if (!userExists) return res.redirect("/register");
    
    //   const isCorrectPassword = comparePassword(userExists.password, password)
    const isCorrectPassword = userExists.comparePassword(password);
    
    if (!isCorrectPassword) return res.redirect("/login");

    const token = genrateToken(userExists.name, userExists.email)
    
    res.cookie('access_token', token);
    res.redirect("/");
};


export const getRegistrationPage = async (req, res) => {
  res.render("auth/register");
};

export const getRegisterPage = async (req, res) => {
  res.render("auth/register");
};
export const postRegister = async (req, res) => {
  const { name, email, password } = req.body;

  const userExits = await checkEmailExits(email);
  if (userExits) return res.redirect("/register");

  //   const hashPassword = await hashPasswordGen(password);

  const register = await createUser({ name, email, password });
  res.redirect("/login");
};
