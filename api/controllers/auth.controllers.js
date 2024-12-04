import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { responseHandler } from "../utils/response.js";

export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return next(responseHandler(400, false, "Please fill in all fields."));
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(responseHandler(400, false, "User already exists."));
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json(
      responseHandler(201, true, "User created successfully.", 1, {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      })
    );
  } catch (error) {
    console.error("Error in signup:", error);
    next(error.response || error);
  }
};

export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return next(responseHandler(400, false, "Please fill in all fields."));
    }

    // Check if the user exists
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(responseHandler(404, false, "User not found!"));
    }

    // Verify the password
    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(responseHandler(401, false, "Wrong credentials!"));
    }

    // Generate a JWT token
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    // Exclude sensitive fields from the response
    const { password: pass, ...rest } = validUser._doc;

    // Send response with cookie and user data
    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Secure cookies in production
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // CSRF protection
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json(
        responseHandler(200, true, "Login successful!", 1, {
          user: rest,
          token,
        })
      );
  } catch (error) {
    // Handle unexpected errors
    next(responseHandler(500, false, "Something went wrong!", 0, { error }));
  }
};

export const google = async (req, res, next) => {
  try {
  } catch (error) {}
};

export const signout = async (req, res, next) => {
  try {
  } catch (error) {}
};
