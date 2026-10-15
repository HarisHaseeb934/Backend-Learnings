import { verifyToken } from "../services/authServices.js";

export const verfiyAuthentication = (req, res, next) => {
  const token = req.cookies.access_token;
  console.log(token)
  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decodedToken = verifyToken(token);
    req.user = decodedToken;
    console.log(req.user)
    return next();
  } catch (error) {
    req.user = null;
    return next();
  }
};
