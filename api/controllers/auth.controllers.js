import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
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

// export const google = async (req, res, next) => {
//   try {
//     const { email, name, photo } = req.body;

//     // Validate input
//     if (!email || !name || !photo) {
//       const error = responseHandler(
//         400,
//         false,
//         "Missing required fields: email, name, or photo"
//       );
//       return next(error);
//     }

//     console.log("Incoming request body:", { email, name, photo });

//     // Check for existing user
//     let user = await User.findOne({ email });
//     if (user) {
//       console.log("User found, generating token...");
//       const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//         expiresIn: "1d",
//       });
//       const { password, ...rest } = user._doc;

//       const response = responseHandler(
//         200,
//         true,
//         "User authenticated successfully",
//         1,
//         {
//           user: rest,
//           token,
//         }
//       );
//       return res
//         .cookie("access_token", token, { httpOnly: true })
//         .status(response.statusCode)
//         .json(response);
//     }

//     // New user registration
//     // Generate a secure random password
//     const generatedPassword = crypto.randomBytes(16).toString("hex");
//     console.log("Generated secure password:", generatedPassword);

//     const hashedPassword = bcrypt.hashSync(generatedPassword, 10);

//     // Create new user
//     user = new User({
//       username:
//         name.split(" ").join("").toLowerCase() +
//         Math.random().toString(36).slice(-4),
//       email,
//       password: hashedPassword,
//       avatar: photo,
//     });

//     await newUser.save();
//     console.log("New user saved successfully:", newUser);

//     const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
//     const { password, ...rest } = newUser._doc;

//     const response = responseHandler(
//       200,
//       true,
//       "New user created successfully",
//       1,
//       {
//         ...rest,
//         token,
//       }
//     );
//     return res
//       .cookie("access_token", token, { httpOnly: true })
//       .status(response.statusCode)
//       .json(response);
//   } catch (error) {
//     console.error("Error in Google authentication:", error);
//     const response = responseHandler(500, false, "Internal Server Error");
//     return next(response);
//   }
// };

export const google = async (req, res, next) => {
  try {
    const { email, name, photo } = req.body;

    if (!email || !name || !photo) {
      const error = responseHandler(
        400,
        false,
        "Missing required fields: email, name, or photo"
      );
      return next(error);
    }

    console.log("Incoming request body:", { email, name, photo });

    // Check for existing user
    let user = await User.findOne({ email });
    if (user) {
      console.log("User found, generating token...");
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      const { password, ...rest } = user._doc;

      const response = responseHandler(
        200,
        true,
        "User authenticated successfully",
        1,
        {
          user: rest,
          token,
        }
      );

      return res
        .cookie("access_token", token, { httpOnly: true })
        .status(response.statusCode)
        .json(response);
    }

    // New user registration
    const generatedPassword = crypto.randomBytes(16).toString("hex");
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    user = new User({
      username:
        name.split(" ").join("").toLowerCase() +
        Math.random().toString(36).slice(-4),
      email,
      password: hashedPassword,
      avatar: photo,
    });

    await user.save();
    console.log("New user created:", user);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    const { password: _, ...rest } = user._doc;

    const response = responseHandler(
      200,
      true,
      "New user created successfully",
      1,
      {
        user: rest,
        token,
      }
    );

    return res
      .cookie("access_token", token, { httpOnly: true })
      .status(response.statusCode)
      .json(response);
  } catch (error) {
    console.error("Error in Google authentication:", error);
    const response = responseHandler(500, false, "Internal Server Error");
    return next(response);
  }
};

export const signout = async (req, res, next) => {
  try {
    // Clear the access token cookie
    res.clearCookie("access_token", { httpOnly: true, secure: true });

    // Send a successful logout response
    res
      .status(200)
      .json(
        responseHandler(200, true, "User has been logged out successfully.")
      );
  } catch (error) {
    // Handle any unexpected errors
    next(
      responseHandler(500, false, "An error occurred while logging out.", 0, {
        error,
      })
    );
  }
};
