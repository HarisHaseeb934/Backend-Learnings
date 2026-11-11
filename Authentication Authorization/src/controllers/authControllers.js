// import { sendMail } from "../lib/nodeMail.js";
import { sendMail } from "../lib/resendMail.js";
import { UrlShortener } from "../models/URLShortener.js";
import { User } from "../models/User.js";
import fs from "fs/promises";
import path from "path";
import ejs from "ejs";
import {
  checkEmailExits,
  clearSession,
  clearVerifyEmailToken,
  createAccessToken,
  createRefreshToken,
  createSession,
  createUser,
  createVerifyEmailLink,
  findVerificationEmailToken,
  generateRandomToken,
  insertEmailVerfi,
  verifyUserEmailAndUpdate,
} from "../services/authServices.js";
import {
  editProfileSchema,
  loginUserSchema,
  registerUserSchema,
  verifyEmail,
} from "../validators/userValidationSchema.js";
import mjml2html from "mjml";
import AppError from "../utilis/AppError.js";

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
    isEmailValid: userExists.isEmailVerified,
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

  const session = await createSession({
    user: register._id,
    refreshToken: "temp",
    userAgent: req.header("user-agent"),
    ipAddress: req.ip,
  });

  const accessToken = createAccessToken({
    id: register._id,
    name: register.name,
    email: register.email,
    isEmailValid: register.isEmailVerified,
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

export const getMe = (req, res) => {
  if (!req.user) return next(new Error("User not logged IN", 404));
  return res.send(`<h1>${req.user.name} - ${req.user.email}</h1>`);
};

export const logout = async (req, res) => {
  await clearSession(req.user.sessionId);

  res.clearCookie("access_token");
  res.clearCookie("refresh_token");

  return res.redirect("/login");
};

export const getProfilePage = async (req, res) => {
  if (!req.user) res.redirect("/login");

  const user = await User.findById(req.user.id);
  if (!user) res.redirect("/login");

  const shortLinks = await UrlShortener.find({ user: user._id });

  res.render("auth/profile", {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      isEmailValid: user.isEmailVerified,
      shortLinks: shortLinks,
      createdAt: user.createdAt,
    },
  });
};

export const getVerifyEmailPage = (req, res) => {
  if (!req.user) return res.redirect("/");
  res.render("auth/emailVerify", {
    email: req.user.email,
    isEmailValid: req.user.isEmailValid,
  });
};

export const resendVerificationLink = async (req, res) => {
  if (!req.user) return res.redirect("/");

  const randomToken = generateRandomToken();

  await insertEmailVerfi({
    user: req.user.id,
    token: randomToken,
  });

  const link = createVerifyEmailLink({
    email: req.user.email,
    token: randomToken,
  });

  const mjmlTemplate = await fs.readFile(
    path.join(import.meta.dirname, "..", "email", "verify-email.mjml"),
    "utf-8",
  );
  const ejsRender = ejs.render(mjmlTemplate, { token: randomToken, link });

  const { html } = await mjml2html(ejsRender);

  await sendMail({
    to: req.user.email,
    subject: "Verify Your Email",
    html,
  });

  res.redirect("/resend-verification");
};

export const verifyEmailToken = async (req, res) => {
  const result = verifyEmail.safeParse(req.query);
  if (!result.success) {
    const errorObject = result.error.flatten().fieldErrors;
    req.flash("error", errorObject);
    return res.redirect("/resend-verification");
  }

  const token = await findVerificationEmailToken(result.data);

  if (!token) return res.send("Verification link is invalid or expired");

  await verifyUserEmailAndUpdate(token.userId);

  await clearVerifyEmailToken(token.userId);

  res.redirect("/profile");
};

export const getEditProfilePage = (req, res, next) => {
  if (!req.user) return next(new AppError("user is not found", 400));
  console.log(req.user.name);
  res.render("auth/editProfile", {
    name: req.user.name,
    errors: req.flash("errors"),
  });
};

export const getEditProfile = async (req, res, next) => {
  const result = editProfileSchema.safeParse(req.body);
  if (!result.success) {
    const errorObject = result.error.flatten().fieldErrors;
    req.flash("errors", errorObject);
    console.log(errorObject);
    return res.redirect("/edit-profile");
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $set: { name: result.data.name } },
    { new: true, runValidators: true },
  );
  if (!user) return next(new AppError("Error Occurs", 404));
  res.redirect("/profile");
};
