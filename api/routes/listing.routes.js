import express from "express";

import { verifyToken } from "../utils/verifyUser.js";

import {
  createListing,
  deleteListing,
  getAllListings,
  getListing,
  getListings,
  getSaleListings,
  updateListing,
} from "../controllers/listing.controllers.js";

const router = express.Router();

router.post("/create-listing", verifyToken, createListing);

router.put("/update-listing/:id", verifyToken, updateListing);

router.delete("/delete-listing/:id", verifyToken, deleteListing);

router.get("/get-all-listings", getListings);

router.get("/get-listing/:id", getListing);

router.get("/all-listings", getAllListings);

router.get("/full-sale-listings", getSaleListings);

export default router;
