import {
  checkEmailExits,
  createAccessToken,
  createRefreshToken,
  createSession,
  createUser,
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
    const errorMessage = result.error.flatten().fieldErrors;
    req.flash("error", errorMessage);
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

  const session = await createSession({
    user: userExists._id,
    refreshToken: "temp",
    userAgent: req.header("user-agent"),
    ipAddress: req.ip,
  });

  const accessToken = createAccessToken({
    id: userExists._id,
    name: userExists.name,
    email: userExists.email,
    sessionId: session._id,
  });
  const refreshToken = createRefreshToken({ sessionId: session._id });

  session.refreshToken = refreshToken;
  await session.save();

  const baseConfig = { httpOnly: true, secure: true };

  res.cookie("access_token", accessToken, {
    ...baseConfig,
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refresh_token", refreshToken, {
    ...baseConfig,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.redirect("/");
};

export const getRegistrationPage = async (req, res) => {
  res.render("auth/register", { errors: req.flash("error") });
};

export const postRegister = async (req, res) => {
  const result = registerUserSchema.safeParse(req.body);
  if (!result.success) {
    const errorMessageObj = result.error.flatten().fieldErrors;
    console.log(errorMessageObj);
    req.flash("error", errorMessageObj);
    return res.redirect("/register");
  }

  const { name, email, password } = result.data;
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
