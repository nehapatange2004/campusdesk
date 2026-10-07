import {
    comparePasswords,
    generateToken,
    hashPassword,
} from "../utils/auth.js";
import User from "../models/User.js";
import UserProfile from "../models/UserProfile.js";
// import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();
// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_secret: process.env.API_SECRET,
//   api_key: process.env.API_KEY,
// });


export const signInUser = async (req, res) => {
    try {
        // console.log(req.body.name);
        // console.log(req.body.email);
        // console.log(req.body.password);
        const email = req.body?.email;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!(emailRegex.test(email))) return res.status(401).json({ message: "Invalid email" });

        const user = await User.findOne({ email: email }).select("-isActive").populate("profile");
        //match the password
        if (!user) {
            res.status(401).send({ message: "User not found!" });
        }

        const isMatch = await comparePasswords(req.body.password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).send({ message: "Invalid Credentials!" });
        }

        // const foundUser = {
        //   email: user.email,
        //   name: user.name,
        //   token: generateToken(user._id, user.email),
        //   profilepic: user.profilepic,
        //   preferences: user.preferences,
        //   id: user._id,
        // }

        // console.log("is Matched? ", isMatch);
        // console.log("wohoo!! the password is correct!");



        const token = generateToken(user._id, user.email);

        // 2. Set the cookie on the response object
        res.cookie("token", token, {
            httpOnly: true,                 // Prevents frontend JavaScript from accessing the cookie (blocks XSS attacks)
            secure: process.env.NODE_ENV === "PROD", // Enforces HTTPS only in production environments
            sameSite: "strict",             // Protects against CSRF attacks
            maxAge: 30 * 24 * 60 * 60 * 1000 // Cookie expiration time in milliseconds (e.g., 30 days)
        });


        // 3. Construct the response object and send it
        const responseData = {
            ...user.toJSON(),
            token,
        };
        return res.status(200).json(responseData);
    } catch (err) {
        console.log("Error while getting data from mongo: ", err);
        res.status(500).send({ message: "Internal server error" });
    }
};

export const signUpNewUser = async (req, res) => {
    try {
        // console.log(req.body.name);
        // console.log(req.body.email);
        // console.log(req.body.password);
        const { email, password, role, name, phone, position, department } = req.body;
        if (!email || !password || !role || !name || !phone || !position || !department) return res.status(401).json({ message: "All fields are required" });
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!(emailRegex.test(email))) return res.status(401).json({ message: "Invalid email" });

        const user = await User.findOne({ email: req.body.email });
        if (user) {
            console.log("User already exists: ", user);
            return res
                .status(403)
                .send({ error: "Already have an account! Consider logging in!" });
        }
        const hashedPassword = await hashPassword(req.body.password);
        
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            passwordHash: hashedPassword,
            role
        });
        await newUser.save();

        const newUserProfile = new UserProfile({
            userId: newUser._id,
            name,
            phone,
            position,
            department,
            
        });
        await newUserProfile.save();
        const token = generateToken(newUser._id, newUser.email);

        // 2. Set the cookie on the response object
        res.cookie("token", token, {
            httpOnly: true,                 // Prevents frontend JavaScript from accessing the cookie (blocks XSS attacks)
            secure: process.env.NODE_ENV === "PROD", // Enforces HTTPS only in production environments
            sameSite: "strict",             // Protects against CSRF attacks
            maxAge: 30 * 24 * 60 * 60 * 1000 // Cookie expiration time in milliseconds (e.g., 30 days)
        });

        console.log("Account Created successfully and cookie token set!");

        // 3. Construct the response object and send it
        const responseData = {
            ...newUser.toJSON(),
            token,
            profile: newUserProfile.toJSON()
        };

        return res.status(201).json(responseData);

    } catch (err) {
        console.log("Error while getting data from mongo: ", err);
        return res.send({ message: "Internal Server Error", error: err });
    }
};

export const signOutUser = async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    });

    return res.status(200).json({ message: "Logged out successfully" });
}
export const updateProfilePic = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user?.email });
        if (req.body?.profilepic) {
            console.log("Towards updating the profile pic for\n", req.user);
            await User.updateOne(
                { _id: req.user._id },
                {
                    $set: { profilepic: req.body.profilepic },
                }
            );
            // console.log("profile set in the db done!");
            const updatedUser = await User.findOne({ email: req.user?.email });
            console.log("Profile Pic: ", req.body.profilepic);

            // console.log("Upadated USERDETAILS: ", updatedUser);
            return res.send(updatedUser);
        }
        // console.log("Body of updateprofile: ", req.body)
        if (!req.body.base64) return res.send({ "message": "No profile pic selected!" });


        //when teh user have his/her own img from storage
        const filePath = req.body.base64;

        const result = await cloudinary.uploader.upload(filePath, {
            public_id: `${req.user._id}`,
            overwrite: true,
            folder: "samples/test1",
        });
        // const data = await result.json();
        // console.log("dAta: ", result);
        // console.log("Req body: ", filePath);
        // cloudinary

        await User.updateOne(
            { _id: user._id },
            {
                $set: { profilepic: result.secure_url },
            }
        );
        const updatedUser = await User.findOne({ email: req.user?.email });
        // fs.unlinkSync(filePath);
        return res.send(updatedUser);

    } catch (err) {
        return res.status(304).send(err);
    }
};