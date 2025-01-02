import jwt from "jsonwebtoken";
import { responseHandler } from "./response.js";

export const verifyToken = (req, res, next) => {
  try {
    // Retrieve the token from cookies
    const token =
      req.cookies.access_token || req.headers.authorization?.split(" ")[1];

    // Check if the token exists
    if (!token) {
      return next(
        responseHandler(401, false, "Access denied. No token provided.")
      );
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return next(responseHandler(403, false, "Invalid or expired token."));
      }

      // Attach user data to the request object
      req.user = user;

      // Proceed to the next middleware or route handler
      next();
    });
  } catch (error) {
    next(
      responseHandler(
        500,
        false,
        "An error occurred while verifying the token.",
        0,
        { error }
      )
    );
  }
};
