import { Router } from "express";
import {
  getChangePasswordPage,
  getEditProfile,
  getEditProfilePage,
  getGithubCallback,
  getGithubLoginPage,
  getGoogleCallback,
  getGoogleLoginPage,
  getLoginPage,
  getMe,
  getProfilePage,
  getRegistrationPage,
  getResetPasswordPage,
  getResetPasswordTokenPage,
  getSetPasswordPage,
  getVerifyEmailPage,
  logout,
  postChangePassword,
  postLogin,
  postRegister,
  postResetPassword,
  postResetPasswordTokenPage,
  postSetPasswordPage,
  resendVerificationLink,
  verifyEmailToken,
} from "../controllers/authControllers.js";
import multer from "multer";
import path from "path";
import AppError from "../utilis/AppError.js";

const router = Router();

const uploadPath = path.join(import.meta.dirname, '..', 'public', 'uploads')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.random();
    cb(
      null,
      file.fieldname + "-" + unique + path.extname(file.originalname),
    );
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname.toLowerCase()),
  );
  const mimetyoe = allowedTypes.test(file.mimetype);
  if (extname && mimetyoe) {
    cb(null, true);
  } else {
    cd(new AppError("Invalid File Extension", 404), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.get("/register", getRegistrationPage);
router.post("/register", postRegister);

router.get("/login", getLoginPage);
router.post("/login", postLogin);

router.get("/logout", logout);

router.route("/me").get(getMe);

router.route("/profile").get(getProfilePage);

router.route("/resend-verification").get(getVerifyEmailPage);

router.route("/resend-verification-link").post(resendVerificationLink);

router.route("/verify-email-token").get(verifyEmailToken);

router.route("/edit-profile").get(getEditProfilePage).post(upload.single('avatar') ,getEditProfile);

router
  .route("/change-password")
  .get(getChangePasswordPage)
  .post(postChangePassword);

router
  .route("/reset-password")
  .get(getResetPasswordPage)
  .post(postResetPassword);

router
  .route("/reset-password/:token")
  .get(getResetPasswordTokenPage)
  .post(postResetPasswordTokenPage);

router.route("/google").get(getGoogleLoginPage);

router.route("/google/callback").get(getGoogleCallback);

router.route("/github").get(getGithubLoginPage);

router.route("/github/callback").get(getGithubCallback);

router.route("/set-password").get(getSetPasswordPage).post(postSetPasswordPage);

export default router;
