import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        passwordHash: {
            type: String,
            required: true
        },

        role: {
            type: String,
            enum: ["student", "staff", "admin"],
            required: true
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);
// Enure virtuals are included when converting documents to JSON or Objects
UserSchema.set("toObject", { virtuals: true });
UserSchema.set("toJSON", { virtuals: true });
//using virtual: It lets the profile be a part of the user and one query runs
// Define the virtual field 'profile' 
UserSchema.virtual("profile", {
    ref: "UserProfile",      // The model to use
    localField: "_id",       // Find profile where `user` matches this model's `_id`
    foreignField: "userId",    // The field on the UserProfile model
    justOne: true            // A user only has ONE profile
});
const User = mongoose.model("User", UserSchema);

export default User;