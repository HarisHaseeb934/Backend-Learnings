import { User } from "../models/User.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

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

export const genrateToken = (_id, name, email) => {
  return jwt.sign({ _id, name, email }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET_KEY);
};
