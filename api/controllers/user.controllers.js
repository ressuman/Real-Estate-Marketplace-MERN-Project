import cloudinary from "cloudinary";
import User from "../models/user.model.js";
import { responseHandler } from "../utils/response.js";
import bcrypt from "bcryptjs";

export const updateUser = async (req, res, next) => {
  try {
    // Check if the user is authorized to update the account
    // Ensure user is authorized to update this account
    if (req.user.id !== req.params.id) {
      return next(
        responseHandler(401, false, "You can only update your own account!")
      );
    }

    // Prepare update data
    const updateData = {};

    if (req.body.username) updateData.username = req.body.username;
    if (req.body.email) updateData.email = req.body.email;
    if (req.body.avatar) updateData.avatar = req.body.avatar;

    // Hash password only if it's provided and non-empty
    if (req.body.password) {
      updateData.password = bcrypt.hashSync(req.body.password, 10);
    }

    // Avoid calling update if no fields are provided
    if (Object.keys(updateData).length === 0) {
      return next(
        responseHandler(400, false, "No valid fields provided for update.")
      );
    }

    // Update user in the database
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true } // Return the updated document
    );

    // Handle user not found
    if (!updatedUser) {
      return next(responseHandler(404, false, "User not found."));
    }

    // Exclude the password field from the response
    const { password, ...rest } = updatedUser._doc;

    // Send the updated user data
    res
      .status(200)
      .json(responseHandler(200, true, "User updated successfully.", 1, rest));
  } catch (error) {
    // Handle unexpected errors
    next(responseHandler(500, false, "Failed to update user.", 0, { error }));
  }
};

export const updateProfilePic = async (req, res, next) => {
  try {
    const { userId, image } = req.body;

    // Upload image to Cloudinary
    const uploadedImage = await cloudinary.uploader.upload(image, {
      folder: "ressuman-mern-realestate-marketplace-abodeconnect-image-storage",
      transformation: { width: 300, height: 300, crop: "fill" },
    });

    // Validate Cloudinary response
    if (!uploadedImage || !uploadedImage.secure_url) {
      return res
        .status(500)
        .json(
          responseHandler(500, false, "Failed to upload image to Cloudinary.")
        );
    }

    // Update user's avatar in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: uploadedImage.secure_url },
      { new: true }
    );

    // Check if user was found and updated
    if (!updatedUser) {
      return res
        .status(404)
        .json(responseHandler(404, false, "User not found."));
    }

    return res
      .status(200)
      .json(
        responseHandler(
          200,
          true,
          "Profile picture updated successfully.",
          1,
          updatedUser
        )
      );
  } catch (error) {
    next(responseHandler(error.statusCode || 500, false, error.message));
  }
};
