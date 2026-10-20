import {
  refreshTokens,
  verifyToken,
} from "../services/authServices.js";

export const verfiyAuthentication = async (req, res, next) => {
  const accessToken = req.cookies.access_token;
  const refreshToken = req.cookies.refresh_token;

  req.user = null;

  if (!accessToken && !refreshToken) {
    return next();
  }

  if (accessToken) {
    const decodedToken = verifyToken(accessToken);
    req.user = decodedToken;
    return next();
  }

  if (refreshToken) {
    try {
      const { accessToken, refreshToken, user } =
        await refreshTokens(refreshToken);
      console.log("user: ", user);
      req.user = user;

      const baseConfig = { httpOnly: true, secure: true };

      res.cookie("access_token", accessToken, {
        ...baseConfig,
        maxAge: 15 * 60 * 1000,
      });
      res.cookie("refresh_token", refreshToken, {
        ...baseConfig,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return next();
    } catch (error) {
      console.log(error);
    }
  }

  return next();
};
