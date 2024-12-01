import express from "express";

const router = express.Router();

router.post("/update-user/:id");
router.delete("/delete-user/:id");
router.get("/listings/:id");
router.get("/:id");

export default router;
