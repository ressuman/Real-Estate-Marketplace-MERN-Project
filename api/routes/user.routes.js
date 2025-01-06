import express from "express";

import {
  deleteUser,
  getUser,
  getUserListings,
  updateUser,
} from "../controllers/user.controllers.js";

import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/update-user/:id", verifyToken, updateUser);

router.delete("/delete-user/:id", verifyToken, deleteUser);

router.get("/listings/user-listings/:id", verifyToken, getUserListings);

router.get("current-user/:id", verifyToken, getUser);

export default router;
