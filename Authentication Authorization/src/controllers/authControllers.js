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
  createResetPasswordLink,
  createSession,
  createUser,
  createUserWithOauth,
  createVerifyEmailLink,
  findVerificationEmailToken,
  generateRandomToken,
  getUserWithOAuthId,
  insertEmailVerfi,
  linkUserWithOAuth,
  refreshTokens,
  verifyUserEmailAndUpdate,
} from "../services/authServices.js";
import {
  editProfileSchema,
  emailSchema,
  loginUserSchema,
  registerUserSchema,
  verifyChangePassword,
  verifyEmail,
  verifyPasswords,
} from "../validators/userValidationSchema.js";
import mjml2html from "mjml";
import AppError from "../utilis/AppError.js";
import z from "zod";
import crypto from "crypto";
import { PasswordResetToken } from "../models/PasswordResetToken.js";
import {
  GOOGLE_REDIRECT_URI,
  OAUTH_EXCHANGE_EXPIRY,
} from "../constants/oauthConstant.js";

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
  if (!userExists.password) {
    req.flash("error", "Login with Social Account");
    return res.redirect("/login");
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

export const getChangePasswordPage = (req, res, next) => {
  if (!req.user) return res.redirect("/");
  res.render("auth/changePassword", {
    errors: req.flash("errors"),
    singleError: req.flash("singleError"),
  });
};

export const postChangePassword = async (req, res, next) => {
  const result = verifyPasswords.safeParse(req.body);
  if (!result.success) {
    // const errorObject = result.error.flatten().fieldErrors;
    const errorObject = z.flattenError(result.error);
    req.flash("errors", Object.entries(errorObject.fieldErrors));
    return res.redirect("/change-password");
  }
  const user = await User.findById(req.user.id);
  if (!user) {
    req.flash("errors", "Users id not Exists");
    res.redirect("/");
  }
  const isMatch = await user.comparePassword(result.data.currentPassword);
  console.log(isMatch);
  if (!isMatch) {
    req.flash("singleError", "Enter Correct Password");
    return res.redirect("/change-password");
  }
  user.password = result.data.newPassword;
  await user.save();
  res.redirect("/profile");
};
export const getResetPasswordPage = (req, res) => {
  res.render("auth/resetPassword", {
    errors: req.flash("errors"),
    formSubmitted: req.flash("formSubmitted")[0],
  });
};

export const postResetPassword = async (req, res) => {
  const result = emailSchema.safeParse(req.body);
  if (!result.success) {
    const error = z.flattenError(result.error);
    req.flash("errors", error.fieldErrors);
    return res.redirect("/reset-password");
  }
  const user = await User.findOne({ email: result.data.registerEmail }).lean();
  if (!user) {
    req.flash("formSubmitted", true);
    return res.redirect("/reset-password");
  }
  const resetPasswordLink = await createResetPasswordLink(user._id);
  const mjmlTemplate = await fs.readFile(
    path.join(import.meta.dirname, "..", "email", "password-reset-email.mjml"),
    "utf-8",
  );
  const injectedEjs = ejs.render(mjmlTemplate, {
    username: user.name,
    link: resetPasswordLink,
  });
  const { html, error } = await mjml2html(injectedEjs);
  await sendMail({ to: user.email, subject: "Reset Password", html });
  req.flash("formSubmitted", true);
  return res.redirect("/reset-password");
};

export const getResetPasswordTokenPage = async (req, res) => {
  const { token } = req.params;
  const hashToken = crypto.createHash("sha256").update(token).digest("hex");
  const isTokenExist = await PasswordResetToken.findOne({ token: hashToken });
  if (!isTokenExist) {
    return res.render("auth/invalid-password");
  }
  return res.render("auth/reset-password", {
    errors: req.flash("errors"),
    singleError: req.flash("singleError"),
    token,
  });
};

export const postResetPasswordTokenPage = async (req, res) => {
  const { token } = req.params;
  const hashToken = crypto.createHash("sha256").update(token).digest("hex");
  const isTokenExist = await PasswordResetToken.findOne({ token: hashToken });
  if (!isTokenExist) {
    return res.render("auth/invalid-password");
  }
  const result = verifyChangePassword.safeParse(req.body);
  if (!result.success) {
    const error = z.flattenError(result.error);
    req.flash("errors", Object.entries(error.fieldErrors));
    return res.redirect(`/reset-password/${token}`);
  }
  const user = await User.findById(isTokenExist.user);
  if (!user) {
    req.flash("errors", "User not Exists");
    return res.redirect("/register");
  }
  user.password = result.data.newPassword;
  await user.save();
  await PasswordResetToken.deleteMany({ user: user._id });
  res.redirect("/");
};

export const getGoogleLoginPage = async (req, res) => {
  if (req.user) return res.redirect("/");

  const state = crypto.randomBytes(32).toString("hex");
  const rootURL = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: GOOGLE_REDIRECT_URI,
    client_id: process.env.GOOGLE_CLIENT_ID,
    response_type: "code",
    scope: ["openid", "profile", "email"].join(" "),
    state,
    prompt: "consent",
  };

  const qs = new URLSearchParams(options);

  const cookieConfig = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: OAUTH_EXCHANGE_EXPIRY,
    sameSite: "lax",
  };

  res.cookie("google_oauth_state", state, cookieConfig);
  res.redirect(`${rootURL}?${qs.toString()}`);
};

export const getGoogleCallback = async (req, res) => {
  const { code, state } = req.query;
  const storedState = req.cookies.google_auth_state;

  if (!state || !code || !storedState || state !== storedState) {
    req.flash("erros", "Invalid Google login attempt. Please try again!");
    return res.redirect("/login");
  }

  let user;

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        redirect_uri: GOOGLE_REDIRECT_URI,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        grant_type: "authorization_code",
      }),
    });

    const token = await tokenRes.json();
    if (!token || !token.access_token) {
      throw new Error("Failed to fetch tokens from Google");
    }

    const userRes = await fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json`,
      {
        headers: { Authorization: `Bearer ${token.access_token}` },
      },
    );

    const googleUser = await userRes.json();
    const { id: googleUserId, name, email, picture } = googleUser;
    user = await getUserWithOAuthId("google", email);

    if (user) {
      if (!user.providerAccountId) {
        await linkUserWithOAuth({
          user: user.id,
          provider: "google",
          providerAccountId: googleUserId,
        });
      }
    } else {
      user = await createUserWithOauth({
        name,
        email,
        provider: "google",
        isEmailVerified: true,
        providerAccountId: googleUserId,
      });
    }
  } catch (error) {
    console.log(error.message);
    req.flash("errors", "Authentication failed. Please try again.");
    return res.redirect("/login");
  }

  const session = await createSession({
    user: user.id,
    refreshToken: "temp",
    userAgent: req.header("user-agent"),
    ipAddress: req.ip,
  });
  const accessToken = createAccessToken({
    id: user.id,
    name: user.name,
    email: user.email,
    isEmailValid: user.isEmailVerified,
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
