import mongoose from "mongoose";
import Listing from "../models/listing.model.js";
import { responseHandler } from "../utils/response.js";

export const createListing = async (req, res, next) => {
  try {
    // Validate required fields explicitly if not handled adequately in the model
    const requiredFields = [
      "title",
      "description",
      "address",
      "regularPrice",
      "discountPrice",
      "bathrooms",
      "bedrooms",
      "furnished",
      "parking",
      "propertyType",
      "transactionType",
      "offer",
      "imageUrls",
    ];

    for (const field of requiredFields) {
      if (req.body[field] === undefined) {
        return next(
          responseHandler(
            400,
            false,
            `${field} is required in the request body.`
          )
        );
      }
    }

    const {
      title,
      description,
      address,
      regularPrice,
      discountPrice,
      bathrooms,
      bedrooms,
      furnished,
      parking,
      propertyType,
      transactionType,
      offer,
      imageUrls,
    } = req.body;

    const allowedPropertyTypes = [
      "apartment",
      "house",
      "studio",
      "condo",
      "villa",
      "duplex",
      "townhouse",
    ];
    const allowedTransactionTypes = [
      "sale",
      "rent",
      "lease",
      "short-term",
      "long-term",
    ];

    // Validate propertyType
    if (!propertyType || !allowedPropertyTypes.includes(propertyType)) {
      return next(responseHandler(400, false, "Invalid property type."));
    }

    // Validate transactionType
    if (
      !transactionType ||
      !allowedTransactionTypes.includes(transactionType)
    ) {
      return next(responseHandler(400, false, "Invalid transaction type."));
    }

    // Validate discount price logic
    if (discountPrice >= regularPrice) {
      return next(
        responseHandler(
          400,
          false,
          "Discount price must be less than the regular price."
        )
      );
    }

    const listing = await Listing.create({
      title,
      description,
      address,
      regularPrice,
      discountPrice,
      bathrooms,
      bedrooms,
      furnished,
      parking,
      propertyType,
      transactionType,
      offer,
      imageUrls,
      userRef: req.user.id, // Attach user ID from authenticated request
    });

    res
      .status(201)
      .json(
        responseHandler(201, true, "Listing created successfully!", 1, listing)
      );
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      next(
        responseHandler(400, false, "Validation error.", 0, {
          errors: error.errors,
        })
      );
    } else {
      next(error);
    }
  }
};

export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(responseHandler(404, false, "Listing not found!"));
    }

    // Ensure the user deleting the listing is the owner
    if (req.user.id !== listing.userRef.toString()) {
      return next(
        responseHandler(401, false, "You can only delete your own listings!")
      );
    }

    await Listing.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .json(
        responseHandler(200, true, "Listing has been deleted successfully!")
      );
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(responseHandler(400, false, "Invalid listing ID format."));
    }
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(responseHandler(404, false, "Listing not found!"));
    }

    if (req.user.id !== listing.userRef.toString()) {
      return next(
        responseHandler(401, false, "You can only update your own listings!")
      );
    }

    // Exclude critical fields from updates
    const { userRef, _id, ...updateFields } = req.body;

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true } // Ensures updates follow schema validation
    );

    return res
      .status(200)
      .json(
        responseHandler(
          200,
          true,
          "Listing updated successfully!",
          1,
          updatedListing
        )
      );
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return next(
        responseHandler(400, false, "Validation error.", 0, {
          errors: error.errors,
        })
      );
    }
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(responseHandler(404, false, "Listing not found!"));
    }

    res
      .status(200)
      .json(
        responseHandler(
          200,
          true,
          "Listing retrieved successfully!",
          1,
          listing
        )
      );
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(responseHandler(400, false, "Invalid listing ID format."));
    }
    next(error);
  }
};

// export const getListings = async (req, res, next) => {
//   try {
//     const limit = Math.max(1, parseInt(req.query.limit) || 9); // Default to 9, min 1
//     const startIndex = Math.max(0, parseInt(req.query.startIndex) || 0); // Default to 0, min 0

//     const query = {
//       name: {
//         $regex: req.query.searchTerm || "",
//         $options: "i",
//       },
//       ...(req.query.offer
//         ? {
//             offer: req.query.offer === "true",
//           }
//         : {}),
//       ...(req.query.furnished
//         ? {
//             furnished: req.query.furnished === "true",
//           }
//         : {}),
//       ...(req.query.parking
//         ? {
//             parking: req.query.parking === "true",
//           }
//         : {}),
//       ...(req.query.transactionType && req.query.transactionType !== "all"
//         ? { transactionType: req.query.transactionType }
//         : {
//             transactionType: {
//               $in: ["sale", "rent", "lease", "short-term", "long-term"],
//             },
//           }),
//       ...(req.query.propertyType && req.query.propertyType !== "all"
//         ? { propertyType: req.query.propertyType }
//         : {
//             propertyType: {
//               $in: [
//                 "apartment",
//                 "house",
//                 "studio",
//                 "condo",
//                 "villa",
//                 "duplex",
//                 "townhouse",
//               ],
//             },
//           }),
//     };

