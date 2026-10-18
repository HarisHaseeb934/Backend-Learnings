import { User } from "../models/User.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { UrlShortener } from "../models/URLShortener.js";
import { Session } from "../models/Session.js";

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
      session: session._id,
    };

    const accessToken = createAccessToken(userInfo);
    const refreshToken = createRefreshToken({ sessionId: session._id });

    session.refreshToken = refreshToken;
    await session.save();

    return {
      accessToken,
      refreshToken,
      user: userInfo
    }
  } catch (error) {
    console.log(error);
  }
};
