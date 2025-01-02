import express from "express";
import { updateUser } from "../controllers/user.controllers.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/update-user/:id", verifyToken, updateUser);

router.delete("/delete-user/:id");

router.get("/listings/:id");

router.get("/:id");

export default router;