//     const sortField = req.query.sort || "createdAt";
//     const sortOrder = req.query.order === "asc" ? 1 : -1;

//     const [listings, totalCount] = await Promise.all([
//       Listing.find(query)
//         .sort({ [sortField]: sortOrder })
//         .limit(limit)
//         .skip(startIndex),
//       Listing.countDocuments(query),
//     ]);

//     res
//       .status(200)
//       .json(
//         responseHandler(
//           200,
//           true,
//           "Listings retrieved successfully!",
//           totalCount,
//           listings
//         )
//       );
//   } catch (error) {
//     if (error instanceof mongoose.Error.CastError) {
//       return next(
//         responseHandler(400, false, "Invalid query parameter format.")
//       );
//     }
//     next(error);
//   }
// };

export const getListings = async (req, res, next) => {
  try {
    const limit = Math.max(1, parseInt(req.query.limit) || 9); // Default to 9, min 1
    const startIndex = Math.max(0, parseInt(req.query.startIndex) || 0); // Default to 0, min 0

    // Build the query object dynamically
    const query = {
      name: {
        $regex: req.query.searchTerm || "",
        $options: "i",
      },
      ...(req.query.offer === "true" ? { offer: true } : {}),
      ...(req.query.furnished === "true" ? { furnished: true } : {}),
      ...(req.query.parking === "true" ? { parking: true } : {}),
      ...(req.query.transactionType && req.query.transactionType !== "all"
        ? { transactionType: req.query.transactionType }
        : {
            transactionType: {
              $in: ["sale", "rent", "lease", "short-term", "long-term"],
            },
          }),
      ...(req.query.propertyType && req.query.propertyType !== "all"
        ? { propertyType: req.query.propertyType }
        : {
            propertyType: {
              $in: [
                "apartment",
                "house",
                "studio",
                "condo",
                "villa",
                "duplex",
                "townhouse",
              ],
            },
          }),
    };

    // Sorting logic
    const sortField = req.query.sort || "createdAt";
    const sortOrder = req.query.order === "asc" ? 1 : -1;

    // Fetch listings and total count concurrently
    const [listings, totalCount] = await Promise.all([
      Listing.find(query)
        .sort({ [sortField]: sortOrder })
        .limit(limit)
        .skip(startIndex),
      Listing.countDocuments(query),
    ]);

    res
      .status(200)
      .json(
        responseHandler(
          200,
          true,
          "Listings retrieved successfully!",
          totalCount,
          listings
        )
      );
  } catch (error) {
    // Handle specific MongoDB errors
    if (error instanceof mongoose.Error.CastError) {
      return next(
        responseHandler(400, false, "Invalid query parameter format.")
      );
    }
    // Pass other errors to the global error handler
    next(error);
  }
};

export const getAllListings = async (req, res, next) => {
  try {
    const limit = Math.max(1, parseInt(req.query.limit) || 9);
    const startIndex = Math.max(0, parseInt(req.query.startIndex) || 0);

    const sortField = req.query.sort || "createdAt";
    const sortOrder = req.query.order === "asc" ? 1 : -1;

    const [listings, totalCount] = await Promise.all([
      Listing.find()
        .sort({ [sortField]: sortOrder })
        .limit(limit)
        .skip(startIndex),
      Listing.countDocuments(),
    ]);

    res
      .status(200)
      .json(
        responseHandler(
          200,
          true,
          "All listings retrieved successfully!",
          totalCount,
          listings
        )
      );
  } catch (error) {
    next(responseHandler(500, false, error.message));
  }
};

export const getSaleListings = async (req, res, next) => {
  try {
    const limit = Math.max(1, parseInt(req.query.limit) || 9);
    const startIndex = Math.max(0, parseInt(req.query.startIndex) || 0);

    //const query = { transactionType: "sale" };

    const query = {
      transactionType: "sale",
      ...(req.query.offer === "true" && { offer: true }),
      ...(req.query.furnished === "true" && { furnished: true }),
      ...(req.query.parking === "true" && { parking: true }),
      ...(req.query.propertyType && { propertyType: req.query.propertyType }),
      ...(req.query.searchTerm && {
        name: { $regex: req.query.searchTerm, $options: "i" },
      }),
    };

    const sortField = req.query.sort || "createdAt";
    const sortOrder = req.query.order === "asc" ? 1 : -1;

    const [listings, totalCount] = await Promise.all([
      Listing.find(query)
        .sort({ [sortField]: sortOrder })
        .limit(limit)
        .skip(startIndex),
      Listing.countDocuments(query),
    ]);

    res
      .status(200)
      .json(
        responseHandler(
          200,
          true,
          "Sale listings retrieved successfully!",
          totalCount,
          listings
        )
      );
  } catch (error) {
    next(responseHandler(500, false, error.message));
  }
};
