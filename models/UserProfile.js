import mongoose from "mongoose";

const UserProfileSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        profilepic: {
            type: String,
            default: null
        },

        phone: {
            type: Number,
            trim: true
        },

        // studentId: {
        //     type: String,
        //     trim: true,
        //     sparse: true,
        //     unique: true
        // },

        // staffId: {
        //     type: String,
        //     trim: true,
        //     sparse: true,
        //     unique: true
        // },

        position: {
            type: String,
            enum: [
                "student",
                "teacher",
                "hod",
                "clerk",
                "exam_officer",
                "accounts_officer",
                "librarian",
                "principal",
                "vice-principal",
                "director",
                "administrative_officer",
                "other"
            ]
        },

        department: {
            // type: mongoose.Schema.Types.ObjectId,
            // ref: "Department"
            type: String
        }
    },
    {
        timestamps: true
    }
);

const UserProfile = mongoose.model("UserProfile", UserProfileSchema);

export default UserProfile;