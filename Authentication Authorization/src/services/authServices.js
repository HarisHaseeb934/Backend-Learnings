import { User } from "../models/User.js";
import argon2 from "argon2";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { UrlShortener } from "../models/URLShortener.js";
import { Session } from "../models/Session.js";
import { EmailVerificationToken } from "../models/EmailVerificationToken.js";
import mongoose from "mongoose";
import { PasswordResetToken } from "../models/PasswordResetToken.js";

export const checkEmailExits = async (email) => {
  return await User.findOne({ email: email });
};

export const createUser = async ({ name, email, password }) => {
  return await User.create({ name: name, email: email, password: password });
};

export const hashPasswordGen = async (password) => {
  return await argon2.hash(password);
};

export const comparePassword = async (hashPassword, password) => {
  return argon2.verify(hashPassword, password);
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
};
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

export const deleteLinkFromUser = async (id) => {
  return await UrlShortener.findByIdAndDelete(id);
};

export const createSession = async (session) => {
  return await Session.create(session);
};

export const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRY,
  });
};

export const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRY,
  });
};

export const refreshTokens = async (refreshToken) => {
  try {
    const decoded = verifyRefreshToken(refreshToken);
    const session = await Session.findById(decoded.sessionId);

    if (!session || !session.isValid) {
      throw new Error("invalid Session", 404);
    }

    const user = await User.findById(session.user);

    if (!user) throw new Error("invalid User");

    const userInfo = {
      id: user._id,
      name: user.name,
      email: user.email,
      isEmailValid: user.isEmailVerified,
      session: session._id,
    };

    const access_Token = createAccessToken(userInfo);
    const refresh_Token = createRefreshToken({ sessionId: session._id });

    session.refreshToken = refresh_Token;
    await session.save();

    return {
      access_Token,
      refresh_Token,
      user: userInfo,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const clearSession = async (session) => {
  return await Session.findByIdAndDelete(session);
};

export const generateRandomToken = (digit = 8) => {
  const min = 10 ** (digit - 1);
  const max = 10 ** digit;

  return crypto.randomInt(min, max).toString();
};

export const insertEmailVerfi = async (data) => {
  const session = await mongoose.startSession();
  try {
    return await session.withTransaction(async () => {
      await EmailVerificationToken.deleteMany({ user: data.user });
      return await EmailVerificationToken.create([data], {
        session,
      });
    });
  } catch (error) {
    console.error("Transaction failed and was fully rolled back:", error);
    throw error;
  } finally {
    session.endSession();
  }
};

export const createVerifyEmailLink = ({ email, token }) => {
  const url = new URL(`${process.env.FORNTEND_URL}/verify-email-token`);
  url.searchParams.append("token", token);
  url.searchParams.append("email", email);

  return url.toString();
};

export const findVerificationEmailToken = async ({ token, email }) => {
  const tokenObj = await EmailVerificationToken.findOne({ token }).populate(
    "user",
  );
  // if (!tokenObj) return null;

  // const user = await User.findById(tokenObj.user)

  if (!tokenObj || !tokenObj.user) return null;
  console.log(tokenObj);
  return {
    userId: tokenObj.user._id,
    email: tokenObj.user.email,
    token: tokenObj.token,
  };
};

export const verifyUserEmailAndUpdate = async (userId) => {
  return await User.findByIdAndUpdate(
    userId,
    { $set: { isEmailVerified: true } },
    { new: true, runValidators: true },
  );
};

export const clearVerifyEmailToken = async (userId) => {
  return await EmailVerificationToken.deleteMany({ user: userId });
};

export const insertResetToken = async (data) => {
  const session = await mongoose.startSession();
  try {
    return await session.withTransaction(async () => {
      await PasswordResetToken.deleteMany({ user: data.user });
      const prt = new PasswordResetToken(data);
      return await prt.save({ session });
    });
  } catch (error) {
    throw error;
  } finally {
    session.endSession();
  }
};

export const createResetPasswordLink = async (id) => {
  const randomToken = crypto.randomBytes(32).toString("hex");
  const hashToken = crypto
    .createHash("sha256")
    .update(randomToken)
    .digest("hex");
  const insertToken = await insertResetToken({ user: id, token: hashToken });
  return `${process.env.FORNTEND_URL}/reset-password/${insertToken.token}`;
};
