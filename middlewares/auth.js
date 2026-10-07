import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
dotenv.config();
export const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    
    if (!token || token.length() == 0) {
      console.log("No authentication token found!");
      return res.status(401).send({ messsage: "Authentication token not found!" });
    }
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    // console.log("Decoded: ", decoded);
    if (!decoded) {
      return res.status(401).send({ messsage: "Authentication failed!" });
    }
    const user = await User.findOne({ _id: decoded.userId }).select(
      "-password"
    );

    if (!user) {
      return res.status(401).send({ messsage: "User not found" });
    }
    req.user = user;
    // console.log("The req.user: ", user);

    // console.log(3);
    //   req.user = decoded;
    // console.log(4);
    next();
  } catch (err) {
    console.log("error in verification!");
    console.log(err);
     
    return res.status(500).send({ messsage: "Internal server error!", error: err });
  }
};