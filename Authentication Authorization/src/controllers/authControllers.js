import {
  checkEmailExits,
  createUser,
  genrateToken,
} from "../services/authServices.js";
import {
  loginUserSchema,
  registerUserSchema,
} from "../validators/userValidationSchema.js";

export const getLoginPage = async (req, res) => {
  res.render("auth/login", { errors: req.flash("error") });
};

export const postLogin = async (req, res) => {
  const result = loginUserSchema.safeParse(req.body);

  if (!result.success) {
    // const errorMessage = result.error.issues[0].message;
    // const formattedErrors = result.error.format();
    // const fieldErrors = result.error.flatten().fieldErrors;
    console.log(formattedErrors);
    req.flash("error", formattedErrors);
    return res.redirect("/login");
  }
  const { email, password } = result.data;
  const userExists = await checkEmailExits(email);
  if (!userExists) {
    req.flash("error", "User Not Exists");
    return res.redirect("/register");
  }
  const isCorrectPassword = await userExists.comparePassword(password);
  if (!isCorrectPassword) {
    req.flash("error", "User or Password is invalid");
    return res.redirect("/login");
  }
  const token = genrateToken(userExists._id, userExists.name, userExists.email);
  res.cookie("access_token", token);
  res.redirect("/");
};

export const getRegistrationPage = async (req, res) => {
  res.render("auth/register", { errors: req.flash("error") });
};

export const postRegister = async (req, res) => {
  const { data, error } = registerUserSchema.safeParse(req.body);
  if (error) {
    res.flash("error", error.errors[0].message);
    res.redirect("/register");
  }
  const { name, email, password } = data;
  const userExits = await checkEmailExits(email);
  if (userExits) {
    req.flash("error", "User already exists");
    return res.redirect("/register");
  }
  const register = await createUser({ name, email, password });
  res.redirect("/login");
};

export const getMe = (req, res) => {
  if (!req.user) return next(new Error("User not logged IN", 404));
  return res.send(`<h1>${req.user.name} - ${req.user.email}</h1>`);
};

export const logout = (req, res) => {
  res.clearCookie("access_token");
  return res.redirect("/login");
};
