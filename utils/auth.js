import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
export const hashPassword = async (password) => {
    // create hash of the brand new password set by user
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const comparePasswords = async (pass1, hash) => {
  //we compare the plain text password witht the hashed stored in db!
  try {
    const isMatch = await bcrypt.compare(pass1, hash);
    console.log("isMatch1: ", isMatch);
    return isMatch;
  } catch (err) {
    console.log("Error: ", err);
  }
};
export const generateToken = (userId, email) => {
    //Generate token which will be stored by the client
  const token = jwt.sign({ userId, email}, JWT_SECRET_KEY, {
    expiresIn: "30d",
  });
  console.log(token);
  return token;
};


// generateToken(8765, "wiyewuieywi@sdhkhsdks.232jbdjsbd");
// verifyToken();

// (async () => {
//   try {
//     const hash = await hashPassword("pass2");
//     comparePasswords("pass93748xdbv", hash);
//   } catch (err) {
//     console.log("Error in main: ", err);
//   }
// })();
// new
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyMzQsImlhdCI6MTc0OTEzMTk3MSwiZXhwIjoxNzQ5MTMyMjcxfQ.Gn5MF1ovrHWFSv3Qwa3kBwb_uTSq_fgyCIjSMoeO8MY