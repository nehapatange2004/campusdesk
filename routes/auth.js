import express from "express";
// import multer from "multer";
import {
    signInUser,
    signUpNewUser,
    //   updateProfilePic,
    signOutUser
} from "../controllers/auth.js";
import { protectedRoute } from "../middlewares/auth.js";
const router = express.Router();

router.post("/signin", signInUser);
router.post("/signup", signUpNewUser);

router.get("/signout", signOutUser);

// router.get("/updateprofile", protectedRoute, async (req, res) => {
//   const user = await User.findOne({ email: req.user?.email });
//   console.log("After the verification of token! \n", user);
//   // console.log(req)
//   const userDetails = {
//     name: user?.name,
//     profilepic: user?.profilepic,
//     preferences: user?.preferences,
//   };
//   // console.log("USERDETAILS: ", userDetails);
//   res.send(userDetails);
// });

// // const upload = multer({ dest: "/uploading" });
// router.post(
//   "/updateprofile",
//   protectedRoute,
//   updateProfilePic
// );
router.get("/dash", protectedRoute, async (req, res) => {
    console.log("USERDETAILS: ", req.user);
    res.status(200).send(req.user);
});

export default router;