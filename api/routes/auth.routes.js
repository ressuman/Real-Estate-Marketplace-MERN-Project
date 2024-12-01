import express from "express";

import {
  google,
  signin,
  signout,
  signup,
} from "../controllers/auth.controllers.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/signin", signin);

router.post("/google-auth", google);

router.get("/signout", signout);

export default router;