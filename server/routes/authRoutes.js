import express from "express";
import { body } from "express-validator";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("mobile")
      .isLength({ min: 7 })
      .withMessage("Valid mobile number is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  registerUser,
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  loginUser,
);

router.post("/logout", logoutUser);
router.get("/me", protect, getCurrentUser);

export default router;
