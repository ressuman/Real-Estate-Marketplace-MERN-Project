import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Listing title is required."],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required."],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Address is required."],
      trim: true,
    },
    regularPrice: {
      type: Number,
      required: [true, "Regular price is required."],
      min: [0, "Regular price must be a positive number."],
    },
    discountPrice: {
      type: Number,
      required: [true, "Discount price is required."],
      min: [0, "Discount price must be a positive number."],
      validate: {
        validator: function (value) {
          // Ensure discountPrice is less than regularPrice if provided
          return !this.regularPrice || value < this.regularPrice;
        },
        message: "Discount price must be less than the regular price.",
      },
    },
    bathrooms: {
      type: Number,
      required: [true, "Number of bathrooms is required."],
      min: [0, "Bathrooms must be a positive number."],
    },
    bedrooms: {
      type: Number,
      required: [true, "Number of bedrooms is required."],
      min: [0, "Bedrooms must be a positive number."],
    },
    furnished: {
      type: Boolean,
      required: [true, "Furnished field is required."],
    },
    parking: {
      type: Boolean,
      required: [true, "Parking field is required."],
    },
    propertyType: {
      type: String,
      required: true,
      enum: [
        "apartment",
        "house",
        "studio",
        "condo",
        "villa",
        "duplex",
        "townhouse",
      ],
    },
    transactionType: {
      type: String,
      enum: ["rent", "sale", "lease", "short-term", "long-term"],
      required: [true, "Transaction type field is required."],
    },
    offer: {
      type: Boolean,
      required: [true, "Offer field is required."],
    },
    imageUrls: {
      type: [String],
      required: [true, "Image URLs are required."],
      validate: [
        {
          validator: (array) => array.length > 0,
          message: "At least one image URL is required.",
        },
        {
          validator: (urls) =>
            urls.every((url) => /^https?:\/\/.+\..+/.test(url)),
          message: "All image URLs must be valid URLs.",
        },
      ],
    },

    userRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required."],
    },
  },
  { timestamps: true }
);

// Add indexing for common query fields
listingSchema.index({ address: 1, type: 1, userRef: 1 });
listingSchema.index({ transactionType: 1, createdAt: -1 });
listingSchema.index({ offer: 1, createdAt: -1 });
listingSchema.index({ furnished: 1, createdAt: -1 });

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
