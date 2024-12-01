import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
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
      responseHandler(201, true, "User created successfully.", 0, {
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
  } catch (error) {}
};

export const google = async (req, res, next) => {
  try {
  } catch (error) {}
};

export const signout = async (req, res, next) => {
  try {
  } catch (error) {}
};
