import express from "express";

// Controllers
import {
  signIn,
  signUp,
  logout,
  update,
} from "../controllers/auth.controller.js";

// Middlewares
import { protectRoute } from "../middlewares/protectRoute.js";

const router = express.Router();

// Sing in
router.post("/sign-in", signIn);

// Sign up
router.post("/sign-up", signUp);

// Log out
router.post("/log-out", logout);

// Update
router.post("/update", protectRoute, update);

export default router;
